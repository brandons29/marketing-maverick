'use client';
// app/auth/signup/page.tsx — Swayze Media branded sign-up

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
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If email confirmation is off, Supabase auto-logs in — redirect immediately
    if (data.session) {
      await fetch('/api/user/init', { method: 'POST' }).catch(() => {});
      router.push('/settings');
      router.refresh();
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  // ── Success / confirmation state ──────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ backgroundColor: 'rgba(57,231,95,0.1)', border: '1px solid rgba(57,231,95,0.4)' }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: 'var(--green)' }} />
          </div>
          <h2 className="text-2xl font-black uppercase text-white mb-3">Check Your Inbox</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            We sent a confirmation link to <strong className="text-white">{email}</strong>.
            <br />Click it to activate your account and get started.
          </p>
          <Link
            href="/auth/login"
            className="inline-block text-sm font-bold uppercase tracking-wide hover:underline"
            style={{ color: 'var(--green)' }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Sign-up form ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
            style={{ backgroundColor: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)' }}
          >
            <Rocket className="w-7 h-7" style={{ color: 'var(--orange)' }} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Get Started Free
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>100% Free</span>
            {' · No credit card · Unlimited runs'}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <form onSubmit={handleSignup}>

            {/* Email */}
            <div className="relative mb-4">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
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
            <div className="relative mb-4">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
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
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 mb-4"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit — orange button matching swayzemedia.com */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'GET STARTED FREE'
              )}
            </button>
          </form>

          {/* What you get */}
          <div
            className="mt-6 p-4 rounded-xl"
            style={{ backgroundColor: 'var(--bg-card-2)', border: '1px solid var(--border-subtle)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              What you get:
            </p>
            <ul className="space-y-2">
              {[
                'Unlimited AI copy runs — no caps ever',
                '10 killer prompt weapons, all unlocked',
                'BYOK — your OpenAI bill, not ours',
                'Free forever — no credit card needed',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--green)' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>ALREADY HAVE AN ACCOUNT?</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
          </div>

          <Link
            href="/auth/login"
            className="block text-center text-sm font-bold transition-colors hover:text-white"
            style={{ color: 'var(--text-secondary)' }}
          >
            Log in →
          </Link>
        </div>

        {/* Legal */}
        <p className="text-center mt-5 text-xs leading-relaxed px-4" style={{ color: 'var(--text-muted)' }}>
          By signing up you agree to our Terms of Service. We don&apos;t sell your data.
          Your API key is encrypted at rest.
        </p>
      </div>
    </div>
  );
}
