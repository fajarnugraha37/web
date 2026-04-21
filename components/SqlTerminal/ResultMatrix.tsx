"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useMemo } from "react";

interface ResultMatrixProps {
  results: any[] | null;
  error: string | null;
  executionTime: number | null;
}

export function ResultMatrix({
  results,
  error,
  executionTime,
}: ResultMatrixProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => {
    if (!results || results.length === 0) return [];
    return Object.keys(results[0]);
  }, [results]);

  const rowVirtualizer = useVirtualizer({
    count: results?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  if (error) {
    return (
      <div className="flex-1 min-h-[200px] border border-destructive/30 bg-destructive/5 p-6 font-mono text-sm overflow-auto relative">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <span className="animate-pulse">⚠</span>
          <span className="font-bold">QUERY_FAILURE:</span>
        </div>
        <pre className="text-destructive/90 whitespace-pre-wrap">{error}</pre>
        <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,51,102,0.05)_2px,rgba(255,51,102,0.05)_4px)]" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex-1 min-h-[200px] border border-border bg-card/20 flex items-center justify-center font-mono text-xs text-muted-foreground cyber-chamfer">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-pulse">[ WAITING_FOR_INPUT ]</span>
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex-1 min-h-[200px] border border-accent/20 bg-accent/5 p-6 font-mono text-sm relative">
        <div className="flex items-center justify-between mb-4">
          <div className="text-accent flex items-center gap-2 text-xs">
            <span>&gt;</span> SUCCESS: COMMAND_EXECUTED_SAFELY
          </div>
          <div className="text-[10px] text-muted-foreground italic">
            Rows affected: 0 | {executionTime?.toFixed(2)}ms
          </div>
        </div>
        <div className="text-muted-foreground text-xs italic">
          No records matching the provided fragments were found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-[200px] border border-border bg-[#0a0a0f] overflow-hidden">
      {/* HUD Telemetry Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 font-mono text-[10px] tracking-tight">
        <div className="flex items-center gap-4">
          <span className="text-accent">MATRIX_VIEW: ACTIVE</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-accent-secondary">
            RECORDS: {results.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>LATENCY: {executionTime?.toFixed(2)}ms</span>
        </div>
      </div>

      {/* Table Container */}
      <div
        ref={parentRef}
        className="flex-1 overflow-auto relative font-mono text-[11px]"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* Header Row (Fixed) */}
          <div className="sticky top-0 z-20 flex bg-muted border-b border-border shadow-lg">
            {columns.map((col) => (
              <div
                key={col}
                className="flex-1 min-w-[120px] px-3 py-2 text-accent font-bold uppercase tracking-wider border-r border-border/50 bg-accent/5"
              >
                {col}
              </div>
            ))}
          </div>

          {/* Virtualized Rows */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = results[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                className={`absolute top-0 left-0 w-full flex border-b border-border/30 hover:bg-accent/5 transition-colors ${
                  virtualRow.index % 2 === 0 ? "bg-white/[0.02]" : ""
                }`}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {columns.map((col) => (
                  <div
                    key={col}
                    className="flex-1 min-w-[120px] px-3 py-2 border-r border-border/20 truncate text-foreground/80"
                  >
                    {row[col] === null ? (
                      <span className="text-muted-foreground opacity-30 italic">
                        NULL
                      </span>
                    ) : typeof row[col] === "object" ? (
                      <span className="text-accent-tertiary">
                        {JSON.stringify(row[col])}
                      </span>
                    ) : (
                      String(row[col])
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] cyber-grid-bg" />
    </div>
  );
}
