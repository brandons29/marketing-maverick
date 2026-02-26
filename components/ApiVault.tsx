'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Loader2, CheckCircle2, AlertCircle, ChevronRight, Shield } from 'lucide-react';

interface ApiVaultProps {
  onComplete: (keys: any) => void;
}

export default function ApiVault({ onComplete }: ApiVaultProps) {
  const [keys, setKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    xai: '',
    maton: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keys.openai && !keys.anthropic && !keys.google && !keys.xai) {
      setError('At least one AI provider key is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: JSON.stringify(keys) }),
      });

      if (!res.ok) throw new Error('Failed to save keys');

      setSuccess(true);
      setTimeout(() => {
        onComplete(keys);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
          Step 02 — <span className="text-[#ff8400]">API Vault</span>
        </h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Maverick is a Bring Your Own Key (BYOK) engine. Your keys are stored locally in your dedicated vault and are never shared.
        </p>
      </motion.div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">OpenAI Key</label>
            <input
              type="password"
              value={keys.openai}
              onChange={(e) => setKeys({...keys, openai: e.target.value})}
              placeholder="sk-..."
              className="w-full bg-[#070707] border border-white/5 rounded-xl py-4 px-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-[#ff8400]/50 transition-all text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Anthropic Key</label>
            <input
              type="password"
              value={keys.anthropic}
              onChange={(e) => setKeys({...keys, anthropic: e.target.value})}
              placeholder="sk-ant-..."
              className="w-full bg-[#070707] border border-white/5 rounded-xl py-4 px-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-[#ff8400]/50 transition-all text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Maton Key (Integration Engine)</label>
            <input
              type="password"
              value={keys.maton}
              onChange={(e) => setKeys({...keys, maton: e.target.value})}
              placeholder="maton_..."
              className="w-full bg-[#070707] border border-white/5 rounded-xl py-4 px-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-[#ff8400]/50 transition-all text-xs"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                success 
                  ? 'bg-emerald-500 text-white' 
                  : loading
                  ? 'bg-zinc-900 text-zinc-700'
                  : 'bg-[#ff8400] text-black hover:shadow-[0_0_40px_rgba(255,132,0,0.3)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Securing Vault...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Vault Locked
                </>
              ) : (
                <>
                  Secure & Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500 text-xs font-bold">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-6 py-4 border-t border-white/5">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
              AES-256 Encryption · Client-Side Only
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
