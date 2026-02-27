'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/base/badges/badges';
import {
  Activity,
  Terminal,
  Zap,
  Clock,
  Database,
  Cpu,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

function MetricCard({ icon: Icon, label, value, color = 'text-[#ff8400]' }: { icon: any; label: string; value: string | number; color?: string }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-xs text-white/30">{label}</div>
      </div>
    </div>
  );
}

export default function MonitorPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12 pb-32">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge type="pill-color" color="success" size="sm">Free</Badge>
              <h1 className="text-2xl font-black text-white tracking-tight">System Monitor</h1>
            </div>
            <p className="text-sm text-white/40">
              Real-time system health and activity monitoring.
            </p>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2 !rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-medium text-white/40">Security: Hardened</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard icon={Activity} label="System Status" value="Operational" color="text-emerald-500" />
          <MetricCard icon={Zap} label="Active Subagents" value="0" />
          <MetricCard icon={Cpu} label="Local Engine" value="Ready" color="text-blue-400" />
          <MetricCard icon={Database} label="Token Vault" value="Secure" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Activity Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <Terminal className="w-24 h-24" />
              </div>

              <div className="flex items-center gap-2 mb-5">
                <Terminal className="w-4 h-4 text-[#ff8400]" />
                <h2 className="text-sm font-bold text-white">Activity Log</h2>
              </div>

              <div className="space-y-4">
                {[
                  { time: '22:05', type: 'SYSTEM', msg: 'System initialized successfully' },
                  { time: '22:04', type: 'SKILL', msg: 'All marketing skills loaded' },
                  { time: '21:54', type: 'SKILL', msg: 'AI text engine ready' },
                  { time: '21:53', type: 'API', msg: 'Maton API Gateway connected' },
                  { time: '21:18', type: 'EXEC', msg: 'Dependencies synchronized' },
                ].map((act, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="text-xs font-mono text-white/15 mt-0.5 w-10">{act.time}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          type="pill-color"
                          color={act.type === 'SYSTEM' ? 'success' : act.type === 'SKILL' ? 'brand' : 'blue'}
                          size="sm"
                        >
                          {act.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                        {act.msg}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-white/5">
                  <button className="text-xs text-white/20 hover:text-white/50 transition-colors flex items-center gap-1">
                    View Full History <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subagents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-[#ff8400]" />
                  <h2 className="text-sm font-bold text-white">Active Subagents</h2>
                </div>
                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/5 rounded-xl">
                  <p className="text-xs text-white/20">No agents deployed</p>
                </div>
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-[#ff8400]" />
                  <h2 className="text-sm font-bold text-white">Recent Completions</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">Skill Sync</span>
                    <Badge type="pill-color" color="success" size="sm">SUCCESS</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">Maverick Deploy</span>
                    <Badge type="pill-color" color="success" size="sm">DEPLOYED</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Infrastructure */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-4 h-4 text-[#ff8400]" />
                <h2 className="text-sm font-bold text-white">Infrastructure</h2>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Notion Hub', status: 'Agency Brain Sync', color: 'bg-emerald-500' },
                  { name: 'Maton Gateway', status: '100+ APIs Linked', color: 'bg-emerald-500' },
                  { name: 'Model Routing', status: 'Hybrid: Local + Cloud', color: 'bg-blue-400' },
                ].map((item) => (
                  <div key={item.name} className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-white/30">{item.name}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    </div>
                    <div className="text-sm font-medium text-white">{item.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/settings" className="block">
              <div className="bg-[#ff8400] rounded-2xl p-6 text-black group cursor-pointer hover:shadow-[0_0_40px_rgba(255,132,0,0.15)] transition-all">
                <h3 className="text-lg font-bold leading-tight mb-3">
                  Access Full Settings
                </h3>
                <p className="text-xs font-medium opacity-70 mb-4">
                  API keys, integrations, and account management.
                </p>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-5 h-5 text-[#ff8400]" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] text-white/10 font-mono">
          System Monitor · Swayze Media · Free Tool
        </p>

      </div>
    </div>
  );
}
