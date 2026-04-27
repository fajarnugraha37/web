"use client";

import { useState } from "react";
import { useDuckDb } from "@/hooks/use-duckdb";
import { SqlTerminalSection } from "@/components/organisms/SqlTerminalSection";
import { PageTransition } from "@/components/atoms/PageTransition";
import {
  BarChart3,
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
  const [registeredFiles, setRegisteredFiles] = useState<string[]>([]);
  const [isVolumesOpen, setIsVolumesOpen] = useState(true);
  const [isDatasetsOpen, setIsDatasetsOpen] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(text);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        const name = await registerFile(file);
        setRegisteredFiles((prev) => [...new Set([...prev, name])]);
      } catch (err: any) {
        console.error("File registration failed", err);
      }
    }
  };

  const handleExportFull = async (query: string) => {
    try {
      const res = await exec(query);
      if (!res.rows || res.rows.length === 0) return;
      
      const headers = Object.keys(res.rows[0]);
      const csvContent = [
        headers.join(','),
        ...res.rows.map((row: any) => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `duckdb_full_export_${new Date().getTime()}.csv`;
      link.click();
    } catch (err) {
      console.error("Full export failed", err);
      alert("Failed to export full result set.");
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 py-8 md:py-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-accent-secondary" />
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                TELEMETRY ANALYTICS<span className="text-accent-secondary">.EXE</span>
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
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusCard
            icon={<Cpu className="w-4 h-4" />}
            label="ENGINE_STATUS"
            value={status === "initializing" ? "BOOTING..." : status.toUpperCase()}
            color={status === "error" ? "text-destructive" : "text-accent-secondary"}
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
            value="STDBY"
            color="text-accent-secondary"
          />
        </div>

        <div className="mt-4 p-4 border border-border/30 bg-muted/5 font-mono text-[10px] text-muted-foreground leading-relaxed flex flex-col gap-2">
          <div>
            <span className="text-accent-tertiary"># ANALYTICS_TIP:</span> Drag and drop CSV/Parquet files. They are registered as virtual tables. Then use: <code className="text-accent">SELECT * FROM {"'<file-name>'"};</code>
          </div>

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
                      <li key={f} className="text-accent/80 ml-2 before:content-['>_'] before:mr-2">'{f}'</li>
                    ))}
                  </ul>
                ) : (
                  <span className="opacity-50 italic pl-2">None mounted. Drag & drop files to ingest.</span>
                )}
              </div>
            )}
          </div>

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
                  {["bank_failures.parquet", "titanic.parquet", "userdata.parquet"].map((dataset) => {
                    const queryStr = `SELECT * FROM 'https://fajarnugraha37.github.io/web/datasets/${dataset}';`;
                    return (
                      <li key={dataset} className="flex flex-col gap-1 p-2 bg-muted/10 border border-border/30 group">
                        <div className="flex justify-between items-start gap-2">
                          <code className="text-accent text-[9px] break-all leading-tight mt-1">{queryStr}</code>
                          <button onClick={() => handleCopy(queryStr)} className="p-1.5 text-muted-foreground hover:text-accent border border-transparent hover:border-accent/30 bg-background/50 rounded-sm transition-all">
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

        <SqlTerminalSection 
          exec={exec} 
          status={status} 
          error={error} 
          accentColor="accent-secondary"
          onExportFull={handleExportFull}
        />
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
      <div className={`font-mono text-xs font-black uppercase tracking-wider ${color} ${loading ? "animate-pulse" : ""}`}>
        {value}
      </div>
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
      <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
