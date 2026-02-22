'use client';
// app/pricing/page.tsx — Marketing Maverick is completely free

import { Zap, Shield, Star, Check } from 'lucide-react';
import Link from 'next/link';

const FREE_FEATURES = [
  { text: 'Unlimited runs — no caps ever' },
  { text: 'All 10 Killer Weapons' },
  { text: 'BYOK (your OpenAI key)' },
  { text: 'No watermarks on outputs' },
  { text: 'Zero lock-in — always free' },
  { text: 'Weekly skill drops' },
];

export default function Pricing() {
  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-20">
      <div className="max-w-2xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <Zap className="w-10 h-10 text-[#00ff88] mx-auto mb-4" />
          <h1 className="text-5xl font-black uppercase tracking-tight text-white mb-3">
            100% Free
          </h1>
          <p className="text-[#555] font-mono text-sm uppercase tracking-widest">
            No credit card · No paywall · No limits
          </p>
        </div>

        {/* ── Free Plan Card ── */}
        <div className="bg-[#0f0f0f] border border-[#00ff88]/40 rounded-2xl p-8 relative shadow-[0_0_40px_rgba(0,255,136,0.08)]">

          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00ff88] text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full">
            Always Free
          </div>

          <div className="mb-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00ff88] mb-2">Marketing Maverick</p>
            <div className="flex items-baseline gap-1 justify-center">
              <span className="text-5xl font-black text-white">$0</span>
              <span className="text-[#555] font-mono text-sm">/forever</span>
            </div>
            <p className="text-xs text-[#555] font-mono mt-1">Bring your own OpenAI key. That&apos;s it.</p>
          </div>

          <ul className="space-y-3 mb-8">
            {FREE_FEATURES.map(({ text }) => (
              <li key={text} className="flex items-center gap-3">
                <Check className="w-3.5 h-3.5 text-[#00ff88] shrink-0" />
                <span className="text-sm text-[#c0c0c0]">{text}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/auth/signup"
            className="block w-full text-center flex items-center justify-center gap-2 btn-primary py-3.5 rounded-xl text-sm font-black uppercase tracking-wider"
          >
            <Zap className="w-4 h-4" />
            Get Started Free
          </Link>
        </div>

        {/* ── Trust Strip ── */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, color: '#00ff88', label: 'BYOK', body: 'Your key, your cost. Typically cheaper than any bloated AI tool.' },
            { icon: Shield, color: '#00d4ff', label: 'Encrypted', body: 'API key stored with pgcrypto + RLS. Only you can read your row.' },
            { icon: Star, color: '#ffd700', label: 'No Lock-in', body: 'Always free. No hidden charges. No subscription required.' },
          ].map(({ icon: Icon, color, label, body }) => (
            <div key={label} className="flex items-start gap-3 bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}10`, border: `1px solid ${color}25` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#555] mb-0.5">{label}</p>
                <p className="text-xs text-[#333] leading-relaxed font-mono">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Fine Print ── */}
        <p className="text-center mt-10 text-xs text-[#333] font-mono">
          Questions? Email{' '}
          <a href="mailto:support@swayze.media" className="text-[#555] hover:text-[#00ff88] transition-colors">
            support@swayze.media
          </a>
        </p>
      </div>
    </div>
  );
}
