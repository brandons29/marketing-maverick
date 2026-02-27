'use client';

import { useState, useEffect } from 'react';
import { Bot, X, MessageSquare, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';

export function CMOChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; content: string }[]>([]);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Welcome to Marketing Maverick. Let's get to work — where are the leaks in your funnel? Tell me your current monthly spend and your target ROAS. I'll audit your priority list."
      }
    ]);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-[#ff8400] rounded-full shadow-[0_0_30px_rgba(255,132,0,0.3)] flex items-center justify-center group hover:scale-110 transition-all"
      >
        <Bot className="w-6 h-6 text-black" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff88] rounded-full border-2 border-black animate-pulse" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-[#ff8400] text-black text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Strategy Brief
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed right-6 bottom-6 z-[60] w-[380px] glass-card shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ff8400]/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#ff8400]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Maverick AI</h3>
            <p className="text-[10px] text-white/30">Strategy Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/20 hover:text-white transition-colors">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                  m.role === 'assistant'
                    ? 'bg-white/[0.03] border border-white/5 text-white/70'
                    : 'bg-[#ff8400] text-black font-semibold'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Alert */}
          <div className="px-4 py-2 bg-amber-500/5 border-y border-amber-500/10 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] text-amber-500/70">Tip: Connect your API key in Settings to enable AI responses.</span>
          </div>

          {/* Input */}
          <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="relative">
              <input
                type="text"
                placeholder="Ask Maverick..."
                className="input-dark pr-10 text-xs"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ff8400]">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
