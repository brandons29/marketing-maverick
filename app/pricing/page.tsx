'use client';
// app/pricing/page.tsx — Marketing Maverick Pricing
// Matte Black · Cyber Neon · Gold — fully on-brand

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Crown, Zap, Shield, Star, Check, X } from 'lucide-react';
import Link from 'next/link';

const FREE_FEATURES = [
  { text: '5 free runs total', ok: true },
  { text: 'All 10 Killer Weapons', ok: true },
  { text: 'BYOK (your OpenAI key)', ok: true },
  { text: 'Unlimited runs', ok: false },
  { text: 'No watermarks', ok: false },
  { text: 'Priority support', ok: false },
];

const PRO_FEATURES = [
  { text: 'Unlimited runs', ok: true },
  { text: 'All 10 Killer Weapons', ok: true },
  { text: 'BYOK (your OpenAI key)', ok: true },
  { text: 'Zero watermarks', ok: true },
  { text: 'Weekly "Gold" Skill Drops', ok: true },
  { text: 'Priority support', ok: true },
];

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleCheckout = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/auth/signup';
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed — try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-20">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <Crown className="w-10 h-10 text-[#ffd700] mx-auto mb-4" />
          <h1 className="text-5xl font-black uppercase tracking-tight text-white mb-3">
            Pick Your Weapon
          </h1>
          <p className="text-[#555] font-mono text-sm uppercase tracking-widest">
            5 free runs · No credit card · Cancel anytime
          </p>
        </div>

        {/* ── Plans Grid ── */}
        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* Free Plan */}
          <div className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-8">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#555] mb-2">Starter</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-[#444] font-mono text-sm">/mo</span>
              </div>
              <p className="text-xs text-[#333] font-mono mt-1">Feel the power before you commit</p>
            </div>

            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map(({ text, ok }) => (
                <li key={text} className="flex items-center gap-3">
                  {ok ? (
                    <Check className="w-3.5 h-3.5 text-[#00ff88] shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-[#333] shrink-0" />
                  )}
                  <span className={`text-sm ${ok ? 'text-[#888]' : 'text-[#333]'}`}>{text}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="block w-full text-center text-sm font-black uppercase tracking-wider border border-white/10 text-[#555] px-6 py-3 rounded-xl hover:border-white/20 hover:text-[#888] transition-all"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#0f0f0f] border border-[#ffd700]/40 rounded-2xl p-8 relative shadow-[0_0_40px_rgba(255,215,0,0.08)]">

            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ffd700] text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full">
              Most Popular
            </div>

            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffd700] mb-2">Maverick Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">$15</span>
                <span className="text-[#555] font-mono text-sm">/mo</span>
              </div>
              <p className="text-xs text-[#555] font-mono mt-1">Unlimited runs. Zero limits. Pure output.</p>
            </div>

            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map(({ text, ok }) => (
                <li key={text} className="flex items-center gap-3">
                  <Check className={`w-3.5 h-3.5 shrink-0 ${ok ? 'text-[#ffd700]' : 'text-[#333]'}`} />
                  <span className="text-sm text-[#c0c0c0]">{text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 btn-gold py-3.5 rounded-xl text-sm disabled:opacity-50 disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Opening checkout...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4" />
                  Go Pro — $15/mo
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Trust Strip ── */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, color: '#00ff88', label: 'BYOK', body: 'Your key, your cost. Typically cheaper than any bloated AI tool.' },
            { icon: Shield, color: '#00d4ff', label: 'Encrypted', body: 'API key stored with pgcrypto + RLS. Only you can read your row.' },
            { icon: Star, color: '#ffd700', label: 'No Lock-in', body: 'Cancel from your Lemon Squeezy dashboard anytime. No tricks.' },
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

        {/* ── FAQ / Fine Print ── */}
        <p className="text-center mt-10 text-xs text-[#333] font-mono">
          Questions? Email{' '}
          <a href="mailto:support@swayze.media" className="text-[#555] hover:text-[#00ff88] transition-colors">
            support@swayze.media
          </a>{' '}
          · Powered by Lemon Squeezy for secure payments
        </p>
      </div>
    </div>
  );
}
