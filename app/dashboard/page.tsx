'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { skills } from '@/prompts/marketing';
import { MODEL_CATALOG } from '@/lib/ai-engine';
import SkillSelector from '@/components/SkillSelector';
import ChatWindow from '@/components/ChatWindow';
import {
  Zap,
  BarChart3,
  FileText,
  Key,
  ChevronDown,
  Loader2,
  Sparkles,
} from 'lucide-react';

/* -- stat card ----------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl flex-1 min-w-[180px] flex items-center gap-4 p-5">
      <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#00ff88]" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

/* -- page ---------------------------------------------------- */

export default function DashboardPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([skills[0]?.id]);
  const [model, setModel] = useState(MODEL_CATALOG[0]?.id ?? '');
  const [brief, setBrief] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [runNumber, setRunNumber] = useState(0);
  const [recentOutputs, setRecentOutputs] = useState<
    { id: string; title: string; preview: string; date: string }[]
  >([]);

  const [firstName, setFirstName] = useState('');
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) setFirstName(user.email.split('@')[0]);
    })();
  }, []);

  const handleGenerate = async () => {
    if (!brief.trim() || loading) return;
    setLoading(true);
    setOutput('');
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: brief,
          selectedSkills,
          model,
          stream: true
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate');
      }

      if (!res.body) throw new Error('No response body');
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setOutput(accumulated);
      }

      setRunNumber(prev => prev + 1);
      
      const skillLabel = selectedSkills.length === 1 
        ? (skills.find(s => s.id === selectedSkills[0])?.name ?? 'Copy')
        : `${selectedSkills.length} Weapons`;

      setRecentOutputs((prev) => [
        {
          id: crypto.randomUUID(),
          title: skillLabel,
          preview: accumulated.slice(0, 80) + '...',
          date: new Date().toLocaleDateString(),
        },
        ...prev.slice(0, 9),
      ]);
    } catch (err: any) {
      console.error(err);
      setOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#070707] text-zinc-300 p-8">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
            Maverick <span className="text-[#00ff88]">Console</span>
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-2 uppercase tracking-[0.3em]">
            System Status: <span className="text-[#00ff88]">Online</span> — {firstName || 'User'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Model:</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#00ff88] focus:outline-none cursor-pointer"
            >
              {MODEL_CATALOG.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0f0f0f]">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-10">
        <StatCard icon={Zap} label="Weapons Active" value={String(selectedSkills.length)} />
        <StatCard icon={BarChart3} label="System Prompts" value={String(skills.length)} />
        <StatCard icon={FileText} label="Recent Runs" value={String(recentOutputs.length)} />
        <StatCard icon={Key} label="API Status" value="Secure" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Weapon Picker */}
        <div className="lg:col-span-1">
          <SkillSelector 
            selected={selectedSkills} 
            onChange={setSelectedSkills} 
          />
          
          <div className="mt-6 p-5 bg-[#0f0f0f] border border-white/5 rounded-2xl">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#555] mb-4">
              History
            </h2>
            {recentOutputs.length === 0 ? (
              <p className="text-[10px] font-mono text-[#333]">No recent runs.</p>
            ) : (
              <div className="space-y-4">
                {recentOutputs.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-zinc-500 group-hover:text-[#00ff88] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono text-[#222]">{item.date}</span>
                    </div>
                    <p className="text-[10px] text-[#333] line-clamp-1 font-mono">
                      {item.preview}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main: Input & Output */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#00ff88]" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                New Brief
              </h2>
            </div>
            
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Describe what you want to sell. Who is it for? What's the offer?..."
              className="w-full bg-[#070707] border border-white/5 rounded-xl p-5 text-sm text-white placeholder:text-[#222] focus:outline-none focus:border-[#00ff88]/30 transition-all resize-none min-h-[160px]"
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading || !brief.trim() || selectedSkills.length === 0}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${
                  loading || !brief.trim() || selectedSkills.length === 0
                    ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                    : 'bg-[#00ff88] text-black hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Crunching...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black" />
                    Engage Maverick
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Window */}
          {output && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ChatWindow 
                content={output} 
                runNumber={runNumber} 
                onRemix={() => setOutput('')} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
