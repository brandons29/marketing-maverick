'use client';
// app/settings/page.tsx — API Key management — Swayze Media branded

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import ApiKeyInput from '@/components/ApiKeyInput';
import { Shield, ExternalLink, Key, Info } from 'lucide-react';

export default function Settings() {
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

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

    setHasSavedKey(!!data?.api_key);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  const handleSave = async (key: string) => {
    if (!userId) throw new Error('Not authenticated');

    const { error } = await supabase.from('users').upsert(
      { id: userId, api_key: key, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );

    if (error) throw new Error(error.message);
    setHasSavedKey(true);
  };

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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(57,231,95,0.3)', borderTopColor: 'var(--green)' }} />
          <span className="font-mono text-sm uppercase tracking-widest">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-12">
      <div className="max-w-lg mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ backgroundColor: 'rgba(57,231,95,0.1)', border: '1px solid rgba(57,231,95,0.3)' }}
          >
            <Key className="w-6 h-6" style={{ color: 'var(--green)' }} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
            API Key
          </h1>
          <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
            Your key. Your bill. We&apos;re just the engine.
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-2xl p-6 shadow-2xl"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
        >
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
            Marketing Maverick runs entirely on{' '}
            <strong className="text-white">your own OpenAI API key</strong>.
            We route calls on your behalf. Your key is stored in Supabase with
            row-level security and is{' '}
            <strong className="text-white">never logged or exposed</strong>.
          </p>

          <ApiKeyInput onSave={handleSave} hasSavedKey={hasSavedKey} />

          {hasSavedKey && (
            <div className="mt-4">
              <button
                onClick={handleRemove}
                className="text-xs font-mono underline underline-offset-2 transition-colors hover:text-red-400"
                style={{ color: 'var(--text-muted)' }}
              >
                Remove saved key
              </button>
            </div>
          )}

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <a
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono transition-colors hover:text-white"
              style={{ color: 'var(--text-muted)' }}
            >
              <ExternalLink className="w-3 h-3" />
              Get your key at platform.openai.com →
            </a>
          </div>
        </div>

        {/* Security Callout */}
        <div
          className="mt-5 flex items-start gap-3 rounded-xl px-4 py-3.5"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <Shield className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--green)' }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Security</p>
            <p className="text-xs leading-relaxed font-mono" style={{ color: 'var(--text-muted)' }}>
              Keys are stored in Supabase with row-level security —{' '}
              <code style={{ color: 'var(--text-secondary)' }}>auth.uid() = id</code>. Only your session
              can read your row. We recommend setting a{' '}
              <a
                href="https://platform.openai.com/account/billing/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                usage cap
              </a>{' '}
              on your OpenAI key as an extra safety net.
            </p>
          </div>
        </div>

        {/* Usage tip */}
        <div
          className="mt-4 flex items-start gap-3 rounded-xl px-4 py-3.5"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--orange)' }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Model</p>
            <p className="text-xs leading-relaxed font-mono" style={{ color: 'var(--text-muted)' }}>
              Maverick uses <code style={{ color: 'var(--text-secondary)' }}>gpt-4o-mini</code> by
              default — fast, cheap, and sharp enough to write killer copy. Access to
              GPT-4o requires a paid OpenAI plan.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
