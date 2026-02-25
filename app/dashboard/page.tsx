'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { skills } from '@/prompts/marketing';
import { MODEL_CATALOG } from '@/lib/ai-engine';
import {
  Zap,
  Copy,
  FileText,
  BarChart3,
  Key,
  ChevronDown,
  Loader2,
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
    <div className="card flex-1 min-w-[180px] flex items-center gap-4 p-5">
      <div className="w-10 h-10 rounded-xl bg-[#ff8400]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#ff8400]" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

/* -- safe text renderer -------------------------------------- */
/* Escapes HTML entities first, then applies basic markdown
   formatting. This prevents XSS since all user/AI content
   is entity-escaped before any HTML tags are inserted. */

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderMarkdown(raw: string) {
  const safe = escapeHtml(raw);
  return safe
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

/* -- page ---------------------------------------------------- */

export default function DashboardPage() {
  const [selectedSkill, setSelectedSkill] = useState(skills[0]?.id ?? '');
  const [model, setModel] = useState(MODEL_CATALOG[0]?.id ?? '');
  const [brief, setBrief] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentOutputs, setRecentOutputs] = useState<
    { id: string; title: string; preview: string; date: string }[]
  >([]);
  const outputRef = useRef<HTMLDivElement>(null);

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
          selectedSkills: [selectedSkill],
          model,
          stream: true,
          messages: [{ role: 'user', content: brief }],
        }),
      });
      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const token =
                parsed.choices?.[0]?.delta?.content ??
                parsed.choices?.[0]?.text ??
                '';
              accumulated += token;
              setOutput(accumulated);
            } catch {
              /* skip non-JSON lines */
            }
          }
        }
      }
      const skillLabel =
        skills.find((s) => s.id === selectedSkill)?.name ?? 'Copy';
      setRecentOutputs((prev) => [
        {
          id: crypto.randomUUID(),
          title: skillLabel,
          preview: accumulated.slice(0, 80) + '...',
          date: new Date().toLocaleDateString(),
        },
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      console.error(err);
      setOutput('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Generate conversion-ready copy in seconds.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard icon={FileText} label="Copies Generated" value="--" />
        <StatCard icon={Zap} label="Active Campaigns" value="--" />
        <StatCard icon={BarChart3} label="Prompts Available" value={String(skills.length)} />
        <StatCard icon={Key} label="API Credits Used" value="--" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">AI Copywriter</h2>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-zinc-400 mb-1">Template</label>
              <div className="relative">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#ff8400]"
                >
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-zinc-400 mb-1">AI Model</label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#ff8400]"
                >
                  {MODEL_CATALOG.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <label className="block text-xs text-zinc-400 mb-1">Your Brief</label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Describe your product, audience, and goal..."
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#ff8400] resize-none mb-4"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !brief.trim()}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {loading ? 'Generating...' : 'Generate Copy'}
            </button>
            {output && (
              <button onClick={handleCopy} className="btn-ghost flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </button>
            )}
          </div>

          {/* Output display - content is XSS-safe because renderMarkdown
              escapes all HTML entities before inserting any formatting tags.
              The only HTML injected is our own static class-based tags. */}
          {output && (
            <div
              ref={outputRef}
              className="mt-6 p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 leading-relaxed max-h-[400px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(output) }}
            />
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Outputs</h2>
          {recentOutputs.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Your generated copies will appear here.
            </p>
          ) : (
            <div className="space-y-3">
              {recentOutputs.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-800"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-[#ff8400]">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-zinc-500">{item.date}</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{item.preview}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
