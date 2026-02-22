'use client';

import { useState } from 'react';
import { 
  X, 
  Key, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle,
  PlayCircle,
  ChevronRight
} from 'lucide-react';

export function ApiHelpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-maverick-neon/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-maverick-neon" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Engine Connection Guide</h3>
              <p className="text-[8px] font-mono text-maverick-muted uppercase tracking-widest mt-0.5">Setup Instruction · Elite Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="text-maverick-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-maverick-neon italic">The Concept</h4>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
              Marketing Maverick is the shell for your <span className="text-white font-black italic">Intelligence Engine</span>. 
              We provide the frameworks and $100M+ strategic logic—you provide the LLM (Large Language Model) power via an API key.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-maverick-gold italic">Setup Instructions</h4>
            
            <div className="grid gap-4">
              {[
                { 
                  step: '01', 
                  title: 'Access OpenAI Platform', 
                  desc: 'Navigate to platform.openai.com and sign in to your developer account.',
                  link: 'https://platform.openai.com/api-keys'
                },
                { 
                  step: '02', 
                  title: 'Create Secret Key', 
                  desc: 'Generate a new API key. Ensure it starts with "sk-" and has permissions for chat completions.',
                },
                { 
                  step: '03', 
                  title: 'Establish Connection', 
                  desc: 'Paste the key into the Maverick Settings. We encrypt it instantly at the browser level.',
                }
              ].map((s) => (
                <div key={s.step} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                  <span className="text-[10px] font-black text-maverick-neon/40 mt-1">{s.step}</span>
                  <div className="space-y-1 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-white">{s.title}</p>
                    <p className="text-[10px] text-maverick-muted leading-relaxed uppercase font-mono">{s.desc}</p>
                    {s.link && (
                      <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[9px] font-black text-maverick-neon hover:underline mt-2 uppercase tracking-widest">
                        Go to Dashboard <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 bg-maverick-neon/[0.03] border border-maverick-neon/10 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-maverick-neon shrink-0 mt-0.5" />
            <p className="text-[9px] font-mono uppercase tracking-[0.1em] text-maverick-neon/80 leading-relaxed">
              Security Protocol: Your API key is encrypted using AES-256 and never touches our database in plaintext. You maintain 100% control over usage and costs.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-center">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-maverick-neon text-black font-black uppercase tracking-[0.3em] rounded-xl hover:shadow-[0_0_30px_rgba(0,204,102,0.3)] transition-all active:scale-95 italic text-[10px]"
          >
            I'm Ready to Execute
          </button>
        </div>
      </div>
    </div>
  );
}
