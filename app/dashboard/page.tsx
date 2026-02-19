'use client';
// app/dashboard/page.tsx — Marketing Maverick Command Center
// Matte Black · Cyber Neon · Gold — full Weapon Picker sidebar

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { skills } from '@/prompts/marketing';
import {
  Zap,
  ChevronRight,
  Copy,
  RotateCcw,
  AlertTriangle,
  Crown,
  Lock,
  CheckCheck,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface UserProfile {
  run_count: number;
  subscription_status: 'free' | 'pro';
  api_key: string | null;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const FREE_LIMIT = 5;

// ─── Component ──────────────────────────────────────────────────────────────
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
  const isPro = profile?.subscription_status === 'pro';
  const runsUsed = profile?.run_count ?? 0;
  const runsLeft = isPro ? Infinity : FREE_LIMIT - runsUsed;
  const isLocked = !isPro && runsUsed >= FREE_LIMIT;

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
        .select('run_count, subscription_status, api_key')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data as UserProfile);

      // Handle post-upgrade redirect
      if (window.location.search.includes('upgrade=true')) {
        window.history.replaceState(null, '', '/dashboard');
      }

      setProfileLoading(false);
    };
    init();
  }, [supabase]);

  // ── Toggle weapon selection ──
  const toggleWeapon = (id: string) => {
    setSelectedWeapons((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  // ── Send to Maverick ──
  const handleUnleash = async () => {
    if (!message.trim()) return;
    if (isLocked) {
      window.location.href = '/pricing';
      return;
    }
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
          window.location.href = '/pricing';
          return;
        }
        if (res.status === 403 && json.error?.includes('No API key')) {
          window.location.href = '/settings';
          return;
        }
        throw new Error(json.error || 'Something broke');
      }

      setResponse(json.content ?? '');
      setProfile((prev) =>
        prev ? { ...prev, run_count: prev.run_count + 1 } : prev
      );

      // Smooth scroll to output
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Copy output ──
  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Remix (clear & reuse weapons) ──
  const handleRemix = () => {
    setResponse('');
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Loading skeleton ──
  if (profileLoading) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#444]">
          <div className="w-5 h-5 border-2 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin" />
          <span className="font-mono text-sm uppercase tracking-widest">Loading arsenal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* ── TOP BAR ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Command Center
            </h1>
            <p className="text-xs text-[#444] font-mono mt-1 uppercase tracking-widest">
              Pick weapons · Brief Maverick · Unleash
            </p>
          </div>

          {/* Run counter + status */}
          <div className="flex items-center gap-3">
            {isPro ? (
              <span className="status-pill-pro flex items-center gap-1.5">
                <Crown className="w-3 h-3" />
                PRO — Unlimited
              </span>
            ) : (
              <span className="status-pill-free">
                {Math.max(0, runsLeft)} free run{runsLeft !== 1 ? 's' : ''} left
              </span>
            )}

            {!isPro && (
              <a
                href="/pricing"
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide bg-[#ffd700] text-black px-3 py-1.5 rounded hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] transition-all"
              >
                <Crown className="w-3 h-3" />
                Go Pro — $15/mo
              </a>
            )}
          </div>
        </div>

        {/* ── MISSING API KEY BANNER ── */}
        {!profile?.api_key && (
          <div className="mb-6 flex items-center gap-3 bg-[#ffd700]/8 border border-[#ffd700]/30 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-[#ffd700] shrink-0" />
            <p className="text-sm text-[#c9a227] font-medium">
              No OpenAI key detected.{' '}
              <a href="/settings" className="text-[#ffd700] font-bold hover:underline">
                Add your key →
              </a>
            </p>
          </div>
        )}

        {/* ── MAIN GRID: Sidebar + Content ── */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">

          {/* ════════════════════════════════════════
              WEAPON PICKER SIDEBAR
          ════════════════════════════════════════ */}
          <aside className="bg-[#0f0f0f] border border-white/6 rounded-2xl p-5 h-fit md:sticky md:top-[76px]">

            {/* Sidebar header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#555]">
                ⚔ Weapons
              </h2>
              {selectedWeapons.length > 0 && (
                <button
                  onClick={() => setSelectedWeapons([])}
                  className="text-[10px] font-bold text-[#333] hover:text-red-400 uppercase tracking-wider transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Weapon list */}
            <div className="space-y-1">
              {skills.map((skill) => {
                const isSelected = selectedWeapons.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleWeapon(skill.id)}
                    className={`weapon-item w-full text-left flex items-center gap-3 ${isSelected ? 'selected' : ''}`}
                  >
                    {/* Checkbox indicator */}
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-[#00ff88] bg-[#00ff88]'
                          : 'border-[#333]'
                      }`}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-black">
                          <path d="M1 4l3 3 5-6" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>

                    <span className="text-sm font-semibold text-[#888] group-hover:text-white transition-colors">
                      {skill.name}
                    </span>

                    {isSelected && (
                      <ChevronRight className="w-3 h-3 text-[#00ff88] ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected count */}
            {selectedWeapons.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs font-mono text-[#00ff88]">
                  {selectedWeapons.length} weapon{selectedWeapons.length > 1 ? 's' : ''} loaded
                </p>
              </div>
            )}

            {/* Tip */}
            <div className="mt-5 pt-4 border-t border-white/5">
              <p className="text-[10px] text-[#333] font-mono leading-relaxed">
                Stack weapons for compound output. e.g. Value Prop + Landing Headline = 🔥
              </p>
            </div>
          </aside>

          {/* ════════════════════════════════════════
              MAIN CONTENT: Input + Output
          ════════════════════════════════════════ */}
          <section className="flex flex-col gap-6">

            {/* Input area */}
            <div className="bg-[#0f0f0f] border border-white/6 rounded-2xl p-6">
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#555] mb-3">
                Brief Maverick
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  selectedWeapons.length > 0
                    ? `Tell Maverick what to ${skills.find(s => s.id === selectedWeapons[0])?.name.toLowerCase() ?? 'write'}...`
                    : "e.g. 'Write cold DMs for a SaaS tool that saves engineers 5hrs/week'"
                }
                className="input-dark resize-none min-h-[140px] text-sm leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleUnleash();
                  }
                }}
              />

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-[#333] font-mono">
                  {selectedWeapons.length === 0 ? 'No weapons selected' : `${selectedWeapons.length} skill${selectedWeapons.length > 1 ? 's' : ''} active`}
                  <span className="ml-2 opacity-50">· ⌘+Enter to fire</span>
                </p>

                {isLocked ? (
                  <a
                    href="/pricing"
                    className="flex items-center gap-2 bg-[#ffd700] text-black px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Unlock — $15/mo
                  </a>
                ) : (
                  <button
                    onClick={handleUnleash}
                    disabled={loading || !message.trim()}
                    className="flex items-center gap-2 btn-primary py-2.5 px-6 text-sm disabled:opacity-40 disabled:transform-none disabled:shadow-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        UNLEASH
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/25 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-400">Maverick hit a wall</p>
                  <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* ── OUTPUT PANEL ── */}
            {response && (
              <div
                ref={outputRef}
                className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,136,0.06)]"
              >
                {/* Output header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0f0f0f]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00ff88]">
                      Maverick Output
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRemix}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#555] hover:text-[#888] transition-colors px-2 py-1 rounded border border-transparent hover:border-white/10"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Remix
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded border transition-all ${
                        copied
                          ? 'text-[#00ff88] border-[#00ff88]/40 bg-[#00ff88]/8'
                          : 'text-[#555] border-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Output content */}
                <div className="p-6 md:p-8">
                  <div
                    className="maverick-output text-[0.9rem] leading-7 whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{
                      __html: response
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\n/g, '<br>'),
                    }}
                  />
                </div>

                {/* Output footer */}
                <div className="px-6 py-3 border-t border-white/5 bg-[#0f0f0f] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#222] uppercase tracking-widest">
                    Marketing Maverick v1.0 · Swayze Media
                  </span>
                  <span className="text-[10px] font-mono text-[#222]">
                    run #{runsUsed}
                  </span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!response && !loading && !error && (
              <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-white/8 rounded-2xl">
                <div className="text-4xl mb-4">⚡</div>
                <p className="text-sm font-bold text-[#444] uppercase tracking-widest mb-1">
                  Awaiting orders
                </p>
                <p className="text-xs text-[#333] font-mono">
                  Pick a weapon · Drop your brief · Hit Unleash
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
