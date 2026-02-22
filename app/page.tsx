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
  ArrowUpRight
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative bg-black overflow-x-hidden min-h-screen grid-complex mesh-gradient">

      {/* ── HERO SECTION ── */}
      <section className="relative px-6 pt-32 pb-40 text-center min-h-screen flex flex-col items-center justify-center">
        
        {/* Floating Decorative Elements (Meng To Style) */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-maverick-neon/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-maverick-gold/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />

        <div className="relative max-w-6xl mx-auto z-10">
          <div className="inline-flex items-center gap-3 mb-12 px-6 py-2 rounded-full glass-panel animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-1.5 h-1.5 rounded-full bg-maverick-neon animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
              Swayze Media · 2026 Protocol
            </span>
          </div>

          <h1 className="text-6xl md:text-[11rem] font-black uppercase tracking-tighter text-white mb-12 leading-[0.8] italic animate-in fade-in slide-in-from-bottom-8 duration-1000">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white">Maverick</span><br />
            <span className="text-maverick-neon drop-shadow-[0_0_30px_rgba(0,255,136,0.3)]">Built to Scale.</span>
          </h1>

          <div className="max-w-3xl mx-auto space-y-8 mb-20 animate-in fade-in duration-1000 delay-300">
            <p className="text-lg md:text-2xl font-bold text-white/90 uppercase italic tracking-tight leading-tight">
              The $100M+ Strategy OS for High-Density Performance.
            </p>
            <p className="text-xs md:text-sm text-maverick-muted font-mono uppercase tracking-[0.3em] leading-relaxed max-w-2xl mx-auto border-l border-white/10 pl-6">
              A 100% Free Strategy Engine. We provide the institutional logic—you power the synapse with your own LLM API key.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 animate-in fade-in duration-1000 delay-500">
            <Link href="/auth/signup" className="btn-synapse scale-110 px-16 group">
              Start Free Synapse
              <ArrowUpRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors border-b border-white/5 pb-1">
              Access Intelligence →
            </Link>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURES (JrGarcia Style) ── */}
      <section className="px-6 py-40 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-6">
          
          <div className="md:col-span-7 glass-card p-12 flex flex-col justify-between group">
            <div>
              <Layers className="w-10 h-10 text-maverick-neon mb-8" />
              <h2 className="text-4xl font-black uppercase italic text-white mb-6 tracking-tighter">Multi-Engine<br/>Fidelity</h2>
              <p className="text-sm text-maverick-muted uppercase font-mono tracking-widest leading-loose">
                Switch between OpenAI, Claude, Gemini, and Grok on the fly. One interface for all commercial apex models.
              </p>
            </div>
            <div className="mt-12 flex gap-4">
              {['GPT-5', 'CLAUDE 5', 'GEMINI 3.1'].map(t => (
                <span key={t} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-white/40">{t}</span>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 glass-card p-12 group bg-maverick-neon/[0.02]">
            <Target className="w-10 h-10 text-maverick-gold mb-8" />
            <h2 className="text-4xl font-black uppercase italic text-white mb-6 tracking-tighter">Strategic<br/>Modules</h2>
            <p className="text-sm text-maverick-muted uppercase font-mono tracking-widest leading-loose">
              14+ Elite modules including AEO Visibility, Visual Audit, and Offer Math. Custom-built for $10M+ scale.
            </p>
          </div>

          <div className="md:col-span-5 glass-card p-12 group">
            <Shield className="w-10 h-10 text-white/20 mb-8" />
            <h2 className="text-4xl font-black uppercase italic text-white mb-6 tracking-tighter">Zero-Trust<br/>Vault</h2>
            <p className="text-sm text-maverick-muted uppercase font-mono tracking-widest leading-loose">
              BYOK Encryption. Your keys are AES-256 secured at the browser level. We never see your plaintext.
            </p>
          </div>

          <div className="md:col-span-7 glass-card p-12 group bg-gradient-to-br from-maverick-neon/5 to-transparent">
            <Activity className="w-10 h-10 text-maverick-neon mb-8" />
            <h2 className="text-4xl font-black uppercase italic text-white mb-6 tracking-tighter">Visual<br/>Intelligence</h2>
            <p className="text-sm text-maverick-muted uppercase font-mono tracking-widest leading-loose">
              Drop ad creatives for instant vision-based scorecarding. Recover ROAS by auditing creative energy vs framework math.
            </p>
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
