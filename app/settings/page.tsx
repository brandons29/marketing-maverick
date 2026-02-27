'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import ApiKeyInput from '@/components/ApiKeyInput';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import { Shield, Key, Info, HelpCircle } from 'lucide-react';
import { ApiHelpModal } from '@/components/ApiHelpModal';

export default function Settings() {
  const [savedProviders, setSavedProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [rawKeyData, setRawKeyData] = useState<string | null>(null);

  const supabase = createClient();

  const checkKeys = useCallback(async () => {
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

    if (data?.api_key) {
      setRawKeyData(data.api_key);
      try {
        const parsed = JSON.parse(data.api_key);
        setSavedProviders(Object.keys(parsed).filter(k => !!parsed[k]));
      } catch {
        setSavedProviders(['openai']);
      }
    } else {
      setSavedProviders([]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    checkKeys();
  }, [checkKeys]);

  const handleSave = async (key: string, provider: string) => {
    if (!userId) throw new Error('Not authenticated');

    let currentKeys: Record<string, string> = {};
    if (rawKeyData) {
      try {
        currentKeys = JSON.parse(rawKeyData);
      } catch {
        currentKeys = { openai: rawKeyData };
      }
    }

    const updatedKeys = { ...currentKeys, [provider]: key };
    const jsonString = JSON.stringify(updatedKeys);

    const { error } = await supabase.from('users').upsert(
      { id: userId, api_key: jsonString, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );

    if (error) throw new Error(error.message);
    setRawKeyData(jsonString);
    setSavedProviders(Object.keys(updatedKeys).filter(k => !!updatedKeys[k]));
  };

  const handleRemove = async (provider: string) => {
    if (!userId || !rawKeyData) return;
    const confirmed = window.confirm(`Disconnect ${provider.toUpperCase()} key?`);
    if (!confirmed) return;

    let currentKeys: Record<string, string> = {};
    try {
      currentKeys = JSON.parse(rawKeyData);
    } catch {
      currentKeys = { openai: rawKeyData };
    }

    const { [provider]: _, ...updatedKeys } = currentKeys;
    const jsonString = JSON.stringify(updatedKeys);

    const { error } = await supabase.from('users').update({
      api_key: Object.keys(updatedKeys).length > 0 ? jsonString : null,
      updated_at: new Date().toISOString()
    }).eq('id', userId);

    if (!error) {
      setRawKeyData(Object.keys(updatedKeys).length > 0 ? jsonString : null);
      setSavedProviders(Object.keys(updatedKeys));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/30">
          <div className="w-5 h-5 border-2 rounded-full animate-spin border-[#ff8400]/30 border-t-[#ff8400]" />
          <span className="text-xs font-medium">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12 pb-32">
      <div className="max-w-2xl mx-auto">

        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge type="pill-color" color="success" size="sm">Free</Badge>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Settings & API Keys
              </h1>
            </div>
            <p className="text-sm text-white/40">
              Multi-provider BYOK engine. Your keys, your control.
            </p>
          </div>
          <Button
            size="sm"
            color="secondary"
            iconLeading={HelpCircle}
            onClick={() => setHelpOpen(true)}
          >
            Connection Guide
          </Button>
        </div>

        {/* Main Card */}
        <div className="glass-card p-6 lg:p-8 mb-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold text-white mb-2">Intelligence Management</h2>
              <p className="text-sm text-white/50 leading-relaxed">
                Switch providers and link keys below. Your strategy engine supports <span className="text-white font-semibold">OpenAI, Anthropic, Google, and xAI</span> simultaneously. This tool is completely free — you only pay your AI providers directly.
              </p>
            </div>

            <ApiKeyInput onSave={handleSave} savedProviders={savedProviders} />

            {savedProviders.length > 0 && (
              <div className="pt-6 border-t border-white/5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">Active Connections</p>
                <div className="flex flex-wrap gap-2">
                  {savedProviders.map(p => (
                    <div key={p} className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg">
                      <Badge type="pill-color" color="success" size="sm">{p}</Badge>
                      <button
                        onClick={() => handleRemove(p)}
                        className="text-xs text-red-500/40 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-5 space-y-3">
            <Shield className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-bold text-white">Encrypted Vault</h4>
            <p className="text-xs text-white/35 leading-relaxed">
              Keys are stored with AES-256 row-level encryption. Multi-provider JSON is encrypted before storage.
            </p>
          </div>
          <div className="glass-card p-5 space-y-3">
            <Info className="w-4 h-4 text-[#ff8400]" />
            <h4 className="text-sm font-bold text-white">Zero Cost</h4>
            <p className="text-xs text-white/35 leading-relaxed">
              Maverick is completely free. You pay your AI providers directly for the tokens you consume. No markup, no hidden fees.
            </p>
          </div>
        </div>

        <ApiHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      </div>
    </div>
  );
}
