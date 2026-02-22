'use client';
// app/auth/login/page.tsx — Swayze Media branded login

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Ensure profile row exists for users who predate the DB trigger
    await fetch('/api/user/init', { method: 'POST' }).catch(() => {});

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
            style={{ backgroundColor: 'rgba(57,231,95,0.1)', border: '1px solid rgba(57,231,95,0.3)' }}
          >
            <Zap className="w-7 h-7" style={{ color: 'var(--green)' }} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Log in to your Marketing Maverick account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <form onSubmit={handleLogin}>

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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark pl-10"
                required
                autoComplete="current-password"
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
                  Authenticating...
                </>
              ) : (
                'LOG IN'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>OR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            New here?{' '}
            <Link href="/auth/signup" className="font-bold hover:underline" style={{ color: 'var(--green)' }}>
              Create a free account →
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-center mt-6 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          Your API key never touches our servers in plaintext.
        </p>
      </div>
    </div>
  );
}
