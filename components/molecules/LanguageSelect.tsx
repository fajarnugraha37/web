import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/hooks/useTranslationParams';

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
}

export function LanguageSelect({ value, onChange, id, label, disabled = false }: LanguageSelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-background border border-border px-3 py-2 text-sm font-sans cyber-chamfer-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
