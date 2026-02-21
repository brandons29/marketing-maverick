'use client';
// app/dashboard/attribution/page.tsx — Attribution Bridge (PHASE 4)
// High-performance CSV joiner for Marketers.

import { useState } from 'react';
import { 
  Upload, 
  ArrowRightLeft, 
  BarChart3, 
  FileSpreadsheet, 
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';

export default function AttributionPage() {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<{ adData: File | null; crmData: File | null }>({
    adData: null,
    crmData: null,
  });

  const handleDrop = (e: React.DragEvent, type: 'adData' | 'crmData') => {
    e.preventDefault();
    setIsOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-maverick-neon opacity-60 tracking-[0.3em] uppercase">Phase 4</span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">Attribution Bridge</h1>
            </div>
            <p className="text-xs text-[#444] font-mono uppercase tracking-widest">
              Join Ad Platforms + CRM · Expose the Tracking Gap
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-maverick-dark-1 border border-white/5 rounded-lg px-4 py-2">
              <p className="text-[10px] text-[#444] font-mono uppercase mb-0.5">Privacy Mode</p>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-maverick-neon" />
                <span className="text-xs font-bold text-white">Client-Side Join</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Teaser (Empty State) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'True CPA', value: '$0.00', icon: TrendingUp },
            { label: 'True ROAS', value: '0.0x', icon: BarChart3 },
            { label: 'Tracking Gap', value: '0%', icon: Percent },
            { label: 'Lost Leads', value: '0', icon: AlertCircle },
          ].map((m) => (
            <div key={m.label} className="metric-card">
              <p className="metric-label">{m.label}</p>
              <div className="flex items-end justify-between">
                <span className="metric-value text-white/20">{m.value}</span>
                <m.icon className="w-4 h-4 text-[#222]" />
              </div>
            </div>
          ))}
        </div>

        {/* Split Pane Upload */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          
          {/* Ad Platform CSV */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-maverick-neon" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#555]">1. Ad Spend CSV</h3>
            </div>
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
              onDragLeave={() => setIsOver(false)}
              onDrop={(e) => handleDrop(e, 'adData')}
              className={`drop-zone ${isOver ? 'over' : ''} ${files.adData ? 'has-file' : ''}`}
            >
              {files.adData ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-maverick-neon" />
                  <p className="text-sm font-bold text-white">{files.adData.name}</p>
                  <button onClick={() => setFiles(p => ({...p, adData: null}))} className="text-[10px] font-mono text-[#444] hover:text-white underline">Change file</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-maverick-dark-1 flex items-center justify-center border border-white/5">
                    <Upload className="w-5 h-5 text-[#333]" />
                  </div>
                  <p className="text-xs text-[#555] font-mono uppercase tracking-widest">Drop Meta/Google Export</p>
                </div>
              )}
            </div>
          </div>

          {/* Join Icon */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-maverick-neon/10 border border-maverick-neon/20 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-maverick-neon" />
            </div>
            <span className="text-[10px] font-mono text-[#333] uppercase">Inner Join</span>
          </div>

          {/* CRM / GHL CSV */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-maverick-gold" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#555]">2. CRM / Source of Truth</h3>
            </div>
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
              onDragLeave={() => setIsOver(false)}
              onDrop={(e) => handleDrop(e, 'crmData')}
              className={`drop-zone ${isOver ? 'over' : ''} ${files.crmData ? 'has-file' : ''}`}
            >
              {files.crmData ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-maverick-gold" />
                  <p className="text-sm font-bold text-white">{files.crmData.name}</p>
                  <button onClick={() => setFiles(p => ({...p, crmData: null}))} className="text-[10px] font-mono text-[#444] hover:text-white underline">Change file</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-maverick-dark-1 flex items-center justify-center border border-white/5">
                    <Upload className="w-5 h-5 text-[#333]" />
                  </div>
                  <p className="text-xs text-[#555] font-mono uppercase tracking-widest">Drop GHL/Salesforce Export</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Action Bar */}
        <div className="mt-12 p-6 bg-maverick-dark-1 border border-white/5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] text-[#444] font-mono uppercase mb-1">Join Key</p>
              <select className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-maverick-neon/50">
                <option>utm_content</option>
                <option>campaign_id</option>
                <option>email (Hashing required)</option>
              </select>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-3.5 h-3.5 text-[#333]" />
              <span className="text-xs font-bold text-[#555] uppercase tracking-wider">AI Auto-Detection Active</span>
            </div>
          </div>

          <button 
            disabled={!files.adData || !files.crmData}
            className="w-full md:w-auto px-10 py-3 bg-maverick-neon text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all active:scale-95 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
          >
            RUN ATTRIBUTION
          </button>
        </div>

        {/* Bottom Note */}
        <p className="text-center mt-8 text-[10px] text-[#222] font-mono uppercase tracking-widest">
          Swayze Media Attribution Bridge · Ver 1.0.4 · Localized Processing
        </p>

      </div>
    </div>
  );
}
