'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, ArrowLeft, Lock, FileText, Scale } from 'lucide-react';
import Link from 'next/link';

export default function LegalPage({ title, lastUpdated, content }: { title: string, lastUpdated: string, content: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-maverick-black px-6 py-20 lg:py-32">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-maverick-muted hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Command Center
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <Scale className="w-5 h-5 text-maverick-gold" />
          <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter italic text-white">
            {title}
          </h1>
        </div>
        
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-maverick-muted mb-12">
          Last Updated: {lastUpdated} · Swayze Media Legal Department
        </p>

        <div className="prose prose-invert prose-sm max-w-none font-medium leading-relaxed text-white/70 space-y-8 bg-maverick-dark-1 border border-white/5 p-8 lg:p-12 rounded-[2.5rem]">
          {content}
        </div>

        <div className="mt-12 p-8 bg-maverick-gold/5 border border-maverick-gold/20 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-maverick-gold shrink-0 mt-1" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-maverick-gold mb-1">Executive Disclaimer</p>
            <p className="text-xs text-white/60 leading-relaxed">
              Marketing Maverick is a performance intelligence tool provided "as-is". By utilizing this engine, you assume full responsibility for your marketing decisions and API usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
