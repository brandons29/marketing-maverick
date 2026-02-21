// app/api/chat/route.ts — The Maverick Engine
// Proxies OpenAI calls using the user's BYOK API key.
// Enforces free-tier paywall (5 runs max) with atomic DB increment.
// Supports both standard and streaming response modes.
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { callOpenAI, streamOpenAI } from '@/lib/openai';

const FREE_LIMIT = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { message, selectedSkills, model, stream: useStream } = body as {
      message?: string;
      selectedSkills?: string[];
      model?: string;
      stream?: boolean;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    // Clamp message length to prevent abuse
    if (message.length > 4000) {
      return NextResponse.json({ error: 'Message too long (max 4000 chars)' }, { status: 400 });
    }

    // ── Server-side auth (reads cookie) ──────────────────────────────────────
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Fetch profile: key + subscription + run count ─────────────────────────
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('api_key, subscription_status, run_count')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      // Profile row may not exist yet — auto-create it
      if (profileError?.code === 'PGRST116') {
        await supabase.from('users').insert({
          id: user.id,
          run_count: 0,
          subscription_status: 'free',
        });
        return NextResponse.json(
          { error: 'No API key set — add yours in Settings.' },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
    }

    // ── API key check ─────────────────────────────────────────────────────────
    if (!profile.api_key) {
      return NextResponse.json(
        { error: 'No API key set — add yours in Settings.' },
        { status: 403 }
      );
    }

    // ── Paywall: DISABLED for feedback phase ────────────────────────────────
    const isPro = true;
    const currentRuns = profile.run_count ?? 0;

    // ── Streaming path ────────────────────────────────────────────────────────
    if (useStream) {
      const stream = await streamOpenAI(
        profile.api_key,
        message,
        selectedSkills ?? [],
        model ?? 'gpt-4o-mini'
      );

      // Fire-and-forget run count increment — don't await in stream path
      supabase.rpc('increment_run_count', { user_id: user.id }).then(({ error }) => {
        if (error) {
          console.error('[Chat/Stream] RPC increment failed:', error.message);
          supabase
            .from('users')
            .update({ run_count: (profile.run_count ?? 0) + 1 })
            .eq('id', user.id);
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-store, no-transform',
          'X-Runs-Left': isPro ? 'unlimited' : String(Math.max(0, FREE_LIMIT - currentRuns - 1)),
        },
      });
    }

    // ── Standard (non-streaming) path ─────────────────────────────────────────
    const content = await callOpenAI(
      profile.api_key,
      message,
      selectedSkills ?? [],
      model ?? 'gpt-4o-mini'
    );

    // ── Atomic run count increment via SQL RPC ───────────────────────────────
    const { error: updateError } = await supabase.rpc('increment_run_count', {
      user_id: user.id,
    });

    if (updateError) {
      console.error('[Chat] RPC increment failed:', updateError.message);
      // Fallback to manual update if RPC is missing (for local dev/unapplied schema)
      await supabase
        .from('users')
        .update({ run_count: (profile.run_count ?? 0) + 1 })
        .eq('id', user.id);
    }

    const newRunCount = (profile.run_count ?? 0) + 1;

    return NextResponse.json({
      content,
      runCount: newRunCount,
      runsLeft: isPro ? null : Math.max(0, FREE_LIMIT - newRunCount),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    // CRITICAL: truncate + sanitize — never log API keys
    const safe = msg.replace(/sk-[A-Za-z0-9_-]{8,}/g, 'sk-***').slice(0, 300);
    console.error('[Chat] Error:', safe);

    // 402-range errors from OpenAI billing should surface to user
    if (msg.includes('billing') || msg.includes('rate limit')) {
      return NextResponse.json({ error: msg }, { status: 402 });
    }

    // Auth/key errors — map to clear messages
    if (msg.includes('Invalid OpenAI API key')) {
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
