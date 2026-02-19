// app/api/user/init/route.ts — Ensure user profile row exists
// Called after signup/login as a belt-and-suspenders fallback
// (the DB trigger handles it at the DB level; this handles edge cases).
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Upsert profile row — idempotent, safe to call multiple times
    const { error } = await supabase
      .from('users')
      .upsert(
        {
          id: user.id,
          run_count: 0,
          subscription_status: 'free',
        },
        {
          onConflict: 'id',
          ignoreDuplicates: true, // Don't overwrite existing data
        }
      );

    if (error) {
      console.error('[UserInit] Upsert failed:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
