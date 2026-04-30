"use client";

import React from "react";
import { Database, Trash2 } from "lucide-react";

interface PostgresToolbarProps {
  onPurge: () => void;
}

/**
 * Molecule: PostgresToolbar
 * Renders the primary header and system purge actions for the PostgreSQL lab.
 */
export function PostgresToolbar({ onPurge }: PostgresToolbarProps) {
  return (
    <div className="flex justify-end border-b border-border pb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onPurge}
          className="flex items-center gap-2 px-3 py-1.5 border border-destructive/30 text-destructive hover:bg-destructive hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest cyber-chamfer-sm cursor-pointer"
          title="System Purge"
        >
          <Trash2 className="w-3 h-3" />
          PURGE
        </button>
      </div>
    </div>
  );
}
