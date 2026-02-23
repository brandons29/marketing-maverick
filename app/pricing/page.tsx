'use client';

import { Check, Zap, Sparkles, ShieldCheck, Target, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  const plans = [
    {
      name: 'Elite Standard',
      price: '497',
      desc: 'For high-spend media buyers driving $1M+ annually.',
      features: [
        '14+ Strategy Modules (AEO, Visual Audit, etc.)',
        'Unlimited AI Strategy Synapses',
        'Manual CSV Attribution Bridge',
        '7-Day Full Access Free Trial',
        'Secure BYOK Encryption',
        'Standard Brandon Persona Support'
      ],
      cta: 'Start 7-Day Trial',
      highlight: false
    },
    {
      name: 'CMO Partner',
      price: '997',
      desc: 'For elite agencies and $10M+ scale operations.',
      features: [
        'Everything in Elite Standard',
        'Live SaaS Sync (Zero-Manual Data)',
        'Autonomous "Pulse" Alerts (24/7)',
        '10 Brand Units (Agency War Room)',
        'Proactive SMS/Slack Interjections',
        'Executive PDF Scorecards'
      ],
      cta: 'Access CMO Partner',
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen px-6 py-24 bg-black grid-complex mesh-gradient">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full glass-panel animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-1.5 h-1.5 rounded-full bg-maverick-gold animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-maverick-gold">
              Institutional Tier Access
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-8 italic">
            Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white">Performance</span><br />
            <span className="text-maverick-neon">Scale Plans.</span>
          </h1>
          <p className="performance-subheadline mx-auto uppercase tracking-widest text-xs md:text-sm">
            7-Day Free Trial on all tiers. Cancel any time. Zero gatekeeping.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative elite-card p-10 flex flex-col ${plan.highlight ? 'border-maverick-gold/30 bg-maverick-gold/[0.02]' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-maverick-gold text-black text-[10px] font-black uppercase tracking-widest rounded-full italic shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                  Most Powerful
                </div>
              )}

              <div className="mb-10">
                <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-4 ${plan.highlight ? 'text-maverick-gold' : 'text-maverick-neon'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black italic tracking-tighter text-white">${plan.price}</span>
                  <span className="text-sm font-mono text-maverick-muted uppercase tracking-widest">/mo</span>
                </div>
                <p className="mt-4 text-[11px] text-maverick-muted font-medium uppercase leading-relaxed tracking-wider">
                  {plan.desc}
                </p>
              </div>

              <div className="flex-1 space-y-5 mb-12">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-maverick-gold' : 'text-maverick-neon'}`} />
                    <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/auth/signup"
                className={`btn-synapse w-full text-center py-5 shadow-2xl ${plan.highlight ? 'bg-maverick-gold text-black shadow-maverick-gold/20' : ''}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison Ticker */}
        <div className="mt-24 py-12 border-y border-white/5 overflow-hidden">
          <div className="ticker-track">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 mr-12 text-[10px] font-black text-maverick-muted uppercase tracking-[0.5em] italic">
                <span>Enterprise Security</span>
                <span className="text-white/10">·</span>
                <span>Zero-Trust Vault</span>
                <span className="text-white/10">·</span>
                <span>Real-Time SaaS Action</span>
                <span className="text-white/10">·</span>
                <span>$100M+ Scaling Frameworks</span>
                <span className="text-white/10">·</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
