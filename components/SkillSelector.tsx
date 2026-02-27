'use client';
// components/SkillSelector.tsx — Skill Picker sidebar (reusable)

import { skills } from '@/prompts/marketing';
import { Badge } from '@/components/ui/base/badges/badges';
import { CheckCircle2 } from 'lucide-react';

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
    <div className="glass-card p-5 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white">
          AI Skills
        </h2>
        <Badge type="pill-color" color="success" size="sm">
          All Free
        </Badge>
      </div>

      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-[10px] font-bold text-white/20 hover:text-red-400 uppercase tracking-wider transition-colors mb-3"
        >
          Clear all
        </button>
      )}

      {/* List */}
      <div className="space-y-1.5">
        {skills.map((skill) => {
          const isSelected = selected.includes(skill.id);
          return (
            <button
              key={skill.id}
              onClick={() => toggle(skill.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 flex items-center gap-3 group ${
                isSelected
                  ? 'bg-[#ff8400]/10 border border-[#ff8400]/20'
                  : 'border border-transparent hover:bg-white/[0.03]'
              }`}
              title={skill.description}
            >
              {isSelected ? (
                <CheckCircle2 className="w-4 h-4 text-[#ff8400] shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded border border-white/10 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium truncate block ${isSelected ? 'text-[#ff8400]' : 'text-white/60 group-hover:text-white/80'}`}>
                  {skill.name}
                </span>
                <span className="text-[10px] text-white/25 truncate block">
                  {skill.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Count */}
      {selected.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs font-mono text-[#ff8400]">
            {selected.length} skill{selected.length > 1 ? 's' : ''} active
          </p>
        </div>
      )}

      {/* Tip */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-[10px] text-white/20 font-mono leading-relaxed">
          Stack skills for compound output.
        </p>
      </div>
    </div>
  );
}
