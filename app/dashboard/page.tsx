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

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* ── TOP BAR ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="section-label mb-1">Command Center</p>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Marketing Maverick
            </h1>
            <p className="text-xs font-mono mt-1 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Pick weapons · Brief Maverick · Unleash
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(57,231,95,0.1)', border: '1px solid rgba(57,231,95,0.3)', color: 'var(--green)' }}
            >
              <Zap className="w-3 h-3" />
              Free — Unlimited
            </span>

            <a
              href="https://t.me/brandonswayze"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs px-3 py-1.5"
            >
              Give Feedback
            </a>
          </div>
        </div>

        {/* ── MISSING API KEY BANNER ── */}
        {!profile?.api_key && (
          <div
            className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.3)' }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: 'var(--orange)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--orange)' }}>
              No OpenAI key detected.{' '}
              <a href="/settings" className="font-bold hover:underline" style={{ color: 'var(--orange)' }}>
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
          <aside
            className="rounded-2xl p-5 h-fit md:sticky md:top-[80px]"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                ⚔ Weapons
              </h2>
              {selectedWeapons.length > 0 && (
                <button
                  onClick={() => setSelectedWeapons([])}
                  className="text-[10px] font-bold uppercase tracking-wider transition-colors hover:text-red-400"
                  style={{ color: 'var(--text-muted)' }}
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
                    <span
                      className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all"
                      style={{
                        borderColor: isSelected ? 'var(--green)' : 'var(--border-card)',
                        backgroundColor: isSelected ? 'var(--green)' : 'transparent',
                      }}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-black">
                          <path d="M1 4l3 3 5-6" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>

                    <span className="text-sm font-semibold transition-colors" style={{ color: isSelected ? 'white' : 'var(--text-secondary)' }}>
                      {skill.name}
                    </span>

                    {isSelected && (
                      <ChevronRight className="w-3 h-3 ml-auto shrink-0" style={{ color: 'var(--green)' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected count */}
            {selectedWeapons.length > 0 && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs font-mono" style={{ color: 'var(--green)' }}>
                  {selectedWeapons.length} weapon{selectedWeapons.length > 1 ? 's' : ''} loaded
                </p>
              </div>
            )}

            {/* Tip */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <p className="text-[10px] font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Stack weapons for compound output. e.g. Value Prop + Landing Headline = 🔥
              </p>
            </div>
          </aside>

          {/* ════════════════════════════════════════
              MAIN CONTENT: Input + Output
          ════════════════════════════════════════ */}
          <section className="flex flex-col gap-6">

            {/* Input area */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
              <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-muted)' }}>
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
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {selectedWeapons.length === 0 ? 'No weapons selected' : `${selectedWeapons.length} skill${selectedWeapons.length > 1 ? 's' : ''} active`}
                  <span className="ml-2 opacity-50">· ⌘+Enter to fire</span>
                </p>

                <button
                  onClick={handleUnleash}
                  disabled={loading || !message.trim()}
                  className="btn-primary py-2.5 px-6 text-sm disabled:opacity-40 disabled:transform-none disabled:shadow-none"
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
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-400">Maverick hit a wall</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(248,113,113,0.7)' }}>{error}</p>
                </div>
              </div>
            )}

            {/* ── OUTPUT PANEL ── */}
            {response && (
              <div
                ref={outputRef}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--bg-page)', border: '1px solid rgba(57,231,95,0.2)' }}
              >
                {/* Output header */}
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--green)' }} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--green)' }}>
                      Maverick Output
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRemix}
                      className="flex items-center gap-1.5 text-xs font-bold transition-colors px-2 py-1 rounded"
                      style={{ color: 'var(--text-muted)', border: '1px solid transparent' }}
                    >
                      <RotateCcw className="w-3 h-3" />
                      Remix
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded transition-all"
                      style={copied
                        ? { color: 'var(--green)', border: '1px solid rgba(57,231,95,0.4)', backgroundColor: 'rgba(57,231,95,0.08)' }
                        : { color: 'var(--text-muted)', border: '1px solid var(--border-card)' }
                      }
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
                <div
                  className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4"
                  style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-card)' }}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Marketing Maverick · Swayze Media
                  </span>

                  <div
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                    style={{ backgroundColor: 'rgba(57,231,95,0.05)', border: '1px solid rgba(57,231,95,0.2)' }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--green)' }}>Help us improve:</span>
                    <a
                      href="https://t.me/brandonswayze"
                      target="_blank"
                      className="text-[10px] font-black text-white hover:underline uppercase transition-colors"
                      style={{ color: 'var(--green)' }}
                    >
                      Send Feedback →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!response && !loading && !error && (
              <div
                className="flex flex-col items-center justify-center text-center py-16 rounded-2xl"
                style={{ border: '1px dashed var(--border-card)' }}
              >
                <div className="text-4xl mb-4">⚡</div>
                <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                  Awaiting orders
                </p>
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
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
