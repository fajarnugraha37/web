import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 // SIGNAL_LOST",
  description: "The requested node does not exist in this sector of the net.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-destructive opacity-5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-secondary opacity-5 blur-[120px] rounded-full pointer-events-none" />

      {/* Scanline overlay */}
      <div className="not-found-scanlines absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 py-8 max-w-3xl mx-auto">
        {/* Status badge */}
        <div className="inline-block border border-destructive/50 bg-card px-3 py-1 text-xs font-mono mb-8 cyber-chamfer-reverse text-destructive self-center">
          <span className="animate-blink mr-2">&gt;</span> KERNEL_PANIC //
          SEGFAULT_DETECTED
        </div>

        {/* Big 404 glitch */}
        <div className="relative mb-4 select-none" aria-hidden="true">
          <h1
            className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-foreground/10 cyber-glitch-text relative"
            data-text="404"
          >
            <span className="relative z-10 text-foreground/10">404</span>
            <span className="not-found-glitch-1 absolute inset-0 text-destructive/60 z-20">
              404
            </span>
            <span className="not-found-glitch-2 absolute inset-0 text-accent-tertiary/60 z-20">
              404
            </span>
          </h1>
        </div>

        {/* Error heading */}
        <h2
          className="text-3xl md:text-5xl font-black uppercase tracking-widest text-foreground mb-4 cyber-glitch-text"
          data-text="SIGNAL_LOST"
        >
          SIGNAL_LOST
        </h2>

        {/* Neon divider */}
        <div className="h-px w-32 bg-destructive shadow-[0_0_10px_#ff3366] mb-8" />

        {/* Terminal error block */}
        <div className="w-full bg-card/60 backdrop-blur-sm border border-border cyber-chamfer p-6 mb-8 text-left font-mono text-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="text-destructive">[ERR]</span>
              <span className="text-foreground/70">
                Route target not found in address space.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-destructive">[ERR]</span>
              <span className="text-foreground/70">
                Requested node has been decommissioned, never existed, or you
                are hallucinating.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent-tertiary">[SYS]</span>
              <span className="text-foreground/70">
                Initiating damage control protocols...
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-accent-tertiary">[SYS]</span>
              <span className="text-foreground/50">
                Recommendation: return to a known-good sector.
              </span>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
              <span className="text-accent">&gt;</span>
              <span className="w-2 h-5 bg-accent animate-pulse shadow-[0_0_5px_#00ff88] inline-block" />
            </div>
          </div>
        </div>

        {/* Error code details */}
        <div className="grid grid-cols-3 gap-4 w-full mb-10 text-center font-mono text-xs">
          <div className="border border-border/50 bg-card/40 p-3 cyber-chamfer-sm">
            <div className="text-muted-foreground mb-1">ERROR_CODE</div>
            <div className="text-destructive font-bold">0x404</div>
          </div>
          <div className="border border-border/50 bg-card/40 p-3 cyber-chamfer-sm">
            <div className="text-muted-foreground mb-1">NODE_STATUS</div>
            <div className="text-accent-secondary font-bold">NULL</div>
          </div>
          <div className="border border-border/50 bg-card/40 p-3 cyber-chamfer-sm">
            <div className="text-muted-foreground mb-1">SECTOR</div>
            <div className="text-accent-tertiary font-bold">VOID</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            id="not-found-home-btn"
            className="px-6 py-3 border border-accent text-accent text-sm font-sans font-bold uppercase tracking-widest cyber-chamfer-sm hover:bg-accent hover:text-black transition-all glow-btn"
          >
            &gt; SYS//OP
          </Link>
          <Link
            href="/blogs"
            id="not-found-blogs-btn"
            className="px-6 py-3 border border-border text-muted-foreground text-sm font-sans font-bold uppercase tracking-widest cyber-chamfer-sm hover:border-accent-tertiary hover:text-accent-tertiary transition-all"
          >
            READ_LOGS
          </Link>
          <Link
            href="/contacts"
            id="not-found-contact-btn"
            className="px-6 py-3 border border-border text-muted-foreground text-sm font-sans font-bold uppercase tracking-widest cyber-chamfer-sm hover:border-accent-secondary hover:text-accent-secondary glow-btn-secondary transition-all"
          >
            CONTACT.EXE
          </Link>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-destructive/30 pointer-events-none" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-destructive/30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-destructive/30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-destructive/30 pointer-events-none" />
      </div>
    </div>
  );
}
