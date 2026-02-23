'use client';

import Link from 'next/link';
import { 
  Zap, 
  Target, 
  Activity, 
  Cpu,
  ChevronRight,
  Sparkles,
  Layers,
  Shield,
  ArrowUpRight,
  BrainCircuit,
  TrendingUp,
  Workflow
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative bg-black overflow-x-hidden min-h-screen grid-complex mesh-gradient">

      {/* ── HERO SECTION ── */}
      <section className="relative px-6 pt-32 pb-24 md:pt-48 md:pb-40 text-center min-h-screen flex flex-col items-center justify-center">
        
        {/* Floating Decorative Elements (Meng To Style) */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-maverick-neon/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-maverick-gold/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="inline-flex items-center gap-3 mb-12 px-6 py-2 rounded-full glass-panel animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-1.5 h-1.5 rounded-full bg-maverick-gold animate-ping shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
              Institutional Growth Command · v1.2
            </span>
          </div>

          <h1 className="text-6xl md:text-[11rem] font-black uppercase tracking-tighter text-white mb-10 leading-[0.8] italic animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Explosive <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white">Growth</span><br />
            <span className="text-maverick-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">Intelligence.</span>
          </h1>

          <div className="max-w-4xl mx-auto space-y-10 mb-20 animate-in fade-in duration-1000 delay-300">
            <p className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">
              AI + Performance Logic = Exponential Scale.
            </p>
            <p className="text-xs md:text-sm text-maverick-muted font-mono uppercase tracking-[0.3em] leading-loose max-w-3xl mx-auto border-l border-maverick-gold/20 pl-8 text-left md:text-center">
              Maverick isn't just a tool; it's a strategic force multiplier. We combine the world's most powerful LLMs with a high-density logic layer to generate synapses that solve for growth, audit creative energy, and automate $10M+ marketing operations. 
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 animate-in fade-in duration-1000 delay-500">
            <Link href="/auth/signup" className="btn-synapse scale-110 px-16 group bg-maverick-gold text-black border-maverick-gold">
              Initiate Growth Synapse
              <ArrowUpRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors border-b border-white/5 pb-1">
              View Deployment Tiers →
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE POWER GRID (Conceptual Bento) ── */}
      <section className="px-6 py-40 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-24">
            <h2 className="text-4xl md:text-7xl font-black uppercase italic text-white tracking-tighter mb-6">
              The <span className="text-maverick-neon">Maverick Effect.</span>
            </h2>
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.5em] text-maverick-muted">
              Exponential Efficiency · Limitless Strategy · Precise Execution
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            
            {/* Efficiency / Productivity Card */}
            <div className="md:col-span-7 glass-card p-12 flex flex-col justify-between group bg-gradient-to-br from-maverick-neon/5 to-transparent border-maverick-neon/10">
              <div>
                <Workflow className="w-12 h-12 text-maverick-neon mb-10" />
                <h3 className="text-4xl font-black uppercase italic text-white mb-6 tracking-tighter">Exponential<br/>Productivity</h3>
                <p className="text-sm text-maverick-muted uppercase font-mono tracking-widest leading-loose">
                  Traditional strategy takes weeks. A Maverick Synapse takes seconds. We automate the cognitive heavy lifting of audit, planning, and copywriting, enabling one operator to do the work of a 20-person agency.
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-black text-maverick-neon uppercase tracking-widest italic">Efficiency Overload</span>
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Module: Operational Intelligence</span>
              </div>
            </div>

            {/* Strategic Fidelity Card */}
            <div className="md:col-span-5 glass-card p-12 group bg-white/[0.01]">
              <BrainCircuit className="w-12 h-12 text-maverick-gold mb-10" />
              <h3 className="text-4xl font-black uppercase italic text-white mb-6 tracking-tighter">Apex Logic<br/>Layer</h3>
              <p className="text-sm text-maverick-muted uppercase font-mono tracking-widest leading-loose">
                LLMs alone are generic. Maverick layers them with Swayze Media's $10M+ performance protocols. The result is "Apex Strategy"—intelligence tuned specifically for aggressive, profit-first scaling.
              </p>
              <div className="mt-12 text-maverick-gold text-[8px] font-black uppercase tracking-[0.4em] italic">Multi-Provider Fidelity Integrated</div>
            </div>

            {/* Live Operations Card */}
            <div className="md:col-span-5 glass-card p-12 group bg-maverick-neon/[0.01]">
              <Activity className="w-12 h-12 text-maverick-neon mb-10" />
              <h3 className="text-4xl font-black uppercase italic text-white mb-6 tracking-tighter">The Action<br/>Bridge</h3>
              <p className="text-sm text-maverick-muted uppercase font-mono tracking-widest leading-loose">
                Don't just plan; execute. Our integration with Maton AI gives Maverick "hands," allowing you to push strategic assets directly into Meta, HubSpot, and Klaviyo with zero manual transfer.
              </p>
            </div>

            {/* Scale Readiness Card */}
            <div className="md:col-span-7 glass-card p-12 group bg-gradient-to-tr from-maverick-gold/5 to-transparent border-maverick-gold/10">
              <TrendingUp className="w-12 h-12 text-maverick-gold mb-10" />
              <h3 className="text-4xl font-black uppercase italic text-white mb-6 tracking-tighter">Scale<br/>Readiness</h3>
              <p className="text-sm text-maverick-muted uppercase font-mono tracking-widest leading-loose">
                Companies fail because they can't scale their output as fast as their spend. Maverick removes the bottleneck, providing the creative and strategic throughput required for explosive, sustained growth.
              </p>
              <div className="mt-12 flex gap-4">
                {['Meta Ads', 'Google Ads', 'Shopify', 'HubSpot'].map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-lg bg-maverick-gold/5 border border-maverick-gold/10 text-[8px] font-black text-maverick-gold/60">{t}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-24 border-t border-white/5 text-center bg-black/50 backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 grid-complex opacity-20" />
        <div className="relative z-10 space-y-6">
          <p className="text-[10px] font-mono uppercase tracking-[1em] text-white/20">
            © 2026 Swayze Media · Performance Intelligence
          </p>
          <div className="flex justify-center gap-12 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
            <Link href="/terms" className="hover:text-maverick-neon transition-colors">Protocol</Link>
            <Link href="/settings" className="hover:text-maverick-neon transition-colors">Terminal</Link>
            <Link href="/dashboard" className="hover:text-maverick-neon transition-colors">Synapse</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
