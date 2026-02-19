'use client';
// components/ChatWindow.tsx — Output display + copy/remix actions

import { useRef } from 'react';
import { Copy, RotateCcw, CheckCheck } from 'lucide-react';
import { useState } from 'react';

interface ChatWindowProps {
  content: string;
  runNumber: number;
  onRemix: () => void;
}

export default function ChatWindow({ content, runNumber, onRemix }: ChatWindowProps) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Lightweight markdown renderer: **bold**, *italic*, line breaks
  const render = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

  return (
    <div
      ref={ref}
      className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,136,0.06)] mt-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0f0f0f]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#00ff88]">
            Maverick Output
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRemix}
            className="flex items-center gap-1.5 text-xs font-bold text-[#555] hover:text-[#888] transition-colors px-2 py-1 rounded border border-transparent hover:border-white/10"
          >
            <RotateCcw className="w-3 h-3" />
            Remix
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded border transition-all ${
              copied
                ? 'text-[#00ff88] border-[#00ff88]/40 bg-[#00ff88]/8'
                : 'text-[#555] border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {copied ? (
              <>
                <CheckCheck className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div
          className="maverick-output text-[0.9rem] leading-7 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: render(content) }}
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-white/5 bg-[#0f0f0f] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#222] uppercase tracking-widest">
          Marketing Maverick v1.0 · Swayze Media
        </span>
        <span className="text-[10px] font-mono text-[#222]">
          run #{runNumber}
        </span>
      </div>
    </div>
  );
}
