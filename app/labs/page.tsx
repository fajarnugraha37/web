"use client";

import { PageTransition } from "@/components/PageTransition";
import Link from "next/link";
import { Database, BarChart3, ChevronRight, Binary } from "lucide-react";

const LAB_NODES = [
  {
    id: "postgresql",
    name: "SQL LAB.EXE",
    description:
      "Persistent PostgreSQL WASM Node for relational database exploration.",
    icon: <Database className="w-8 h-8" />,
    path: "/labs/postgresql",
    status: "✔",
    color: "text-accent",
  },
  {
    id: "duckdb",
    name: "TELEMETRY ANALYTICS.EXE",
    description: "OLAP engine (DuckDB) for big data analysis exploration.",
    icon: <BarChart3 className="w-8 h-8" />,
    path: "/labs/duckdb",
    status: "✔",
    color: "text-accent-secondary",
  },
  {
    id: "knowledge-graph",
    name: "BLOG NETWORK.EXE",
    description:
      "Interactive 3D visualization of how articles in the blog archive relate to each other.",
    icon: <Binary className="w-8 h-8" />,
    path: "/labs/knowledge-graph",
    status: "✔",
    color: "text-accent-tertiary",
  },
  {
    id: "markdown",
    name: "MARKDOWN.EXE",
    description: "Live Markdown editor with split-pane preview and terminal aesthetics.",
    icon: <Binary className="w-8 h-8" />,
    path: "/labs/markdown",
    status: "✔",
    color: "text-accent",
  },
];

export default function LabsDashboard() {
  return (
    <PageTransition>
      <div className="flex flex-col gap-8 py-12 max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="space-y-2 border-b border-border pb-8">
          <div className="flex items-center gap-3">
            <Binary className="w-6 h-6 text-accent" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
              LABORATORY <span className="text-accent">DASHBOARD</span>
            </h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-[0.3em]">
            Select an active node to begin
          </p>
        </div>

        {/* System Warning */}
        <div className="p-6 border border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-3 text-destructive mb-2">
            <span className="text-xl font-bold animate-pulse">⚠</span>
            <h3 className="font-mono text-xs font-black tracking-widest uppercase">
              System Warning
            </h3>
          </div>
          <p className="text-[10px] font-mono text-destructive/80 leading-relaxed uppercase">
            All computation is performed strictly in the visitor's local browser
            context. Data persistence is managed via IndexedDB. Clearing browser
            storage will result in permanent data loss. No sensitive data is
            transmitted to the core server.
          </p>
        </div>

        {/* Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LAB_NODES.map((node) => (
            <Link
              key={node.id}
              href={node.path}
              className="group relative flex flex-col p-6 border border-border bg-card/30 hover:border-accent/50 transition-all cyber-chamfer overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 bg-muted/20 border border-border group-hover:border-accent/30 transition-colors ${node.color}`}
                >
                  {node.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                    NODE_STATUS
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold ${node.status === "ONLINE" ? "text-accent" : "text-accent-secondary"} animate-pulse`}
                  >
                    [{node.status}]
                  </span>
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <h2 className="text-2xl font-black tracking-tight group-hover:text-accent transition-colors">
                  {node.name}
                </h2>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed h-12 overflow-hidden line-clamp-3">
                  {node.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] group-hover:text-accent transition-colors">
                <span>Access Node</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* HUD Accents */}
              <div className="absolute top-0 right-0 w-px h-12 bg-gradient-to-b from-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-24 h-px bg-gradient-to-r from-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
