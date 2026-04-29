"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchPalette } from "@/components/molecules/SearchPalette";
import { MobileNav } from "@/components/molecules/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/blogs", label: "/Blogs", activeClass: "text-accent" },
  { href: "/about", label: "/About", activeClass: "text-accent-secondary" },
  { href: "/labs", label: "/Labs", activeClass: "text-accent-tertiary" },
  { href: "/feed.xml", label: "/RSS Feed", activeClass: "text-accent" },
];

const LAB_LINKS = [
  { href: "/labs/postgresql", label: "SQL LAB.EXE", hoverClass: "hover:text-accent" },
  { href: "/labs/duckdb", label: "TELEMETRY ANALYTICS.EXE", hoverClass: "hover:text-accent-secondary" },
  { href: "/labs/knowledge-graph", label: "BLOG NETWORKS.EXE", hoverClass: "hover:text-accent-tertiary" },
  { href: "/labs/markdown", label: "MARKDOWN PLAYGROUND.EXE", hoverClass: "hover:text-accent" },
  { href: "/labs/ffmpeg", label: "MEDIA PROCESSOR.EXE", hoverClass: "hover:text-accent-secondary" },
  { href: "/labs/translate", label: "TRANSLATION PLAYGROUND.EXE", hoverClass: "hover:text-accent-tertiary" },
];

export function Header() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // DRY: Use isMobile to auto-close nav when scaling to desktop
  useEffect(() => {
    if (!isMobile && isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  }, [isMobile, isMobileNavOpen]);

  const closeAll = () => {
    setIsSearchOpen(false);
    setIsMobileNavOpen(false);
  };

  const isAnyMenuOpen = isSearchOpen || isMobileNavOpen;

  return (
    <>
      <header className="fixed top-0 w-full z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-sans font-bold text-xl text-accent cyber-glitch-text"
              data-text="SYS//OP"
            >
              SYS//OP
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-8 text-xs uppercase tracking-widest items-center">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={cn(
                      "hover:text-accent transition-colors",
                      pathname.startsWith(link.href) && link.activeClass
                    )}
                    prefetch={link.href.endsWith(".xml") ? false : undefined}
                  >
                    {link.label}
                    {link.href === "/labs" && (
                      <span className="ml-1 text-[8px] opacity-50 group-hover:rotate-180 transition-transform duration-300 inline-block">
                        ▼
                      </span>
                    )}
                  </Link>

                  {link.href === "/labs" && (
                    <div className="absolute top-full -left-4 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                      <div className="min-w-[180px] bg-background border border-border p-2 cyber-chamfer-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
                        {LAB_LINKS.map((lab) => (
                          <Link
                            key={lab.href}
                            href={lab.href}
                            className={cn(
                              "block px-3 py-2 hover:bg-accent/10 transition-all border-l-2 border-transparent hover:border-accent font-mono text-[10px]",
                              lab.hoverClass
                            )}
                          >
                            {lab.label}
                          </Link>
                        ))}
                        <div className="mt-2 pt-2 border-t border-border/50 text-[8px] px-3 text-muted-foreground italic">
                          Labolatory
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SearchPalette isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
            <Link
              href="/contacts"
              className="hidden md:block px-4 py-1 border border-accent text-accent shadow-[0_0_8px_rgba(0,255,136,0.3)] cyber-chamfer-sm hover:bg-accent hover:text-black transition-all text-xs uppercase tracking-widest"
            >
              Contact.exe
            </Link>
            <MobileNav isOpen={isMobileNavOpen} setIsOpen={setIsMobileNavOpen} />
          </div>
        </div>
      </header>

      {/* Global Backdrop - Sit ABOVE content but BELOW search/mobile menus */}
      {isAnyMenuOpen && (
        <div 
          className="fixed inset-0 z-[30] bg-black/40 backdrop-blur-[2px] transition-all cursor-pointer"
          onClick={closeAll}
        />
      )}
    </>
  );
}
