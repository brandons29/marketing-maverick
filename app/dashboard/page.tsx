'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { skills } from '@/prompts/marketing';
import { MODEL_CATALOG, getProviderForModel } from '@/lib/ai-engine';
import {
  Zap,
  ChevronRight,
  Copy,
  RotateCcw,
  AlertTriangle,
  CheckCheck,
  Activity,
  Target,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  History,
  ChevronDown,
  Cpu,
  BrainCircuit,
  Sparkles,
  Clock,
  ArrowRight,
  MonitorCheck,
  MousePointer2,
  ArrowUpRight
} from 'lucide-react';

interface UserProfile { api_key: string | null; }
interface SynapseHistory { brief: string; module: string; response: string; model: string; ts: Date; }

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [streamBuffer, setStreamBuffer] = useState('');
  const [selectedWeapons, setSelectedWeapons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [modelOpen, setModelOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [synapseHistory, setSynapseHistory] = useState<SynapseHistory[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/auth/signup'; return; }
      const { data } = await supabase.from('users').select('api_key').eq('id', user.id).single();
      if (data) setProfile(data as UserProfile);
      setProfileLoading(false);
    };
    init();
  }, [supabase]);

  const toggleWeapon = (id: string) => {
    setSelectedWeapons(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const handleUnleash = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setStreaming(true);
    setError('');
    setResponse('');
    setStreamBuffer('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          selectedSkills: selectedWeapons,
          model: selectedModel,
          stream: true,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        if (res.status === 403 && json.error?.includes('key not configured')) { 
          setError('Provider key not found. Redirecting to Vault...');
          setTimeout(() => window.location.href = '/settings', 1500); 
          return; 
        }
        throw new Error(json.error || 'Synapse failed');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.delta) {
                  fullResponse += parsed.delta;
                  setStreamBuffer(fullResponse);
                }
              } catch {}
            }
          }
        }
      }

      setResponse(fullResponse);
      setStreamBuffer('');

      const moduleName = selectedWeapons.length > 0
        ? skills.find(s => s.id === selectedWeapons[0])?.name ?? 'Custom'
        : 'General';
      
      setSynapseHistory(prev => [{
        brief: message.slice(0, 60),
        module: moduleName,
        response: fullResponse,
        model: selectedModel,
        ts: new Date()
      }, ...prev].slice(0, 10));

      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const activeModel = MODEL_CATALOG.find(m => m.id === selectedModel) || MODEL_CATALOG[0];
  const currentOutput = streaming ? streamBuffer : response;

  const provider = getProviderForModel(selectedModel);
  let isKeyConfigured = false;
  if (profile?.api_key) {
    try {
      const keys = JSON.parse(profile.api_key);
      isKeyConfigured = !!keys[provider];
    } catch {
      isKeyConfigured = provider === 'openai' && !!profile.api_key;
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-2 rounded-full animate-spin border-maverick-neon/20 border-t-maverick-neon shadow-[0_0_20px_rgba(0,255,136,0.2)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-maverick-neon animate-pulse">Initializing Engine</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-maverick-neon selection:text-black">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 pb-40">

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-maverick-neon shadow-[0_0_15px_rgba(0,255,136,0.6)]" />
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">Strategic Forge</h1>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.5em]">
              Operational Intelligence · Swayze Media Protocol
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setHistoryOpen(!historyOpen)}
              className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white/20 transition-all group"
            >
              <History className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
              Archives ({synapseHistory.length})
            </button>
            <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-maverick-neon/[0.03] border border-maverick-neon/10 rounded-2xl">
              <ShieldCheck className="w-4 h-4 text-maverick-neon" />
              <span className="text-[10px] font-black text-maverick-neon uppercase italic tracking-widest text-maverick-neon">Elite Active</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-8">
            <section className="elite-card p-10 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-maverick-neon uppercase tracking-[0.3em]">Step 01</p>
                  <h2 className="text-xl font-black uppercase italic tracking-tight">Load Logic</h2>
                </div>
                {selectedWeapons.length > 0 && (
                  <button onClick={() => setSelectedWeapons([])} className="text-[9px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-colors">Wipe All</button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {skills.map((skill) => {
                  const isSelected = selectedWeapons.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleWeapon(skill.id)}
                      className={`group w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all border ${isSelected ? 'bg-maverick-neon/10 border-maverick-neon/30 shadow-[0_0_20px_rgba(0,255,136,0.05)]' : 'border-white/5 hover:bg-white/[0.02]'}`}
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-maverick-neon bg-maverick-neon' : 'border-white/10 group-hover:border-white/30'}`}>
                        {isSelected && <CheckCheck className="w-3.5 h-3.5 text-black" />}
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${isSelected ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>{skill.name}</span>
                      {isSelected && <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-maverick-neon animate-in slide-in-from-left-2" />}
                    </button>
                  );
                })}
              </div>
            </section>

            {historyOpen && synapseHistory.length > 0 && (
              <section className="elite-card p-8 animate-in slide-in-from-top-4 duration-500">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 mb-6">Recent Synapses</h3>
                <div className="space-y-4">
                  {synapseHistory.map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setMessage(item.brief); setResponse(item.response); }}
                      className="w-full text-left p-4 rounded-xl border border-white/5 hover:bg-white/[0.02] transition-all group"
                    >
                      <p className="text-[11px] font-bold text-white truncate mb-2 group-hover:text-maverick-neon transition-colors">{item.brief}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-mono text-neutral-600 uppercase">{item.module}</span>
                        <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-tighter">{item.ts.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-8 space-y-10">
            
            <section className="elite-card p-10 bg-white/[0.02] border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-maverick-gold uppercase tracking-[0.3em]">Step 02</p>
                  <h2 className="text-xl font-black uppercase italic tracking-tight">Execute Protocol</h2>
                </div>
                
                <div className="relative group">
                  <button
                    onClick={() => setModelOpen(!modelOpen)}
                    className="flex items-center gap-4 px-6 py-3 bg-black/40 border border-white/10 rounded-2xl hover:border-white/20 transition-all"
                  >
                    <div className="text-right">
                      <p className="text-[8px] font-mono text-neutral-500 uppercase tracking-[0.2em]">Engine</p>
                      <p className="text-[10px] font-black text-white uppercase italic">{activeModel.label}</p>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {modelOpen && (
                    <div className="absolute top-full mt-4 right-0 w-80 bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,1)] z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/5">
                        {MODEL_CATALOG.map(m => (
                          <button
                            key={m.id}
                            onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                            className={`w-full flex items-center gap-5 px-6 py-5 text-left transition-colors ${selectedModel === m.id ? 'bg-maverick-neon/5' : 'hover:bg-white/[0.02]'}`}
                          >
                            <div>
                              <p className={`text-[11px] font-black uppercase italic ${selectedModel === m.id ? 'text-maverick-neon' : 'text-white'}`}>{m.label}</p>
                              <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-1">{m.group}</p>
                            </div>
                            {selectedModel === m.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-maverick-neon shadow-[0_0_10px_rgba(0,255,136,1)]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isKeyConfigured && (
                <div className="mb-8 flex items-center justify-between gap-6 p-6 rounded-[1.5rem] bg-maverick-gold/5 border border-maverick-gold/20 animate-in fade-in">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-maverick-gold/10 flex items-center justify-center border border-maverick-gold/20">
                      <ShieldCheck className="w-5 h-5 text-maverick-gold" />
                    </div>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider italic">
                      Intelligence key missing for <span className="text-maverick-gold underline decoration-maverick-gold/40">{provider.toUpperCase()}</span>. Access Restricted.
                    </p>
                  </div>
                  <a href="/settings" className="btn-synapse-gold px-8 whitespace-nowrap">Connect Vault</a>
                </div>
              )}

              <div className="relative group">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={selectedWeapons.length > 0
                    ? `Instruct the ${skills.find(s => s.id === selectedWeapons[0])?.name} module...`
                    : "Describe the performance bottleneck or scaling target..."
                  }
                  className="w-full bg-black/60 border border-white/5 rounded-[2rem] p-10 text-base md:text-lg text-white placeholder:text-neutral-700 outline-none focus:border-maverick-neon/30 transition-all resize-none min-h-[220px] font-medium leading-relaxed shadow-inner"
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleUnleash(); }}
                />
                <div className="absolute bottom-6 right-8 flex items-center gap-4 opacity-40 group-focus-within:opacity-100 transition-opacity">
                   <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-neutral-500">Cmd + Enter to Fire</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleUnleash}
                  disabled={loading || !message.trim() || !isKeyConfigured}
                  className={`btn-synapse px-14 py-6 scale-110 flex items-center gap-4 group ${loading ? 'opacity-50' : ''}`}
                >
                  {loading ? (
                    <><RotateCcw className="w-5 h-5 animate-spin" /> Forge in Progress</>
                  ) : (
                    <><Zap className={`w-5 h-5 transition-transform group-hover:scale-125 ${isKeyConfigured ? 'fill-black' : ''}`} /> Unleash Intelligence</>
                  )}
                </button>
              </div>
            </section>

            {error && (
              <div className="flex items-center gap-5 p-8 rounded-3xl bg-red-500/5 border border-red-500/20 animate-in shake-in duration-500">
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                <p className="text-sm font-black uppercase italic tracking-wider text-red-400">{error}</p>
              </div>
            )}

            {(currentOutput || loading) && (
              <div ref={outputRef} className="elite-card bg-white/[0.01] border-white/10 animate-in slide-in-from-bottom-12 duration-1000">
                <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${streaming ? 'animate-pulse bg-maverick-gold shadow-[0_0_15px_rgba(212,175,55,1)]' : 'bg-maverick-neon shadow-[0_0_15px_rgba(0,255,136,1)]'}`} />
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] italic text-neutral-300">
                      {streaming ? 'Forging Strategic Asset...' : 'Operational Blueprint Ready'}
                    </h3>
                  </div>
                  
                  {!streaming && response && (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${copied ? 'bg-maverick-neon/20 border-maverick-neon text-maverick-neon' : 'bg-white/5 border-transparent text-white hover:bg-white/10'}`}
                      >
                        {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Captured' : 'Copy Protocol'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-10 lg:p-16">
                  <article
                    className="prose prose-invert max-w-none text-neutral-300 leading-[2] text-sm md:text-base font-medium space-y-8"
                    dangerouslySetInnerHTML={{
                      __html: (currentOutput || '')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black italic tracking-tight">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<span class="text-maverick-neon italic">$1</span>')
                        .replace(/#{1,3} (.*?)(\n|$)/g, '<h3 class="text-white font-black uppercase italic text-2xl mt-12 mb-6 tracking-tighter border-l-2 border-maverick-neon pl-6">$1</h3>')
                        .replace(/\n/g, '<br>')
                    }}
                  />
                  {streaming && <span className="inline-block w-2 h-6 bg-maverick-neon animate-pulse ml-2 rounded shadow-[0_0_15px_rgba(0,255,136,1)] align-middle" />}
                </div>
              </div>
            )}

            {!currentOutput && !loading && !error && (
              <div className="flex flex-col items-center justify-center text-center py-40 rounded-[3rem] border border-dashed border-white/[0.05] bg-white/[0.005]">
                <div className="w-20 h-20 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center justify-center mb-8 shadow-inner">
                  <BrainCircuit className="w-10 h-10 text-neutral-800" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600 mb-2">Engine Idle</h3>
                <p className="text-[9px] font-mono text-neutral-800 uppercase tracking-widest italic">Awaiting Priority Logic Brief</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
