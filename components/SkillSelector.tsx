'use client';
// components/SkillSelector.tsx — Weapon Picker sidebar (reusable)

import { ChevronRight } from 'lucide-react';
import { skills } from '@/prompts/marketing';

interface SkillSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function SkillSelector({ selected, onChange }: SkillSelectorProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="bg-[#0f0f0f] border border-white/6 rounded-2xl p-5 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#555]">
          ⚔ Weapons
        </h2>
        {selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-[10px] font-bold text-[#333] hover:text-red-400 uppercase tracking-wider transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-1">
        {skills.map((skill) => {
          const isSelected = selected.includes(skill.id);
          return (
            <button
              key={skill.id}
              onClick={() => toggle(skill.id)}
              className={`weapon-item w-full text-left flex items-center gap-3 ${isSelected ? 'selected' : ''}`}
              title={skill.prompt}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? 'border-[#00ff88] bg-[#00ff88]' : 'border-[#333]'
                }`}
              >
                {isSelected && (
                  <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-black">
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="black"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm font-semibold text-[#888] truncate">
                {skill.name}
              </span>
              {isSelected && (
                <ChevronRight className="w-3 h-3 text-[#00ff88] ml-auto shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Count */}
      {selected.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs font-mono text-[#00ff88]">
            {selected.length} weapon{selected.length > 1 ? 's' : ''} loaded
          </p>
        </div>
      )}

      {/* Tip */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <p className="text-[10px] text-[#333] font-mono leading-relaxed">
          Stack weapons for compound output.
        </p>
      </div>
    </div>
  );
}
