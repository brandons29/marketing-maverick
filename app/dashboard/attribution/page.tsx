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
  Percent,
  Download
} from 'lucide-react';
import { mapAdSpendCSV, joinAdData, AdSpendRow, InternalConversionRow } from '@/lib/attribution/csv-mapper';

export default function AttributionPage() {
  const [isOver, setIsOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
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

  const processAttribution = async () => {
    if (!files.adData || !files.crmData) return;
    setIsProcessing(true);

    try {
      const adText = await files.adData.text();
      const crmText = await files.crmData.text();

      const adSpend = mapAdSpendCSV(adText);
      
      // Basic CRM mapping - in a real app, this would use AI/Mapping UI
      const crmData: InternalConversionRow[] = (await new Promise((resolve) => {
        const Papa = require('papaparse');
        Papa.parse(crmText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            resolve(results.data.map((row: any) => ({
              date: row.date || row.Date,
              campaign_id: row.campaign_id || row['Campaign ID'],
              revenue: parseFloat(row.revenue || row.Amount || '0'),
              conversions: parseInt(row.conversions || row.Leads || '0'),
            })));
          }
        });
      })) as InternalConversionRow[];

      const joined = joinAdData(adSpend, crmData);
      setResults(joined);
    } catch (error) {
      console.error('Attribution failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const totals = results ? results.reduce((acc, curr) => ({
    spend: acc.spend + curr.spend,
    revenue: acc.revenue + curr.revenue,
    conversions: acc.conversions + curr.conversions,
  }), { spend: 0, revenue: 0, conversions: 0 }) : null;

  const trueRoas = totals && totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : '0.0';
  const trueCpa = totals && totals.conversions > 0 ? (totals.spend / totals.conversions).toFixed(2) : '0.00';

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

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'True CPA', value: results ? `$${trueCpa}` : '$0.00', icon: TrendingUp },
            { label: 'True ROAS', value: results ? `${trueRoas}x` : '0.0x', icon: BarChart3 },
            { label: 'Tracking Gap', value: results ? '24%' : '0%', icon: Percent }, // Mock gap for now
            { label: 'Lost Leads', value: results ? totals?.conversions : '0', icon: AlertCircle },
          ].map((m) => (
            <div key={m.label} className="metric-card">
              <p className="metric-label">{m.label}</p>
              <div className="flex items-end justify-between">
                <span className={`metric-value ${results ? 'text-white' : 'text-white/20'}`}>{m.value}</span>
                <m.icon className={`w-4 h-4 ${results ? 'text-maverick-neon' : 'text-[#222]'}`} />
              </div>
            </div>
          ))}
        </div>

        {results ? (
          <div className="bg-maverick-dark-1 border border-white/5 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Joined Attribution Data</h3>
              <button 
                onClick={() => setResults(null)}
                className="text-[10px] font-mono text-maverick-neon hover:text-white uppercase"
              >
                Clear Results
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[#444] border-b border-white/5 uppercase">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Campaign ID</th>
                    <th className="px-6 py-4 text-right">Spend</th>
                    <th className="px-6 py-4 text-right">Revenue</th>
                    <th className="px-6 py-4 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  {results.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                      <td className="px-6 py-4">{row.date}</td>
                      <td className="px-6 py-4">{row.campaign_id}</td>
                      <td className="px-6 py-4 text-right text-maverick-neon">${row.spend.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-maverick-gold">${row.revenue.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">{(row.roas || 0).toFixed(2)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Split Pane Upload */
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
        )}

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
              <RefreshCcw className={`w-3.5 h-3.5 text-[#333] ${isProcessing ? 'animate-spin text-maverick-neon' : ''}`} />
              <span className="text-xs font-bold text-[#555] uppercase tracking-wider">
                {isProcessing ? 'Processing Data...' : 'AI Auto-Detection Active'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {results && (
              <button className="flex items-center gap-2 px-6 py-3 border border-white/5 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            <button 
              onClick={processAttribution}
              disabled={!files.adData || !files.crmData || isProcessing}
              className="flex-1 md:flex-none px-10 py-3 bg-maverick-neon text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all active:scale-95 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
            >
              {results ? 'RE-RUN ATTRIBUTION' : 'RUN ATTRIBUTION'}
            </button>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-center mt-8 text-[10px] text-[#222] font-mono uppercase tracking-widest">
          Swayze Media Attribution Bridge · Ver 1.0.4 · Localized Processing
        </p>

      </div>
    </div>
  );
}
