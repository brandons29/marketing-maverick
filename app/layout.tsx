// app/layout.tsx — Swayze Media branded global layout with Untitled UI
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import './globals.css';
import { CMOChatbot } from '@/components/CMOChatbot';
import { OnboardingTour } from '@/components/OnboardingTour';
import { AnimatedSynapseLogo } from '@/components/AnimatedSynapseLogo';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: 'Marketing Maverick — Plug & Play Performance Marketing Assistant | Swayze Media',
  description: 'Free performance marketing assistant by Swayze Media. Strategy, attribution, campaign analysis, and growth operations — powered by your own API key.',
  openGraph: {
    title: 'Marketing Maverick by Swayze Media',
    description: 'Free plug and play performance marketing assistant. Your key, your strategy, your results.',
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
    <html lang="en" className="dark-mode">
      <body className={`${inter.className} min-h-screen relative`} style={{ backgroundColor: 'var(--swayze-bg-page)', color: 'var(--swayze-text-secondary)' }}>

        {/* ── STICKY NAV ── */}
        <nav className="nav-glass sticky top-0 z-50 px-6 py-0">
          <div className="max-w-6xl mx-auto flex justify-between items-center h-16">

            {/* Logo — Swayze Media logo + Animated Synapse */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="scale-75 -ml-2">
                <AnimatedSynapseLogo />
              </div>
              <Image
                src="/swayze-logo-white.png"
                alt="Swayze Media"
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
              <span className="text-white/15 text-base font-light">|</span>
              <span className="text-white font-black text-sm tracking-wider uppercase">
                Maverick
              </span>
            </Link>

            {/* Nav links */}
            {user ? (
              <div className="flex items-center gap-5">
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold uppercase tracking-wide text-white/60 hover:text-[#00ff88] transition-colors duration-150"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-sm font-semibold uppercase tracking-wide text-white/60 hover:text-white transition-colors duration-150"
                >
                  API Key
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg text-white/30 border border-white/10 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold uppercase tracking-wide text-white/60 hover:text-white transition-colors duration-150"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2.5 bg-[#00ff88] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,204,102,0.3)] transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* ── PAGE CONTENT ── */}
        <main className="relative z-0">
          {children}
        </main>

        {/* ── BRANDON SWAYZE CMO CHATBOT ── */}
        <CMOChatbot />

        {/* ── ONBOARDING TOUR ── */}
        <OnboardingTour />

        {/* ── FOOTER — matches swayzemedia.com footer style ── */}
        <footer className="mt-20 py-8 px-6" style={{ borderTop: '1px solid var(--swayze-border)' }}>
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
              <Link href="/" className="text-xs font-medium uppercase tracking-wider text-white/35 hover:text-white/60 transition-colors">Home</Link>
              <Link href="/dashboard" className="text-xs font-medium uppercase tracking-wider text-white/35 hover:text-white/60 transition-colors">Dashboard</Link>
              <a href="https://swayzemedia.com" target="_blank" rel="noopener noreferrer" className="text-xs font-medium uppercase tracking-wider text-white/35 hover:text-white/60 transition-colors">Swayze Media</a>
            </div>

            {/* Copyright */}
            <p className="text-xs text-white/35 font-mono">
              © 2026 Swayze Media. All rights reserved.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
