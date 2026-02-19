'use client';
// components/PaywallModal.tsx — Upgrade modal shown when free limit is hit

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Crown, Zap, X } from 'lucide-react';

interface PaywallModalProps {
  onClose: () => void;
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleUpgrade = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
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

      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed — try again or reach out to support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-[#111] border border-[#ffd700]/30 rounded-3xl shadow-[0_0_60px_rgba(255,215,0,0.15)] overflow-hidden">

        {/* Gold glow top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ffd700]/10 border border-[#ffd700]/30 mb-5">
            <Crown className="w-8 h-8 text-[#ffd700]" />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
            You Hit the Ceiling
          </h2>
          <p className="text-sm text-[#555] mb-6 leading-relaxed">
            Your 5 free runs are up. Go Pro for <strong className="text-[#ffd700]">$15/mo</strong>{' '}
            and get unlimited access to the full Maverick arsenal.
          </p>

          {/* Features */}
          <ul className="text-left space-y-2.5 mb-8">
            {[
              'Unlimited runs — no caps ever',
              'Full skill library (10 weapons + weekly drops)',
              'No watermarks on outputs',
              'Cancel anytime — no lock-in',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[#888]">
                <Zap className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full btn-gold text-base py-3 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                Opening checkout...
              </span>
            ) : (
              'GO PRO — $15/mo'
            )}
          </button>

          <p className="mt-4 text-xs text-[#333] font-mono">
            Powered by Lemon Squeezy · Secure checkout · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
