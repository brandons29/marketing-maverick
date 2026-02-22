'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import ApiKeyInput from '@/components/ApiKeyInput';
import { Shield, ExternalLink, Key, Info, HelpCircle } from 'lucide-react';
import { ApiHelpModal } from '@/components/ApiHelpModal';

export default function Settings() {
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

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
              Secure your synapse. Connect your LLM.
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
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-maverick-gold italic">Strategic Requirement</p>
              <p className="text-sm leading-relaxed text-white/80 font-medium">
                Maverick provides the frameworks and expert-level logic—you provide the <span className="text-white font-black italic underline decoration-maverick-neon/40 underline-offset-4">Intelligence power</span> via your OpenAI API key.
              </p>
            </div>

            <ApiKeyInput onSave={handleSave} hasSavedKey={hasSavedKey} />

            {hasSavedKey && (
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={handleRemove}
                  className="text-[9px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors"
                >
                  Disconnect saved key
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-3">
            <Shield className="w-4 h-4 text-maverick-neon" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Encrypted Vault</h4>
            <p className="text-[9px] font-mono text-maverick-muted leading-relaxed uppercase">
              Keys are stored with AES-256 row-level encryption. We never see your key in plaintext.
            </p>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-3">
            <Info className="w-4 h-4 text-maverick-gold" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Usage Control</h4>
            <p className="text-[9px] font-mono text-maverick-muted leading-relaxed uppercase">
              You own the cost. We recommend setting a $5-$10 usage cap on your OpenAI dashboard.
            </p>
          </div>
        </div>

        <ApiHelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      </div>
    </div>
  );
}
