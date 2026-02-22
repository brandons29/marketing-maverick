'use client';

import Link from 'next/link';
import { 
  Zap, 
  ShieldCheck, 
  Target, 
  Activity, 
  LayoutDashboard, 
  RefreshCcw,
  TrendingUp,
  FileSpreadsheet,
  BarChart3,
  Cpu,
  Lock,
  ChevronRight
} from 'lucide-react';

const weapons = [
  'Scale Strategy', 'Ad Copy Synapse', 'CRO Synapse', 'Visual Briefing',
  'Offer Engineering', 'Funnel Synapse', 'Retargeting Blitz',
  'Lead Gen Elite', 'ROAS Recovery', 'Performance Hooks',
];

export default function Home() {
  return (
    <div className="relative bg-black overflow-x-hidden min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-32 pb-40 text-center min-h-[95vh] flex flex-col items-center justify-center">
        {/* Refined Grid Overlay */}
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        
        {/* Subtle Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-maverick-neon/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto z-10">
          <div className="inline-flex items-center gap-3 mb-10 px-5 py-2.5 rounded-full bg-maverick-neon/5 border border-maverick-neon/20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-2 h-2 rounded-full bg-maverick-neon shadow-[0_0_15px_rgba(0,255,136,1)]" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-maverick-neon">
              Swayze Media Elite · Performance Synapse
            </span>
          </div>

          <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter text-white mb-10 leading-[0.85] italic animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Performance AI<br />
            <span className="text-maverick-gold">Built to Scale.</span>
          </h1>

          <div className="max-w-3xl mx-auto space-y-6 mb-16 animate-in fade-in duration-1000 delay-300">
            <p className="text-base md:text-xl font-bold text-white uppercase italic tracking-tight">
              Expert Execution Logic + Your Intelligence Engine.
            </p>
            <p className="performance-subheadline mx-auto uppercase tracking-widest text-[11px] md:text-sm">
              Marketing Maverick is a 100% Free Strategy Engine. We provide the $100M+ tactical logic—you power the synapse with your own LLM API key.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in fade-in duration-1000 delay-500">
            <Link href="/auth/signup" className="btn-synapse w-full sm:w-auto shadow-2xl">
              Start Free Synapse
            </Link>
            <Link href="/auth/login" className="text-[11px] font-black uppercase tracking-[0.4em] text-maverick-muted hover:text-white transition-colors">
              Already Have Access →
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM (HOOK) ── */}
      <section className="px-6 py-40 bg-[#050505] border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <p className="performance-label text-red-500">The Problem</p>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
              Ad Platforms Lie.<br />
              <span className="opacity-30">CRMs Hide The Truth.</span>
            </h2>
          </div>
          <p className="text-sm md:text-base font-medium text-white/60 leading-relaxed uppercase tracking-[0.2em] max-w-2xl mx-auto">
            Media buyers managing $10M+ shouldn't be guessing. The "Tracking Gap" wastes 20-30% of your budget. Maverick exposes the leak and recovers your ROAS.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <p className="performance-label text-maverick-neon">The Protocol</p>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic text-white">How it Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Connect LLM',
                body: 'Bring your own OpenAI API key. We provide a 100% secure, encrypted bridge to your engine.',
                icon: Cpu
              },
              {
                step: '02',
                title: 'Load Strategy',
                body: 'Access the collective knowledge of $100M+ in managed spend via our elite strategy modules.',
                icon: Target
              },
              {
                step: '03',
                title: 'Execute Results',
                body: 'Synapse ad data with expert logic to generate institutional-grade performance assets.',
                icon: Zap
              }
            ].map((s) => (
              <div key={s.step} className="elite-card p-10 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <s.icon className="w-32 h-32" />
                </div>
                <span className="text-[11px] font-black text-maverick-neon/40 uppercase tracking-widest font-mono">Step {s.step}</span>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{s.title}</h3>
                <p className="text-sm text-maverick-muted font-medium leading-loose uppercase tracking-wider">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-60 border-t border-white/[0.05] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter italic text-white mb-12 leading-[0.8] animate-pulse duration-[4000ms]">
            Start<br />
            <span className="text-maverick-neon">Synapse.</span>
          </h2>
          <p className="text-xs font-mono uppercase tracking-[0.6em] text-maverick-muted mb-16 max-w-md mx-auto leading-relaxed">
            Free for elite performance marketers.<br />No card. No gatekeeping. No fluff.
          </p>
          <Link href="/auth/signup" className="btn-synapse scale-125 px-20">
            Access Intelligence
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-white/[0.05] text-center bg-black">
        <p className="text-[9px] font-mono uppercase tracking-[0.6em] text-white/20">
          © 2026 Swayze Media · Performance Intelligence · Institutional Grade
        </p>
      </footer>
    </div>
  );
}
