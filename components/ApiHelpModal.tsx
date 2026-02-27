'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import {
  X,
  Key,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export function ApiHelpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [openProvider, setOpenProvider] = useState<string | null>('openai');

  if (!isOpen) return null;

  const providers = [
    {
      id: 'maton',
      name: 'Maton AI (SaaS Actions)',
      url: 'https://maton.ai/api-keys',
      steps: [
        'Sign in to maton.ai.',
        'Navigate to API Keys and create a new "Secret Key".',
        'Connect your SaaS units (Meta, HubSpot, Klaviyo) within Maton.',
        'Link the key here to give Maverick "hands" to execute your strategies.',
      ],
    },
    {
      id: 'openai',
      name: 'OpenAI (GPT-4o)',
      url: 'https://platform.openai.com/api-keys',
      steps: [
        'Sign in to platform.openai.com.',
        'Navigate to "API Keys" in the left sidebar.',
        'Create a "Secret Key" (starts with sk-).',
        'Ensure you have credits (typically $5 minimum) in your billing dashboard.',
      ],
    },
    {
      id: 'anthropic',
      name: 'Anthropic (Claude)',
      url: 'https://console.anthropic.com/settings/keys',
      steps: [
        'Sign in to console.anthropic.com.',
        'Go to Settings > API Keys.',
        'Create a new key (starts with sk-ant-).',
        'Add credits to your account for the key to work.',
      ],
    },
    {
      id: 'google',
      name: 'Google (Gemini)',
      url: 'https://aistudio.google.com/app/apikey',
      steps: [
        'Sign in to Google AI Studio.',
        'Click "Get API key" in the sidebar.',
        'Create a new API key.',
        'Note: Free tier has usage limits; pay-as-you-go is recommended for reliability.',
      ],
    },
    {
      id: 'xai',
      name: 'xAI (Grok)',
      url: 'https://console.x.ai/',
      steps: [
        'Sign in to console.x.ai.',
        'Navigate to the "API Keys" section.',
        'Create a new API key (starts with xai-).',
        'Verify your billing status to avoid connection errors.',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid var(--swayze-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff8400]/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-[#ff8400]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">API Connection Guide</h3>
              <p className="text-xs text-white/30">Multi-provider setup instructions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <p className="text-sm text-white/60 leading-relaxed">
              Maverick is your free strategy shell. We provide the frameworks — you power them with your preferred AI provider. Connect any (or all) below.
            </p>
          </div>

          <div className="space-y-3">
            {providers.map((p) => (
              <div key={p.id} className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
                <button
                  onClick={() => setOpenProvider(openProvider === p.id ? null : p.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <span className={`text-sm font-semibold ${openProvider === p.id ? 'text-[#ff8400]' : 'text-white/70'}`}>{p.name}</span>
                  <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${openProvider === p.id ? 'rotate-180 text-[#ff8400]' : ''}`} />
                </button>
                {openProvider === p.id && (
                  <div className="px-4 pb-4 pt-1 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-2">
                      {p.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="text-xs font-bold text-[#ff8400] mt-0.5">0{i + 1}</span>
                          <p className="text-xs text-white/50 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff8400] hover:underline"
                    >
                      Open Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Privacy Note */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-400/70 leading-relaxed">
              Your keys are secured via AES-256 encryption and never stored in plaintext. You maintain 100% control over usage and billing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 shrink-0" style={{ borderTop: '1px solid var(--swayze-border)' }}>
          <Button size="lg" color="primary" onClick={onClose} className="w-full justify-center">
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}
