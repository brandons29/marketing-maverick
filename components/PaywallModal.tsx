'use client';
// components/PaywallModal.tsx — Free tool confirmation (no paywall)

import { X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/base/buttons/button';

interface PaywallModalProps {
  onClose: () => void;
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md glass-card overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 mb-5">
            <Zap className="w-7 h-7 text-[#00ff88]" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            You&apos;re All Set
          </h2>
          <p className="text-sm text-white/40 mb-6 leading-relaxed">
            Marketing Maverick is <strong className="text-[#00ff88]">completely free</strong>.
            No limits, no paywall — just bring your own API key.
          </p>

          <Button size="lg" color="primary" onClick={onClose} className="w-full justify-center">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
