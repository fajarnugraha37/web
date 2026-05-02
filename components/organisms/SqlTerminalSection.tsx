"use client";

import React, { useState, useCallback } from "react";
import { SqlEditor } from "@/components/molecules/SqlEditor";
import { ResultMatrix } from "@/components/molecules/ResultMatrix";
import { Square, Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSqlStore } from "@/lib/store/useSqlStore";

interface SqlTerminalSectionProps {
  exec: (query: string) => Promise<any>;
  status: string;
  error: string | null;
  onExportFull?: (query: string) => Promise<void>;
  accentColor?: "accent" | "accent-secondary" | "accent-tertiary";
  engine?: "pg" | "duckdb";
}

export function SqlTerminalSection({
  exec,
  status,
  error,
  onExportFull,
  accentColor = "accent",
  engine = "pg",
}: SqlTerminalSectionProps) {
  // Zustand state
  const history = useSqlStore((state) => engine === "pg" ? state.pgHistory : state.duckDbHistory);
  const addPgHistory = useSqlStore((state) => state.addPgHistory);
  const addDuckDbHistory = useSqlStore((state) => state.addDuckDbHistory);
  const clearHistory = useSqlStore((state) => state.clearHistory);

  // Local UI-only state
  const [results, setResults] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [layoutMode, setLayoutMode] = useState<"stack" | "wide">("stack");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [localIsExecuting, setLocalIsExecuting] = useState(false);
  const [localTotalRecords, setLocalTotalRecords] = useState(0);

  const handleExecute = useCallback(
    async (query: string, page = 1, size = pageSize) => {
      setQueryError(null);
      setLastQuery(query);
      setCurrentPage(page);
      setLocalIsExecuting(true);

      const start = performance.now();
      let trimmedQuery = query.trim();

      // Only add to history if it's the initial execution (page 1) and not empty
      if (page === 1 && trimmedQuery.length > 0) {
        if (engine === 'pg') addPgHistory(trimmedQuery);
        else addDuckDbHistory(trimmedQuery);
      }

      if (trimmedQuery.endsWith(";")) {
        trimmedQuery = trimmedQuery.slice(0, -1);
      }

      const isSelect = trimmedQuery.toUpperCase().startsWith("SELECT");

      try {
        if (isSelect) {
          // 1. Get Total Count
          const countQuery = `SELECT COUNT(*) as total FROM (${trimmedQuery}) AS sub`;
          const countRes = await exec(countQuery);
          const total = parseInt(countRes.rows?.[0]?.total || countRes.rows?.[0]?.count || 0);
          setLocalTotalRecords(total);

          // 2. Fetch Page
          const offset = (page - 1) * size;
          const pagedQuery = `SELECT * FROM (${trimmedQuery}) AS sub LIMIT ${size} OFFSET ${offset}`;
          const res = await exec(pagedQuery);
          setResults(res.rows);
        } else {
          const res = await exec(trimmedQuery);
          setResults(res.rows || []);
          setLocalTotalRecords(res.rows?.length || 0);
        }
        setExecutionTime(performance.now() - start);
      } catch (err: any) {
        setQueryError(err.message || "Unknown execution error");
        setResults(null);
        setLocalTotalRecords(0);
      } finally {
        setLocalIsExecuting(false);
      }
    },
    [exec, pageSize, engine, addPgHistory, addDuckDbHistory]
  );

  const onPageChange = (page: number) => {
    if (lastQuery) handleExecute(lastQuery, page, pageSize);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    if (lastQuery) handleExecute(lastQuery, 1, size);
  };

  const accentClass = {
    accent: "bg-accent",
    "accent-secondary": "bg-accent-secondary",
    "accent-tertiary": "bg-accent-tertiary",
  }[accentColor];

  const shadowClass = {
    accent: "shadow-[0_0_10px_#00ff88]",
    "accent-secondary": "shadow-[0_0_10px_#ff00ff]",
    "accent-tertiary": "shadow-[0_0_10px_#00d4ff]",
  }[accentColor];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <div className="bg-muted/20 p-1 border border-border cyber-chamfer-sm hidden md:flex">
          <button
            onClick={() => setLayoutMode("stack")}
            className={cn(
              "p-1.5 transition-all",
              layoutMode === "stack"
                ? `${accentClass} text-black ${shadowClass}`
                : "text-muted-foreground hover:text-white"
            )}
            title="Stack View"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayoutMode("wide")}
            className={cn(
              "p-1.5 transition-all",
              layoutMode === "wide"
                ? `${accentClass} text-black ${shadowClass}`
                : "text-muted-foreground hover:text-white"
            )}
            title="Wide View"
          >
            <Columns2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-6",
          layoutMode === "wide" ? "lg:flex-row lg:items-stretch" : ""
        )}
      >
        <div
          className={cn(
            "flex flex-col",
            layoutMode === "wide" ? "lg:w-2/5" : "w-full"
          )}
        >
          <SqlEditor
            onExecute={handleExecute}
            isLoading={localIsExecuting}
            disabled={status === "initializing" || status === "error"}
            history={history}
            onClearHistory={() => clearHistory(engine)}
          />
        </div>

        <div
          className={cn(
            "flex flex-col min-h-[400px]",
            layoutMode === "wide" ? "lg:w-3/5" : "w-full"
          )}
        >
          <ResultMatrix
            results={results}
            error={queryError || (status === "error" ? error : null)}
            executionTime={executionTime}
            onExportFull={() => lastQuery && onExportFull?.(lastQuery)}
            pagination={{
              currentPage,
              pageSize,
              totalRecords: localTotalRecords,
              onPageChange,
              onPageSizeChange,
            }}
          />
        </div>
      </div>
    </div>
  );
}
