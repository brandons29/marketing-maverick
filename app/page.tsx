'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  Brain,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
  Activity,
  BrainCircuit,
  TrendingUp,
  Workflow,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';

const skills = [
  { icon: Target, label: 'AI Search Optimization', desc: 'Optimize content for AI-powered search engines.' },
  { icon: Brain, label: 'Creative Audit', desc: 'Audit ad creatives for conversion performance.' },
  { icon: BarChart3, label: 'Growth Playbook', desc: 'Build data-driven growth strategies.' },
  { icon: Sparkles, label: 'Conversion Copy', desc: 'Generate high-converting marketing copy.' },
  { icon: Layers, label: 'Attribution Engine', desc: 'Map ad spend to real revenue.' },
  { icon: Shield, label: 'Competitor Intel', desc: 'Analyze competitor positioning and gaps.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function Home() {
  return (
    <div className="dark-mode relative overflow-x-hidden min-h-screen">

      {/* ── HERO SECTION ── */}
      <section className="relative px-6 pt-32 pb-24 md:pt-48 md:pb-40 text-center min-h-screen flex flex-col items-center justify-center grid-complex mesh-gradient">

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge type="pill-color" color="success" size="md" className="mb-8">
              100% Free — No Credit Card Required
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-[9rem] font-black uppercase tracking-tighter text-white mb-10 leading-[0.85] italic"
          >
            AI Copy That{' '}
            <span className="text-[#ff8400] drop-shadow-[0_0_30px_rgba(255,132,0,0.3)]">Sells.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto space-y-6 mb-16"
          >
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              Marketing Maverick is a <span className="text-white font-semibold">free AI copywriting tool</span> built by{' '}
              <a href="https://swayzemedia.com" target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline font-semibold">
                Swayze Media
              </a>
              . Bring your own API key and generate high-converting copy in seconds — no paywall, no trial, no limits.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/auth/signup">
              <Button size="xl" color="primary" iconTrailing={ArrowRight}>
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="xl" color="secondary">
                Open Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs text-white/30 font-medium uppercase tracking-widest"
          >
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" /> BYOK — Your Keys Stay Yours</span>
            <span className="hidden sm:block text-white/10">|</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" /> No Paywall Ever</span>
            <span className="hidden sm:block text-white/10">|</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#00ff88]" /> Built by Swayze Media</span>
          </motion.div>
        </div>
      </section>

      {/* ── THE POWER GRID (Bento) ── */}
      <section className="px-6 py-32 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">

          <div className="mb-20">
            <Badge type="pill-color" color="brand" size="sm" className="mb-4">
              Free AI Skills
            </Badge>
            <h2 className="text-4xl md:text-7xl font-black uppercase italic text-white tracking-tighter mb-4">
              The <span className="text-[#00ff88]">Maverick Effect.</span>
            </h2>
            <p className="text-sm text-white/40 font-mono uppercase tracking-widest">
              Exponential Efficiency · Limitless Strategy · Precise Execution
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-6">

            {/* Efficiency Card */}
            <div className="md:col-span-7 glass-card p-12 flex flex-col justify-between group bg-gradient-to-br from-[#00ff88]/5 to-transparent border-[#00ff88]/10">
              <div>
                <Workflow className="w-12 h-12 text-[#00ff88] mb-10" />
                <h3 className="text-3xl font-black uppercase italic text-white mb-6 tracking-tighter">Exponential<br/>Productivity</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Traditional strategy takes weeks. A Maverick Synapse takes seconds. We automate the cognitive heavy lifting of audit, planning, and copywriting — enabling one operator to do the work of a 20-person agency.
                </p>
              </div>
              <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
                <Badge type="pill-color" color="success" size="sm">Free Forever</Badge>
                <span className="text-xs font-mono text-white/20 uppercase tracking-widest">Operational Intelligence</span>
              </div>
            </div>

            {/* Strategic Fidelity Card */}
            <div className="md:col-span-5 glass-card p-12 group bg-white/[0.01]">
              <BrainCircuit className="w-12 h-12 text-[#d4af37] mb-10" />
              <h3 className="text-3xl font-black uppercase italic text-white mb-6 tracking-tighter">Apex Logic<br/>Layer</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                LLMs alone are generic. Maverick layers them with Swayze Media's performance protocols. The result is intelligence tuned specifically for aggressive, profit-first scaling.
              </p>
              <div className="mt-12">
                <Badge type="pill-color" color="warning" size="sm">Multi-Provider Fidelity</Badge>
              </div>
            </div>

            {/* Live Operations Card */}
            <div className="md:col-span-5 glass-card p-12 group bg-[#00ff88]/[0.01]">
              <Activity className="w-12 h-12 text-[#00ff88] mb-10" />
              <h3 className="text-3xl font-black uppercase italic text-white mb-6 tracking-tighter">The Action<br/>Bridge</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Don't just plan; execute. Our integration with Maton AI gives Maverick "hands," allowing you to push strategic assets directly into Meta, HubSpot, and Klaviyo.
              </p>
            </div>

            {/* Scale Readiness Card */}
            <div className="md:col-span-7 glass-card p-12 group bg-gradient-to-tr from-[#d4af37]/5 to-transparent border-[#d4af37]/10">
              <TrendingUp className="w-12 h-12 text-[#d4af37] mb-10" />
              <h3 className="text-3xl font-black uppercase italic text-white mb-6 tracking-tighter">Scale<br/>Readiness</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Companies fail because they can't scale their output as fast as their spend. Maverick removes the bottleneck, providing the creative and strategic throughput required for explosive, sustained growth.
              </p>
              <div className="mt-10 flex gap-3 flex-wrap">
                {['Meta Ads', 'Google Ads', 'Shopify', 'HubSpot'].map(t => (
                  <Badge key={t} type="pill-color" color="warning" size="sm">{t}</Badge>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-24" style={{ background: 'var(--swayze-bg-card)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic text-white tracking-tighter mb-4">
              Three Steps. Zero Cost.
            </h2>
            <p className="text-sm text-white/40 max-w-lg mx-auto">
              Maverick is free forever. Your API key, your data, your results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up Free', desc: 'Create your free account in seconds. No credit card needed.' },
              { step: '02', title: 'Connect Your Key', desc: 'Bring your own OpenAI, Anthropic, or Google AI key. We never store or share it.' },
              { step: '03', title: 'Generate & Win', desc: 'Pick a skill, describe your goal, and let Maverick write copy that converts.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-5xl font-black text-[#ff8400]/20 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Zap className="w-10 h-10 text-[#ff8400] mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black uppercase italic text-white tracking-tighter mb-4">
            Ready to Write Copy That Converts?
          </h2>
          <p className="text-sm text-white/40 mb-8 max-w-lg mx-auto">
            Marketing Maverick is free, forever. Built with love by Swayze Media for marketers who want results.
          </p>
          <Link href="/auth/signup">
            <Button size="xl" color="primary" iconTrailing={ArrowRight}>
              Start Free Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
