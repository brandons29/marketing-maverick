// app/api/chat/route.ts — The Maverick Engine
// Proxies OpenAI calls using the user's BYOK API key.
// Enforces free-tier paywall (5 runs max) with atomic DB increment.
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { callOpenAI } from '@/lib/openai';

const FREE_LIMIT = 5;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { message, selectedSkills, model } = body as {
      message?: string;
      selectedSkills?: string[];
      model?: string;
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

    // ── Paywall: free users max FREE_LIMIT runs ───────────────────────────────
    const isPro = profile.subscription_status === 'pro';
    const currentRuns = profile.run_count ?? 0;

    if (!isPro && currentRuns >= FREE_LIMIT) {
      return NextResponse.json(
        {
          error: 'Free limit reached. Upgrade to Pro for unlimited runs.',
          code: 'PAYWALL',
        },
        { status: 402 }
      );
    }

    // ── Call OpenAI with the user's own key — never ours ─────────────────────
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

    return NextResponse.json({
      content,
      runCount: (profile.run_count ?? 0) + 1,
      runsLeft: isPro ? null : Math.max(0, FREE_LIMIT - ((profile.run_count ?? 0) + 1)),
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

    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
