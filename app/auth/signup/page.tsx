'use client';
// app/auth/signup/page.tsx — Swayze Media branded sign-up with Untitled UI

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import { Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('You must accept the Terms of Service to proceed.');
      return;
    }
    setLoading(true);
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      await fetch('/api/user/init', { method: 'POST' }).catch(() => {});
      router.push('/settings');
      router.refresh();
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  // ── Success / confirmation state ──
  if (success) {
    return (
      <div className="dark-mode min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Check Your Inbox</h2>
          <p className="text-sm text-white/50 leading-relaxed mb-8">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
            <br />Click it to activate your free account and get started.
          </p>
          <Link href="/auth/login" className="text-sm font-bold text-[#ff8400] hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Sign-up form ──
  return (
    <div className="dark-mode min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Image src="/swayze-logo-white.png" alt="Swayze Media" width={100} height={32} className="h-8 w-auto object-contain" />
            <span className="text-white/15 font-light">|</span>
            <span className="text-white font-black text-sm tracking-wider uppercase">Maverick</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            Get Started Free
          </h1>
          <p className="text-sm text-white/40">
            <span className="text-[#00ff88] font-bold">100% Free</span> · No credit card · Unlimited runs
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSignup}>

            {/* Email */}
            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="password"
                  placeholder="Strong password (8+ chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pl-10"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4 bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Legal Consent */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/10 bg-black text-[#ff8400] focus:ring-[#ff8400]/20"
                />
                <span className="text-[11px] leading-relaxed text-white/30 group-hover:text-white/50 transition-colors">
                  I agree to the <Link href="/terms" className="text-white hover:underline underline-offset-2">Terms of Service</Link> and understand that Marketing Maverick is provided &quot;as-is&quot; with no liability assumed by Swayze Media.
                </span>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              color="primary"
              isDisabled={loading || !agreed}
              isLoading={loading}
              className="w-full justify-center"
            >
              {loading ? 'Creating account...' : 'Get Started Free'}
            </Button>
          </form>

          {/* What you get */}
          <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-xs font-bold uppercase tracking-widest text-white/25 mb-3">
              What you get:
            </p>
            <ul className="space-y-2">
              {[
                'Unlimited AI copy runs — no caps ever',
                'All marketing skills, fully unlocked',
                'BYOK — your API key, your cost control',
                'Free forever — no credit card needed',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-white/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-white/20">ALREADY HAVE AN ACCOUNT?</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <Link href="/auth/login" className="block text-center text-sm font-bold text-white/40 hover:text-white transition-colors">
            Log in →
          </Link>
        </div>

        {/* Legal */}
        <p className="text-center mt-5 text-xs text-white/20 leading-relaxed px-4">
          By signing up you agree to our Terms of Service. We don&apos;t sell your data.
          Your API key is encrypted at rest.
        </p>
      </div>
    </div>
  );
}
