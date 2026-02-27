'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import {
  Zap,
  Target,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function GrowthPlanPage() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      id: 'audit',
      label: 'Infrastructure Audit',
      title: 'Eliminate the Leaks',
      desc: 'Connect your SaaS stack via Maton AI. Scan for tracking gaps, offer fatigue, and creative decay.',
      icon: ShieldAlert,
      action: 'Run System Scan',
    },
    {
      id: 'priority',
      label: 'Priority Architecture',
      title: 'Find the 10x Lever',
      desc: 'Identify the ONE specific campaign or offer that warrants aggressive scaling. High-density focus only.',
      icon: Target,
      action: 'Generate Roadmap',
    },
    {
      id: 'execute',
      label: 'Scale Execution',
      title: 'Push to Live Ops',
      desc: 'Automate creative briefs and copy distribution directly into your Meta and Google accounts.',
      icon: Zap,
      action: 'Generate Strategy',
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12 pb-32">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Badge type="pill-color" color="success" size="sm">Free</Badge>
            <h1 className="text-2xl font-black text-white tracking-tight">Growth Hub</h1>
          </div>
          <p className="text-sm text-white/40">
            Business development powered by real-time SaaS intelligence.
          </p>
        </div>

        {/* Strategy Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {stages.map((stage, i) => {
            const isActive = activeStage === i;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(i)}
                className={`text-left glass-card p-6 group transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'border-[#ff8400]/30 bg-[#ff8400]/[0.03] scale-[1.01]'
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                {isActive && <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#ff8400] to-transparent" />}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isActive ? 'border-[#ff8400]/20 bg-[#ff8400]/10' : 'border-white/5 bg-white/[0.03]'
                  }`}>
                    <stage.icon className={`w-5 h-5 ${isActive ? 'text-[#ff8400]' : 'text-white/30'}`} />
                  </div>
                  <span className="text-xs font-mono text-white/20">0{i + 1}</span>
                </div>
                <Badge type="pill-color" color={isActive ? 'brand' : 'gray'} size="sm" className="mb-2">
                  {stage.label}
                </Badge>
                <h2 className="text-lg font-bold text-white mb-3 tracking-tight">{stage.title}</h2>
                <p className="text-xs text-white/40 leading-relaxed">{stage.desc}</p>
                {isActive && (
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#ff8400] animate-in slide-in-from-left-2">
                    {stage.action} <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detail Area */}
        <div className="glass-card p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <Sparkles className="w-48 h-48 text-[#ff8400]" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#ff8400] flex items-center justify-center text-black font-black text-sm">S</div>
              <div>
                <p className="text-xs font-bold text-[#ff8400]">Swayze Media Growth Engine</p>
                <p className="text-xs text-white/40">Awaiting SaaS context...</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xl font-bold text-white leading-tight">
                Connect your SaaS tools to unlock real-time growth insights.
              </p>
              <p className="text-sm text-white/40 leading-relaxed">
                Link your Meta and HubSpot accounts via Maton AI in Settings. Maverick will pull your real-time ROAS, CAC, and lead quality scores to build your growth roadmap — completely free.
              </p>
              <div className="pt-6 flex gap-4 flex-wrap">
                <Link href="/settings">
                  <Button size="lg" color="primary" iconTrailing={ArrowRight}>
                    Connect SaaS Tools
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
