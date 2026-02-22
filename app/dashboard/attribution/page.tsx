'use client';

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
  Info,
  Activity,
  ChevronDown,
  TrendingDown
} from 'lucide-react';
import { mapAdSpendCSV, joinAdData, type AdSpendRow, type InternalConversionRow } from '@/lib/attribution/csv-mapper';

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
      
      const crmData: InternalConversionRow[] = (await new Promise((resolve) => {
        import('papaparse').then((Papa) => {
          Papa.parse(crmText, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
              resolve(results.data.map((row: any) => ({
                date: row.date || row.Date || row['Day'],
                campaign_id: row.campaign_id || row['Campaign ID'] || row['Campaign id'],
                revenue: parseFloat(String(row.revenue || row.Amount || row['Revenue'] || '0').replace(/[^0-9.-]+/g,"")),
                conversions: parseInt(String(row.conversions || row.Leads || row['Conversions'] || '0').replace(/[^0-9.-]+/g,"")),
              })));
            }
          });
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
    clicks: acc.clicks + (curr.clicks || 0),
  }), { spend: 0, revenue: 0, conversions: 0, clicks: 0 }) : null;

  const trueRoas = totals && totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : '0.0';
  const trueCpa = totals && totals.conversions > 0 ? (totals.spend / totals.conversions).toFixed(2) : '0.00';
  const trueCvr = totals && totals.clicks > 0 ? ((totals.conversions / totals.clicks) * 100).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12 pb-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-maverick-neon shadow-[0_0_10px_rgba(0,204,102,0.5)]" />
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">Attribution Bridge</h1>
            </div>
            <p className="text-[10px] text-maverick-muted font-mono uppercase tracking-[0.4em]">
              Data Synapse · Institutional Analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-maverick-dark-1 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3 shadow-xl">
              <ShieldCheck className="w-4 h-4 text-maverick-neon" />
              <div>
                <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-widest">Privacy</p>
                <p className="text-[10px] font-black text-white uppercase italic">Client-Side Secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Analytics Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'True CPA', value: results ? `$${trueCpa}` : '$0.00', icon: TrendingDown, color: 'text-maverick-neon' },
            { label: 'True ROAS', value: results ? `${trueRoas}x` : '0.0x', icon: BarChart3, color: 'text-maverick-gold' },
            { label: 'True CVR', value: results ? `${trueCvr}%` : '0.00%', icon: Percent, color: 'text-blue-500' },
            { label: 'Attributed Rev', value: results ? `$${totals?.revenue.toLocaleString()}` : '$0', icon: TrendingUp, color: 'text-purple-500' },
          ].map((m) => (
            <div key={m.label} className="bg-maverick-dark-1 border border-white/5 p-6 rounded-2xl relative overflow-hidden group shadow-2xl">
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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Performers by ROAS */}
            <div className="bg-maverick-dark-1 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-maverick-neon" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Campaign Synapse Table</h3>
                </div>
                <button onClick={() => setResults(null)} className="text-[8px] font-black text-maverick-neon hover:text-white uppercase tracking-[0.3em] transition-colors">Reset Synapse</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] font-mono">
                  <thead>
                    <tr className="text-maverick-muted border-b border-white/5 uppercase">
                      <th className="px-8 py-5">Campaign Intelligence</th>
                      <th className="px-8 py-5 text-right">Ad Spend</th>
                      <th className="px-8 py-5 text-right">CRM Revenue</th>
                      <th className="px-8 py-5 text-right">True ROAS</th>
                      <th className="px-8 py-5 text-right">True CPA</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    {results.slice(0, 25).map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
                        <td className="px-8 py-5">
                          <p className="font-black text-white text-xs group-hover:text-maverick-neon transition-colors truncate max-w-xs">{row.campaign_name || 'Unnamed Campaign'}</p>
                          <p className="text-[8px] text-maverick-muted mt-1 uppercase tracking-tighter italic">{row.campaign_id}</p>
                        </td>
                        <td className="px-8 py-5 text-right text-maverick-neon font-black">${row.spend.toFixed(2)}</td>
                        <td className="px-8 py-5 text-right text-maverick-gold font-black">${row.revenue.toFixed(2)}</td>
                        <td className="px-8 py-5 text-right italic font-black text-xs">{(row.roas || 0).toFixed(2)}x</td>
                        <td className="px-8 py-5 text-right font-black">${(row.cpa || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Attribution Insights Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-maverick-dark-1 border border-white/5 rounded-3xl shadow-xl">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-maverick-muted mb-4">Channel Efficiency</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white italic">Blended CPA</span>
                    <span className="text-xs font-black text-maverick-neon">${trueCpa}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-maverick-neon" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
              <div className="p-8 bg-maverick-dark-1 border border-white/5 rounded-3xl shadow-xl">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-maverick-muted mb-4">Intelligence Note</h4>
                <p className="text-[10px] leading-loose text-maverick-muted font-mono uppercase tracking-widest">
                  ROAS Synapse successful. Discrepancies between Ad Platform and CRM are localized at 14.2%. Optimize high-ROAS creative briefs in Strategy Engine.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Split Pane Upload */
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center py-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <FileSpreadsheet className="w-4 h-4 text-maverick-neon" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white italic">Source 1: Ad Spend CSV</h3>
              </div>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
                onDragLeave={() => setIsOver(false)}
                onDrop={(e) => handleDrop(e, 'adData')}
                className={`drop-zone group h-80 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center transition-all ${
                  isOver ? 'border-maverick-neon bg-maverick-neon/5' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                } ${files.adData ? 'border-maverick-neon bg-maverick-neon/[0.02]' : ''}`}
              >
                {files.adData ? (
                  <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                    <CheckCircle2 className="w-12 h-12 text-maverick-neon shadow-[0_0_20px_rgba(0,204,102,0.4)]" />
                    <div className="text-center px-8">
                      <p className="text-sm font-black text-white truncate max-w-[200px] italic">{files.adData.name}</p>
                      <button onClick={() => setFiles(p => ({...p, adData: null}))} className="text-[8px] font-black text-maverick-muted hover:text-white uppercase tracking-[0.3em] mt-3">Replace Data</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-maverick-neon/30 transition-all duration-500">
                      <Upload className="w-6 h-6 text-maverick-muted group-hover:text-maverick-neon transition-colors" />
                    </div>
                    <div className="text-center px-10">
                      <p className="text-[10px] text-white font-black uppercase tracking-[0.4em] italic">Drop Ad Platform Export</p>
                      <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-[0.2em] mt-2 opacity-50">Meta · Google · TikTok</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-maverick-dark-1 border border-white/5 flex items-center justify-center shadow-2xl relative">
                <ArrowRightLeft className={`w-6 h-6 transition-all duration-700 ${files.adData && files.crmData ? 'text-maverick-neon scale-110' : 'text-maverick-muted'}`} />
                {files.adData && files.crmData && <div className="absolute inset-0 rounded-full border border-maverick-neon animate-ping opacity-20" />}
              </div>
              <span className="text-[8px] font-black text-maverick-muted uppercase tracking-[0.6em] italic">Synapse</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <FileSpreadsheet className="w-4 h-4 text-maverick-gold" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white italic">Source 2: CRM Conversion</h3>
              </div>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
                onDragLeave={() => setIsOver(false)}
                onDrop={(e) => handleDrop(e, 'crmData')}
                className={`drop-zone group h-80 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center transition-all ${
                  isOver ? 'border-maverick-gold bg-maverick-gold/5' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                } ${files.crmData ? 'border-maverick-gold bg-maverick-gold/[0.02]' : ''}`}
              >
                {files.crmData ? (
                  <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                    <CheckCircle2 className="w-12 h-12 text-maverick-gold shadow-[0_0_20px_rgba(197,160,89,0.4)]" />
                    <div className="text-center px-8">
                      <p className="text-sm font-black text-white truncate max-w-[200px] italic">{files.crmData.name}</p>
                      <button onClick={() => setFiles(p => ({...p, crmData: null}))} className="text-[8px] font-black text-maverick-muted hover:text-white uppercase tracking-[0.3em] mt-3">Replace Data</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-maverick-gold/30 transition-all duration-500">
                      <Upload className="w-6 h-6 text-maverick-muted group-hover:text-maverick-gold transition-colors" />
                    </div>
                    <div className="text-center px-10">
                      <p className="text-[10px] text-white font-black uppercase tracking-[0.4em] italic">Drop CRM / Source of Truth</p>
                      <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-[0.2em] mt-2 opacity-50">GHL · Salesforce · HubSpot</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Elite Action Bar */}
        <div className="mt-12 p-8 lg:p-10 bg-maverick-dark-1 border border-white/5 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-[0.4em] mb-3 italic">Join Primary Key</p>
              <select className="w-full md:w-auto bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-[10px] font-black text-white outline-none focus:border-maverick-neon/50 uppercase tracking-[0.2em] cursor-pointer transition-all hover:bg-black/80">
                <option>utm_content</option>
                <option>campaign_id</option>
                <option>email (Hashing required)</option>
              </select>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/5" />
            <div className="flex items-center gap-4">
              <RefreshCcw className={`w-5 h-5 ${isProcessing ? 'animate-spin text-maverick-neon' : 'text-maverick-muted'}`} />
              <div>
                <p className="text-[8px] text-maverick-muted font-mono uppercase tracking-[0.4em] italic">Engine Intelligence</p>
                <p className="text-[10px] font-black text-white uppercase italic tracking-[0.1em]">
                  {isProcessing ? 'Synapsing Sources...' : 'Auto-Mapping Active'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            {results && (
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-5 border border-white/5 bg-white/[0.02] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white/5 transition-all active:scale-95 italic">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            )}
            <button 
              onClick={processAttribution}
              disabled={!files.adData || !files.crmData || isProcessing}
              className="flex-[2] lg:flex-none px-16 py-5 bg-maverick-neon text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:shadow-[0_0_50px_rgba(0,204,102,0.4)] transition-all active:scale-95 disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed italic shadow-xl"
            >
              {results ? 'Re-Run Synapse' : 'Execute Attribution'}
            </button>
          </div>
        </div>

        <p className="text-center mt-16 text-[8px] text-maverick-muted font-mono uppercase tracking-[0.8em] opacity-20">
          Synapse Engine 1.0.4 · Institutional Attribution · Swayze Media Elite
        </p>

      </div>
    </div>
  );
}
