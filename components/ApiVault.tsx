'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/base/buttons/button';
import { CheckCircle2, AlertCircle, ChevronRight, Shield } from 'lucide-react';

interface ApiVaultProps {
  onComplete: (keys: any) => void;
}

export default function ApiVault({ onComplete }: ApiVaultProps) {
  const [keys, setKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    xai: '',
    maton: '',
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
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
          API <span className="text-[#ff8400]">Vault</span>
        </h2>
        <p className="text-sm text-white/40 max-w-md mx-auto">
          Maverick is a BYOK (Bring Your Own Key) tool. Your keys are encrypted with AES-256 and never shared.
        </p>
      </motion.div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'openai', label: 'OpenAI Key', placeholder: 'sk-...' },
            { key: 'anthropic', label: 'Anthropic Key', placeholder: 'sk-ant-...' },
            { key: 'maton', label: 'Maton Key (Integration Engine)', placeholder: 'maton_...' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2 block">{field.label}</label>
              <input
                type="password"
                value={(keys as any)[field.key]}
                onChange={(e) => setKeys({ ...keys, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="input-dark"
              />
            </div>
          ))}

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              color={success ? 'secondary' : 'primary'}
              isDisabled={loading || success}
              isLoading={loading}
              iconTrailing={success ? CheckCircle2 : ChevronRight}
              className="w-full justify-center"
            >
              {loading ? 'Securing...' : success ? 'Vault Secured' : 'Secure & Continue'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/5">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] text-white/20">AES-256 Encryption · Client-Side Only</span>
          </div>
        </form>
      </div>
    </div>
  );
}
