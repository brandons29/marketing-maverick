// app/layout.tsx — Global layout with sticky Cyber Neon nav + Auth state
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marketing Maverick — AI Copy That Sells',
  description: 'Ruthless AI copywriting powered by your own OpenAI key. No fluff. Pure conversion.',
  openGraph: {
    title: 'Marketing Maverick',
    description: 'AI copy that converts. Your key, your bill.',
    type: 'website',
  },
};

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component — cookies can't be mutated in RSC after streaming
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-[#f0f0f0] min-h-screen`}>

        {/* ── STICKY NAV ── */}
        <nav className="nav-glass sticky top-0 z-50 px-6 py-0">
          <div className="max-w-6xl mx-auto flex justify-between items-center h-[60px]">

            {/* Wordmark */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-[10px] font-mono text-[#00ff88] opacity-60 tracking-[0.3em] uppercase">
                swayze.media
              </span>
              <span className="text-white font-black text-lg tracking-tight uppercase">
                MAVERICK
                <span className="text-[#ffd700]">.</span>
              </span>
            </Link>

            {/* Nav links */}
            {user ? (
              <div className="flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-[#888] hover:text-[#00ff88] transition-colors duration-150 uppercase tracking-wide"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-sm font-semibold text-[#888] hover:text-[#00ff88] transition-colors duration-150 uppercase tracking-wide"
                >
                  API Key
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm font-semibold text-[#888] hover:text-[#ffd700] transition-colors duration-150 uppercase tracking-wide"
                >
                  Pricing
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-xs font-bold text-[#555] hover:text-red-400 transition-colors duration-150 uppercase tracking-widest border border-[#222] hover:border-red-500/40 px-3 py-1.5 rounded"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-[#888] hover:text-white transition-colors duration-150 uppercase tracking-wide"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-black uppercase tracking-wider bg-[#00ff88] text-black px-4 py-2 rounded hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition-all duration-200 active:scale-95"
                >
                  Start Free
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* ── PAGE CONTENT ── */}
        <main className="relative z-0">
          {children}
        </main>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/5 mt-20 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#333] font-mono uppercase tracking-widest">
              © 2026 Swayze Media · Marketing Maverick
            </p>
            <p className="text-xs text-[#333] font-mono italic">
              Your key. Your bill. Your results.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
