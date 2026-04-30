"use client";

import React from "react";
import { useDuckDb } from "@/hooks/use-duckdb";
import { useDuckDbActions } from "@/hooks/useDuckDbActions";
import { SqlTerminalSection } from "@/components/organisms/SqlTerminalSection";
import { PageTransition } from "@/components/atoms/PageTransition";
import { StatusCard } from "@/components/atoms/StatusCard";
import { PageHeader } from "@/components/molecules/PageHeader";
import { DuckDbToolbar } from "@/components/molecules/DuckDbToolbar";
import { VolumeDatasetManager } from "@/components/molecules/VolumeDatasetManager";
import { Cpu, Zap, Table as TableIcon, BarChart3 } from "lucide-react";

const AVAILABLE_DATASETS = ["bank_failures.parquet", "titanic.parquet", "userdata.parquet"];

/**
 * Organism: DuckDbLabContent
 * Orchestrates the DuckDB OLAP Node environment.
 */
export function DuckDbLabContent() {
  const { status, error, exec, registerFile } = useDuckDb();
  const {
    registeredFiles,
    copiedQuery,
    handleCopy,
    handleFileUpload,
    handleExportFull,
  } = useDuckDbActions({ registerFile, exec });

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 py-8 md:py-12 max-w-6xl mx-auto">
        <PageHeader 
          title="TELEMETRY"
          accentText="ANALYTICS.EXE"
          tagText="DATA_STREAM // OLAP_ENGINE"
          tagIcon={BarChart3}
          subtitle="OLAP engine for big data analysis exploration"
        />
        <DuckDbToolbar onFileUpload={handleFileUpload} />

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

        <VolumeDatasetManager 
          registeredFiles={registeredFiles}
          availableDatasets={AVAILABLE_DATASETS}
          onCopyQuery={handleCopy}
          copiedQuery={copiedQuery}
        />

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
