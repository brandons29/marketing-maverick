'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import ApiKeyInput from '@/components/ApiKeyInput';
import { Shield, ExternalLink, Key, Info, HelpCircle } from 'lucide-react';
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
        // Legacy support: single string = openai
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

    const updatedKeys = {
      ...currentKeys,
      [provider]: key
    };

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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex items-center gap-3 text-maverick-muted">
          <div className="w-5 h-5 border-2 rounded-full animate-spin border-maverick-neon/30 border-t-maverick-neon" />
          <span className="font-mono text-[10px] uppercase tracking-widest">Accessing Secure Vault...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16 lg:py-24 bg-black">
      <div className="max-w-xl mx-auto">

        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Key className="w-5 h-5 text-maverick-neon" />
              <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">
                Engine Connection
              </h1>
            </div>
            <p className="text-sm font-medium text-maverick-muted leading-relaxed uppercase tracking-wider">
              Multi-Provider Synapse · Secure Intelligence
            </p>
          </div>
          <button 
            onClick={() => setHelpOpen(true)}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-maverick-neon hover:text-white transition-colors border border-maverick-neon/20 px-4 py-2 rounded-full"
          >
            <HelpCircle className="w-3 h-3" />
            Connection Guide
          </button>
        </div>

        {/* Main Card */}
        <div className="elite-card p-8 lg:p-12 mb-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-maverick-gold italic">Intelligence Management</p>
              <p className="text-sm leading-relaxed text-white/80 font-medium">
                Switch providers and link keys below. Your strategy engine supports <span className="text-white font-black italic underline decoration-maverick-neon/40 underline-offset-4">OpenAI, Anthropic, Google, and xAI</span> simultaneously.
              </p>
            </div>

            <ApiKeyInput onSave={handleSave} savedProviders={savedProviders} />

            {savedProviders.length > 0 && (
              <div className="pt-8 border-t border-white/5 space-y-4">
                <p className="performance-label">Active Connections</p>
                <div className="flex flex-wrap gap-2">
                  {savedProviders.map(p => (
                    <div key={p} className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
                      <span className="text-[10px] font-black text-white uppercase">{p}</span>
                      <button 
                        onClick={() => handleRemove(p)}
                        className="text-[10px] font-bold text-red-500/50 hover:text-red-500 transition-colors px-1"
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
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-3">
            <Shield className="w-4 h-4 text-maverick-neon" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Encrypted Vault</h4>
            <p className="text-[9px] font-mono text-maverick-muted leading-relaxed uppercase">
              Keys are stored with AES-256 row-level encryption. Multi-provider JSON is encrypted before storage.
            </p>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-3">
            <Info className="w-4 h-4 text-maverick-gold" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Execution Control</h4>
            <p className="text-[9px] font-mono text-maverick-muted leading-relaxed uppercase">
              We charge nothing. You pay your providers directly for the tokens you consume.
            </p>
          </div>
        </div>

        <ApiHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      </div>
    </div>
  );
}
