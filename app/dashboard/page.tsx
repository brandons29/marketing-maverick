'use client';
// app/dashboard/page.tsx — Marketing Maverick Command Center
// Swayze Media branded — forest green-black, orange CTAs, neon green accents

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
  AlertCircle
} from 'lucide-react';

interface UserProfile {
  api_key: string | null;
}

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [selectedWeapons, setSelectedWeapons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // ── Fetch user profile on mount ──
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/signup';
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('api_key')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data as UserProfile);
      setProfileLoading(false);
    };
    init();
  }, [supabase]);

  const toggleWeapon = (id: string) => {
    setSelectedWeapons((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleUnleash = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, selectedSkills: selectedWeapons }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          throw new Error('OpenAI billing issue — check your API key quota.');
        }
        if (res.status === 403 && json.error?.includes('No API key')) {
          window.location.href = '/settings';
          return;
        }
        throw new Error(json.error || 'Something broke');
      }

      setResponse(json.content ?? '');
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRemix = () => {
    setResponse('');
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Loading skeleton ──
  if (profileLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(57,231,95,0.3)', borderTopColor: 'var(--green)' }} />
          <span className="font-mono text-sm uppercase tracking-widest">Loading arsenal...</span>
        </div>
      </div>
    );
  }

  // ── Dashboard Metrics (Mocked for Elite feel) ──
  const dashboardStats = [
    { label: 'AI Efficiency', value: '94%', change: '+12%', icon: Zap },
    { label: 'Creative Testing', value: '14 Active', change: '+2', icon: Activity },
    { label: 'Avg ROAS (Last Join)', value: '3.4x', change: '+0.4x', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12">
      <div className="max-w-7xl mx-auto">

        {/* ── TOP BAR ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-maverick-neon shadow-[0_0_10px_rgba(0,204,102,0.5)]" />
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">Strategy Engine</h1>
            </div>
            <p className="text-[10px] text-maverick-muted font-mono uppercase tracking-[0.4em]">
              Performance Intelligence · Elite Performance Assets
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-maverick-dark-1 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-maverick-neon" />
              <div>
                <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-widest">Status</p>
                <p className="text-[10px] font-black text-white uppercase italic">Elite Pro Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── PERFORMANCE STATS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="bg-maverick-dark-1 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-12 h-12" />
              </div>
              <p className="text-[10px] font-black text-maverick-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-black italic tracking-tighter text-white">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-maverick-neon mb-1">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── MISSING API KEY BANNER ── */}
        {!profile?.api_key && (
          <div
            className="mb-8 flex items-center gap-4 rounded-2xl px-6 py-4 bg-maverick-gold/5 border border-maverick-gold/20"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 text-maverick-gold" />
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-maverick-gold mb-1">Infrastructure Alert</p>
              <p className="text-sm font-medium text-white/80">
                No performance intelligence key detected. Connect OpenAI to unlock the Strategy Engine.
              </p>
            </div>
            <a href="/settings" className="px-6 py-2 bg-maverick-gold text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-neon-gold transition-all italic">
              Connect Key →
            </a>
          </div>
        )}

        {/* ── MAIN GRID: Sidebar + Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

          {/* ════════════════════════════════════════
              STRATEGY MODULE PICKER
          ════════════════════════════════════════ */}
          <aside
            className="rounded-3xl p-6 h-fit lg:sticky lg:top-8 bg-maverick-dark-1 border border-white/5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-maverick-neon" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-maverick-muted">
                  Strategy Modules
                </h2>
              </div>
              {selectedWeapons.length > 0 && (
                <button
                  onClick={() => setSelectedWeapons([])}
                  className="text-[8px] font-black uppercase tracking-widest text-maverick-muted hover:text-white transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {skills.map((skill) => {
                const isSelected = selectedWeapons.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleWeapon(skill.id)}
                    className={`group w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all border border-transparent ${
                      isSelected 
                        ? 'bg-maverick-neon/5 border-maverick-neon/20' 
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                        isSelected 
                          ? 'border-maverick-neon bg-maverick-neon' 
                          : 'border-white/10 group-hover:border-white/30'
                      }`}
                    >
                      {isSelected && (
                        <CheckCheck className="w-3 h-3 text-black" />
                      )}
                    </div>

                    <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                      isSelected ? 'text-white' : 'text-maverick-muted group-hover:text-white'
                    }`}>
                      {skill.name}
                    </span>

                    {isSelected && (
                      <ChevronRight className="w-3 h-3 ml-auto shrink-0 text-maverick-neon" />
                    )}
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

          {/* ════════════════════════════════════════
              EXECUTION: Input + Output
          ════════════════════════════════════════ */}
          <section className="flex flex-col gap-8">

            {/* Briefing area */}
            <div
              className="rounded-3xl p-8 bg-maverick-dark-1 border border-white/5 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-maverick-neon" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-maverick-muted">
                  Performance Brief
                </label>
              </div>
              
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  selectedWeapons.length > 0
                    ? `Input specific targets for ${skills.find(s => s.id === selectedWeapons[0])?.name}...`
                    : "e.g. 'Audit current Facebook Ad account performance for a Shopify store at $50k/mo spend...'"
                }
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-sm text-white placeholder:text-maverick-muted outline-none focus:border-maverick-neon/50 transition-all resize-none min-h-[160px] font-medium leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleUnleash();
                  }
                }}
              />

              <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border border-maverick-black bg-maverick-dark-3" />
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-maverick-muted uppercase tracking-widest">
                    {selectedWeapons.length === 0 ? 'Select module to begin' : `${selectedWeapons.length} Stage Synapse Active`}
                  </p>
                </div>

                <button
                  onClick={handleUnleash}
                  disabled={loading || !message.trim()}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-4 bg-maverick-neon text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:shadow-[0_0_40px_rgba(0,204,102,0.3)] transition-all active:scale-95 disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed italic"
                >
                  {loading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Synapsing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Execute Intelligence
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-4 rounded-2xl px-6 py-4 bg-red-500/5 border border-red-500/20 animate-in fade-in"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Synapse Interrupted</p>
                  <p className="text-xs mt-1 text-white/60">{error}</p>
                </div>
              </div>
            )}

            {/* ── OUTPUT PANEL ── */}
            {response && (
              <div
                ref={outputRef}
                className="rounded-3xl overflow-hidden bg-maverick-dark-1 border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700"
              >
                {/* Output header */}
                <div
                  className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.01]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-maverick-neon animate-pulse shadow-[0_0_10px_rgba(0,204,102,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                      Elite Performance Asset
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRemix}
                      className="p-2.5 rounded-xl border border-white/5 text-maverick-muted hover:text-white hover:bg-white/5 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                        copied 
                          ? 'bg-maverick-neon/10 border-maverick-neon text-maverick-neon' 
                          : 'bg-white/5 border-transparent text-white hover:bg-white/10'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5" />
                          Synapsed
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Asset
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Output content */}
                <div className="p-8 lg:p-12">
                  <div
                    className="maverick-output text-sm lg:text-base leading-relaxed text-white/90 font-medium max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: response
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black italic">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="italic text-maverick-neon">$1</em>')
                        .replace(/\n/g, '<br>'),
                    }}
                  />
                </div>

                {/* Output footer */}
                <div
                  className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 bg-white/[0.01]"
                >
                  <p className="text-[8px] font-mono text-maverick-muted uppercase tracking-[0.5em] italic">
                    Performance Intelligence Engine · Swayze Media
                  </p>

                  <div
                    className="flex items-center gap-3 rounded-full px-4 py-2 bg-maverick-neon/[0.03] border border-maverick-neon/10"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-maverick-neon">Optimize:</span>
                    <a
                      href="https://t.me/brandonswayze"
                      target="_blank"
                      className="text-[9px] font-black text-white hover:text-maverick-neon uppercase tracking-widest transition-colors italic"
                    >
                      Audit Report →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!response && !loading && !error && (
              <div
                className="flex flex-col items-center justify-center text-center py-24 rounded-3xl border border-dashed border-white/5 bg-white/[0.01]"
              >
                <div className="w-16 h-16 rounded-full bg-maverick-dark-1 border border-white/5 flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8 text-maverick-muted opacity-20" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-maverick-muted mb-2">
                  Awaiting Intelligence Brief
                </p>
                <p className="text-[8px] font-mono text-maverick-muted uppercase tracking-widest opacity-40">
                  Load Module · Supply Target · Execute Synapse
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
