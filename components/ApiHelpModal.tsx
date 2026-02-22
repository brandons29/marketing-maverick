'use client';

import { useState } from 'react';
import { 
  X, 
  Key, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle,
  PlayCircle,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export function ApiHelpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [openProvider, setOpenProvider] = useState<string | null>('openai');

  if (!isOpen) return null;

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI (GPT-4o)',
      url: 'https://platform.openai.com/api-keys',
      steps: [
        'Sign in to platform.openai.com.',
        'Navigate to "API Keys" in the left sidebar.',
        'Create a "Secret Key" (starts with sk-).',
        'Ensure you have credits (typically $5 minimum) in your billing dashboard.'
      ]
    },
    {
      id: 'anthropic',
      name: 'Anthropic (Claude 3.5)',
      url: 'https://console.anthropic.com/settings/keys',
      steps: [
        'Sign in to console.anthropic.com.',
        'Go to Settings > API Keys.',
        'Create a new key (starts with sk-ant-).',
        'Add credits to your account for the key to work.'
      ]
    },
    {
      id: 'google',
      name: 'Google (Gemini 2.0)',
      url: 'https://aistudio.google.com/app/apikey',
      steps: [
        'Sign in to Google AI Studio.',
        'Click "Get API key" in the sidebar.',
        'Create a new API key.',
        'Note: Free tier has usage limits; pay-as-you-go is recommended for reliability.'
      ]
    },
    {
      id: 'xai',
      name: 'xAI (Grok)',
      url: 'https://console.x.ai/',
      steps: [
        'Sign in to console.x.ai.',
        'Navigate to the "API Keys" section.',
        'Create a new API key (starts with xai-).',
        'Verify your billing status to avoid connection errors.'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-maverick-neon/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-maverick-neon" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Intelligence Connection Guide</h3>
              <p className="text-[8px] font-mono text-maverick-muted uppercase tracking-widest mt-0.5">Multi-Provider Setup · Elite Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="text-maverick-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-maverick-neon italic">The Concept</h4>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
              Maverick is your <span className="text-white font-black italic">Strategy Shell</span>. 
              We provide the frameworks—you power them with your preferred provider. Choose any (or all) below to connect your engine.
            </p>
          </div>

          <div className="space-y-4">
            {providers.map((p) => (
              <div key={p.id} className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                <button 
                  onClick={() => setOpenProvider(openProvider === p.id ? null : p.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className={`text-[11px] font-black uppercase tracking-widest ${openProvider === p.id ? 'text-maverick-neon' : 'text-white'}`}>{p.name}</span>
                  <ChevronDown className={`w-4 h-4 text-maverick-muted transition-transform ${openProvider === p.id ? 'rotate-180 text-maverick-neon' : ''}`} />
                </button>
                {openProvider === p.id && (
                  <div className="px-6 pb-6 pt-2 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid gap-3">
                      {p.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="text-[9px] font-black text-maverick-neon mt-0.5">0{i+1}</span>
                          <p className="text-[10px] text-maverick-muted uppercase font-mono tracking-tight">{step}</p>
                        </div>
                      ))}
                    </div>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[9px] font-black text-maverick-neon hover:underline mt-2 uppercase tracking-widest border border-maverick-neon/20 px-4 py-2 rounded-lg">
                      Open Console <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Privacy Note */}
          <div className="p-4 bg-maverick-neon/[0.03] border border-maverick-neon/10 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-maverick-neon shrink-0 mt-0.5" />
            <p className="text-[9px] font-mono uppercase tracking-[0.1em] text-maverick-neon/80 leading-relaxed">
              Encryption Protocol: Your keys are secured via AES-256 and never touch our servers in plaintext. You maintain 100% control over usage and billing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-center shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-maverick-neon text-black font-black uppercase tracking-[0.3em] rounded-xl hover:shadow-[0_0_30px_rgba(0,204,102,0.3)] transition-all active:scale-95 italic text-[10px]"
          >
            Acknowledge Intelligence Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
