'use client';
// components/PaywallModal.tsx — Not used (tool is free), kept for compatibility

import { X, Zap } from 'lucide-react';

interface PaywallModalProps {
  onClose: () => void;
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-[#111] border border-[#00ff88]/30 rounded-3xl shadow-[0_0_60px_rgba(0,255,136,0.15)] overflow-hidden">

        {/* Green glow top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 mb-5">
            <Zap className="w-8 h-8 text-[#00ff88]" />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
            You&apos;re All Set
          </h2>
          <p className="text-sm text-[#555] mb-6 leading-relaxed">
            Marketing Maverick is <strong className="text-[#00ff88]">completely free</strong>.{' '}
            No limits, no paywall — just bring your OpenAI key.
          </p>

          <button
            onClick={onClose}
            className="w-full btn-primary text-base py-3"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
