import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`);
    }

    if (data.session) {
      // Initialize user profile directly here instead of an internal fetch call
      // which often fails in serverless environments due to networking/loopback issues
      const { error: upsertError } = await supabase
        .from('users')
        .upsert(
          {
            id: data.session.user.id,
            run_count: 0,
            subscription_status: 'free',
          },
          {
            onConflict: 'id',
            ignoreDuplicates: true,
          }
        );

      if (upsertError) {
        console.error('[UserInit] Callback upsert failed:', upsertError.message);
      }
    }
  }

  // Final redirect to dashboard
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
