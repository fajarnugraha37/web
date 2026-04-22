import React from "react";
import { PageTransition } from "@/components/PageTransition";
import { KnowledgeGraphCanvas } from "@/components/KnowledgeGraph/KnowledgeGraphCanvas";
import relations from "@/public/relations.json";
import searchIndex from "@/public/search-index.json";
import { transformDataToGraph } from "@/lib/graph-utils";
import Link from "next/link";
import { ChevronLeft, Info, Activity, Database, Share2 } from "lucide-react";

export default function KnowledgeGraphPage() {
  const graphData = transformDataToGraph(relations, searchIndex);

  return (
    <PageTransition>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Breadcrumb / Top HUD */}
        <div className="flex items-center justify-between mb-8 mt-8 ">
          <Link
            href="/labs"
            className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-all group"
          >
            <div className="mr-3 p-1 border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-black transition-all cyber-chamfer-sm">
              <ChevronLeft className="w-3 h-3" />
            </div>
            <span>RETURN_TO_LABS</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-3 py-1 uppercase tracking-wider shadow-[0_0_10px_rgba(var(--accent-secondary-rgb),0.1)]">
              <Activity className="w-3 h-3" />
              <span>ARTICLE_RELATIONSHIP_MAP</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground bg-muted/20 border border-border px-3 py-1">
              [ INDEXED_ARTICLES: {graphData.nodes.length} ]
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 flex-1">
          {/* Main Visualizer */}
          <div className="relative h-[600px] lg:h-auto min-h-[500px]">
            <KnowledgeGraphCanvas data={graphData} />
          </div>

          {/* Side Info Panel */}
          <aside className="space-y-6">
            <div className="bg-card/30 border border-border p-5 relative group overflow-hidden">
              <div className="absolute inset-0 cyber-grid-bg opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="relative z-10">
                <h3 className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest mb-4">
                  <Database className="w-4 h-4" />[ CONTENT_NETWORK ]
                </h3>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed mb-4">
                  Explore how blog posts connect through shared themes and
                  technical concepts. This 3D graph maps articles as nodes, with
                  lines indicating semantic relationships and similarity scores.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-mono border-b border-border/50 pb-1">
                    <span className="text-muted-foreground">ENGINE</span>
                    <span className="text-foreground">D3-FORCE-3D</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono border-b border-border/50 pb-1">
                    <span className="text-muted-foreground">RENDERER</span>
                    <span className="text-foreground">THREE.JS / R3F</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono border-b border-border/50 pb-1">
                    <span className="text-muted-foreground">VERSION</span>
                    <span className="text-foreground">v2.0.77</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/20 border border-border/50 p-5 rounded-md">
              <h3 className="flex items-center gap-2 text-xs font-bold text-accent-tertiary uppercase tracking-widest mb-4">
                <Info className="w-4 h-4" />
                SYSTEM_LOG
              </h3>
              <div className="space-y-3 font-mono text-[9px]">
                <div className="flex gap-2">
                  <span className="text-accent/60">[06:12:04]</span>
                  <span className="text-muted-foreground">
                    Mapping blog content network...
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent/60">[06:12:05]</span>
                  <span className="text-foreground">
                    Pulling article metadata.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent/60">[06:12:06]</span>
                  <span className="text-foreground">
                    Correlating relational connections.
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent/60">[06:12:07]</span>
                  <span className="text-accent">
                    READY: Content graph accessible.
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 p-4">
              <div className="flex items-center gap-3 mb-2 text-accent">
                <Share2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  Export Sequence
                </span>
              </div>
              <p className="text-[9px] font-mono text-muted-foreground mb-3">
                Download relational data for offline processing.
              </p>
              <button className="w-full py-2 bg-accent/10 border border-accent/30 text-accent text-[9px] font-mono uppercase hover:bg-accent hover:text-black transition-all">
                INITIATE_DATA_DUMP
              </button>
            </div>
          </aside>
        </div>

        {/* Ambient background glows */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/4 right-0 w-[40vw] h-[40vh] bg-accent/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 left-0 w-[40vw] h-[40vh] bg-accent-secondary/5 blur-[120px] rounded-full" />
        </div>
      </div>
    </PageTransition>
  );
}
