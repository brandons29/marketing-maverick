'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/base/buttons/button';
import { Globe, FileText, Upload, Loader2, CheckCircle2, AlertCircle, ChevronRight, Zap } from 'lucide-react';

interface StrategicDropZoneProps {
  onComplete: (context: any) => void;
}

export default function StrategicDropZone({ onComplete }: StrategicDropZoneProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ingestion failed');

      setSuccess(true);
      setTimeout(() => {
        onComplete(data.context);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
          Strategic <span className="text-[#ff8400]">Context</span>
        </h2>
        <p className="text-sm text-white/40 max-w-md mx-auto">
          Drop a URL or upload a document to auto-extract your business intelligence.
        </p>
      </motion.div>

      <div className="glass-card p-6">
        <form onSubmit={handleIngest} className="space-y-5">
          <div className="relative group">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#ff8400] transition-colors" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-business.com"
              className="input-dark pl-10"
              disabled={loading || success}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-xs text-white/20">OR</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="border-2 border-dashed border-white/5 rounded-xl p-6 text-center group hover:border-[#ff8400]/20 transition-all cursor-pointer">
            <Upload className="w-6 h-6 text-white/15 mx-auto mb-2 group-hover:text-[#ff8400] transition-colors" />
            <p className="text-xs font-medium text-white/30">Drop Document (PDF / TXT)</p>
            <p className="text-[10px] text-white/15 mt-1">Coming soon: Deep document analysis</p>
          </div>

          <Button
            type="submit"
            size="lg"
            color={success ? 'secondary' : 'primary'}
            isDisabled={loading || !url.trim() || success}
            isLoading={loading}
            iconTrailing={success ? CheckCircle2 : ChevronRight}
            className="w-full justify-center"
          >
            {loading ? 'Scanning...' : success ? 'Context Extracted' : 'Analyze URL'}
          </Button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <div className="mt-6 flex justify-center gap-6">
        {[
          { icon: Globe, label: 'Website Scraper' },
          { icon: FileText, label: 'PDF Parser' },
          { icon: Zap, label: 'AI Extraction' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 opacity-20">
            <item.icon className="w-3 h-3" />
            <span className="text-[10px] font-medium text-white">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
