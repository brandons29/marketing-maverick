// app/layout.tsx — Swayze Media branded global layout
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: 'Marketing Maverick — AI Copy That Sells | Swayze Media',
  description: 'Free AI copywriting tool by Swayze Media. Bring your own OpenAI key and generate high-converting copy in seconds.',
  openGraph: {
    title: 'Marketing Maverick by Swayze Media',
    description: 'Free AI copy tool. Your key, your results.',
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
      <body className={`${inter.className} min-h-screen`} style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>

        {/* ── STICKY NAV ── */}
        <nav className="nav-glass sticky top-0 z-50 px-6 py-0">
          <div className="max-w-6xl mx-auto flex justify-between items-center h-[64px]">

            {/* Logo — actual Swayze Media logo image */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/swayze-logo-white.png"
                alt="Swayze Media"
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
              <span style={{ color: 'var(--border-card)', fontSize: '1rem', fontWeight: 300 }}>|</span>
              <span className="text-white font-black text-sm tracking-wider uppercase">
                Maverick
              </span>
            </Link>

            {/* Nav links */}
            {user ? (
              <div className="flex items-center gap-5">
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold transition-colors duration-150 uppercase tracking-wide"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-sm font-semibold transition-colors duration-150 uppercase tracking-wide"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  API Key
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-xs font-bold transition-colors duration-150 uppercase tracking-widest px-3 py-1.5 rounded"
                    style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold transition-colors duration-150 uppercase tracking-wide"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Login
                </Link>
                {/* Orange CTA button — matches swayzemedia.com "Get Started" */}
                <Link
                  href="/auth/signup"
                  className="btn-primary text-sm px-5 py-2.5"
                  style={{ borderRadius: '0.375rem' }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* ── PAGE CONTENT ── */}
        <main className="relative z-0">
          {children}
        </main>

        {/* ── FOOTER — matches swayzemedia.com footer style ── */}
        <footer className="mt-20 py-8 px-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/swayze-logo-white.png"
                alt="Swayze Media"
                width={80}
                height={27}
                className="h-6 w-auto object-contain opacity-80"
              />
            </div>

            {/* Nav links */}
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs font-medium uppercase tracking-wider transition-colors" style={{ color: 'var(--text-muted)' }}>Home</Link>
              <Link href="/dashboard" className="text-xs font-medium uppercase tracking-wider transition-colors" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
              <a href="https://swayzemedia.com" target="_blank" rel="noopener noreferrer" className="text-xs font-medium uppercase tracking-wider transition-colors" style={{ color: 'var(--text-muted)' }}>Swayze Media</a>
            </div>

            {/* Copyright */}
            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              © 2026 Swayze Media. All rights reserved.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
