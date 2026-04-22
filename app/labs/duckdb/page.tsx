"use client";

import { useState, useCallback } from "react";
import { useDuckDb } from "@/hooks/use-duckdb";
import { SqlEditor } from "@/components/SqlTerminal/SqlEditor";
import { ResultMatrix } from "@/components/SqlTerminal/ResultMatrix";
import { PageTransition } from "@/components/PageTransition";
import {
  BarChart3,
  Square,
  Columns2,
  Cpu,
  Zap,
  FileUp,
  Table as TableIcon,
  Copy,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react";

export default function DuckDBLab() {
  const { status, error, exec, registerFile } = useDuckDb();
  const [results, setResults] = useState<any[] | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"stack" | "wide">("stack");
  const [registeredFiles, setRegisteredFiles] = useState<string[]>([]);

  // Pagination State (Note: For DuckDB we handle it in SQL just like Postgres)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  // Accordion & Copy State
  const [isVolumesOpen, setIsVolumesOpen] = useState(true);
  const [isDatasetsOpen, setIsDatasetsOpen] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(text);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const handleExecute = useCallback(
    async (query: string, page = 1, size = pageSize) => {
      setIsExecuting(true);
      setQueryError(null);
      setLastQuery(query);
      setCurrentPage(page);

      const start = performance.now();
      let trimmedQuery = query.trim();

      if (trimmedQuery.endsWith(";")) {
        trimmedQuery = trimmedQuery.slice(0, -1);
      }

      const isSelect = trimmedQuery.toUpperCase().startsWith("SELECT");

      try {
        if (isSelect) {
          // 1. Get Total Count
          const countQuery = `SELECT COUNT(*) as total FROM (${trimmedQuery}) AS sub`;
          const countRes = await exec(countQuery);
          const total = Number(countRes.rows[0].total);
          setTotalRecords(total);

          // 2. Fetch Page
          const offset = (page - 1) * size;
          const pagedQuery = `SELECT * FROM (${trimmedQuery}) AS sub LIMIT ${size} OFFSET ${offset}`;
          const res = await exec(pagedQuery);
          setResults(res.rows);
        } else {
          const res = await exec(trimmedQuery);
          setResults(res.rows);
          setTotalRecords(res.rows.length);
        }
        setExecutionTime(performance.now() - start);
      } catch (err: any) {
        setQueryError(err.message || "Execution failed");
        setResults(null);
        setTotalRecords(0);
      } finally {
        setIsExecuting(false);
      }
    },
    [exec, pageSize],
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        const name = await registerFile(file);
        setRegisteredFiles((prev) => [...new Set([...prev, name])]);

        // Use read_csv_auto explicitly for better detection in stable 1.28.0
        const query = file.name.endsWith(".csv")
          ? `SELECT * FROM read_csv_auto('${name}') LIMIT 10`
          : `SELECT * FROM '${name}' LIMIT 10`;

        handleExecute(query);
      } catch (err: any) {
        setQueryError(`File registration failed: ${err.message}`);
      }
    }
  };

  const onPageChange = (page: number) => {
    if (lastQuery) handleExecute(lastQuery, page, pageSize);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    if (lastQuery) handleExecute(lastQuery, 1, size);
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
      link.download = `duckdb_analytics_${new Date().getTime()}.csv`;
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
              <BarChart3 className="w-6 h-6 text-accent-secondary" />
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                TELEMETRY ANALYTICS
                <span className="text-accent-secondary">.EXE</span>
              </h1>
            </div>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
              DuckDB OLAP Node // Big Data Streaming Active
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-1.5 border border-accent-secondary/30 text-accent-secondary hover:bg-accent-secondary hover:text-black transition-all font-mono text-[10px] uppercase tracking-widest cyber-chamfer-sm cursor-pointer">
              <FileUp className="w-3 h-3" />
              INGEST_FILE
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".csv,.parquet,.json"
              />
            </label>

            <div className="flex bg-muted/20 p-1 border border-border cyber-chamfer-sm">
              <button
                onClick={() => setLayoutMode("stack")}
                className={`p-1.5 transition-all ${layoutMode === "stack" ? "bg-accent-secondary text-black shadow-[0_0_10px_#ff00ff]" : "text-muted-foreground hover:text-white"}`}
                title="Stack View"
              >
                <Square className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode("wide")}
                className={`p-1.5 transition-all ${layoutMode === "wide" ? "bg-accent-secondary text-black shadow-[0_0_10px_#ff00ff]" : "text-muted-foreground hover:text-white"}`}
                title="Wide View"
              >
                <Columns2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Global Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard
            icon={<Cpu className="w-4 h-4" />}
            label="ENGINE_STATUS"
            value={
              status === "initializing" ? "BOOTING..." : status.toUpperCase()
            }
            color={
              status === "error" ? "text-destructive" : "text-accent-secondary"
            }
            loading={status === "initializing"}
          />
          <StatusCard
            icon={<Zap className="w-4 h-4" />}
            label="COMPUTE_MODE"
            value="STREAMING_OLAP"
            color="text-accent"
          />
          <StatusCard
            icon={<TableIcon className="w-4 h-4" />}
            label="VIRTUAL_VOLUMES"
            value={`${registeredFiles.length} MOUNTED`}
            color="text-white"
          />
          <StatusCard
            icon={<BarChart3 className="w-4 h-4" />}
            label="NODE_THROUGHPUT"
            value={
              executionTime
                ? `${(totalRecords / (executionTime / 1000)).toLocaleString(undefined, { maximumFractionDigits: 0 })} r/s`
                : "STDBY"
            }
            color="text-accent-secondary"
          />
        </div>

        <div className="mt-4 p-4 border border-border/30 bg-muted/5 font-mono text-[10px] text-muted-foreground leading-relaxed flex flex-col gap-2">
          <div>
            <span className="text-accent-tertiary"># ANALYTICS_TIP:</span> Drag
            and drop CSV/Parquet files. They are registered as virtual tables in
            your browser. Then use:
            <code className="text-accent">
              SELECT * FROM {"'<file-name>'"};
            </code>
          </div>
          <div>
            <span className="text-accent-tertiary"># TIP:</span> If CSV
            auto-detection fails, use:{" "}
            <code className="text-accent">
              SELECT * FROM read_csv({"'<file-name>'"}, header=True);
            </code>
          </div>
          <div>
            <span className="text-accent-tertiary"># REMOTE_DATA:</span> Ensure
            URLs support CORS. For GitHub, replace{" "}
            <code className="text-destructive text-[9px]">
              github.com/../blob/..
            </code>{" "}
            with{" "}
            <code className="text-accent text-[9px]">
              raw.githubusercontent.com/...
            </code>{" "}
            to prevent cross-origin crashes.
          </div>

          {/* Active Volumes Accordion */}
          <div className="border border-border/20 bg-black/20 mt-2">
            <button
              onClick={() => setIsVolumesOpen(!isVolumesOpen)}
              className="w-full flex items-center justify-between p-2 hover:bg-accent/5 transition-colors"
            >
              <span className="text-accent-tertiary font-bold tracking-widest uppercase">
                # ACTIVE_VOLUMES [{registeredFiles.length}]
              </span>
              {isVolumesOpen ? (
                <ChevronDown className="w-3 h-3 text-accent-tertiary" />
              ) : (
                <ChevronRight className="w-3 h-3 text-accent-tertiary" />
              )}
            </button>
            {isVolumesOpen && (
              <div className="p-2 border-t border-border/20 max-h-32 overflow-y-auto">
                {registeredFiles.length > 0 ? (
                  <ul className="space-y-1">
                    {registeredFiles.map((f) => (
                      <li
                        key={f}
                        className="text-accent/80 ml-2 before:content-['>_'] before:mr-2"
                      >
                        '{f}'
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="opacity-50 italic pl-2">
                    None mounted. Drag & drop files to ingest.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Available Datasets Accordion */}
          <div className="border border-border/20 bg-black/20">
            <button
              onClick={() => setIsDatasetsOpen(!isDatasetsOpen)}
              className="w-full flex items-center justify-between p-2 hover:bg-accent-secondary/5 transition-colors"
            >
              <span className="text-accent-secondary font-bold tracking-widest uppercase">
                # AVAILABLE_DATASETS
              </span>
              {isDatasetsOpen ? (
                <ChevronDown className="w-3 h-3 text-accent-secondary" />
              ) : (
                <ChevronRight className="w-3 h-3 text-accent-secondary" />
              )}
            </button>
            {isDatasetsOpen && (
              <div className="p-2 border-t border-border/20 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-accent-secondary/20">
                <ul className="space-y-2">
                  {[
                    "bank_failures.parquet",
                    "gold_vs_bitcoin.parquet",
                    "iris.parquet",
                    "sample.csv",
                    "sample.parquet",
                    "search_trends.parquet",
                    "table.parquet",
                    "taq.parquet",
                    "titanic.parquet",
                    "userdata.parquet",
                  ].map((dataset) => {
                    const queryStr = `SELECT * FROM 'https://fajarnugraha37.github.io/web/datasets/${dataset}';`;
                    return (
                      <li
                        key={dataset}
                        className="flex flex-col gap-1 p-2 bg-muted/10 border border-border/30 hover:border-accent/30 transition-colors group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <code className="text-accent text-[9px] break-all leading-tight mt-1">
                            {queryStr}
                          </code>
                          <button
                            onClick={() => handleCopy(queryStr)}
                            className="p-1.5 text-muted-foreground hover:text-accent shrink-0 border border-transparent hover:border-accent/30 bg-background/50 rounded-sm transition-all"
                            title="Copy Query"
                          >
                            {copiedQuery === queryStr ? (
                              <Check className="w-3 h-3 text-accent" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
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

        {/* Main Interface */}
        <div
          className={`flex flex-col gap-6 ${layoutMode === "wide" ? "lg:flex-row lg:items-stretch" : ""}`}
        >
          <div
            className={`${layoutMode === "wide" ? "lg:w-2/5" : "w-full"} flex flex-col`}
          >
            <SqlEditor
              onExecute={handleExecute}
              isLoading={status === "executing"}
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
