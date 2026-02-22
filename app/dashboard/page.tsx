'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { skills } from '@/prompts/marketing';
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
  Clock
} from 'lucide-react';

interface UserProfile { api_key: string | null; }
interface SynapseHistory { brief: string; module: string; response: string; model: string; ts: Date; }

const MODELS = [
  { id: 'gpt-4o-mini', label: 'Fast', desc: 'Instant · Low Cost', icon: Zap },
  { id: 'gpt-4o',      label: 'Elite', desc: 'Best Quality · GPT-4o', icon: Sparkles },
  { id: 'o1-mini',     label: 'Reasoning', desc: 'Deep Strategy · Complex', icon: BrainCircuit },
];

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
        if (res.status === 403 && json.error?.includes('No API key')) { window.location.href = '/settings'; return; }
        throw new Error(json.error || 'Synapse failed');
      }

      // Stream the response
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

      // Save to history
      const moduleName = selectedWeapons.length > 0
        ? skills.find(s => s.id === selectedWeapons[0])?.name ?? 'Custom'
        : 'General';
      setSynapseHistory(prev => [{
        brief: message.slice(0, 60),
        module: moduleName,
        response: fullResponse,
        model: selectedModel,
        ts: new Date()
      }, ...prev].slice(0, 5));

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

  const handleRemix = () => { setResponse(''); setMessage(''); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const loadFromHistory = (item: SynapseHistory) => { setMessage(item.brief); setResponse(item.response); setHistoryOpen(false); };

  const activeModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];
  const currentOutput = streaming ? streamBuffer : response;

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-maverick-muted">
          <div className="w-5 h-5 border-2 rounded-full animate-spin border-maverick-neon/30 border-t-maverick-neon" />
          <span className="font-mono text-xs uppercase tracking-widest">Initializing Engine...</span>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    { label: 'Sessions Today', value: synapseHistory.length.toString(), change: `+${synapseHistory.length}`, icon: Activity },
    { label: 'Active Module', value: selectedWeapons.length > 0 ? `${selectedWeapons.length} Loaded` : 'None', change: '', icon: Target },
    { label: 'Engine Mode', value: activeModel.label, change: '', icon: Cpu },
  ];

  return (
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12 pb-32 lg:pb-12">
      <div className="max-w-7xl mx-auto">

        {/* ── TOP BAR ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-maverick-neon shadow-[0_0_10px_rgba(0,204,102,0.5)]" />
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">Strategy Engine</h1>
            </div>
            <p className="text-[10px] text-maverick-muted font-mono uppercase tracking-[0.4em]">
              Performance Intelligence · Swayze Media Elite
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* History button */}
            {synapseHistory.length > 0 && (
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-maverick-dark-1 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-maverick-muted hover:text-white transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                History ({synapseHistory.length})
              </button>
            )}
            <div className="bg-maverick-dark-1 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-maverick-neon" />
              <div>
                <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-widest">Status</p>
                <p className="text-[10px] font-black text-white uppercase italic">Elite Pro Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SYNAPSE HISTORY PANEL ── */}
        {historyOpen && synapseHistory.length > 0 && (
          <div className="mb-8 bg-maverick-dark-1 border border-white/5 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-maverick-gold" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Recent Synapses</span>
              </div>
              <button onClick={() => setHistoryOpen(false)} className="text-[8px] text-maverick-muted hover:text-white uppercase tracking-widest font-black">Close</button>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {synapseHistory.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-maverick-neon/5 border border-maverick-neon/10 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-maverick-neon" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.brief}{item.brief.length >= 60 ? '...' : ''}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-mono text-maverick-muted uppercase">{item.module}</span>
                        <span className="text-white/10">·</span>
                        <span className="text-[8px] font-mono text-maverick-muted uppercase">{item.model}</span>
                        <span className="text-white/10">·</span>
                        <Clock className="w-2.5 h-2.5 text-maverick-muted" />
                        <span className="text-[8px] font-mono text-maverick-muted">{item.ts.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => loadFromHistory(item)}
                    className="shrink-0 text-[8px] font-black text-maverick-neon uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Reload →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PERFORMANCE STATS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="bg-maverick-dark-1 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-12 h-12" />
              </div>
              <p className="text-[10px] font-black text-maverick-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-black italic tracking-tighter text-white">{stat.value}</span>
                {stat.change && <span className="text-[10px] font-bold text-maverick-neon mb-1">{stat.change}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* ── MISSING API KEY BANNER ── */}
        {!profile?.api_key && (
          <div className="mb-8 flex items-center gap-4 rounded-2xl px-6 py-4 bg-maverick-gold/5 border border-maverick-gold/20">
            <AlertTriangle className="w-5 h-5 shrink-0 text-maverick-gold" />
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-maverick-gold mb-1">Infrastructure Alert</p>
              <p className="text-sm font-medium text-white/80">No performance intelligence key detected. Connect your LLM key to unlock the Strategy Engine.</p>
            </div>
            <a href="/settings" className="px-6 py-2 bg-maverick-gold text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all italic">Connect Key →</a>
          </div>
        )}

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

          {/* ── MODULE PICKER ── */}
          <aside className="rounded-3xl p-6 h-fit lg:sticky lg:top-8 bg-maverick-dark-1 border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-maverick-neon" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-maverick-muted">Strategy Modules</h2>
              </div>
              {selectedWeapons.length > 0 && (
                <button onClick={() => setSelectedWeapons([])} className="text-[8px] font-black uppercase tracking-widest text-maverick-muted hover:text-white transition-colors">Reset</button>
              )}
            </div>

            <div className="space-y-1.5">
              {skills.map((skill) => {
                const isSelected = selectedWeapons.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleWeapon(skill.id)}
                    className={`group w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all border ${isSelected ? 'bg-maverick-neon/5 border-maverick-neon/20' : 'border-transparent hover:bg-white/[0.02]'}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-maverick-neon bg-maverick-neon' : 'border-white/10 group-hover:border-white/30'}`}>
                      {isSelected && <CheckCheck className="w-3 h-3 text-black" />}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-white' : 'text-maverick-muted group-hover:text-white'}`}>{skill.name}</span>
                    {isSelected && <ChevronRight className="w-3 h-3 ml-auto shrink-0 text-maverick-neon" />}
                  </button>
                );
              })}
            </div>

            {selectedWeapons.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-[8px] font-mono text-maverick-neon uppercase tracking-[0.3em] italic">
                  {selectedWeapons.length} Module{selectedWeapons.length > 1 ? 's' : ''} Synapsing
                </p>
              </div>
            )}
          </aside>

          {/* ── EXECUTION ── */}
          <section className="flex flex-col gap-8">
            <div className="rounded-3xl p-8 bg-maverick-dark-1 border border-white/5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-maverick-neon" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-maverick-muted">Performance Brief</label>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={selectedWeapons.length > 0
                  ? `Brief the ${skills.find(s => s.id === selectedWeapons[0])?.name} module...`
                  : "e.g. 'Audit our Meta campaigns running at $50k/mo spend — ROAS has dropped from 4.2x to 2.8x over 3 weeks...'"
                }
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-maverick-muted outline-none focus:border-maverick-neon/50 transition-all resize-none min-h-[160px] font-medium leading-relaxed"
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleUnleash(); }}
              />

              {/* Model Selector + Execute Button */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mt-6 gap-4">
                {/* Model Selector */}
                <div className="relative">
                  <button
                    onClick={() => setModelOpen(!modelOpen)}
                    className="flex items-center gap-3 px-4 py-3 bg-black/50 border border-white/10 rounded-xl hover:border-white/20 transition-colors group"
                  >
                    <activeModel.icon className="w-3.5 h-3.5 text-maverick-neon" />
                    <div className="text-left">
                      <p className="text-[8px] font-mono text-maverick-muted uppercase tracking-widest">Engine</p>
                      <p className="text-[10px] font-black text-white uppercase italic">{activeModel.label}</p>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-maverick-muted ml-2 transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {modelOpen && (
                    <div className="absolute bottom-full mb-2 left-0 w-64 bg-maverick-dark-2 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      {MODELS.map(m => (
                        <button
                          key={m.id}
                          onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                          className={`w-full flex items-center gap-4 px-5 py-4 transition-colors ${selectedModel === m.id ? 'bg-maverick-neon/5' : 'hover:bg-white/[0.02]'}`}
                        >
                          <m.icon className={`w-4 h-4 shrink-0 ${selectedModel === m.id ? 'text-maverick-neon' : 'text-maverick-muted'}`} />
                          <div className="text-left">
                            <p className={`text-[10px] font-black uppercase italic ${selectedModel === m.id ? 'text-maverick-neon' : 'text-white'}`}>{m.label}</p>
                            <p className="text-[8px] font-mono text-maverick-muted uppercase tracking-widest">{m.desc}</p>
                          </div>
                          {selectedModel === m.id && <CheckCheck className="w-3.5 h-3.5 text-maverick-neon ml-auto" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUnleash}
                  disabled={loading || !message.trim()}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-4 bg-maverick-neon text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:shadow-[0_0_40px_rgba(0,204,102,0.3)] transition-all active:scale-95 disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed italic"
                >
                  {loading ? (
                    <><RotateCcw className="w-4 h-4 animate-spin" />Synapsing...</>
                  ) : (
                    <><Zap className="w-4 h-4" />Execute Intelligence</>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-4 rounded-2xl px-6 py-4 bg-red-500/5 border border-red-500/20 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Synapse Interrupted</p>
                  <p className="text-xs mt-1 text-white/60">{error}</p>
                </div>
              </div>
            )}

            {/* ── OUTPUT PANEL ── */}
            {(currentOutput || loading) && (
              <div ref={outputRef} className="rounded-3xl overflow-hidden bg-maverick-dark-1 border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${streaming ? 'animate-pulse bg-maverick-gold' : 'bg-maverick-neon'} shadow-[0_0_10px_rgba(0,204,102,0.5)]`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                      {streaming ? 'Synapsing...' : 'Elite Performance Asset'}
                    </span>
                    <span className="text-[8px] font-mono text-maverick-muted uppercase px-2 py-0.5 rounded-full border border-white/5">
                      {activeModel.label}
                    </span>
                  </div>
                  {!streaming && response && (
                    <div className="flex items-center gap-3">
                      <button onClick={handleRemix} className="p-2.5 rounded-xl border border-white/5 text-maverick-muted hover:text-white hover:bg-white/5 transition-all">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${copied ? 'bg-maverick-neon/10 border-maverick-neon text-maverick-neon' : 'bg-white/5 border-transparent text-white hover:bg-white/10'}`}
                      >
                        {copied ? <><CheckCheck className="w-3.5 h-3.5" />Synapsed</> : <><Copy className="w-3.5 h-3.5" />Copy Asset</>}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-8 lg:p-12">
                  <div
                    className="text-sm lg:text-base leading-relaxed text-white/90 font-medium max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: (currentOutput || '')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black italic">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="italic text-maverick-neon">$1</em>')
                        .replace(/#{1,3} (.*?)(\n|$)/g, '<h3 class="text-white font-black italic text-lg mt-6 mb-2 uppercase tracking-tight">$1</h3>')
                        .replace(/\n/g, '<br>')
                    }}
                  />
                  {streaming && <span className="inline-block w-1.5 h-4 bg-maverick-neon animate-pulse ml-1 rounded-sm" />}
                </div>

                {!streaming && response && (
                  <div className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 bg-white/[0.01]">
                    <p className="text-[8px] font-mono text-maverick-muted uppercase tracking-[0.5em] italic">Performance Intelligence Engine · Swayze Media</p>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!currentOutput && !loading && !error && (
              <div className="flex flex-col items-center justify-center text-center py-24 rounded-3xl border border-dashed border-white/5 bg-white/[0.01]">
                <div className="w-16 h-16 rounded-full bg-maverick-dark-1 border border-white/5 flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8 text-maverick-muted opacity-20" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-maverick-muted mb-2">Awaiting Intelligence Brief</p>
                <p className="text-[8px] font-mono text-maverick-muted uppercase tracking-widest opacity-40">Load Module · Supply Target · Execute Synapse</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
