"use client";

import { useState } from "react";
import { usePglite } from "@/hooks/use-pglite";
import { SqlTerminalSection } from "@/components/organisms/SqlTerminalSection";
import { PageTransition } from "@/components/atoms/PageTransition";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import {
  Database,
  ShieldAlert,
  Cpu,
  HardDrive,
  Trash2,
  Table as TableIcon,
} from "lucide-react";

export default function PostgreSQLPlayground() {
  const { status, error, exec } = usePglite();
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);

  const executePurge = () => {
    const request = indexedDB.deleteDatabase("/pglite/sysop-db");
    request.onsuccess = () => {
      localStorage.removeItem("sysop_cmd_history");
      window.location.reload();
    };
    request.onerror = () => alert("Purge failed. Manual intervention required.");
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
      link.download = `pg_full_export_${new Date().getTime()}.csv`;
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
              onClick={() => setIsPurgeModalOpen(true)}
              className="p-2 border border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all cyber-chamfer-sm"
              title="System Purge"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

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
            value={status === "volatile" ? "VOLATILE (RAM)" : "PERSISTENT (IndexDB)"}
            color={status === "volatile" ? "text-accent-secondary" : "text-accent-tertiary"}
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

        <div className="mt-2 p-2 border border-border/30 bg-muted/5 cyber-chamfer-sm font-mono text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-accent-tertiary"># SYSTEM_TIP:</span> Try querying <code className="text-accent">system_control</code>, <code className="text-accent">net_nodes</code> or <code className="text-accent-secondary">SELECT * FROM generate_series(1, 50);</code>
        </div>

        <SqlTerminalSection 
          exec={exec} 
          status={status} 
          error={error} 
          accentColor="accent"
          onExportFull={handleExportFull}
        />
      </div>

      <ConfirmationModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirm={executePurge}
        title="CRITICAL_SYSTEM_PURGE"
        message="This operation will nuke the local database instance and clear all command history. This process is irreversible. Proceed?"
        confirmLabel="NUKE_DATABASE"
        variant="destructive"
      />
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
