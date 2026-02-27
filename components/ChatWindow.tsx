'use client';
// components/ChatWindow.tsx — Output display + copy/remix actions with Untitled UI

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import { Copy, RotateCcw, CheckCheck, Download } from 'lucide-react';

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

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maverick-output-${runNumber}.md`;
    a.click();
    URL.revokeObjectURL(url);
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
      className="glass-card overflow-hidden shadow-[0_0_40px_rgba(255,132,0,0.04)] mt-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--swayze-border)' }}>
        <div className="flex items-center gap-3">
          <Badge type="pill-color" color="success" size="sm">
            Run #{runNumber}
          </Badge>
          <span className="text-xs text-white/30 font-mono">
            {content.split(/\s+/).length} words
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" color="tertiary" iconLeading={copied ? CheckCheck : Copy} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button size="sm" color="tertiary" iconLeading={Download} onClick={handleDownload}>
            Export
          </Button>
          <Button size="sm" color="tertiary" iconLeading={RotateCcw} onClick={onRemix}>
            Remix
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 max-h-[600px] overflow-y-auto">
        <div
          className="maverick-output text-sm leading-7 whitespace-pre-wrap break-words text-white/80"
          dangerouslySetInnerHTML={{ __html: render(content) }}
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--swayze-border)', background: 'var(--swayze-bg-card)' }}>
        <span className="text-[10px] font-mono text-white/15 uppercase tracking-widest">
          Marketing Maverick · Swayze Media · Free Tool
        </span>
        <span className="text-[10px] font-mono text-white/15">
          run #{runNumber}
        </span>
      </div>
    </div>
  );
}
