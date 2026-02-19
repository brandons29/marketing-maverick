'use client';
// app/auth/signup/page.tsx — Matte Black + Cyber Neon sign-up

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Rocket, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If email confirmation is off, Supabase auto-logs in — redirect immediately
    if (data.session) {
      // Ensure profile row exists (belt-and-suspenders alongside DB trigger)
      await fetch('/api/user/init', { method: 'POST' }).catch(() => {});
      router.push('/settings'); // Send them to add their API key first
      router.refresh();
    } else {
      // Confirmation email sent
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/40 mb-6">
            <CheckCircle className="w-8 h-8 text-[#00ff88]" />
          </div>
          <h2 className="text-2xl font-black uppercase text-white mb-3">Check Your Inbox</h2>
          <p className="text-[#888] text-sm leading-relaxed mb-8">
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
            <br />Click it to activate your account and start your 5 free runs.
          </p>
          <Link
            href="/auth/login"
            className="inline-block text-sm font-bold text-[#00ff88] hover:underline uppercase tracking-wide"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#111] border border-[#ffd700]/30 mb-5 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            <Rocket className="w-7 h-7 text-[#ffd700]" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Get Maverick'd
          </h1>
          <p className="mt-2 text-sm font-mono">
            <span className="text-[#00ff88]">5 free runs</span>
            <span className="text-[#555]"> · No credit card · Your key</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-5">

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
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

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
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

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'SIGN UP — 5 FREE RUNS'
              )}
            </button>
          </form>

          {/* What you're signing up for */}
          <div className="mt-6 p-4 bg-[#1a1a1a] rounded-xl border border-white/5">
            <p className="text-xs text-[#555] font-mono uppercase tracking-widest mb-2">What you get:</p>
            <ul className="space-y-1.5">
              {[
                '5 free AI copy runs',
                '10 Killer Prompt weapons',
                'BYOK — your OpenAI bill, not ours',
                'Upgrade anytime for unlimited',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-[#888]">
                  <span className="text-[#00ff88] font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-xs text-[#333] font-mono">ALREADY IN?</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          <Link
            href="/auth/login"
            className="block text-center text-sm font-bold text-[#888] hover:text-white transition-colors"
          >
            Log in →
          </Link>
        </div>

        {/* Legal */}
        <p className="text-center mt-5 text-xs text-[#333] leading-relaxed px-4">
          By signing up you agree to our Terms of Service. We don&apos;t sell your data.
          Your API key is encrypted at rest.
        </p>
      </div>
    </div>
  );
}
