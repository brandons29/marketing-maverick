'use client';
// app/auth/login/page.tsx — Matte Black + Cyber Neon login

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
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#111] border border-[#00ff88]/30 mb-5 shadow-[0_0_20px_rgba(0,255,136,0.2)]">
            <Zap className="w-7 h-7 text-[#00ff88]" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-[#555] font-mono">
            {"// Ready to dominate?"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">

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
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'LOG IN'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-xs text-[#333] font-mono">OR</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-[#555]">
            New here?{' '}
            <Link href="/auth/signup" className="text-[#00ff88] font-bold hover:underline">
              Get 5 free runs →
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-center mt-6 text-xs text-[#333] font-mono">
          Your API key never touches our servers in plaintext.
        </p>
      </div>
    </div>
  );
}
