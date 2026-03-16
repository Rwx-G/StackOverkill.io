'use client';

import { Check } from 'lucide-react';

interface OptionCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({ emoji, label, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={selected}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all duration-200
        flex items-center gap-3
        hover:border-primary/50 hover:shadow-sm
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${
          selected
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-slate-200 bg-white'
        }
      `}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="flex-1 font-medium text-slate-800">{label}</span>
      {selected && (
        <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </span>
      )}
    </button>
  );
}
