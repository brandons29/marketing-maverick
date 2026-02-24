'use client';

import { useState } from 'react';
import { 
  Shield, 
  Lock, 
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
  MonitorCheck,
  RotateCcw
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
  { id: 'maton',     name: 'Maton AI',   icon: Layers,       placeholder: 'maton_...' },
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
      // Show success for 3s then reset for next key
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* ── SUCCESS BANNER ── */}
      {success && (
        <div className="p-6 rounded-3xl bg-maverick-neon/5 border border-maverick-neon/20 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 rounded-xl bg-maverick-neon/10 flex items-center justify-center border border-maverick-neon/20">
            <CheckCircle2 className="w-5 h-5 text-maverick-neon" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-maverick-neon mb-0.5">Protocol Linked</p>
            <p className="text-xs font-bold text-white/80 uppercase tracking-widest">{activeProvider.name} vault is now authorized.</p>
          </div>
          <a href="/dashboard" className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-maverick-neon hover:underline">
            Go to Forge <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Provider Selector */}
        <div className="relative">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-4 block">Select Engine</label>
          <button 
            onClick={() => setProviderOpen(!providerOpen)}
            className={`w-full flex items-center justify-between p-6 bg-black/40 border rounded-[1.5rem] text-sm text-white transition-all group ${providerOpen ? 'border-maverick-neon/40' : 'border-white/10 hover:border-white/20'}`}
          >
            <div className="flex items-center gap-4">
              <activeProvider.icon className={`w-5 h-5 ${savedProviders.includes(activeProvider.id) ? 'text-maverick-neon' : 'text-neutral-600'}`} />
              <span className="font-black uppercase tracking-widest italic">{activeProvider.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {savedProviders.includes(activeProvider.id) && (
                <span className="text-[8px] font-black text-maverick-neon bg-maverick-neon/5 px-3 py-1 rounded-lg border border-maverick-neon/10 tracking-widest">ACTIVE</span>
              )}
              <ChevronDown className={`w-4 h-4 text-neutral-600 transition-transform ${providerOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {providerOpen && (
            <div className="absolute top-full mt-3 w-full bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,1)] z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="divide-y divide-white/5">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProvider(p.id); setProviderOpen(false); }}
                    className={`w-full flex items-center gap-5 px-8 py-6 hover:bg-white/[0.02] transition-colors ${provider === p.id ? 'bg-white/[0.02]' : ''}`}
                  >
                    <p.icon className={`w-5 h-5 ${provider === p.id ? 'text-maverick-neon' : 'text-neutral-600'}`} />
                    <span className={`text-[11px] font-black uppercase tracking-widest italic ${provider === p.id ? 'text-white' : 'text-neutral-500'}`}>{p.name}</span>
                    {savedProviders.includes(p.id) && (
                      <CheckCircle2 className="w-4 h-4 text-maverick-neon ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API Key Input */}
        <div className="relative">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-4 block">Authorization Key</label>
          <div className="relative group">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={activeProvider.placeholder}
              className="w-full bg-black/60 border border-white/5 rounded-[1.5rem] p-6 pr-20 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-maverick-neon/30 transition-all font-medium"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-end border-t border-white/5 pt-12">
        <label className="flex items-start gap-6 cursor-pointer group bg-white/[0.01] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.02] transition-all">
          <div className="relative flex items-center mt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer h-6 w-6 opacity-0 absolute cursor-pointer"
            />
            <div className="h-6 w-6 border border-white/10 rounded-lg bg-black transition-all peer-checked:bg-maverick-neon peer-checked:border-maverick-neon flex items-center justify-center">
              {agreed && <CheckCircle2 className="h-4 w-4 text-black" />}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Institutional Trust Protocol</p>
            <p className="text-[10px] font-medium text-neutral-500 uppercase leading-[2] tracking-[0.1em] select-none">
              I acknowledge this key is for <span className="text-neutral-300">private strategic execution</span>. 
              Maverick utilizes <span className="text-neutral-300">institutional-grade AES-256 encryption</span> at the boundary. 
              Keys are never stored in plaintext and remain under my exclusive sovereignty.
            </p>
          </div>
        </label>

        <button
          onClick={handleSave}
          disabled={loading || !key.trim() || !agreed}
          className={`btn-synapse w-full h-[88px] flex items-center justify-center gap-4 text-center ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? (
            <><RotateCcw className="w-5 h-5 animate-spin" />Linking...</>
          ) : (
            <><MonitorCheck className="w-5 h-5" />Authorise</>
          )}
        </button>
      </div>

      {error && (
        <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 text-center animate-in shake-in">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">
            Authorization Failed: {error}
          </p>
        </div>
      )}
    </div>
  );
}
