'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Terminal, 
  Zap, 
  Clock, 
  Database, 
  Cpu, 
  ShieldCheck, 
  ExternalLink,
  Search,
  ChevronRight,
  Loader2
} from 'lucide-react';

/* -- ui components ------------------------------------------ */

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  color = "text-[#ff8400]" 
}: { 
  icon: any, 
  label: string, 
  value: string | number,
  color?: string 
}) {
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-black text-white tracking-tight">{value}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Icon className="w-4 h-4 text-[#ff8400]" />
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
        {title}
      </h2>
    </div>
  );
}

/* -- page --------------------------------------------------- */

export default function MonitorPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [subagents, setSubagents] = useState<any>({ running: [], recent: [], stats: {} });
  const [usage, setUsage] = useState<any>({ total_tokens: 0, cost_estimate: 0 });
  const [loading, setLoading] = useState(true);

  // In a real Vercel deploy, these would fetch from your API
  // For now, we'll simulate the "Live" feel with the data Bob has
  useEffect(() => {
    const fetchData = async () => {
      // This is where you'd call your actual backend /api/monitor
      // For the prototype, we show the system is linked
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-[#070707] text-zinc-300 p-8 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#ff8400] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff8400]">
              Live Mission Control
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            Maverick <span className="text-[#ff8400]">Monitor</span>
          </h1>
          <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase tracking-widest">
            Node: Brandon-Mac-Mini — Kernel: OpenClaw 2026.2.24
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security: Hardened</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard icon={Activity} label="System Status" value="Operational" color="text-emerald-500" />
        <MetricCard icon={Zap} label="Active Subagents" value="0" />
        <MetricCard icon={Cpu} label="Local Engine" value="Qwen 3.5" color="text-blue-500" />
        <MetricCard icon={Database} label="Token Vault" value="Secure" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Activity Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Terminal className="w-32 h-32" />
            </div>
            
            <SectionHeader icon={Terminal} title="Activity Log" />
            
            <div className="space-y-6">
              {/* Simulated Activities for the UI Polish */}
              {[
                { time: '22:05', type: 'SYSTEM', msg: 'Upgraded to OpenClaw 2026.2.24' },
                { time: '22:04', type: 'SKILL', msg: 'Installed ClawdHub CLI v1.0.0' },
                { time: '21:54', type: 'SKILL', msg: 'Integrated Humanize-AI-Text engine' },
                { time: '21:53', type: 'API', msg: 'Maton API Gateway Connected' },
                { time: '21:18', type: 'EXEC', msg: '693 packages synchronized successfully' }
              ].map((act, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="text-[10px] font-mono text-zinc-700 mt-1">{act.time}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                        act.type === 'SYSTEM' ? 'bg-emerald-500/10 text-emerald-500' :
                        act.type === 'SKILL' ? 'bg-[#ff8400]/10 text-[#ff8400]' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {act.type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium group-hover:text-white transition-colors tracking-tight">
                      {act.msg}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-white/5">
                <button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors flex items-center gap-2">
                  View Full History <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Subagents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6">
                <SectionHeader icon={Zap} title="Active Subagents" />
                <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/5 rounded-2xl">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">No agents deployed</p>
                </div>
             </div>
             <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6">
                <SectionHeader icon={Clock} title="Recent Completions" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400">Skill Sync</span>
                    <span className="text-[9px] font-mono text-emerald-500">SUCCESS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400">Maverick Redesign</span>
                    <span className="text-[9px] font-mono text-emerald-500">DEPLOYED</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Infrastructure */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6">
            <SectionHeader icon={Database} title="Infrastructure" />
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-zinc-500">Notion Hub</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-sm font-bold text-white tracking-tight">Agency Brain Sync</div>
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-zinc-500">Maton Gateway</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-sm font-bold text-white tracking-tight">100+ APIs Linked</div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-zinc-500">Model Routing</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <div className="text-sm font-bold text-white tracking-tight">Hybrid: Local + Opus</div>
              </div>
            </div>
          </div>

          <div className="bg-[#ff8400] rounded-3xl p-8 text-black group cursor-pointer hover:shadow-[0_0_50px_rgba(255,132,0,0.2)] transition-all">
            <h3 className="text-xl font-black uppercase italic leading-tight mb-4">
              Access The<br />Full Vault
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-6">
              Deep analytics, project boards, and master settings.
            </p>
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChevronRight className="w-6 h-6 text-[#ff8400]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
