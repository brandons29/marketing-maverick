'use client';

import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, CheckCircle2, ChevronDown, Sparkles, BrainCircuit, Zap, Cpu } from 'lucide-react';

interface ApiKeyInputProps {
  onSave: (key: string, provider: string) => Promise<void>;
  savedProviders: string[];
}

const PROVIDERS = [
  { id: 'openai',    name: 'OpenAI',    icon: Sparkles,     placeholder: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic', icon: BrainCircuit, placeholder: 'sk-ant-...' },
  { id: 'google',    name: 'Google',    icon: Zap,          placeholder: 'AIza...' },
  { id: 'xai',       name: 'xAI',       icon: Cpu,          placeholder: 'xai-...' },
];

export default function ApiKeyInput({ onSave, savedProviders }: ApiKeyInputProps) {
  const [key, setKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [providerOpen, setProviderOpen] = useState(false);

  const activeProvider = PROVIDERS.find(p => p.id === provider) || PROVIDERS[0];

  const handleSave = async () => {
    if (!key.trim() || !agreed) return;
    setLoading(true);
    setError('');
    try {
      await onSave(key.trim(), provider);
      setSuccess(true);
      setKey('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Provider Selector */}
        <div className="relative">
          <label className="performance-label">Intelligence Provider</label>
          <button 
            onClick={() => setProviderOpen(!providerOpen)}
            className="w-full flex items-center justify-between p-6 bg-black border border-white/10 rounded-2xl text-sm text-white hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-4">
              <activeProvider.icon className={`w-5 h-5 ${savedProviders.includes(activeProvider.id) ? 'text-maverick-neon' : 'text-maverick-muted'}`} />
              <span className="font-black uppercase tracking-widest">{activeProvider.name}</span>
              {savedProviders.includes(activeProvider.id) && (
                <span className="text-[8px] font-black text-maverick-neon bg-maverick-neon/10 px-2 py-1 rounded-full border border-maverick-neon/20">CONNECTED</span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-maverick-muted transition-transform ${providerOpen ? 'rotate-180' : ''}`} />
          </button>

          {providerOpen && (
            <div className="absolute top-full mt-2 w-full bg-maverick-dark-2 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setProvider(p.id); setProviderOpen(false); }}
                  className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors ${provider === p.id ? 'bg-white/[0.02]' : ''}`}
                >
                  <p.icon className={`w-5 h-5 ${provider === p.id ? 'text-maverick-neon' : 'text-maverick-muted'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${provider === p.id ? 'text-white' : 'text-maverick-muted'}`}>{p.name}</span>
                  {savedProviders.includes(p.id) && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-maverick-neon ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* API Key Input */}
        <div className="relative">
          <label className="performance-label">API Access Key</label>
          <div className="relative group">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={activeProvider.placeholder}
              className="elite-input pr-16"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-maverick-muted hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
            />
            <div className="h-5 w-5 border border-white/20 rounded-md bg-white/5 transition-all peer-checked:bg-maverick-neon peer-checked:border-maverick-neon flex items-center justify-center">
              {agreed && <CheckCircle2 className="h-3.5 w-3.5 text-black" />}
            </div>
          </div>
          <span className="text-[10px] font-mono text-maverick-muted uppercase leading-relaxed tracking-wider select-none">
            Maverick Clause: I acknowledge this key is for <span className="text-white">individual execution</span>. My keys are encrypted locally and Maverick never stores them in plaintext. I am responsible for all billing and usage on my {activeProvider.name} account.
          </span>
        </label>

        <button
          onClick={handleSave}
          disabled={loading || !key.trim() || !agreed}
          className="btn-synapse w-full relative overflow-hidden"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 animate-spin" />
              Establishing Link...
            </span>
          ) : success ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Link Established
            </span>
          ) : (
            `Sync ${activeProvider.name} Engine`
          )}
        </button>

        {error && (
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500 text-center animate-pulse">
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
}
