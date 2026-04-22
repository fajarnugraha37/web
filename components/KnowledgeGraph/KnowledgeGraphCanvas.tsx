"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Stars,
  MeshDistortMaterial,
  Line,
} from "@react-three/drei";
import * as THREE from "three";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from "d3-force-3d";
import { GraphData, GraphNode, GraphLink } from "@/lib/graph-utils";
import { useRouter } from "next/navigation";
import { ExternalLink, X } from "lucide-react";

const Node = ({
  node,
  isHovered,
  isSelected,
  onHover,
  onClick,
}: {
  node: GraphNode;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onClick: (e: any, id: string) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const active = isHovered || isSelected;

  return (
    <group position={[node.x || 0, node.y || 0, node.z || 0]}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          onHover(null);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => onClick(e, node.id)}
      >
        <sphereGeometry args={[active ? 1.5 : 0.8, 32, 32]} />
        <MeshDistortMaterial
          color={active ? (isSelected ? "#00d4ff" : "#ff00ff") : "#00ff88"}
          emissive={active ? (isSelected ? "#00d4ff" : "#ff00ff") : "#00ff88"}
          emissiveIntensity={active ? 2 : 0.5}
          distort={active ? 0.4 : 0.2}
          speed={active ? 4 : 2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {active && (
        <Html distanceFactor={15} position={[0, 2, 0]} zIndexRange={[100, 0]}>
          <div
            className={`bg-background/95 backdrop-blur-xl border-2 ${isSelected ? "border-accent-secondary shadow-[0_0_30px_rgba(0,212,255,0.4)]" : "border-accent shadow-[0_0_20px_rgba(0,255,136,0.3)]"} p-5 rounded-lg min-w-[280px] pointer-events-auto select-none cyber-chamfer transition-all duration-300 transform scale-110`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[10px] font-mono text-accent uppercase tracking-[0.2em] mb-1">
                  {isSelected ? "NODE_LOCKED" : "NODE_SIGNAL_DETECTED"}
                </div>
                <div className="text-lg font-black text-foreground leading-tight">
                  {node.title}
                </div>
              </div>
              {isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(e, node.id);
                  }}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <p className="text-xs font-mono text-muted-foreground leading-relaxed mb-4 line-clamp-3">
              {node.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {node.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono bg-accent/5 border border-accent/20 text-accent px-2 py-0.5 uppercase tracking-tighter"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <a
              href={`/web/blogs/${node.id}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent/10 border border-accent/40 text-accent text-[10px] font-bold font-mono uppercase hover:bg-accent hover:text-black transition-all group cyber-chamfer-sm"
            >
              <span>READ_LOG.EXE</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </Html>
      )}
    </group>
  );
};

const Link = ({ link }: { link: GraphLink }) => {
  const sourceNode = link.source as any as GraphNode;
  const targetNode = link.target as any as GraphNode;

  if (!sourceNode || !targetNode) return null;

  const points = [
    [sourceNode.x || 0, sourceNode.y || 0, sourceNode.z || 0],
    [targetNode.x || 0, targetNode.y || 0, targetNode.z || 0],
  ] as [number, number, number][];

  return (
    <Line
      points={points}
      color="#00d4ff"
      lineWidth={0.5}
      transparent
      opacity={0.15}
    />
  );
};

const Scene = ({ data }: { data: GraphData }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const router = useRouter();

  // Initialize simulation
  const { nodes, links } = useMemo(() => {
    return {
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    };
  }, [data]);

  useEffect(() => {
    const simulation = forceSimulation<GraphNode>(nodes, 3)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(30),
      )
      .force("charge", forceManyBody().strength(-150))
      .force("center", forceCenter(0, 0, 0))
      .on("tick", () => {
        setTick((t) => t + 1);
      });

    const timer = setTimeout(() => simulation.stop(), 5000);

    return () => {
      simulation.stop();
      clearTimeout(timer);
    };
  }, [nodes, links]);

  const handleNodeClick = useCallback(
    (e: any, id: string) => {
      e.stopPropagation();
      if (selectedNode === id) {
        setSelectedNode(null);
      } else {
        setSelectedNode(id);
      }
    },
    [selectedNode],
  );

  const handleMissClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />

      {/* Background click handler */}
      <mesh position={[0, 0, 0]} onClick={handleMissClick} visible={false}>
        <sphereGeometry args={[500, 32, 32]} />
      </mesh>

      <group>
        {links.map((link, i) => (
          <Link key={`link-${i}`} link={link} />
        ))}
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            isHovered={hoveredNode === node.id}
            isSelected={selectedNode === node.id}
            onHover={setHoveredNode}
            onClick={handleNodeClick}
          />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={20}
        maxDistance={200}
        autoRotate={!hoveredNode && !selectedNode}
        autoRotateSpeed={0.5}
        makeDefault
      />
    </>
  );
};

export const KnowledgeGraphCanvas = ({ data }: { data: GraphData }) => {
  return (
    <div className="w-full h-full min-h-[600px] bg-[#050505] rounded-xl border border-accent/20 relative overflow-hidden">
      {/* HUD Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#00ff88]" />
          <span className="text-[10px] font-mono text-accent uppercase tracking-[0.3em]">
            Article_Connections::Active
          </span>
        </div>
        <div className="text-xs font-mono text-muted-foreground/60 max-w-xs">
          Visualizing the interconnected web of blog posts. Each node represents
          an article; connections highlight related topics and shared concepts.
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 pointer-events-none text-right">
        <div className="text-[10px] font-mono text-accent-secondary uppercase tracking-widest">
          Controls
        </div>
        <div className="text-[8px] font-mono text-muted-foreground/40 mt-1">
          DRAG TO ROTATE // SCROLL TO ZOOM
          <br />
          CLICK NODE TO ACCESS DATA
        </div>
      </div>

      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 80]} fov={60} />
        <Scene data={data} />
      </Canvas>
    </div>
  );
};
