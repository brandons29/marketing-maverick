'use client';

import { useState } from 'react';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  ShieldAlert, 
  ChevronRight, 
  BrainCircuit, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function GrowthPlanPage() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      id: 'audit',
      label: 'Infrastructure Audit',
      title: 'Eliminate the Leaks',
      desc: 'Connect your SaaS stack via Maton AI. Brandon scans for tracking gaps, offer fatigue, and creative decay.',
      icon: ShieldAlert,
      action: 'Run System Scan'
    },
    {
      id: 'priority',
      label: 'Priority Architecture',
      title: 'Find the 10x Lever',
      desc: 'Identify the ONE specific campaign or offer that warrants aggressive scaling. High-density focus only.',
      icon: Target,
      action: 'Generate Roadmap'
    },
    {
      id: 'execute',
      label: 'Scale Execution',
      title: 'Push to Live Ops',
      desc: 'Automate creative briefs and copy distribution directly into your Meta and Google accounts.',
      icon: Zap,
      action: 'Initiate Synapse'
    }
  ];

  return (
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-maverick-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Brandon's Growth Command</h1>
          </div>
          <p className="text-sm font-medium text-maverick-muted uppercase tracking-[0.4em] leading-relaxed max-w-2xl">
            Institutional Business Development · Powered by Real-Time SaaS Intelligence
          </p>
        </div>

        {/* The Strategy Progress UI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {stages.map((stage, i) => {
            const isActive = activeStage === i;
            const isDone = activeStage > i;
            return (
              <button 
                key={stage.id}
                onClick={() => setActiveStage(i)}
                className={`text-left elite-card p-8 group transition-all duration-500 relative overflow-hidden ${isActive ? 'border-maverick-gold/40 bg-maverick-gold/[0.03] scale-[1.02]' : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-80'}`}
              >
                {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maverick-gold to-transparent" />}
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isActive ? 'border-maverick-gold/20 bg-maverick-gold/10' : 'border-white/5 bg-white/5'}`}>
                    <stage.icon className={`w-6 h-6 ${isActive ? 'text-maverick-gold' : 'text-maverick-muted'}`} />
                  </div>
                  <span className="text-[10px] font-mono font-black text-maverick-muted">0{i+1}</span>
                </div>
                <h3 className={`text-xs font-black uppercase tracking-widest mb-2 ${isActive ? 'text-maverick-gold' : 'text-white'}`}>{stage.label}</h3>
                <h2 className="text-xl font-black italic text-white mb-4 tracking-tight">{stage.title}</h2>
                <p className="text-[11px] font-medium leading-relaxed text-maverick-muted uppercase tracking-wider">{stage.desc}</p>
                {isActive && (
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-maverick-gold uppercase tracking-widest animate-in slide-in-from-left-2">
                    {stage.action} <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Area */}
        <div className="glass-panel rounded-[3rem] p-12 relative overflow-hidden border border-maverick-gold/10">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <Sparkles className="w-64 h-64 text-maverick-gold" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-maverick-gold flex items-center justify-center text-black font-black italic">B</div>
              <div>
                <p className="text-[10px] font-black text-maverick-gold uppercase tracking-widest">Brandon's Direct Insight</p>
                <p className="text-xs font-bold text-white uppercase italic">Awaiting SaaS Context...</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="text-2xl font-black italic text-white leading-tight">
                "We don't guess at $10M+ scale. We execute on data."
              </p>
              <p className="text-sm text-maverick-muted leading-loose uppercase font-mono tracking-widest">
                Link your Meta and HubSpot units via Maton AI in Settings to unlock this dashboard. I will then pull your real-time ROAS, CAC, and lead quality scores to build your explosive growth roadmap.
              </p>
              <div className="pt-8 flex gap-6">
                <a href="/settings" className="btn-synapse px-10">Connect SaaS Intelligence</a>
                <button className="btn-ghost">View Methodology</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
