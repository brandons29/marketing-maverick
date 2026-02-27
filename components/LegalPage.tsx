'use client';

import Link from 'next/link';
import { ArrowLeft, Scale, AlertTriangle } from 'lucide-react';

export default function LegalPage({ title, lastUpdated, content }: { title: string; lastUpdated: string; content: React.ReactNode }) {
  return (
    <div className="dark-mode min-h-screen px-6 py-20 lg:py-32">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/30 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <Scale className="w-5 h-5 text-[#ff8400]" />
          <h1 className="text-2xl lg:text-4xl font-black text-white tracking-tight">
            {title}
          </h1>
        </div>

        <p className="text-xs text-white/30 mb-10">
          Last Updated: {lastUpdated} · Swayze Media
        </p>

        <div className="prose prose-invert prose-sm max-w-none text-white/60 leading-relaxed space-y-6 glass-card p-8 lg:p-12">
          {content}
        </div>

        <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-400 mb-1">Disclaimer</p>
            <p className="text-xs text-white/40 leading-relaxed">
              Marketing Maverick is a free tool provided &quot;as-is&quot;. By using this tool, you assume full responsibility for your marketing decisions and API usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
