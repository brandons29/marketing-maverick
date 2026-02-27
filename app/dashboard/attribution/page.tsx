'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import {
  Upload,
  ArrowRightLeft,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  Percent,
  Download,
  TrendingDown,
} from 'lucide-react';
import { mapAdSpendCSV, joinAdData, type InternalConversionRow } from '@/lib/attribution/csv-mapper';

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
      setFiles((prev) => ({ ...prev, [type]: file }));
    }
  };

  const handleFileSelect = (type: 'adData' | 'crmData') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) setFiles((prev) => ({ ...prev, [type]: file }));
    };
    input.click();
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
              resolve(
                results.data.map((row: any) => ({
                  date: row.date || row.Date || row['Day'],
                  campaign_id: row.campaign_id || row['Campaign ID'] || row['Campaign id'],
                  revenue: parseFloat(String(row.revenue || row.Amount || row['Revenue'] || '0').replace(/[^0-9.-]+/g, '')),
                  conversions: parseInt(String(row.conversions || row.Leads || row['Conversions'] || '0').replace(/[^0-9.-]+/g, '')),
                }))
              );
            },
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

  const totals = results
    ? results.reduce(
        (acc, curr) => ({
          spend: acc.spend + curr.spend,
          revenue: acc.revenue + curr.revenue,
          conversions: acc.conversions + curr.conversions,
          clicks: acc.clicks + (curr.clicks || 0),
        }),
        { spend: 0, revenue: 0, conversions: 0, clicks: 0 }
      )
    : null;

  const trueRoas = totals && totals.spend > 0 ? (totals.revenue / totals.spend).toFixed(2) : '0.0';
  const trueCpa = totals && totals.conversions > 0 ? (totals.spend / totals.conversions).toFixed(2) : '0.00';
  const trueCvr = totals && totals.clicks > 0 ? ((totals.conversions / totals.clicks) * 100).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12 pb-32">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge type="pill-color" color="success" size="sm">Free</Badge>
              <h1 className="text-2xl font-black text-white tracking-tight">Attribution Engine</h1>
            </div>
            <p className="text-sm text-white/40">
              Map ad spend to real revenue with CSV-based attribution analysis.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card px-4 py-2 flex items-center gap-2 !rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-white/50">Client-Side Processing</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'True CPA', value: results ? `$${trueCpa}` : '$0.00', icon: TrendingDown, color: 'text-[#00ff88]' },
            { label: 'True ROAS', value: results ? `${trueRoas}x` : '0.0x', icon: BarChart3, color: 'text-[#ff8400]' },
            { label: 'True CVR', value: results ? `${trueCvr}%` : '0.00%', icon: Percent, color: 'text-blue-400' },
            { label: 'Attributed Rev', value: results ? `$${totals?.revenue.toLocaleString()}` : '$0', icon: TrendingUp, color: 'text-purple-400' },
          ].map((m) => (
            <div key={m.label} className="glass-card p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <m.icon className="w-10 h-10" />
              </div>
              <p className="text-xs font-bold text-white/30 mb-1">{m.label}</p>
              <span className={`text-xl font-bold ${results ? 'text-white' : 'text-white/10'}`}>
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {results ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Results Table */}
            <div className="glass-card overflow-hidden">
              <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--swayze-border)' }}>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-[#ff8400]" />
                  <h3 className="text-sm font-bold text-white">Campaign Attribution Table</h3>
                </div>
                <button onClick={() => setResults(null)} className="text-xs font-medium text-white/30 hover:text-white transition-colors">
                  Reset
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-white/30 border-b border-white/5">
                      <th className="px-6 py-4 font-medium">Campaign</th>
                      <th className="px-6 py-4 text-right font-medium">Ad Spend</th>
                      <th className="px-6 py-4 text-right font-medium">CRM Revenue</th>
                      <th className="px-6 py-4 text-right font-medium">True ROAS</th>
                      <th className="px-6 py-4 text-right font-medium">True CPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 25).map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white truncate max-w-xs">{row.campaign_name || 'Unnamed Campaign'}</p>
                          <p className="text-[10px] text-white/20 mt-0.5">{row.campaign_id}</p>
                        </td>
                        <td className="px-6 py-4 text-right text-[#00ff88] font-semibold">${row.spend.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right text-[#ff8400] font-semibold">${row.revenue.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-semibold">{(row.roas || 0).toFixed(2)}x</td>
                        <td className="px-6 py-4 text-right font-medium">${(row.cpa || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6">
                <h4 className="text-xs font-bold text-white/30 mb-3">Channel Efficiency</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Blended CPA</span>
                    <span className="text-sm font-bold text-[#00ff88]">${trueCpa}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00ff88] rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
              <div className="glass-card p-6">
                <h4 className="text-xs font-bold text-white/30 mb-3">Intelligence Note</h4>
                <p className="text-xs text-white/40 leading-relaxed">
                  Attribution complete. Discrepancies between Ad Platform and CRM are localized. Optimize high-ROAS creative briefs in the Strategy Engine.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Upload Panes */
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center py-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <FileSpreadsheet className="w-4 h-4 text-[#00ff88]" />
                <h3 className="text-sm font-bold text-white">Source 1: Ad Spend CSV</h3>
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
                onDragLeave={() => setIsOver(false)}
                onDrop={(e) => handleDrop(e, 'adData')}
                onClick={() => handleFileSelect('adData')}
                className={`glass-card h-64 flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed ${
                  files.adData ? 'border-[#00ff88]/30 bg-[#00ff88]/[0.02]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {files.adData ? (
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-[#00ff88]" />
                    <p className="text-sm font-semibold text-white truncate max-w-[200px]">{files.adData.name}</p>
                    <button onClick={(e) => { e.stopPropagation(); setFiles((p) => ({ ...p, adData: null })); }} className="text-xs text-white/30 hover:text-white transition-colors">
                      Replace
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="w-8 h-8 text-white/20" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-white/50">Drop Ad Platform Export</p>
                      <p className="text-xs text-white/20 mt-1">Meta · Google · TikTok</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
              <div className={`w-12 h-12 rounded-full glass-card flex items-center justify-center ${files.adData && files.crmData ? 'border-[#ff8400]/30' : ''}`}>
                <ArrowRightLeft className={`w-5 h-5 ${files.adData && files.crmData ? 'text-[#ff8400]' : 'text-white/20'}`} />
              </div>
              <span className="text-[10px] text-white/20 font-medium">Join</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <FileSpreadsheet className="w-4 h-4 text-[#ff8400]" />
                <h3 className="text-sm font-bold text-white">Source 2: CRM Conversions</h3>
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
                onDragLeave={() => setIsOver(false)}
                onDrop={(e) => handleDrop(e, 'crmData')}
                onClick={() => handleFileSelect('crmData')}
                className={`glass-card h-64 flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed ${
                  files.crmData ? 'border-[#ff8400]/30 bg-[#ff8400]/[0.02]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {files.crmData ? (
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-[#ff8400]" />
                    <p className="text-sm font-semibold text-white truncate max-w-[200px]">{files.crmData.name}</p>
                    <button onClick={(e) => { e.stopPropagation(); setFiles((p) => ({ ...p, crmData: null })); }} className="text-xs text-white/30 hover:text-white transition-colors">
                      Replace
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="w-8 h-8 text-white/20" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-white/50">Drop CRM / Source of Truth</p>
                      <p className="text-xs text-white/20 mt-1">GHL · Salesforce · HubSpot</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-8 glass-card p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <select className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-[#ff8400]/30 transition-all">
              <option>utm_content</option>
              <option>campaign_id</option>
              <option>email (Hashing required)</option>
            </select>
            <div className="flex items-center gap-3">
              <RefreshCcw className={`w-4 h-4 ${isProcessing ? 'animate-spin text-[#ff8400]' : 'text-white/20'}`} />
              <span className="text-xs text-white/40">
                {isProcessing ? 'Processing...' : 'Auto-Mapping Active'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {results && (
              <Button size="md" color="secondary" iconLeading={Download}>
                Export CSV
              </Button>
            )}
            <Button
              size="lg"
              color="primary"
              onClick={processAttribution}
              isDisabled={!files.adData || !files.crmData || isProcessing}
              isLoading={isProcessing}
            >
              {results ? 'Re-Run Attribution' : 'Run Attribution'}
            </Button>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] text-white/10 font-mono">
          Attribution Engine · Swayze Media · Free Tool
        </p>

      </div>
    </div>
  );
}
