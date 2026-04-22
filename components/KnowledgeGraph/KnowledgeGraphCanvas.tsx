"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  MeshWobbleMaterial,
  Grid,
} from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import * as THREE_LIB from "three";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from "d3-force-3d";
import { GraphData, GraphNode, GraphLink } from "@/lib/graph-utils";
import { useRouter } from "next/navigation";
import { ExternalLink, X, Zap } from "lucide-react";

const CP_YELLOW = "#fcee0a";
const CP_CYAN = "#00f0ff";
const CP_MAGENTA = "#ff003c";

// Single Node Component - Performance Optimized
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
  const groupRef = useRef<THREE_LIB.Group>(null);
  const active = isHovered || isSelected;

  // Manual update of position via ref to avoid React re-renders
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(node.x || 0, node.y || 0, node.z || 0);
    }
  });

  return (
    <group ref={groupRef}>
      {active && (
        <mesh>
          <icosahedronGeometry args={[2.5, 0]} />
          <meshBasicMaterial
            color={isSelected ? CP_CYAN : CP_YELLOW}
            transparent
            opacity={0.05}
            wireframe
          />
        </mesh>
      )}

      <mesh
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
        <icosahedronGeometry args={[active ? 3.0 : 1.6, 0]} />
        <MeshWobbleMaterial
          color={active ? (isSelected ? CP_CYAN : CP_YELLOW) : "#111"}
          emissive={active ? (isSelected ? CP_CYAN : CP_YELLOW) : CP_CYAN}
          emissiveIntensity={active ? 6 : 0.4}
          factor={active ? 0.4 : 0}
          speed={active ? 4 : 0}
        />
      </mesh>

      {active && (
        <Html distanceFactor={15} position={[0, 2, 0]} zIndexRange={[100, 0]}>
          <div
            className={`bg-[#050505]/95 backdrop-blur-xl border-t-4 ${isSelected ? "border-t-[#00f0ff] shadow-[0_0_40px_rgba(0,240,255,0.4)]" : "border-t-[#fcee0a] shadow-[0_0_30px_rgba(252,238,10,0.3)]"} p-6 min-w-[300px] pointer-events-auto select-none transition-all duration-300 transform scale-110 relative overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)",
            }}
          >
            <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <Zap
                className={`w-8 h-8 ${isSelected ? "text-[#00f0ff]" : "text-[#fcee0a]"}`}
              />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div
                    className={`text-[10px] font-mono ${isSelected ? "text-[#00f0ff]" : "text-[#fcee0a]"} uppercase tracking-[0.3em] mb-1 font-black animate-pulse`}
                  >
                    {isSelected ? "://DATA_LOCKED" : "://SIGNAL_FOUND"}
                  </div>
                  <div className="text-xl font-black text-white leading-tight tracking-tighter uppercase italic">
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
                    <X className="w-5 h-5 text-white/50" />
                  </button>
                )}
              </div>

              <p className="text-[11px] font-mono text-white/70 leading-relaxed mb-5 border-l-2 border-white/20 pl-3">
                {node.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {node.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[9px] font-mono font-black border ${isSelected ? "border-[#00f0ff]/40 text-[#00f0ff]" : "border-[#fcee0a]/40 text-[#fcee0a]"} px-2 py-0.5 uppercase tracking-tighter`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={`/web/blogs/${node.id}`}
                target="_blank"
                className={`flex items-center justify-center gap-3 w-full py-3 ${isSelected ? "bg-[#00f0ff] text-black" : "bg-[#fcee0a] text-black"} text-[11px] font-black font-mono uppercase hover:brightness-125 transition-all group`}
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%)",
                }}
              >
                <span>OPEN_ENCRYPTED_LOG</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Optimized Link Component with Electro-Flow effect
const Link = ({ link }: { link: GraphLink }) => {
  const lineRef = useRef<THREE_LIB.Line>(null);
  const geoRef = useRef<THREE_LIB.BufferGeometry>(null);
  const pulseRef = useRef<THREE_LIB.Mesh>(null);

  const [pulseData] = useState(() => ({
    progress: Math.random(),
    speed: 0.005 + Math.random() * 0.015,
  }));

  useFrame(() => {
    const source = link.source as any as GraphNode;
    const target = link.target as any as GraphNode;

    if (!source.x || !target.x) return;

    // Use performance.now() to avoid state.clock/THREE.Clock deprecation
    const time = performance.now() / 1000;

    if (lineRef.current && geoRef.current) {
      const posAttr = geoRef.current.attributes.position;
      const pa = posAttr.array as Float32Array;

      // High-frequency jitter for "electro" feel
      const jitter = Math.sin(time * 30 + Number(link.value)) * 0.05;

      pa[0] = source.x;
      pa[1] = source.y + jitter;
      pa[2] = source.z;
      pa[3] = target.x;
      pa[4] = target.y - jitter;
      pa[5] = target.z;

      posAttr.needsUpdate = true;
    }

    if (pulseRef.current) {
      pulseData.progress = (pulseData.progress + pulseData.speed) % 1;
      pulseRef.current.position.set(
        source.x + (target.x - source.x) * pulseData.progress,
        source.y + (target.y - source.y) * pulseData.progress,
        source.z + (target.z - source.z) * pulseData.progress,
      );

      // Pulse brightness oscillation
      const s = 0.5 + Math.sin(time * 10) * 0.2;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      <line ref={lineRef}>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array(6)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={CP_MAGENTA}
          transparent
          opacity={0.25}
          blending={THREE_LIB.AdditiveBlending}
        />
      </line>

      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.4, 4, 4]} />
        <meshBasicMaterial
          color={CP_CYAN}
          transparent
          opacity={0.6}
          blending={THREE_LIB.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

const Scene = ({ data }: { data: GraphData }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

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
          .distance(45),
      )
      .force("charge", forceManyBody().strength(-250))
      .force("center", forceCenter(0, 0, 0));

    const timer = setTimeout(() => simulation.stop(), 10000);
    return () => {
      simulation.stop();
      clearTimeout(timer);
    };
  }, [nodes, links]);

  const handleNodeClick = useCallback((e: any, id: string) => {
    e.stopPropagation();
    setSelectedNode((prev) => (prev === id ? null : id));
  }, []);

  const handleMissClick = useCallback(() => setSelectedNode(null), []);

  return (
    <>
      <color attach="background" args={["#030305"]} />

      <Grid
        position={[0, -50, 0]}
        infiniteGrid
        fadeDistance={120}
        fadeStrength={3}
        cellSize={10}
        sectionSize={50}
        sectionColor={CP_MAGENTA}
        cellColor="#111"
      />

      <ambientLight intensity={0.2} />
      <pointLight position={[20, 20, 20]} intensity={1.5} color={CP_CYAN} />
      <pointLight
        position={[-20, -20, -20]}
        intensity={1.5}
        color={CP_MAGENTA}
      />

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

      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
        />
        <Noise opacity={0.04} />
      </EffectComposer>

      <OrbitControls
        enablePan={false}
        minDistance={40}
        maxDistance={250}
        autoRotate={!hoveredNode && !selectedNode}
        autoRotateSpeed={0.5}
        makeDefault
      />

      <mesh position={[0, 0, 0]} onClick={handleMissClick} visible={false}>
        <sphereGeometry args={[500, 8, 8]} />
      </mesh>
    </>
  );
};

export const KnowledgeGraphCanvas = ({ data }: { data: GraphData }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className="w-full h-full min-h-[600px] bg-[#030305] rounded-xl border-2 border-[#ff003c]/10 flex items-center justify-center">
        <div className="text-accent font-mono text-xs animate-pulse tracking-[0.5em]">
          INIT_NEURAL_LINK...
        </div>
      </div>
    );

  return (
    <div className="w-full h-full min-h-[600px] md:min-h-[700px] bg-[#030305] rounded-xl border-2 border-[#ff003c]/10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-10">
        <div className="w-full h-1 bg-[#00f0ff] absolute top-0 animate-[scan_6s_linear_infinite] shadow-[0_0_15px_#00f0ff]" />
      </div>

      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-[#fcee0a] rotate-45 animate-pulse" />
          <span className="text-[10px] font-mono text-[#fcee0a] uppercase tracking-[0.3em] font-black text-shadow-glow">
            NET_RUNNER::ACTIVE
          </span>
        </div>
        <div className="text-[9px] font-mono text-[#00f0ff]/60 max-w-xs uppercase leading-tight">
          Mapping blog content network. [ SECURE LINK ESTABLISHED ]
        </div>
      </div>

      <Canvas
        dpr={1}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <PerspectiveCamera makeDefault position={[0, 30, 120]} fov={60} />
        <Scene data={data} />
      </Canvas>

      <style jsx global>{`
        @keyframes scan {
          from {
            top: -5%;
          }
          to {
            top: 105%;
          }
        }
        .text-shadow-glow {
          text-shadow: 0 0 10px rgba(252, 238, 10, 0.5);
        }
      `}</style>
    </div>
  );
};
