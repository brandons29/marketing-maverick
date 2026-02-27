'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import {
  Layers,
  Activity,
  AlertTriangle,
  RefreshCcw,
  ArrowRight,
} from 'lucide-react';
import { MATON_INTEGRATIONS } from '@/lib/maton';

export default function OperationsPage() {
  const [connections, setConnections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/maton');
      const data = await res.json();
      if (res.status === 403) {
        setError('Maton API Key not connected. Head to Settings to establish the link.');
      } else {
        setConnections(data.connections || []);
      }
    } catch (err) {
      setError('Failed to load operations hub.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 lg:px-10 lg:py-12 pb-32">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge type="pill-color" color="success" size="sm">Free</Badge>
              <h1 className="text-2xl font-black text-white tracking-tight">Operations Hub</h1>
            </div>
            <p className="text-sm text-white/40">
              SaaS execution hub powered by Maton AI.
            </p>
          </div>
          <Button
            size="md"
            color="secondary"
            onClick={fetchConnections}
            isLoading={loading}
            iconLeading={RefreshCcw}
          >
            Sync Connections
          </Button>
        </div>

        {error ? (
          <div className="glass-card p-12 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Connection Offline</h3>
              <p className="text-sm text-white/40">{error}</p>
            </div>
            <Link href="/settings">
              <Button size="lg" color="primary" iconTrailing={ArrowRight}>
                Connect Maton in Settings
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Status Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="glass-card p-6 border-[#ff8400]/10 bg-[#ff8400]/[0.02]">
                <div className="flex items-center gap-3 mb-5">
                  <Activity className="w-4 h-4 text-[#ff8400]" />
                  <h2 className="text-sm font-bold text-white">Execution Health</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">Maton Status</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#00ff88]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">Connected Apps</span>
                    <span className="text-xs font-bold text-white">{connections.length}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-xs font-bold text-white/30 mb-3">How It Works</h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  Maverick serves as the strategy shell. Maton AI provides the action primitives to push assets into your existing stack automatically.
                </p>
              </div>
            </div>

            {/* Grid of Connections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MATON_INTEGRATIONS.map((app) => {
                  const isConnected = connections.includes(app.app);
                  return (
                    <div key={app.app} className={`glass-card p-6 group transition-all ${isConnected ? 'border-[#00ff88]/10 bg-[#00ff88]/[0.01]' : 'opacity-50'}`}>
                      <div className="flex items-start justify-between mb-5">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                          <Layers className={`w-5 h-5 ${isConnected ? 'text-[#00ff88]' : 'text-white/20'}`} />
                        </div>
                        <Badge
                          type="pill-color"
                          color={isConnected ? 'success' : 'gray'}
                          size="sm"
                        >
                          {isConnected ? 'Linked' : 'Inactive'}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{app.label}</h3>
                      <p className="text-xs text-white/30 mb-4">
                        {isConnected ? `${app.actions.length} actions available` : 'Authorization required'}
                      </p>
                      {isConnected && (
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                          {app.actions.map((action) => (
                            <span key={action} className="text-[10px] font-medium text-white/30 px-2 py-0.5 bg-white/[0.03] rounded border border-white/5">
                              {action}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        <p className="text-center mt-12 text-[10px] text-white/10 font-mono">
          Operations Hub · Swayze Media · Free Tool
        </p>

      </div>
    </div>
  );
}
