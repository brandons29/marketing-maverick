'use client';
// app/settings/page.tsx — API Key management
// Secure BYOK key entry with mask/reveal, validation, and Supabase persistence.

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import ApiKeyInput from '@/components/ApiKeyInput';
import { Shield, ExternalLink, Key, Info } from 'lucide-react';

export default function Settings() {
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  // ── Check for existing key on mount ──────────────────────────────────────
  const checkKey = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }

    setUserId(user.id);

    const { data } = await supabase
      .from('users')
      .select('api_key')
      .eq('id', user.id)
      .single();

    // Only expose whether a key exists — never the key itself
    setHasSavedKey(!!data?.api_key);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  // ── Save key to Supabase ──────────────────────────────────────────────────
  const handleSave = async (key: string) => {
    if (!userId) throw new Error('Not authenticated');

    // Upsert: creates the row if it doesn't exist yet
    const { error } = await supabase.from('users').upsert(
      {
        id: userId,
        api_key: key,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) throw new Error(error.message);
    setHasSavedKey(true);
  };

  // ── Remove key ────────────────────────────────────────────────────────────
  const handleRemove = async () => {
    if (!userId) return;
    const confirmed = window.confirm('Remove your OpenAI key? Your runs will stop working until you add a new one.');
    if (!confirmed) return;

    const { error } = await supabase
      .from('users')
      .update({ api_key: null, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (!error) setHasSavedKey(false);
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#444]">
          <div className="w-5 h-5 border-2 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full animate-spin" />
          <span className="font-mono text-sm uppercase tracking-widest">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-12">
      <div className="max-w-lg mx-auto">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#111] border border-[#00d4ff]/30 mb-4 shadow-[0_0_20px_rgba(0,212,255,0.15)]">
            <Key className="w-6 h-6 text-[#00d4ff]" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
            API Key
          </h1>
          <p className="text-sm text-[#555] font-mono">
            {'// Your key, your bill. We\'re just the engine.'}
          </p>
        </div>

        {/* ── Main Card ────────────────────────────────────────────────────── */}
        <div className="bg-[#111] border border-white/8 rounded-2xl p-6 shadow-2xl">
          <p className="text-sm text-[#666] leading-relaxed mb-6">
            Marketing Maverick runs entirely on{' '}
            <strong className="text-white">your own OpenAI API key</strong>.
            We route calls on your behalf. Your key is stored in Supabase with
            row-level security and is{' '}
            <strong className="text-white">never logged or exposed</strong>.
          </p>

          <ApiKeyInput onSave={handleSave} hasSavedKey={hasSavedKey} />

          {/* Remove key option */}
          {hasSavedKey && (
            <div className="mt-4">
              <button
                onClick={handleRemove}
                className="text-xs text-[#333] hover:text-red-400 transition-colors font-mono underline underline-offset-2"
              >
                Remove saved key
              </button>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-white/5">
            <a
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-[#555] hover:text-[#00d4ff] transition-colors font-mono"
            >
              <ExternalLink className="w-3 h-3" />
              Get your key at platform.openai.com →
            </a>
          </div>
        </div>

        {/* ── Security Callout ─────────────────────────────────────────────── */}
        <div className="mt-5 flex items-start gap-3 bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3.5">
          <Shield className="w-4 h-4 text-[#00ff88] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#555] uppercase tracking-wide mb-1">Security</p>
            <p className="text-xs text-[#333] leading-relaxed font-mono">
              Keys are stored in Supabase with row-level security —{' '}
              <code className="text-[#555]">auth.uid() = id</code>. Only your session
              can read your row. We recommend setting a{' '}
              <a
                href="https://platform.openai.com/account/billing/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#555] hover:text-[#00d4ff] underline"
              >
                usage cap
              </a>{' '}
              on your OpenAI key as an extra safety net.
            </p>
          </div>
        </div>

        {/* ── Usage tip ────────────────────────────────────────────────────── */}
        <div className="mt-4 flex items-start gap-3 bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3.5">
          <Info className="w-4 h-4 text-[#00d4ff] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#555] uppercase tracking-wide mb-1">Model</p>
            <p className="text-xs text-[#333] leading-relaxed font-mono">
              Maverick uses <code className="text-[#555]">gpt-4o-mini</code> by
              default — fast, cheap, and sharp enough to write killer copy. Access to
              GPT-4o requires a paid OpenAI plan.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
