"use client";

import React from "react";
import { usePglite } from "@/hooks/use-pglite";
import { usePgliteActions } from "@/hooks/usePgliteActions";
import { SqlTerminalSection } from "@/components/organisms/SqlTerminalSection";
import { PageTransition } from "@/components/atoms/PageTransition";
import { ConfirmationModal } from "@/components/atoms/ConfirmationModal";
import { StatusCard } from "@/components/atoms/StatusCard";
import { PageHeader } from "@/components/molecules/PageHeader";
import { PostgresToolbar } from "@/components/molecules/PostgresToolbar";
import {
  Cpu,
  Database,
  HardDrive,
  ShieldAlert,
  Table as TableIcon,
} from "lucide-react";

/**
 * Organism: PostgresLabContent
 * Orchestrates the PostgreSQL Laboratory environment.
 */
export function PostgresLabContent() {
  const { status, error, exec } = usePglite();
  const {
    isPurgeModalOpen,
    setIsPurgeModalOpen,
    executePurge,
    handleExportFull,
  } = usePgliteActions({ exec });

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 py-8 md:py-12 max-w-6xl mx-auto">
        <PageHeader 
          title="SQL"
          accentText="LAB.EXE"
          tagText="DATA_STREAM // RDBMS_INSTANCE"
          tagIcon={Database}
          subtitle="Persistent PostgreSQL WASM Node"
        />
        <PostgresToolbar onPurge={() => setIsPurgeModalOpen(true)} />

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
