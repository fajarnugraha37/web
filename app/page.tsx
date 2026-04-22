import { Button } from "@/components/Button";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getSortedBlogsData } from "@/lib/mdx";
import { Database, BarChart3, ChevronRight, Terminal } from "lucide-react";

export default async function Home() {
  const recentBlogs = getSortedBlogsData().slice(0, 3);

  return (
    <div className="theme-sunset flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Solid Sunset Background to override global body theme */}
      <div className="fixed inset-0 bg-background -z-50 pointer-events-none" />
      {/* Sunset Vibe Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[-40] bg-gradient-to-t from-accent/5 via-accent-secondary/5 to-transparent" />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center py-10 md:py-20 relative">
        {/* Glow Orbs - Sunset Colors */}
        <div className="absolute top-1/4 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent opacity-10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-64 md:w-96 h-64 md:h-96 bg-accent-secondary opacity-10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 z-10 order-2 lg:order-1">
            <ScrollReveal direction="right">
              <div className="inline-block border border-border bg-card px-3 py-1 text-xs font-mono mb-2 cyber-chamfer-reverse text-accent-tertiary self-start shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                <span className="animate-blink mr-2">&gt;</span> SYSTEM.STATUS:
                ONLINE
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1} direction="right">
              <div className="relative">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none relative">
                  <span className="relative z-10 text-foreground">
                    Hey, <br />
                    I&apos;m Fajar!
                  </span>
                  <span className="absolute top-0.5 left-0.5 text-accent-secondary opacity-60 z-0">
                    Hey, <br />
                    I&apos;m Fajar!
                  </span>
                  <span className="absolute -top-0.5 -left-0.5 text-accent opacity-60 z-0">
                    Hey, <br />
                    I&apos;m Fajar!
                  </span>
                </h1>
                <div className="h-1 w-24 bg-accent mt-4 shadow-[0_0_15px_#ff7300]"></div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} direction="right">
              <div className="max-w-md">
                <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-mono">
                  A Software Engineer who builds and operates backend systems.
                  My job is to keep production running, deliveries predictable,
                  and scope honest.
                  <span className="text-accent block mt-2 drop-shadow-[0_0_5px_rgba(255,115,0,0.5)]">
                    Java / Node.js / Go / WASM / AWS
                  </span>
                </p>

                <div className="mt-8 flex items-center gap-4 text-xs font-bold font-sans">
                  <span className="text-muted-foreground">STATUS:</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_5px_#ff7300]"></span>
                    SYSTEMS_OPERATIONAL
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs font-bold font-sans">
                  <span className="text-muted-foreground gap-2">LOAD:</span>
                  <span className="text-accent-tertiary">42.42%</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3} direction="right">
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
                <Button
                  variant="glitch"
                  size="lg"
                  asChild
                  className="group w-full sm:w-auto text-center justify-center"
                >
                  <Link href="/labs">ACCESS_LABS.EXE</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto text-center justify-center hover:border-accent-secondary hover:text-accent-secondary hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                >
                  <Link href="/blogs">READ_LOGS</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>

          <div className="col-span-1 lg:col-span-5 flex flex-col relative justify-center order-1 lg:order-2 w-full max-w-lg mx-auto lg:max-w-none">
            <ScrollReveal delay={0.4} direction="left">
              <div className="bg-card border border-border p-1 relative shadow-[0_10px_40px_rgba(255,115,0,0.15)] cyber-chamfer">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-muted mb-1 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-destructive/70"></div>
                    <div className="w-2 h-2 rounded-full bg-accent-tertiary/70"></div>
                    <div className="w-2 h-2 rounded-full bg-accent/70"></div>
                  </div>
                  <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-sans">
                    Terminal // dev_root
                  </span>
                </div>

                {/* Terminal Content */}
                <div className="p-4 md:p-6 space-y-4 text-xs md:text-sm font-mono text-foreground/80 overflow-x-hidden">
                  <div className="flex items-start gap-3">
                    <span className="text-accent">&gt;</span>
                    <p className="text-accent/90 break-all">
                      cat telemetry.json | grep engine
                    </p>
                  </div>
                  <div className="pl-6 space-y-2 text-foreground/70">
                    <div className="flex justify-between border-b border-border pb-1">
                      <span>SQL_Engine</span>
                      <span className="text-accent-tertiary">
                        PostgreSQL (PGlite WASM)
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-1">
                      <span>OLAP_Engine</span>
                      <span className="text-accent-secondary">
                        DuckDB-WASM (In-Memory)
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-1">
                      <span>Primary_Focus</span>
                      <span className="text-accent">
                        Data Systems, Backend, Edge
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mt-4">
                    <span className="text-accent">&gt;</span>
                    <p className="text-accent/90 break-all">
                      ./mount_volumes.sh --force
                    </p>
                  </div>
                  <div className="pl-6">
                    <span className="text-muted-foreground animate-pulse">
                      Mounting virtual filesystems... [OK]
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-accent">&gt;</span>
                    <span className="w-2 h-4 md:h-5 bg-accent animate-pulse shadow-[0_0_5px_#ff7300]"></span>
                  </div>
                </div>

                {/* Decorative Corner Accents */}
                {/* <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent-secondary opacity-60 shadow-[0_0_10px_#ff007f]"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent opacity-60 shadow-[0_0_10px_#ff7300]"></div> */}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Hardware Nodes Section */}
      <section className="py-16 md:py-24 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background -z-10 pointer-events-none opacity-25" />

        <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground flex items-center gap-4">
              <span className="text-accent drop-shadow-[0_0_5px_#ff7300]">
                01 //
              </span>{" "}
              HARDWARE NODES
            </h2>
            <Link
              href="/labs"
              className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-accent transition-colors"
            >
              [VIEW_ALL_MODULES] <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollReveal delay={0.1} direction="left">
            <Link
              href="/labs/postgresql"
              className="group flex flex-col p-6 border border-border bg-card/80 backdrop-blur-sm cyber-chamfer hover:border-accent hover:shadow-[0_0_20px_rgba(255,115,0,0.15)] transition-all relative overflow-hidden h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-muted/30 border border-border group-hover:border-accent/40 text-accent transition-colors">
                  <Database className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end font-mono text-[10px] uppercase">
                  <span className="text-muted-foreground">NODE_STATUS</span>
                  <span className="text-accent animate-pulse">[ONLINE]</span>
                </div>
              </div>
              <h3 className="text-2xl font-black mb-2 text-foreground group-hover:text-accent transition-colors">
                SQL LAB.EXE
              </h3>
              <p className="text-sm font-mono text-muted-foreground mb-6">
                Persistent PostgreSQL WASM Node. Fully ACID compliant relational
                database running directly in your browser.
              </p>
              <div className="mt-auto flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-accent opacity-80 group-hover:opacity-100 transition-opacity">
                <span>CONNECT_NODE</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.2} direction="right">
            <Link
              href="/labs/duckdb"
              className="group flex flex-col p-6 border border-border bg-card/80 backdrop-blur-sm cyber-chamfer hover:border-accent-secondary hover:shadow-[0_0_20px_rgba(255,0,127,0.15)] transition-all relative overflow-hidden h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-muted/30 border border-border group-hover:border-accent-secondary/40 text-accent-secondary transition-colors">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end font-mono text-[10px] uppercase">
                  <span className="text-muted-foreground">NODE_STATUS</span>
                  <span className="text-accent-secondary animate-pulse">
                    [STREAMING]
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-black mb-2 text-foreground group-hover:text-accent-secondary transition-colors">
                TELEMETRY ANALYTICS.EXE
              </h3>
              <p className="text-sm font-mono text-muted-foreground mb-6">
                High-speed OLAP engine powered by DuckDB-WASM. Drop massive
                CSV/Parquet files and query them with zero latency.
              </p>
              <div className="mt-auto flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-accent-secondary opacity-80 group-hover:opacity-100 transition-opacity">
                <span>CONNECT_NODE</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </ScrollReveal>
        </div>
        <div className="mt-6 md:hidden flex justify-center">
          <Link
            href="/labs"
            className="flex items-center gap-2 text-xs font-mono text-accent hover:text-white transition-colors"
          >
            [VIEW_ALL_MODULES] <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Core Paradigms Section */}
      <section className="py-16 md:py-24 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-30 -z-10 bg-repeat bg-center" />

        {/* Sunset Glow Overlay for Section */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent-secondary/5 to-background -z-10 pointer-events-none opacity-25" />

        <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground">
              <span className="text-accent drop-shadow-[0_0_5px_#ff7300]">
                02 //
              </span>{" "}
              CORE PARADIGMS
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:transform lg:-skew-y-1">
          <ScrollReveal delay={0.1} direction="up">
            <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer hover:-translate-y-2 transition-all duration-300 hover:border-accent hover:shadow-[0_0_20px_rgba(255,115,0,0.3)] group relative h-full">
              <div className="text-5xl md:text-6xl font-black text-white/5 absolute right-4 top-4 group-hover:text-accent/10 transition-colors">
                01
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-4 text-accent drop-shadow-[0_0_5px_rgba(255,115,0,0.5)]">
                CORRECTNESS BEFORE CLEVERNESS
              </h3>
              <p className="text-xs md:text-sm font-mono text-muted-foreground leading-relaxed relative z-10">
                Avoiding elegant solutions that obscure guarantees. Preferring
                explicit, sometimes verbose designs that make invariants,
                constraints, and failure behavior undeniable.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2} direction="up">
            <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer hover:-translate-y-2 transition-all duration-300 hover:border-accent-secondary hover:shadow-[0_0_20px_rgba(255,0,127,0.3)] group relative h-full">
              <div className="text-5xl md:text-6xl font-black text-white/5 absolute right-4 top-4 group-hover:text-accent-secondary/10 transition-colors">
                02
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-4 text-accent-secondary drop-shadow-[0_0_5px_rgba(255,0,127,0.5)]">
                DETERMINISTIC BEHAVIOR
              </h3>
              <p className="text-xs md:text-sm font-mono text-muted-foreground leading-relaxed relative z-10">
                Building systems where outcomes are predictable under the same
                inputs. Minimizing hidden randomness through controlled
                concurrency, ordering guarantees, and reproducible execution
                paths.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3} direction="up">
            <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer hover:-translate-y-2 transition-all duration-300 hover:border-accent-tertiary hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] group relative h-full">
              <div className="text-5xl md:text-6xl font-black text-white/5 absolute right-4 top-4 group-hover:text-accent-tertiary/10 transition-colors">
                03
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-4 text-accent-tertiary drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
                SYSTEMS LIE UNTIL PROVEN OTHERWISE
              </h3>
              <p className="text-xs md:text-sm font-mono text-muted-foreground leading-relaxed relative z-10">
                Assuming every system is incorrect by default. Validating
                behavior through failure cases, edge conditions, and real
                execution paths instead of trusting design assumptions.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 md:mt-24">
          <ScrollReveal delay={0.1} direction="right">
            <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer relative overflow-hidden group h-full transition-all duration-300 hover:border-accent-tertiary/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]">
              {/* Animated scanning bar on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-accent-tertiary opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

              <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-4xl group-hover:opacity-30 group-hover:text-accent-tertiary transition-all duration-500 pointer-events-none">
                &lt;/&gt;
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-foreground flex items-center gap-3 group-hover:text-accent-tertiary transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]">
                <span className="w-2 h-2 bg-accent-tertiary group-hover:animate-pulse shadow-[0_0_5px_#ffd700]"></span>{" "}
                03 // TECHNICAL ARSENAL
              </h3>
              <div className="space-y-5 px-1 md:px-3 relative z-10">
                <div className="group/item">
                  <div className="text-[10px] md:text-xs text-muted-foreground mb-1 group-hover/item:text-accent-tertiary/70 transition-colors font-sans font-bold tracking-widest">
                    LANGUAGES & COMPUTE
                  </div>
                  <div className="font-mono text-xs md:text-sm text-accent-tertiary group-hover:brightness-125 transition-all">
                    Java, Go, TypeScript, WebAssembly (WASM)
                  </div>
                </div>
                <div className="group/item">
                  <div className="text-[10px] md:text-xs text-muted-foreground mb-1 group-hover/item:text-accent-secondary/70 transition-colors font-sans font-bold tracking-widest">
                    INFRASTRUCTURE & EDGE
                  </div>
                  <div className="font-mono text-xs md:text-sm text-accent-secondary group-hover:brightness-125 transition-all">
                    AWS, Kubernetes, Docker, Edge Functions
                  </div>
                </div>
                <div className="group/item">
                  <div className="text-[10px] md:text-xs text-muted-foreground mb-1 group-hover/item:text-accent/70 transition-colors font-sans font-bold tracking-widest">
                    DATABASES & ANALYTICS
                  </div>
                  <div className="font-mono text-xs md:text-sm text-accent group-hover:brightness-125 transition-all">
                    PostgreSQL, DuckDB, Redis, Kafka, RabbitMQ
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} direction="left">
            <div className="bg-card/80 backdrop-blur-sm border border-border p-6 md:p-8 cyber-chamfer relative overflow-hidden group h-full transition-all duration-300 hover:border-destructive/50 hover:shadow-[0_0_30px_rgba(255,51,51,0.2)]">
              {/* Animated scanning bar on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-destructive opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

              <h3 className="text-xl md:text-2xl font-bold mb-6 text-foreground flex items-center gap-3 group-hover:text-destructive transition-colors drop-shadow-[0_0_5px_rgba(255,51,51,0.3)]">
                <span className="w-2 h-2 bg-destructive animate-pulse shadow-[0_0_8px_#ff3333]"></span>{" "}
                04
                {"//"} OPERATIONAL AXIOMS
              </h3>
              <ul className="space-y-4 px-1 md:px-3 font-mono text-xs md:text-sm relative z-10">
                {[
                  "Firefighting doesn't scale. Build systems that are boring in production.",
                  "Documentation is infrastructure. If it's not documented, it's debt.",
                  "Capacity must meet commitment. Optimism is not a strategy.",
                  "Ship safely over ship quickly. Delivery without safety is shipping problems.",
                ].map((axiom, i) => (
                  <li key={i} className="flex gap-3 group/li items-start">
                    <span className="text-accent group-hover:text-destructive transition-colors mt-0.5">
                      &gt;
                    </span>
                    <span className="text-foreground/80 group-hover:text-foreground transition-colors group-hover/li:translate-x-1 transition-transform">
                      {axiom}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Decorative background text */}
              <div className="absolute -bottom-4 right-0 font-black text-6xl text-white/[0.02] pointer-events-none uppercase italic group-hover:text-destructive/[0.05] transition-colors">
                RULES
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Recent Transmissions (Blogs) */}
      <section className="py-16 md:py-24 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent-tertiary/5 to-background -z-10 pointer-events-none opacity-25" />

        <ScrollReveal direction="up">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground flex items-center gap-4">
              <span className="text-accent-tertiary drop-shadow-[0_0_5px_#ffd700]">
                05 //
              </span>{" "}
              RECENT TRANSMISSIONS
            </h2>
            <Link
              href="/blogs"
              className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-accent-tertiary transition-colors"
            >
              [VIEW_ALL_LOGS] <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4">
          {recentBlogs.map((blog, idx) => (
            <ScrollReveal
              key={blog.slug}
              delay={0.1 * (idx + 1)}
              direction="up"
            >
              <Link
                href={`/blogs/${blog.slug}`}
                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 md:p-6 border border-border bg-card/50 hover:bg-card hover:border-accent-tertiary/50 transition-all cyber-chamfer-sm"
              >
                <div className="flex flex-col md:w-48 shrink-0">
                  <span className="font-mono text-xs text-muted-foreground group-hover:text-accent-tertiary transition-colors">
                    {new Date(blog.date).toISOString().split("T")[0]}
                  </span>
                  <div className="flex gap-2 mt-2 md:mt-4 flex-wrap">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-muted/50 border border-border text-[9px] font-mono uppercase text-muted-foreground group-hover:border-accent-tertiary/30 group-hover:text-accent-tertiary/80 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-accent-tertiary transition-colors mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm font-mono text-muted-foreground line-clamp-2">
                    {blog.description}
                  </p>
                </div>
                <div className="hidden md:flex shrink-0 p-3 border border-border group-hover:border-accent-tertiary group-hover:bg-accent-tertiary/10 transition-all">
                  <Terminal className="w-5 h-5 text-muted-foreground group-hover:text-accent-tertiary" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-6 md:hidden flex justify-center">
          <Link
            href="/blogs"
            className="flex items-center gap-2 text-xs font-mono text-accent-tertiary hover:text-white transition-colors"
          >
            [VIEW_ALL_LOGS] <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
