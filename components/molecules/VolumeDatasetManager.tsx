"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface VolumeDatasetManagerProps {
  registeredFiles: string[];
  availableDatasets: string[];
  onCopyQuery: (text: string) => void;
  copiedQuery: string | null;
}

/**
 * Molecule: VolumeDatasetManager
 * Manages mounted virtual volumes and pre-defined datasets list.
 */
export function VolumeDatasetManager({
  registeredFiles,
  availableDatasets,
  onCopyQuery,
  copiedQuery,
}: VolumeDatasetManagerProps) {
  const [isVolumesOpen, setIsVolumesOpen] = useState(true);
  const [isDatasetsOpen, setIsDatasetsOpen] = useState(false);

  return (
    <div className="mt-4 p-4 border border-border/30 bg-muted/5 font-mono text-[10px] text-muted-foreground leading-relaxed flex flex-col gap-2">
      <div>
        <span className="text-accent-tertiary"># ANALYTICS_TIP:</span> Drag and drop CSV/Parquet files. They are registered as virtual tables. Then use: <code className="text-accent">SELECT * FROM {"'<file-name>'"};</code>
      </div>

      {/* Active Volumes */}
      <div className="border border-border/20 bg-black/20 mt-2">
        <button
          onClick={() => setIsVolumesOpen(!isVolumesOpen)}
          className="w-full flex items-center justify-between p-2 hover:bg-accent/5 transition-colors"
        >
          <span className="text-accent-tertiary font-bold tracking-widest uppercase">
            # ACTIVE_VOLUMES [{registeredFiles.length}]
          </span>
          {isVolumesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
        {isVolumesOpen && (
          <div className="p-2 border-t border-border/20 max-h-32 overflow-y-auto">
            {registeredFiles.length > 0 ? (
              <ul className="space-y-1">
                {registeredFiles.map((f) => (
                  <li key={f} className="text-accent/80 ml-2 before:content-['>_'] before:mr-2">&apos;{f}&apos;</li>
                ))}
              </ul>
            ) : (
              <span className="opacity-50 italic pl-2">None mounted. Ingest files to mount virtual volumes.</span>
            )}
          </div>
        )}
      </div>

      {/* Available Datasets */}
      <div className="border border-border/20 bg-black/20">
        <button
          onClick={() => setIsDatasetsOpen(!isDatasetsOpen)}
          className="w-full flex items-center justify-between p-2 hover:bg-accent-secondary/5 transition-colors"
        >
          <span className="text-accent-secondary font-bold tracking-widest uppercase">
            # AVAILABLE_DATASETS
          </span>
          {isDatasetsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
        {isDatasetsOpen && (
          <div className="p-2 border-t border-border/20 max-h-48 overflow-y-auto">
            <ul className="space-y-2">
              {availableDatasets.map((dataset) => {
                const queryStr = `SELECT * FROM '${typeof window !== 'undefined' ? window.location.origin : ''}/datasets/${dataset}';`;
                return (
                  <li key={dataset} className="flex flex-col gap-1 p-2 bg-muted/10 border border-border/30 group">
                    <div className="flex justify-between items-start gap-2">
                      <code className="text-accent text-[9px] break-all leading-tight mt-1">{queryStr}</code>
                      <button 
                        onClick={() => onCopyQuery(queryStr)} 
                        className="p-1.5 text-muted-foreground hover:text-accent border border-transparent hover:border-accent/30 bg-background/50 rounded-sm transition-all"
                      >
                        {copiedQuery === queryStr ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
