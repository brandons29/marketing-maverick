'use client';
// components/ApiKeyInput.tsx — Secure API key input with mask/reveal toggle

import { useState } from 'react';
import { Eye, EyeOff, Key, Save, CheckCircle } from 'lucide-react';

interface ApiKeyInputProps {
  onSave: (key: string) => Promise<void>;
  hasSavedKey?: boolean;
}

export default function ApiKeyInput({ onSave, hasSavedKey = false }: ApiKeyInputProps) {
  const [key, setKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!key.trim()) {
      setError('Paste your OpenAI key first.');
      return;
    }
    if (!key.startsWith('sk-')) {
      setError("That doesn't look like an OpenAI key (should start with sk-).");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave(key.trim());
      setSaved(true);
      setKey('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current status */}
      {hasSavedKey && !saved && (
        <div className="flex items-center gap-2 text-xs text-[#00ff88] font-mono bg-[#00ff88]/8 border border-[#00ff88]/20 rounded-lg px-3 py-2">
          <CheckCircle className="w-3.5 h-3.5" />
          Key on file — replace it below to update
        </div>
      )}

      {/* Input row */}
      <div className="relative">
        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
        <input
          type={visible ? 'text' : 'password'}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-..."
          className="input-dark pl-10 pr-10 font-mono"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm font-medium">{error}</p>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={loading || !key.trim()}
        className="flex items-center gap-2 btn-primary py-2.5 px-6 text-sm disabled:opacity-40 disabled:transform-none disabled:shadow-none"
      >
        {loading ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
            Securing...
          </>
        ) : saved ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" />
            Locked in!
          </>
        ) : (
          <>
            <Save className="w-3.5 h-3.5" />
            LOCK IT IN
          </>
        )}
      </button>
    </div>
  );
}
