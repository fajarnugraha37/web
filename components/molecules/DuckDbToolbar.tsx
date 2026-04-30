"use client";

import React from "react";
import { BarChart3, FileUp } from "lucide-react";

interface DuckDbToolbarProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Molecule: DuckDbToolbar
 * Renders the primary title and file ingestion actions for the lab.
 */
export function DuckDbToolbar({ onFileUpload }: DuckDbToolbarProps) {
  return (
    <div className="flex justify-end border-b border-border pb-6">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 px-3 py-1.5 border border-accent-secondary/30 text-accent-secondary hover:bg-accent-secondary hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest cyber-chamfer-sm cursor-pointer">
          <FileUp className="w-3 h-3" />
          INGEST_FILE
          <input
            type="file"
            multiple
            className="hidden"
            onChange={onFileUpload}
            accept=".csv,.parquet,.json"
          />
        </label>
      </div>
    </div>
  );
}
