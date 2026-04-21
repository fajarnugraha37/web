"use client";

import { useState, useCallback } from "react";
import { usePglite } from "@/hooks/use-pglite";
import { SqlEditor } from "@/components/SqlTerminal/SqlEditor";
import { ResultMatrix } from "@/components/SqlTerminal/ResultMatrix";
import { PageTransition } from "@/components/PageTransition";
import {
  Database,
  Square,
  Columns2,
  ShieldAlert,
  Cpu,
  HardDrive,
  Trash2,
  Table as TableIcon,
} from "lucide-react";

export default function PostgreSQLPlayground() {
  const { status, error, exec } = usePglite();
  const [results, setResults] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"stack" | "wide">("stack");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  const handleExecute = useCallback(
    async (query: string, page = 1, size = pageSize) => {
      setIsExecuting(true);
      setQueryError(null);
      setLastQuery(query);
      setCurrentPage(page);

      const start = performance.now();
      let trimmedQuery = query.trim();

      // Remove trailing semicolon if present for subquery wrapping
      if (trimmedQuery.endsWith(";")) {
        trimmedQuery = trimmedQuery.slice(0, -1);
      }

      const isSelect = trimmedQuery.toUpperCase().startsWith("SELECT");

      try {
        if (isSelect) {
          // 1. Get Total Count
          const countQuery = `SELECT COUNT(*) as total FROM (${trimmedQuery}) AS sub`;
          const countRes = await exec(countQuery);
          const total = parseInt(countRes.rows[0].total);
          setTotalRecords(total);

          // 2. Fetch Page
          const offset = (page - 1) * size;
          const pagedQuery = `SELECT * FROM (${trimmedQuery}) AS sub LIMIT ${size} OFFSET ${offset}`;
          const res = await exec(pagedQuery);
          setResults(res.rows);
        } else {
          // Non-SELECT queries run directly
          const res = await exec(trimmedQuery);
          setResults(res.rows);
          setTotalRecords(res.rows.length);
        }
        setExecutionTime(performance.now() - start);
      } catch (err: any) {
        setQueryError(err.message || "Unknown execution error");
        setResults(null);
        setTotalRecords(0);
      } finally {
        setIsExecuting(false);
      }
    },
    [exec, pageSize],
  );

  const onPageChange = (page: number) => {
    if (lastQuery) handleExecute(lastQuery, page, pageSize);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    if (lastQuery) handleExecute(lastQuery, 1, size);
  };

  const handlePurge = () => {
    if (
      confirm(
        "WARNING: This will nuke the local database and clear all history. Proceed?",
      )
    ) {
      const request = indexedDB.deleteDatabase("/pglite/sysop-db");
      request.onsuccess = () => {
        localStorage.removeItem("sysop_cmd_history");
        window.location.reload();
      };
      request.onerror = () =>
        alert("Purge failed. Manual intervention required.");
    }
  };

  const listTables = () => {
    handleExecute(
      "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';",
    );
  };

  const exportFullCsv = async () => {
    if (!lastQuery) return;
    setIsExecuting(true);
    try {
      const res = await exec(lastQuery);
      const rows = res.rows;
      if (rows.length === 0) return;

      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          headers
            .map((h) => `"${String(row[h] || "").replace(/"/g, '""')}"`)
            .join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `query_results_full_${new Date().getTime()}.csv`;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 py-8 md:py-12 max-w-6xl mx-auto px-4">
        {/* Laboratory Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-accent" />
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                SQL_LAB<span className="text-accent">.EXE</span>
              </h1>
            </div>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
              Persistent PostgreSQL WASM Node
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={listTables}
              className="px-3 py-1.5 border border-accent/30 text-accent hover:bg-accent hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest cyber-chamfer-sm"
            >
              LIST_TABLES
            </button>

            <div className="flex bg-muted/20 p-1 border border-border cyber-chamfer-sm">
              <button
                onClick={() => setLayoutMode("stack")}
                className={`p-1.5 transition-all ${layoutMode === "stack" ? "bg-accent text-black shadow-[0_0_10px_#00ff88]" : "text-muted-foreground hover:text-white"}`}
                title="Stack View"
              >
                <Square className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode("wide")}
                className={`p-1.5 transition-all ${layoutMode === "wide" ? "bg-accent text-black shadow-[0_0_10px_#00ff88]" : "text-muted-foreground hover:text-white"}`}
                title="Wide View"
              >
                <Columns2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handlePurge}
              className="p-2 border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all cyber-chamfer-sm"
              title="System Purge"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard
            icon={<Cpu className="w-4 h-4" />}
            label="ENGINE_STATUS"
            value={status === "initializing" ? "BOOTING..." : "ONLINE"}
            color={status === "error" ? "text-destructive" : "text-accent"}
            loading={status === "initializing"}
          />
          <StatusCard
            icon={<HardDrive className="w-4 h-4" />}
            label="STORAGE_MODE"
            value={
              status === "volatile" ? "VOLATILE (RAM)" : "PERSISTENT (IndexDB)"
            }
            color={
              status === "volatile"
                ? "text-accent-secondary"
                : "text-accent-tertiary"
            }
          />
          <StatusCard
            icon={<ShieldAlert className="w-4 h-4" />}
            label="SEC_CLEARANCE"
            value="N/A"
            color="text-accent"
          />
          <StatusCard
            icon={<TableIcon className="w-4 h-4" />}
            label="ACTIVE_NODES"
            value="01"
            color="text-white"
          />
        </div>

        {/* Main Interface */}
        <div
          className={`flex flex-col gap-6 ${layoutMode === "wide" ? "lg:flex-row lg:items-stretch" : ""}`}
        >
          <div
            className={`${layoutMode === "wide" ? "lg:w-2/5" : "w-full"} flex flex-col`}
          >
            {/* Quick Tips */}
            <div className="mt-2 p-2 border border-border/30 bg-muted/5 cyber-chamfer-sm font-mono text-[10px] text-muted-foreground leading-relaxed">
              <span className="text-accent-tertiary"># SYSTEM_TIP:</span> Try
              querying <code className="text-accent">system_control</code>,{" "}
              <code className="text-accent">net_nodes</code>,{" "}
              <code className="text-accent">access_logs</code> or{" "}
              <code className="text-accent">sys_config</code>.
              <br />
              <span className="text-accent-tertiary"># OR:</span>{" "}
              <code className="text-accent-secondary">
                SELECT * FROM generate_series(1, 5000);
              </code>
            </div>
            <SqlEditor
              onExecute={handleExecute}
              isLoading={isExecuting}
              disabled={status === "initializing" || status === "error"}
            />
          </div>

          <div
            className={`${layoutMode === "wide" ? "lg:w-3/5" : "w-full"} flex flex-col min-h-[400px]`}
          >
            <ResultMatrix
              results={results}
              error={queryError || (status === "error" ? error : null)}
              executionTime={executionTime}
              onExportFull={exportFullCsv}
              pagination={{
                currentPage,
                pageSize,
                totalRecords,
                onPageChange,
                onPageSizeChange,
              }}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function StatusCard({ icon, label, value, color, loading = false }: any) {
  return (
    <div className="border border-border bg-card/40 p-3 cyber-chamfer-sm relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-muted-foreground opacity-50">{icon}</span>
        <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div
        className={`font-mono text-xs font-black uppercase tracking-wider ${color} ${loading ? "animate-pulse" : ""}`}
      >
        {value}
      </div>
      {/* HUD Accent */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
      <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
