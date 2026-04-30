"use client";

import React from "react";
import { PageTransition } from "@/components/atoms/PageTransition";
import { PageHeader } from "@/components/molecules/PageHeader";
import { LabNodeCard } from "@/components/molecules/LabNodeCard";
import { Database, BarChart3, Binary, FileText, Film } from "lucide-react";

const LAB_NODES = [
  {
    id: "postgresql",
    name: "SQL LAB.EXE",
    description: "Persistent PostgreSQL WASM Node for relational database exploration.",
    icon: <Database className="w-8 h-8" />,
    path: "/labs/postgresql",
    status: "ONLINE",
    color: "text-accent",
  },
  {
    id: "duckdb",
    name: "TELEMETRY ANALYTICS.EXE",
    description: "OLAP engine (DuckDB) for big data analysis exploration.",
    icon: <BarChart3 className="w-8 h-8" />,
    path: "/labs/duckdb",
    status: "STREAMING",
    color: "text-accent-secondary",
  },
  {
    id: "knowledge-graph",
    name: "BLOG NETWORKS.EXE",
    description: "Interactive 3D visualization of semantic relationships within the blog archive.",
    icon: <Binary className="w-8 h-8" />,
    path: "/labs/knowledge-graph",
    status: "ACTIVE",
    color: "text-accent-tertiary",
  },
  {
    id: "markdown",
    name: "MARKDOWN PLAYGROUND.EXE",
    description: "Live Markdown editor with split-pane preview and terminal aesthetics.",
    icon: <FileText className="w-8 h-8" />,
    path: "/labs/markdown",
    status: "READY",
    color: "text-accent",
  },
  {
    id: "ffmpeg",
    name: "MEDIA PROCESSOR.EXE",
    description: "High-performance client-side media transcoding and signal processing using FFmpeg WASM.",
    icon: <Film className="w-8 h-8" />,
    path: "/labs/ffmpeg",
    status: "STANDBY",
    color: "text-accent-secondary",
  },
  {
    id: "translate",
    name: "TRANSLATION PLAYGROUND.EXE",
    description: "Client-side offline neural machine translation using transformers.js.",
    icon: <FileText className="w-8 h-8" />, // Reusing FileText for now, you could also use something else if imported
    path: "/labs/translate",
    status: "STANDBY",
    color: "text-accent-tertiary",
  },
];

/**
 * Organism: LabsDashboardContent
 * Orchestrates the full layout of the Laboratory Dashboard.
 */
export function LabsDashboardContent() {
  return (
    <PageTransition>
      <div className="flex flex-col gap-8 py-12 max-w-5xl mx-auto px-4">
        {/* Header */}
        <PageHeader 
          title="LABORATORY"
          accentText="DASHBOARD"
          tagText="SYSTEM_CORE // MODULE_SELECTION"
          tagIcon={Binary}
          subtitle="Select an active node to begin"
        />

        {/* System Warning */}
        <div className="p-6 border border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-3 text-destructive mb-2">
            <span className="text-xl font-bold animate-pulse">⚠</span>
            <h3 className="font-mono text-xs font-black tracking-widest uppercase">System Warning</h3>
          </div>
          <p className="text-[10px] font-mono text-destructive/80 leading-relaxed uppercase">
            All computation is performed strictly in the visitor&apos;s local browser context. Data persistence is managed via IndexedDB. No sensitive data is transmitted to the core server.
          </p>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LAB_NODES.map((node) => (
            <LabNodeCard key={node.id} node={node} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
