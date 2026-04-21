import { Button } from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center py-20 relative">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent opacity-5 blur-[100px] rounded-full point-events-none" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent-secondary opacity-5 blur-[100px] rounded-full point-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 z-10">
            <div className="inline-block border border-border bg-card px-3 py-1 text-xs font-mono mb-2 cyber-chamfer-reverse text-accent-tertiary self-start">
              <span className="animate-blink mr-2">&gt;</span> SYSTEM.STATUS:
              ONLINE
            </div>

            <div className="relative">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none relative">
                <span className="relative z-10">
                  Hey, <br />
                  I&apos;m Fajar!
                </span>
                <span className="absolute top-0.5 left-0.5 text-[#ff00ff] opacity-40 z-0">
                  Hey, <br />
                  I&apos;m Fajar!
                </span>
                <span className="absolute -top-0.5 -left-0.5 text-[#00d4ff] opacity-40 z-0">
                  Hey, <br />
                  I&apos;m Fajar!
                </span>
              </h1>
              <div className="h-1 w-24 bg-accent mt-4 shadow-[0_0_15px_#00ff88]"></div>
            </div>

            <div className="max-w-md">
              <p className="text-lg text-foreground/80 leading-relaxed font-mono">
                A Software Engineer who builds and operates backend systems. My
                job is to keep production running, deliveries predictable, and
                scope honest.
                <span className="text-accent block mt-2">
                  Java / Nodejs / .NET / Go / AWS / k8s
                </span>
              </p>

              <div className="mt-8 flex items-center gap-4 text-xs font-bold font-sans">
                <span className="text-muted-foreground">STATUS:</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_5px_#00ff88]"></span>
                  SYSTEMS_OPERATIONAL
                </span>
              </div>

              <div className="mt-8 flex items-center gap-4 text-xs font-bold font-sans">
                <span className="text-muted-foreground gap-2">LOAD:</span>
                <span>42.42%</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <Button variant="glitch" size="lg" asChild className="group">
                <Link href="/about">EXECUTE_PROFILE.SH</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/blogs">READ_LOGS</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:col-span-5 lg:flex flex-col relative justify-center">
            <div className="bg-card border border-border p-1 relative shadow-2xl cyber-chamfer">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted mb-1">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-[10px] uppercase tracking-tighter opacity-50 font-sans">
                  User: dev_root
                </span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 space-y-4 text-sm font-mono text-foreground/80">
                <div className="flex items-start gap-3">
                  <span className="text-accent">&gt;</span>
                  <p className="text-accent/90">cat skills.json | grep core</p>
                </div>
                <div className="pl-6 space-y-2 text-foreground/70">
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>Language_Stack</span>
                    <span className="text-accent-tertiary">
                      Java / Nodejs / .NET / Go / AWS
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>Cloud</span>
                    <span className="text-accent-tertiary">AWS, K8s</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>Primary_Focus</span>
                    <span className="text-accent-secondary">
                      Backend, Cloud, Sometimes Frontend
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  <span className="text-accent">&gt;</span>
                  <p className="text-accent/90">./start_cluster.sh</p>
                </div>
                <div className="pl-6">
                  <span className="text-muted-foreground animate-pulse">
                    Running diagnostics... [OK]
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <span className="text-accent">&gt;</span>
                  <span className="w-2 h-5 bg-accent animate-pulse shadow-[0_0_5px_#00ff88]"></span>
                </div>
              </div>

              {/* Decorative Corner Accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-accent-secondary opacity-40"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-accent-secondary opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 border-t border-border relative">
        <div className="absolute inset-0 cyber-grid-bg opacity-50 -z-10 bg-repeat bg-center" />

        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold font-sans text-foreground">
            <span className="text-accent">01 //</span> CORE PARADIGMS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transform -skew-y-1">
          <div className="bg-card border border-border p-8 cyber-chamfer hover:-translate-y-2 transition-all duration-300 hover:border-accent hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] group relative">
            <div className="text-6xl font-black text-white/5 absolute right-4 top-4 group-hover:text-accent/10 transition-colors">
              01
            </div>
            <h3 className="text-xl font-bold mb-4 text-accent">
              CORRECTNESS BEFORE CLEVERNESS
            </h3>
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              Avoiding elegant solutions that obscure guarantees. Preferring
              explicit, sometimes verbose designs that make invariants,
              constraints, and failure behavior undeniable.
            </p>
          </div>
          <div className="bg-card border border-border p-8 cyber-chamfer hover:-translate-y-2 transition-all duration-300 hover:border-accent-secondary hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] group relative">
            <div className="text-6xl font-black text-white/5 absolute right-4 top-4 group-hover:text-accent-secondary/10 transition-colors">
              02
            </div>
            <h3 className="text-xl font-bold mb-4 text-accent-secondary">
              DETERMINISTIC BEHAVIOR
            </h3>
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              Building systems where outcomes are predictable under the same
              inputs. Minimizing hidden randomness through controlled
              concurrency, ordering guarantees, and reproducible execution paths
              across distributed components.
            </p>
          </div>
          <div className="bg-card border border-border p-8 cyber-chamfer hover:-translate-y-2 transition-all duration-300 hover:border-accent-tertiary hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] group relative">
            <div className="text-6xl font-black text-white/5 absolute right-4 top-4 group-hover:text-accent-tertiary/10 transition-colors">
              03
            </div>
            <h3 className="text-xl font-bold mb-4 text-accent-tertiary">
              SYSTEMS LIE UNTIL PROVEN OTHERWISE
            </h3>
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              Assuming every system is incorrect by default. Validating behavior
              through failure cases, edge conditions, and real execution paths
              instead of trusting design assumptions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-24">
          <div className="bg-card border border-border p-8 cyber-chamfer relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-4xl group-hover:opacity-20 transition-opacity">
              &lt;/&gt;
            </div>
            <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-3">
              <span className="w-2 h-2 bg-yellow-500"></span> 02 // TECHNICAL
              ARSENAL
            </h3>
            <div className="space-y-4 px-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  LANGUAGES
                </div>
                <div className="font-mono text-sm text-accent-tertiary">
                  Java, .NET, NodeJS, Go, Vue, Typescript
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  INFRASTRUCTURE
                </div>
                <div className="font-mono text-sm text-accent-secondary">
                  AWS, Kubernetes, Docker
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  DATABASES & QUEUES
                </div>
                <div className="font-mono text-sm text-accent">
                  OracleSQL, PostgreSQL, Redis, Kafka, RabbitMQ
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-8 cyber-chamfer relative overflow-hidden group">
            <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-3">
              <span className="w-2 h-2 bg-destructive animate-pulse"></span> 03
              {"//"} OPERATIONAL AXIOMS
            </h3>
            <ul className="space-y-3 px-3 font-mono text-sm">
              <li className="flex gap-2">
                <span className="text-accent">&gt;</span>
                <span className="text-foreground/80">
                  Firefighting doesn&apos;t scale, build systems that are boring
                  in production.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">&gt;</span>
                <span className="text-foreground/80">
                  Documentation is infrastructure, If it&apos;s not documented, it&apos;s
                  debt.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">&gt;</span>
                <span className="text-foreground/80">
                  Capacity must meet commitment, optimism is not a strategy.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">&gt;</span>
                <span className="text-foreground/80">
                  Ship safely over ship quickly, delivery without safety is
                  shipping problems.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
