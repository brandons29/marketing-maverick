'use client';

import Link from 'next/link';
import { 
  Zap, 
  ShieldCheck, 
  Target, 
  Activity, 
  LayoutDashboard, 
  RefreshCcw,
  FileSpreadsheet,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const weapons = [
  'Scale Strategy', 'Ad Copy Synapse', 'CRO Synapse', 'Visual Briefing',
  'Offer Engineering', 'Funnel Synapse', 'Retargeting Blitz',
  'Lead Gen Elite', 'ROAS Recovery', 'Performance Hooks',
];

export default function Home() {
  return (
    <div className="relative bg-maverick-black overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-32 pb-40 text-center min-h-[90vh] flex flex-col items-center justify-center">
        {/* Subtle grid overlay — matches swayzemedia.com texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,204,102,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,204,102,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative max-w-5xl mx-auto z-10">
          {/* Section label — Elite branding */}
          <div className="inline-flex items-center gap-3 mb-10 px-5 py-2.5 rounded-full bg-maverick-neon/5 border border-maverick-neon/20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-2 h-2 rounded-full bg-maverick-neon shadow-[0_0_15px_rgba(0,204,102,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-maverick-neon">
              Performance Intelligence · Swayze Media Elite
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-8 leading-[0.9] italic animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Performance AI<br />
            <span className="text-maverick-gold">For $10M+ Scale.</span>
          </h1>

          <p className="text-sm md:text-base max-w-2xl mx-auto mb-14 leading-relaxed font-mono uppercase tracking-[0.2em] text-maverick-muted animate-in fade-in duration-1000 delay-300">
            Marketing Maverick is the institutional Strategy Engine for elite performance marketers. Synapse ad spend, bridge attribution gaps, and execute data-backed creative synapse.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in duration-1000 delay-500">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-16 py-6 bg-maverick-neon text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:shadow-[0_0_50px_rgba(0,204,102,0.4)] transition-all active:scale-95 italic text-sm shadow-xl"
            >
              Execute Synapse
            </Link>
            <Link
              href="/auth/login"
              className="text-[10px] font-black uppercase tracking-[0.3em] text-maverick-muted hover:text-white transition-colors"
            >
              Access Command Center →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WEAPONS TICKER ── */}
      <section className="py-8 overflow-hidden border-y border-white/5 bg-maverick-dark-1/50 backdrop-blur-sm relative z-20">
        <div className="ticker-track">
          {[...weapons, ...weapons, ...weapons, ...weapons].map((w, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.4em] mr-20 text-maverick-muted whitespace-nowrap">
              <span className="text-maverick-neon mr-3">/</span> {w}
            </span>
          ))}
        </div>
      </section>

      {/* ── PERFORMANCE INFRASTRUCTURE ── */}
      <section className="px-6 py-40 bg-maverick-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-maverick-neon mb-6">The Infrastructure</p>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic text-white mb-8 leading-tight">
              Built By Media Buyers.<br />
              <span className="text-maverick-muted opacity-40">Not Prompt Engineers.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                color: 'text-maverick-neon',
                title: 'Attribution Bridge',
                body: 'Synapse Meta/Google spend with CRM Source of Truth. Expose the tracking gap and calculate True ROAS in seconds.',
              },
              {
                icon: Zap,
                color: 'text-maverick-gold',
                title: 'Strategy Engine',
                body: 'Generate elite performance assets. Scale frameworks, creative briefs, and lead gen optimization built for high-spend accounts.',
              },
              {
                icon: ShieldCheck,
                color: 'text-blue-500',
                title: 'Institutional Privacy',
                body: 'Your data never leaves the client. AES-256 key encryption and row-level security ensure your account intel is for your eyes only.',
              },
              {
                icon: Activity,
                color: 'text-red-500',
                title: 'ROAS Recovery',
                body: 'Execute "Red Team" audits on dipping campaigns. Fatigue analysis and audience overlap killers to restore target CPA.',
              },
              {
                icon: TrendingUp,
                color: 'text-maverick-neon',
                title: 'Offer Engineering',
                body: 'Synthesize high-LTV offers with psychological triggers designed to maximize front-end conversion and customer trust.',
              },
              {
                icon: RefreshCcw,
                color: 'text-maverick-gold',
                title: 'Synapse Logic',
                body: 'Bring Your Own OpenAI Key. Unlimited runs. Full model control. Pure performance intelligence with zero gatekeeping.',
              },
            ].map(({ icon: Icon, color, title, body }) => (
              <div
                key={title}
                className="bg-maverick-dark-1 border border-white/5 p-10 rounded-[2.5rem] hover:border-white/10 transition-all group hover:bg-white/[0.01]"
              >
                <div className={`mb-8 ${color}`}>
                  <Icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4 italic">{title}</h3>
                <p className="text-[11px] leading-relaxed text-maverick-muted font-mono uppercase tracking-widest">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="px-6 py-48 border-t border-white/5 relative overflow-hidden bg-maverick-black">
         <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,204,102,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-9xl font-black uppercase tracking-tighter italic text-white mb-10 leading-[0.85]">
            Stop Guessing.<br />
            <span className="text-maverick-neon">Start Executing.</span>
          </h2>
          <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-maverick-muted mb-16 leading-loose max-w-xl mx-auto">
            Marketing Maverick is free for elite performance marketers. No card. No fluff. Pure synapse.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-20 py-7 bg-maverick-neon text-black font-black uppercase tracking-[0.4em] rounded-2xl hover:shadow-[0_0_70px_rgba(0,204,102,0.5)] transition-all active:scale-95 italic text-sm shadow-2xl"
          >
            Access Command Center
          </Link>
          <div className="mt-24 opacity-20">
            <p className="text-[9px] font-mono uppercase tracking-[0.8em] text-white">Swayze Media · Maverick Synapse 1.0.4 · Institutional Grade</p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-maverick-muted">
          © 2026 Swayze Media · Performance Intelligence Engine
        </p>
      </footer>
    </div>
  );
}
