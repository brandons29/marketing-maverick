'use client';
// app/auth/login/page.tsx — Swayze Media branded login with Untitled UI

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import { Mail, Lock, AlertCircle, Zap } from 'lucide-react';

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

    await fetch('/api/user/init', { method: 'POST' }).catch(() => {});
    router.push('/dashboard');
    router.refresh();
  };

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
            Welcome Back
          </h1>
          <p className="text-sm text-white/40">
            Log in to your free Marketing Maverick account
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleLogin}>

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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pl-10"
                  required
                  autoComplete="current-password"
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

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              color="primary"
              isDisabled={loading}
              isLoading={loading}
              className="w-full justify-center mt-2"
            >
              {loading ? 'Signing in...' : 'Log In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-white/20">OR</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-white/40">
            New here?{' '}
            <Link href="/auth/signup" className="font-bold text-[#ff8400] hover:underline">
              Create a free account →
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-center mt-6 text-xs text-white/20">
          Your API key never touches our servers in plaintext.
        </p>
      </div>
    </div>
  );
}
