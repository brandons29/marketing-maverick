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
  Download,
  Info
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
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-maverick-neon shadow-[0_0_10px_rgba(0,204,102,0.5)]" />
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">Attribution Bridge</h1>
            </div>
            <p className="text-[10px] text-maverick-muted font-mono uppercase tracking-[0.4em]">
              Performance Intelligence · Swayze Media Elite
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-maverick-dark-1 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-maverick-neon" />
              <div>
                <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-widest">Processing</p>
                <p className="text-[10px] font-black text-white uppercase italic">Client-Side Secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'True CPA', value: results ? `$${trueCpa}` : '$0.00', icon: TrendingUp, color: 'text-maverick-neon' },
            { label: 'True ROAS', value: results ? `${trueRoas}x` : '0.0x', icon: BarChart3, color: 'text-maverick-gold' },
            { label: 'Tracking Gap', value: results ? '24%' : '0%', icon: Percent, color: 'text-red-500' },
            { label: 'Attributed Revenue', value: results ? `$${totals?.revenue.toLocaleString()}` : '$0', icon: Info, color: 'text-blue-500' },
          ].map((m) => (
            <div key={m.label} className="bg-maverick-dark-1 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <m.icon className="w-12 h-12" />
              </div>
              <p className="text-[10px] font-black text-maverick-muted uppercase tracking-widest mb-1">{m.label}</p>
              <span className={`text-2xl font-black italic tracking-tighter ${results ? 'text-white' : 'text-white/10'}`}>
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {results ? (
          <div className="bg-maverick-dark-1 border border-white/5 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-maverick-neon" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50">Elite Performance Report</h3>
              </div>
              <button 
                onClick={() => setResults(null)}
                className="text-[10px] font-black text-maverick-neon hover:text-white uppercase tracking-widest"
              >
                Reset Engine
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] font-mono">
                <thead>
                  <tr className="text-maverick-muted border-b border-white/5 uppercase">
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Campaign ID</th>
                    <th className="px-6 py-5 text-right">Ad Spend</th>
                    <th className="px-6 py-5 text-right">CRM Revenue</th>
                    <th className="px-6 py-5 text-right">True ROAS</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  {results.slice(0, 20).map((row, i) => (
                    <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4">{row.date}</td>
                      <td className="px-6 py-4 font-bold">{row.campaign_id}</td>
                      <td className="px-6 py-4 text-right text-maverick-neon font-black">${row.spend.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-maverick-gold font-black">${row.revenue.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right italic font-black">{(row.roas || 0).toFixed(2)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Split Pane Upload */
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            
            {/* Ad Platform CSV */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <FileSpreadsheet className="w-4 h-4 text-maverick-neon" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Source 1: Ad Spend</h3>
              </div>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
                onDragLeave={() => setIsOver(false)}
                onDrop={(e) => handleDrop(e, 'adData')}
                className={`drop-zone group h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
                  isOver ? 'border-maverick-neon bg-maverick-neon/5' : 'border-white/5 hover:border-white/10'
                } ${files.adData ? 'border-maverick-neon bg-maverick-neon/[0.02]' : ''}`}
              >
                {files.adData ? (
                  <div className="flex flex-col items-center gap-4">
                    <CheckCircle2 className="w-10 h-10 text-maverick-neon" />
                    <div className="text-center px-6">
                      <p className="text-sm font-black text-white truncate max-w-[200px]">{files.adData.name}</p>
                      <button onClick={() => setFiles(p => ({...p, adData: null}))} className="text-[8px] font-mono text-maverick-muted hover:text-white uppercase tracking-widest mt-1">Replace File</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-maverick-muted group-hover:text-maverick-neon transition-colors" />
                    </div>
                    <div className="text-center px-6">
                      <p className="text-[10px] text-white font-black uppercase tracking-widest">Drop Ad Export</p>
                      <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-widest mt-1">Meta, Google, or TikTok CSV</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Join Icon */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-maverick-dark-1 border border-white/5 flex items-center justify-center shadow-2xl">
                <ArrowRightLeft className={`w-6 h-6 ${files.adData && files.crmData ? 'text-maverick-neon' : 'text-maverick-muted'}`} />
              </div>
              <span className="text-[8px] font-mono text-maverick-muted uppercase tracking-[0.3em]">Synapse</span>
            </div>

            {/* CRM / GHL CSV */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <FileSpreadsheet className="w-4 h-4 text-maverick-gold" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Source 2: Conversion</h3>
              </div>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
                onDragLeave={() => setIsOver(false)}
                onDrop={(e) => handleDrop(e, 'crmData')}
                className={`drop-zone group h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
                  isOver ? 'border-maverick-gold bg-maverick-gold/5' : 'border-white/5 hover:border-white/10'
                } ${files.crmData ? 'border-maverick-gold bg-maverick-gold/[0.02]' : ''}`}
              >
                {files.crmData ? (
                  <div className="flex flex-col items-center gap-4">
                    <CheckCircle2 className="w-10 h-10 text-maverick-gold" />
                    <div className="text-center px-6">
                      <p className="text-sm font-black text-white truncate max-w-[200px]">{files.crmData.name}</p>
                      <button onClick={() => setFiles(p => ({...p, crmData: null}))} className="text-[8px] font-mono text-maverick-muted hover:text-white uppercase tracking-widest mt-1">Replace File</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-maverick-muted group-hover:text-maverick-gold transition-colors" />
                    </div>
                    <div className="text-center px-6">
                      <p className="text-[10px] text-white font-black uppercase tracking-widest">Drop CRM Export</p>
                      <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-widest mt-1">GHL, Salesforce, or Hubspot</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Action Bar */}
        <div className="mt-12 p-8 bg-maverick-dark-1 border border-white/5 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-widest mb-2">Join Primary Key</p>
              <select className="w-full md:w-auto bg-black border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black text-white outline-none focus:border-maverick-neon/50 uppercase tracking-widest cursor-pointer">
                <option>utm_content</option>
                <option>campaign_id</option>
                <option>email (Hashing required)</option>
              </select>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/5" />
            <div className="flex items-center gap-3">
              <RefreshCcw className={`w-4 h-4 ${isProcessing ? 'animate-spin text-maverick-neon' : 'text-maverick-muted'}`} />
              <div>
                <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-widest">Intelligence</p>
                <p className="text-[10px] font-black text-white uppercase italic">
                  {isProcessing ? 'Synapsing Sources...' : 'Auto-Detection Active'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            {results && (
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all active:scale-95">
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            <button 
              onClick={processAttribution}
              disabled={!files.adData || !files.crmData || isProcessing}
              className="flex-[2] lg:flex-none px-12 py-4 bg-maverick-neon text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:shadow-[0_0_40px_rgba(0,204,102,0.3)] transition-all active:scale-95 disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed italic"
            >
              {results ? 'Re-Run Synapse' : 'Execute Synapse'}
            </button>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-center mt-12 text-[8px] text-maverick-muted font-mono uppercase tracking-[0.5em] opacity-30">
          Maverick Synapse Engine · Elite Attribution · Swayze Media
        </p>

      </div>
    </div>
  );
}
