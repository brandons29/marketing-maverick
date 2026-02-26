'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
          Step 03 — <span className="text-[#ff8400]">Strategic Drop-Zone</span>
        </h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Maverick needs to understand your DNA. Drop a URL or upload a document to auto-extract your business intelligence.
        </p>
      </motion.div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleIngest} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Globe className="w-5 h-5 text-zinc-600 group-focus-within:text-[#ff8400] transition-colors" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-business.com"
              className="w-full bg-[#070707] border border-white/5 rounded-2xl py-5 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#ff8400]/50 transition-all text-sm"
              disabled={loading || success}
            />
          </div>

          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">OR</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 text-center group hover:border-[#ff8400]/30 transition-all cursor-pointer">
            <Upload className="w-8 h-8 text-zinc-700 mx-auto mb-3 group-hover:text-[#ff8400] transition-colors" />
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Drop Document (PDF / TXT)
            </p>
            <p className="text-[10px] text-zinc-700 mt-2">Coming Soon: Deep Document Analysis</p>
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim() || success}
            className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
              success 
                ? 'bg-emerald-500 text-white' 
                : loading || !url.trim()
                ? 'bg-zinc-900 text-zinc-700'
                : 'bg-[#ff8400] text-black hover:shadow-[0_0_40px_rgba(255,132,0,0.3)]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning Brand DNA...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Context Extracted
              </>
            ) : (
              <>
                Initialize Ingestion
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500 text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <div className="mt-8 flex justify-center gap-8">
        <div className="flex items-center gap-2 opacity-30">
          <Globe className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase">Website Scraper</span>
        </div>
        <div className="flex items-center gap-2 opacity-30">
          <FileText className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase">PDF Parser</span>
        </div>
        <div className="flex items-center gap-2 opacity-30">
          <Zap className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase">Synapse Extraction</span>
        </div>
      </div>
    </div>
  );
}
