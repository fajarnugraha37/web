import Link from "next/link";
import { Terminal, Mail } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background/80 backdrop-blur-md mt-auto z-40 overflow-hidden py-12 pb-8">
      {/* Decorative top border line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-block font-sans font-black text-2xl text-foreground tracking-tighter cyber-glitch-text"
              data-text="SYS//OP"
            >
              SYS//OP
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Personal neural-archive and portfolio node. Logging past gigs,
              current ops, and raw brain-dumps.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono mt-4">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
              <span className="text-accent">SYSTEM.ONLINE</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-bold tracking-widest text-foreground uppercase border-b border-border/50 pb-2 inline-block">
              /Directory
            </h3>
            <ul className="space-y-2 text-sm font-mono flex flex-col">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">
                    &gt;
                  </span>{" "}
                  / (Root)
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">
                    &gt;
                  </span>{" "}
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-accent-secondary transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-accent-secondary transition-opacity">
                    &gt;
                  </span>{" "}
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/labs"
                  className="text-muted-foreground hover:text-accent-tertiary transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-accent-tertiary transition-opacity">
                    &gt;
                  </span>{" "}
                  Laboratory
                </Link>
              </li>
              <li>
                <Link
                  href="/feed.xml"
                  prefetch={false}
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-accent transition-opacity">
                    &gt;
                  </span>{" "}
                  RSS Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="text-muted-foreground hover:text-accent-tertiary transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-accent-tertiary transition-opacity">
                    &gt;
                  </span>{" "}
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h3 className="font-sans text-sm font-bold tracking-widest text-foreground uppercase border-b border-border/50 pb-2 inline-block">
              /Active_Nodes
            </h3>
            <ul className="space-y-2 text-sm font-mono flex flex-col">
              <li>
                <Link
                  href="/labs/postgresql"
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  SQL_LAB.EXE
                </Link>
              </li>
              <li>
                <Link
                  href="/labs/duckdb"
                  className="text-muted-foreground hover:text-accent-secondary transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary" />
                  TELEMETRY_ANALYTICS.EXE
                </Link>
              </li>
              <li>
                <Link
                  href="/labs/knowledge-graph"
                  className="text-muted-foreground hover:text-accent-tertiary transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-tertiary" />
                  NEURAL_MAPPING.EXE
                </Link>
              </li>
            </ul>

            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/30">
              <a
                href="https://github.com/fajarnugraha37"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 border border-border bg-card/50 cyber-chamfer-sm hover:border-accent hover:text-accent transition-all glow-btn group"
              >
                <GithubIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://www.linkedin.com/in/fajar-abdi-nugraha-81b26618a/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2 border border-border bg-card/50 cyber-chamfer-sm hover:border-accent-tertiary hover:text-accent-tertiary transition-all glow-btn-secondary group"
              >
                <LinkedinIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="mailto:nugrahafajar37@gmail.com"
                aria-label="Email"
                className="p-2 border border-border bg-card/50 cyber-chamfer-sm hover:border-destructive hover:text-destructive transition-all group hover:shadow-[0_0_10px_rgba(255,51,102,0.4)]"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>

            {/* Terminal decorative block */}
            <div className="mt-6 border border-border/40 bg-black/40 p-3 cyber-chamfer-sm font-mono text-[10px] text-muted-foreground/60 w-full overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-tertiary/20" />
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="w-3 h-3 text-accent/50" />
                <span className="text-accent/50">sys_log</span>
              </div>
              <p className="truncate opacity-50">&gt; encrypting packets...</p>
              <p className="truncate opacity-50">
                &gt; establishing secure link
              </p>
              <p className="truncate opacity-50 text-accent/70 animate-pulse">
                &gt; connection established_
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground">
          <p>© {new Date().getFullYear()} SYS//OP. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-accent cursor-crosshair transition-colors">
              V 1.0.4
            </span>
            <span className="text-border">|</span>
            <span className="hover:text-accent-tertiary cursor-crosshair transition-colors">
              NET_PROTOCOL: OP_SEC
            </span>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-accent/20 pointer-events-none" />
    </footer>
  );
}
