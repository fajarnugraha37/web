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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-accent" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
            SQL LAB<span className="text-accent">.EXE</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
          Persistent PostgreSQL WASM Node // Transactional Laboratory
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPurge}
          className="p-2 border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all cyber-chamfer-sm"
          title="System Purge"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
