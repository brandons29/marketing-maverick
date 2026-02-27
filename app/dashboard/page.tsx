'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { skills } from '@/prompts/marketing';
import { MODEL_CATALOG } from '@/lib/ai-engine';
import SkillSelector from '@/components/SkillSelector';
import ChatWindow from '@/components/ChatWindow';
import { Button } from '@/components/ui/base/buttons/button';
import { Badge } from '@/components/ui/base/badges/badges';
import {
  Zap,
  BarChart3,
  FileText,
  Key,
  Loader2,
  Sparkles,
} from 'lucide-react';

/* -- stat card ----------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  color = 'text-[#00ff88]',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="glass-card flex-1 min-w-[180px] flex items-center gap-4 p-5">
      <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-white/40">{label}</p>
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
          stream: true,
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

      setRunNumber((prev) => prev + 1);

      const skillLabel =
        selectedSkills.length === 1
          ? (skills.find((s) => s.id === selectedSkills[0])?.name ?? 'Strategy')
          : `${selectedSkills.length} Skills`;

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
    <div className="flex-1 min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Badge type="pill-color" color="success" size="sm">Free</Badge>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Strategy Engine
            </h1>
          </div>
          <p className="text-sm text-white/40 mt-1">
            System Status: <span className="text-[#00ff88]">Online</span> — {firstName || 'User'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-3 !rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Model:</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#ff8400] focus:outline-none cursor-pointer"
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
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard icon={Zap} label="Skills Active" value={String(selectedSkills.length)} />
        <StatCard icon={BarChart3} label="Available Skills" value={String(skills.length)} color="text-[#ff8400]" />
        <StatCard icon={FileText} label="Recent Runs" value={String(recentOutputs.length)} color="text-[#d4af37]" />
        <StatCard icon={Key} label="API Status" value="Secure" color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Skill Picker */}
        <div className="lg:col-span-1">
          <SkillSelector
            selected={selectedSkills}
            onChange={setSelectedSkills}
          />

          <div className="mt-6 glass-card p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
              History
            </h2>
            {recentOutputs.length === 0 ? (
              <p className="text-xs text-white/20 font-mono">No recent runs.</p>
            ) : (
              <div className="space-y-4">
                {recentOutputs.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-white/40 group-hover:text-[#ff8400] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-white/15">{item.date}</span>
                    </div>
                    <p className="text-[10px] text-white/20 line-clamp-1 font-mono">
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
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#ff8400]" />
              <h2 className="text-sm font-bold text-white">
                New Brief
              </h2>
            </div>

            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Describe your marketing challenge. What are you trying to achieve? Who is the target audience?..."
              className="input-dark resize-none min-h-[160px]"
            />

            <div className="mt-6 flex justify-end">
              <Button
                size="lg"
                color="primary"
                onClick={handleGenerate}
                isDisabled={loading || !brief.trim() || selectedSkills.length === 0}
                isLoading={loading}
                iconLeading={Zap}
              >
                {loading ? 'Generating...' : 'Run Strategy'}
              </Button>
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
