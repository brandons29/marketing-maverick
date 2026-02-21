// app/page.tsx — Marketing Maverick Landing Page
// Matte Black · Cyber Neon · Gold

import Link from 'next/link';
import { Zap, Key, Shield, Crown } from 'lucide-react';

const weapons = [
  'Cold DMs', 'LinkedIn Hooks', 'Ad Copy A/B', 'SEO Blog Intros',
  'Twitter Threads', 'Email Subjects', 'Testimonial Rewrites',
  'Value Props', 'Objection Crushers', 'Landing Headlines',
];

export default function Home() {
  return (
    <div className="relative">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-24 pb-28 text-center">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#111] border border-[#00ff88]/25 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs font-mono text-[#00ff88] uppercase tracking-widest">
              BYOK · 5 Free Runs · No Credit Card
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-6 leading-none">
            Copy That{' '}
            <span className="gradient-neon-gold">Converts.</span>
            <br />
            <span className="text-[0.7em] text-[#333]">Not Corporate Fluff.</span>
          </h1>

          <p className="text-lg text-[#666] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Marketing Maverick is a ruthless AI copywriter powered by <strong className="text-white">your own OpenAI key</strong>.
            Pick a weapon. Drop a brief. Get copy that sells — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 btn-primary text-base px-8 py-4 rounded-xl"
            >
              <Zap className="w-4 h-4" />
              Start Free — 5 Runs
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-bold text-[#555] hover:text-white transition-colors uppercase tracking-wider"
            >
              See pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WEAPONS TICKER ── */}
      <section className="border-y border-white/5 bg-[#0a0a0a] py-4 overflow-hidden">
        <div className="ticker-track">
          {/* Duplicate set so it loops seamlessly */}
          {[...weapons, ...weapons, ...weapons, ...weapons].map((w, i) => (
            <span key={i} className="text-xs font-black uppercase tracking-widest text-[#333] mr-10">
              <span className="text-[#00ff88]">⚡</span> {w}
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black uppercase tracking-tight text-center text-white mb-3">
            Built Different
          </h2>
          <p className="text-center text-[#444] text-sm font-mono mb-14 uppercase tracking-widest">
            No monthly AI bill. No watermarks. No fluff.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Key,
                color: '#00ff88',
                title: 'Bring Your Key',
                body: 'Connect your OpenAI key. We route the calls. You own the costs — and typically pay less than a premium tool subscription.',
              },
              {
                icon: Zap,
                color: '#ffd700',
                title: '10 Killer Weapons',
                body: 'Cold DMs, LinkedIn hooks, ad copy, email subjects, value props — every weapon is battle-tested for conversion.',
              },
              {
                icon: Shield,
                color: '#00d4ff',
                title: 'Fort Knox Security',
                body: 'Your API key is encrypted at rest. Row-level security means only you see your data. No logging. No leaks.',
              },
            ].map(({ icon: Icon, color, title, body }) => (
              <div
                key={title}
                className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
                  style={{ background: `${color}12`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide text-white mb-2">{title}</h3>
                <p className="text-sm text-[#555] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <Crown className="w-8 h-8 text-[#ffd700] mx-auto mb-4" />
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-3">
            <span className="text-[#ffd700]">$15/mo</span> for Unlimited
          </h2>
          <p className="text-[#555] text-sm mb-8 leading-relaxed">
            Free tier gives you 5 runs to feel the power. Go Pro for unlimited runs,
            the full weapon library, and no watermarks. Cancel anytime.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 btn-gold text-sm px-8 py-3 rounded-xl"
          >
            <Crown className="w-4 h-4" />
            See Plans
          </Link>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="px-6 py-20 text-center border-t border-white/5">
        <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-4">
          Ready to Stop Writing Like a Robot?
        </h2>
        <p className="text-[#444] mb-8 font-mono text-sm">5 free runs. No card needed. Just results.</p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 btn-primary text-base px-10 py-4 rounded-xl"
        >
          <Zap className="w-4 h-4" />
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
