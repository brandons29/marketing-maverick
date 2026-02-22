// app/page.tsx — Marketing Maverick Landing Page
// Swayze Media branded — forest green-black, orange CTAs, neon green accents

import Link from 'next/link';
import { Zap, Key, Shield, Target, FileText, Mail } from 'lucide-react';

const weapons = [
  'Cold DMs', 'LinkedIn Hooks', 'Ad Copy A/B', 'SEO Blog Intros',
  'Twitter Threads', 'Email Subjects', 'Testimonial Rewrites',
  'Value Props', 'Objection Crushers', 'Landing Headlines',
];

export default function Home() {
  return (
    <div className="relative" style={{ backgroundColor: 'var(--bg-page)' }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-28 pb-32 text-center">
        {/* Subtle grid overlay — matches swayzemedia.com texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(57,231,95,1) 1px, transparent 1px), linear-gradient(90deg, rgba(57,231,95,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Section label — matches swayzemedia.com "WHAT WE DO" style */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full" style={{ background: 'rgba(57,231,95,0.08)', border: '1px solid rgba(57,231,95,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--green)' }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--green)' }}>
              Free Tool by Swayze Media
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-6 leading-none">
            AI Copy That{' '}
            <span style={{ color: 'var(--orange)' }}>Converts.</span>
            <br />
            <span className="text-[0.65em]" style={{ color: 'var(--text-muted)' }}>No Fluff. Pure Results.</span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
            Marketing Maverick is a free AI copywriting tool from{' '}
            <a href="https://swayzemedia.com" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:underline">
              Swayze Media
            </a>
            . Bring your own OpenAI key, pick a weapon, and generate copy that sells — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA — orange, matches swayzemedia.com "Get Started" */}
            <Link
              href="/auth/signup"
              className="btn-primary text-base px-8 py-4"
            >
              <Zap className="w-4 h-4" />
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-bold uppercase tracking-wider transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              Already have an account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WEAPONS TICKER ── */}
      <section className="py-4 overflow-hidden" style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}>
        <div className="ticker-track">
          {[...weapons, ...weapons, ...weapons, ...weapons].map((w, i) => (
            <span key={i} className="text-xs font-black uppercase tracking-widest mr-10" style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--green)' }}>⚡</span> {w}
            </span>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU GET — matches swayzemedia.com "Full-Stack Growth Services" section ── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <p className="section-label text-center mb-3">What You Get</p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-center text-white mb-4">
            10 Battle-Tested Weapons
          </h2>
          <p className="text-center text-sm mb-14" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Every template is engineered for conversion — not corporate fluff.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Key,
                color: 'var(--green)',
                title: 'Bring Your Own Key',
                body: 'Connect your OpenAI key. We route the calls. You own the costs — and typically pay less than any premium tool subscription.',
              },
              {
                icon: Zap,
                color: 'var(--orange)',
                title: 'Unlimited Runs',
                body: 'No caps, no limits, no upgrade prompts. Run as many copy generations as you need — completely free, forever.',
              },
              {
                icon: Shield,
                color: '#00d4ff',
                title: 'Fort Knox Security',
                body: 'Your API key is stored with row-level security. Only your session can read your data. No logging. No leaks.',
              },
              {
                icon: Target,
                color: 'var(--orange)',
                title: 'Ad Copy & Hooks',
                body: 'Generate high-converting ad copy for Meta, Google, TikTok, and LinkedIn. A/B variants included.',
              },
              {
                icon: Mail,
                color: 'var(--green)',
                title: 'Cold Outreach',
                body: 'Cold DMs, cold emails, LinkedIn connection requests — written to get replies, not ignored.',
              },
              {
                icon: FileText,
                color: '#00d4ff',
                title: 'Landing Page Copy',
                body: 'Headlines, value props, objection crushers, and CTAs — everything you need to convert visitors into buyers.',
              },
            ].map(({ icon: Icon, color, title, body }) => (
              <div
                key={title}
                className="rounded-xl p-6 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                  style={{ background: `${color}15`, border: `1px solid ${color}35` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE TOOL CTA — matches swayzemedia.com pricing card style ── */}
      <section className="px-6 py-20" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="max-w-xl mx-auto text-center">
          {/* Section label */}
          <p className="section-label mb-3">Pricing</p>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-4">
            100% Free.<br />
            <span style={{ color: 'var(--orange)' }}>No Catch.</span>
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Marketing Maverick is a free tool from Swayze Media. Unlimited runs, all weapons unlocked.
            Just bring your OpenAI key and start generating copy that converts.
          </p>

          {/* Pricing card — styled like swayzemedia.com "Most Popular" card */}
          <div className="rounded-xl p-8 mb-8 text-left" style={{ backgroundColor: 'var(--bg-card)', border: '2px solid var(--orange)' }}>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4" style={{ backgroundColor: 'var(--orange)', color: '#000' }}>
              Always Free
            </div>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-5xl font-black text-white">$0</span>
              <span className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>/forever</span>
            </div>
            <ul className="space-y-3 mb-6">
              {[
                'Unlimited AI copy runs — no caps ever',
                'All 10 weapons unlocked',
                'Bring your own OpenAI key (BYOK)',
                'Secure key storage with RLS',
                'Stack weapons for compound output',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white">
                  <span className="text-base" style={{ color: 'var(--green)' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup" className="btn-primary w-full justify-center text-sm py-3">
              <Zap className="w-4 h-4" />
              Get Started Free →
            </Link>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            A free tool by{' '}
            <a href="https://swayzemedia.com" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--green)' }}>
              swayzemedia.com
            </a>
            {' '}· No credit card required
          </p>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 py-20 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <p className="section-label mb-3">Ready?</p>
        <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-4">
          Stop Writing Like a Robot.
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          Free forever. No card needed. Just results.
        </p>
        <Link
          href="/auth/signup"
          className="btn-primary text-base px-10 py-4"
        >
          <Zap className="w-4 h-4" />
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
