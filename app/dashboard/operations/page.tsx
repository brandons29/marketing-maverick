'use client';

import { useState, useEffect } from 'react';
import { 
  Layers, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCcw, 
  ExternalLink,
  Zap,
  Cpu,
  ArrowRight
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-maverick-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">Live Operations</h1>
            </div>
            <p className="text-[10px] text-maverick-muted font-mono uppercase tracking-[0.4em]">
              SaaS Execution Hub · Powered by Maton AI
            </p>
          </div>
          <button 
            onClick={fetchConnections}
            className="flex items-center gap-2 px-4 py-2 bg-maverick-dark-1 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-maverick-muted hover:text-white transition-colors"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync Connections
          </button>
        </div>

        {error ? (
          <div className="elite-card p-12 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic text-white mb-2 tracking-tight">Bridge Offline</h3>
              <p className="text-sm text-maverick-muted leading-relaxed uppercase tracking-wider">{error}</p>
            </div>
            <a href="/settings" className="btn-synapse inline-flex items-center gap-2 px-10">
              Connect Maton Bridge
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Status Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="elite-card p-8 bg-maverick-gold/[0.02] border-maverick-gold/10">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-maverick-gold" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Execution Health</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-maverick-muted uppercase">Maton Status</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-maverick-neon uppercase italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-maverick-neon animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-maverick-muted uppercase">Connected Apps</span>
                    <span className="text-[10px] font-black text-white italic">{connections.length} Units</span>
                  </div>
                </div>
              </div>

              <div className="elite-card p-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-maverick-muted mb-4 italic">Deployment Protocol</h3>
                <p className="text-[10px] leading-loose text-maverick-muted font-mono uppercase tracking-widest">
                  Maverick serves as the strategy shell. Maton AI provides the action primitives to push assets into your existing stack without human intervention.
                </p>
              </div>
            </div>

            {/* Grid of Connections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MATON_INTEGRATIONS.map((app) => {
                  const isConnected = connections.includes(app.app);
                  return (
                    <div key={app.app} className={`glass-card p-8 group ${isConnected ? 'border-maverick-neon/20 bg-maverick-neon/[0.01]' : 'opacity-40 grayscale'}`}>
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                          <Layers className={`w-6 h-6 ${isConnected ? 'text-maverick-neon' : 'text-maverick-muted'}`} />
                        </div>
                        {isConnected ? (
                          <div className="px-3 py-1 rounded-full bg-maverick-neon/10 border border-maverick-neon/20 text-[8px] font-black text-maverick-neon uppercase tracking-widest">Linked</div>
                        ) : (
                          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/20 uppercase tracking-widest">Inactive</div>
                        )}
                      </div>
                      <h3 className="text-xl font-black uppercase italic text-white mb-2 tracking-tighter">{app.label}</h3>
                      <p className="text-[10px] font-mono text-maverick-muted uppercase tracking-widest mb-6">
                        {isConnected ? `${app.actions.length} Actions Available` : 'Authorization Required'}
                      </p>
                      {isConnected && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                          {app.actions.map(action => (
                            <span key={action} className="text-[7px] font-black text-white/40 uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/5">{action}</span>
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

        <p className="text-center mt-16 text-[8px] text-maverick-muted font-mono uppercase tracking-[0.8em] opacity-20">
          Operation Hub 1.0.1 · SaaS Execution · Swayze Media Elite
        </p>

      </div>
    </div>
  );
}
