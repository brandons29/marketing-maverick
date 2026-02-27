'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Brain,
  BarChart3,
  Layers,
  Activity,
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Strategy Engine', desc: 'Multi-skill AI copywriting with OpenAI, Anthropic, Google, and xAI support.' },
  { icon: Zap, title: 'AI Playground', desc: 'Multi-model chat interface for testing and comparing AI outputs.' },
  { icon: BarChart3, title: 'Attribution Engine', desc: 'Map ad spend to real revenue with CSV-based attribution analysis.' },
  { icon: Layers, title: 'Operations Hub', desc: 'Connect to 100+ SaaS tools via Maton AI integration.' },
  { icon: Activity, title: 'System Monitor', desc: 'Real-time system health and activity monitoring.' },
  { icon: Shield, title: 'Secure BYOK Vault', desc: 'AES-256 encrypted API key storage with row-level security.' },
];

export default function PricingPage() {
  return (
    <div className="dark-mode min-h-screen px-6 py-24 grid-complex mesh-gradient">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <Badge type="pill-color" color="success" size="lg" className="mb-6">
            100% Free — Forever
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
            No Paywall. No Trial.<br />
            <span className="text-[#ff8400]">Just Results.</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Marketing Maverick is a free tool built by{' '}
            <a href="https://swayzemedia.com" target="_blank" rel="noopener noreferrer" className="text-[#00ff88] hover:underline font-semibold">
              Swayze Media
            </a>
            . Bring your own API key and get unlimited access to every feature. No credit card, no subscription, no catch.
          </p>
        </div>

        {/* Free Plan Card */}
        <div className="glass-card p-8 md:p-12 mb-12 border-[#00ff88]/20 bg-[#00ff88]/[0.02]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">Everything Included</h2>
              <p className="text-sm text-white/40">All features. All skills. Zero cost.</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-[#00ff88]">$0</div>
              <div className="text-xs text-white/30 font-medium">forever</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              'Unlimited AI copy generation',
              'All marketing skills included',
              'Multi-model support (GPT, Claude, Gemini, Grok)',
              'Attribution engine',
              'Operations hub with 100+ integrations',
              'System monitoring dashboard',
              'Encrypted API key vault',
              'No usage limits or throttling',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00ff88] shrink-0" />
                <span className="text-sm text-white/70">{item}</span>
              </div>
            ))}
          </div>

          <Link href="/auth/signup">
            <Button size="xl" color="primary" iconTrailing={ArrowRight} className="w-full md:w-auto">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card p-6">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-[#ff8400]" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            {[
              { q: 'Is this really free?', a: 'Yes. Marketing Maverick is 100% free. You only pay your AI provider (OpenAI, Anthropic, etc.) for the tokens you use. We charge nothing.' },
              { q: 'Why is it free?', a: 'Maverick is built by Swayze Media as a value-add tool for the marketing community. It showcases our approach to AI-driven marketing.' },
              { q: 'Do I need a credit card?', a: 'No. Sign up with just your email. No credit card, no trial period, no hidden fees.' },
              { q: 'What is BYOK?', a: 'BYOK means "Bring Your Own Key." You connect your own API keys from providers like OpenAI or Anthropic. Your keys are encrypted and never shared.' },
            ].map((item) => (
              <div key={item.q} className="glass-card p-5">
                <h3 className="text-sm font-bold text-white mb-2">{item.q}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
