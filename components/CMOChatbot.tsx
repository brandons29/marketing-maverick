'use client';

import { useState, useEffect } from 'react';
import { Bot, X, MessageSquare, TrendingUp, AlertTriangle, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';

export function CMOChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; content: string }[]>([]);

  useEffect(() => {
    // Initial welcome message (The Brandon Swayze CMO Intro)
    setMessages([
      {
        role: 'assistant',
        content: "Brandon Swayze here. Welcome to the Elite. Let's not waste time—where are the leaks in your funnel? Tell me your current monthly spend and your target ROAS. I'm auditing your priority list right now."
      }
    ]);
  }, []);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-maverick-gold rounded-full shadow-[0_0_40px_rgba(197,160,89,0.4)] flex items-center justify-center group hover:scale-110 transition-all border-2 border-white/20"
      >
        <Bot className="w-8 h-8 text-black" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse" />
        <span className="absolute right-full mr-4 px-4 py-2 bg-maverick-gold text-black text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap italic pointer-events-none">
          CMO Priority Brief
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed right-8 bottom-8 z-[60] w-[400px] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${isMinimized ? 'h-20' : 'h-[600px]'}`}>
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-maverick-gold/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-maverick-gold" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white italic">Brandon Swayze</h3>
            <p className="text-[8px] font-mono text-maverick-gold uppercase tracking-widest mt-0.5">Virtual CMO · Priority Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-maverick-muted hover:text-white transition-colors">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="text-maverick-muted hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-medium leading-relaxed ${m.role === 'assistant' ? 'bg-white/[0.03] border border-white/5 text-white/80' : 'bg-maverick-gold text-black font-black italic shadow-xl'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Intervention Alert Mockup */}
          <div className="px-6 py-3 bg-red-500/5 border-y border-red-500/10 flex items-center gap-3">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-red-500/80">CMO Alert: Tracking Gap Detected (14.2%)</span>
          </div>

          {/* Input area */}
          <div className="p-6 bg-white/[0.01] border-t border-white/5">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Brief your CMO..."
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-[11px] font-medium text-white placeholder:text-maverick-muted outline-none focus:border-maverick-gold/40 transition-all pr-12"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-maverick-gold">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
