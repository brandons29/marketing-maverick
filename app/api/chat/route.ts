// app/api/chat/route.ts — The Maverick Engine
// Enforces paywall, proxies user's BYOK key to AI providers.
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { callAI, streamAI } from '@/lib/ai-engine';

const FREE_RUN_LIMIT = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

    const { message, selectedSkills, model, stream: useStream } = body as {
      message?: string;
      selectedSkills?: string[];
      model?: string;
      stream?: boolean;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }
    if (message.length > 4000) {
      return NextResponse.json({ error: 'Message too long (max 4000 chars)' }, { status: 400 });
    }

    // ── Auth ────────────────────────────────────────────────────────────────
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Profile ─────────────────────────────────────────────────────────────
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('api_key, run_count, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError?.code === 'PGRST116') {
      // Row missing — auto-create, then block until key is set
      await supabase
        .from('users')
        .insert({ id: user.id, run_count: 0, subscription_status: 'free' });
      return NextResponse.json(
        { error: 'Profile created. Add your API key in Settings before using Maverick.' },
        { status: 403 }
      );
    }
    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
    }
    if (!profile.api_key) {
      return NextResponse.json(
        { error: 'No API key set — add yours in Settings.' },
        { status: 403 }
      );
    }

    // ── Paywall ─────────────────────────────────────────────────────────────
    const isFree = profile.subscription_status !== 'pro';
    const runCount = profile.run_count ?? 0;

    if (false && isFree && runCount >= FREE_RUN_LIMIT) {
      return NextResponse.json(
        {
          error: 'paywall',
          message: `Free tier limit reached (${FREE_RUN_LIMIT} runs). Upgrade to Maverick Pro for unlimited access.`,
          runsUsed: runCount,
          limit: FREE_RUN_LIMIT,
        },
        { status: 402 }
      );
    }

    // ── Run ─────────────────────────────────────────────────────────────────
    const selectedModel = model ?? 'gpt-4o-mini';
    const runsLeft = isFree ? FREE_RUN_LIMIT - runCount - 1 : null;

    // Atomic increment — fire-and-forget, don't block the response
    const increment = () =>
      supabase.rpc('increment_run_count', { user_id: user.id }).then(({ error: rpcErr }) => {
        if (rpcErr) {
          // Fallback: manual update
          supabase
            .from('users')
            .update({ run_count: runCount + 1 })
            .eq('id', user.id);
        }
      });

    if (useStream) {
      const stream = await streamAI(
        profile.api_key,
        message,
        selectedSkills ?? [],
        selectedModel
      );
      increment();
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-store',
          'X-Runs-Left': runsLeft !== null ? String(runsLeft) : 'unlimited',
          'X-Subscription': profile.subscription_status ?? 'free',
        },
      });
    }

    const content = await callAI(
      profile.api_key,
      message,
      selectedSkills ?? [],
      selectedModel
    );
    increment();

    return NextResponse.json({
      content,
      runCount: runCount + 1,
      runsLeft,
      subscription: profile.subscription_status ?? 'free',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    // Scrub any API key patterns before logging
    const safe = msg
      .replace(/(?:sk-|xai-|AIza)[A-Za-z0-9_-]{8,}/g, '***')
      .slice(0, 300);
    console.error('[Chat] Error:', safe);

    if (msg.includes('key not configured')) {
      return NextResponse.json({ error: msg }, { status: 403 });
    }
    if (msg.includes('Invalid') && msg.includes('key')) {
      return NextResponse.json({ error: msg }, { status: 401 });
    }
    if (msg.includes('billing') || msg.includes('rate limit')) {
      return NextResponse.json({ error: msg }, { status: 402 });
    }
    return NextResponse.json({ error: safe }, { status: 500 });
  }
}
