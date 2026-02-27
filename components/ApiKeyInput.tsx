'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  BrainCircuit,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  Save,
  AlertCircle,
} from 'lucide-react';

interface ApiKeyInputProps {
  onSave: (key: string, provider: string) => Promise<void>;
  savedProviders: string[];
}

const PROVIDERS = [
  { id: 'openai',    name: 'OpenAI',    icon: Sparkles,     placeholder: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic', icon: BrainCircuit, placeholder: 'sk-ant-...' },
  { id: 'google',    name: 'Google',    icon: Zap,          placeholder: 'AIza...' },
  { id: 'xai',       name: 'xAI',       icon: Cpu,          placeholder: 'xai-...' },
  { id: 'maton',     name: 'Maton AI',  icon: Layers,       placeholder: 'maton_...' },
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

      {/* Success Banner */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-400">{activeProvider.name} key saved successfully.</p>
          </div>
          <a href="/dashboard" className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline">
            Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Provider Selector */}
        <div className="relative">
          <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2 block">Provider</label>
          <button
            onClick={() => setProviderOpen(!providerOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-white transition-all ${
              providerOpen ? 'border border-[#ff8400]/30 bg-white/[0.03]' : 'border border-white/5 bg-white/[0.02] hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <activeProvider.icon className={`w-4 h-4 ${savedProviders.includes(activeProvider.id) ? 'text-[#00ff88]' : 'text-white/30'}`} />
              <span className="font-semibold">{activeProvider.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {savedProviders.includes(activeProvider.id) && (
                <Badge type="pill-color" color="success" size="sm">Active</Badge>
              )}
              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${providerOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {providerOpen && (
            <div className="absolute top-full mt-2 w-full bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setProvider(p.id); setProviderOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left ${provider === p.id ? 'bg-white/[0.02]' : ''}`}
                >
                  <p.icon className={`w-4 h-4 ${provider === p.id ? 'text-[#ff8400]' : 'text-white/30'}`} />
                  <span className={`text-sm font-medium ${provider === p.id ? 'text-white' : 'text-white/50'}`}>{p.name}</span>
                  {savedProviders.includes(p.id) && (
                    <CheckCircle2 className="w-4 h-4 text-[#00ff88] ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* API Key Input */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2 block">API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={activeProvider.placeholder}
              className="input-dark pr-12"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Consent + Save */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pt-4 border-t border-white/5">
        <label className="flex items-start gap-3 cursor-pointer group flex-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-white/10 bg-black text-[#ff8400] focus:ring-[#ff8400]/20"
          />
          <span className="text-[11px] text-white/30 leading-relaxed group-hover:text-white/50 transition-colors">
            I acknowledge this key is encrypted with AES-256 and stored securely. Keys are never stored in plaintext.
          </span>
        </label>

        <Button
          size="lg"
          color="primary"
          onClick={handleSave}
          isDisabled={loading || !key.trim() || !agreed}
          isLoading={loading}
          iconLeading={Save}
        >
          {loading ? 'Saving...' : 'Save Key'}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs font-medium text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
