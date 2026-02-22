'use client';
// app/pricing/page.tsx — Marketing Maverick is completely free — Swayze Media branded

import { Zap, Shield, Star, Check } from 'lucide-react';
import Link from 'next/link';

const FREE_FEATURES = [
  { text: 'Unlimited AI copy runs — no caps ever' },
  { text: 'All 10 Killer Weapons, fully unlocked' },
  { text: 'BYOK — bring your own OpenAI key' },
  { text: 'No watermarks on outputs' },
  { text: 'Zero lock-in — always free' },
  { text: 'Secure key storage with row-level security' },
];

export default function Pricing() {
  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-20">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Pricing</p>
          <h1 className="text-5xl font-black uppercase tracking-tight text-white mb-3">
            100% Free.
            <br />
            <span style={{ color: 'var(--orange)' }}>No Catch.</span>
          </h1>
          <p className="text-sm font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            No credit card · No paywall · No limits
          </p>
        </div>

        {/* Free Plan Card — styled like swayzemedia.com "Most Popular" card */}
        <div
          className="rounded-2xl p-8 relative"
          style={{ backgroundColor: 'var(--bg-card)', border: '2px solid var(--orange)' }}
        >
          {/* Badge — matches swayzemedia.com "Most Popular" orange badge */}
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full"
            style={{ backgroundColor: 'var(--orange)' }}
          >
            Always Free
          </div>

          <div className="mb-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--green)' }}>
              Marketing Maverick by Swayze Media
            </p>
            <div className="flex items-baseline gap-1 justify-center">
              <span className="text-5xl font-black text-white">$0</span>
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>/forever</span>
            </div>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
              Bring your own OpenAI key. That&apos;s it.
            </p>
          </div>

          <ul className="space-y-3 mb-8">
            {FREE_FEATURES.map(({ text }) => (
              <li key={text} className="flex items-center gap-3">
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--green)' }} />
                <span className="text-sm text-white">{text}</span>
              </li>
            ))}
          </ul>

          {/* Orange CTA — matches swayzemedia.com featured card button */}
          <Link
            href="/auth/signup"
            className="btn-primary w-full justify-center py-3.5 text-sm font-black uppercase tracking-wider"
          >
            <Zap className="w-4 h-4" />
            Get Started Free →
          </Link>
        </div>

        {/* Trust Strip — matches swayzemedia.com feature card grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, color: 'var(--green)', label: 'BYOK', body: 'Your key, your cost. Typically cheaper than any bloated AI tool subscription.' },
            { icon: Shield, color: '#00d4ff', label: 'Encrypted', body: 'API key stored with pgcrypto + RLS. Only you can read your row.' },
            { icon: Star, color: 'var(--orange)', label: 'No Lock-in', body: 'Always free. No hidden charges. No subscription required.' },
          ].map(({ icon: Icon, color, label, body }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}35` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-xs leading-relaxed font-mono" style={{ color: 'var(--text-muted)' }}>{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fine Print */}
        <p className="text-center mt-10 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          A free tool by{' '}
          <a href="https://swayzemedia.com" target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors" style={{ color: 'var(--green)' }}>
            swayzemedia.com
          </a>
          {' · '}Questions?{' '}
          <a href="mailto:support@swayze.media" className="hover:underline transition-colors" style={{ color: 'var(--text-secondary)' }}>
            support@swayze.media
          </a>
        </p>
      </div>
    </div>
  );
}
