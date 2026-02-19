// app/api/auth/signout/route.ts — Clears session and redirects to home
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  // Redirect to home after sign out
  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  );
}
