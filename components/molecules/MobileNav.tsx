"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  accentClass: string;
  highlight?: boolean;
  children?: { href: string; label: string; accentClass: string }[];
}

const NAV_LINKS: NavLink[] = [
  { href: "/blogs", label: "/Blogs", accentClass: "hover:text-accent" },
  {
    href: "/about",
    label: "/About",
    accentClass: "hover:text-accent-secondary",
  },
  {
    href: "/labs",
    label: "/Labs",
    accentClass: "hover:text-accent-tertiary",
    children: [
      {
        href: "/labs/postgresql",
        label: "SQL_LAB.EXE",
        accentClass: "hover:text-accent",
      },
      {
        href: "/labs/duckdb",
        label: "TELEMETRY_ANALYTICS.EXE",
        accentClass: "hover:text-accent-secondary",
      },
      {
        href: "/labs/knowledge-graph",
        label: "BLOG_NETWORK.EXE",
        accentClass: "hover:text-accent-tertiary",
      },
      {
        href: "/labs/markdown",
        label: "MARKDOWN.EXE",
        accentClass: "hover:text-accent",
      },
    ],
  },
  { href: "/feed.xml", label: "/RSS Feed", accentClass: "hover:text-accent" },
  {
    href: "/contacts",
    label: "Contact.exe",
    accentClass: "hover:text-accent-tertiary",
    highlight: true,
  },
];

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  const [expandedLabs, setExpandedLabs] = useState(false);
  const pathname = usePathname();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setExpandedLabs(false);
  }, [setIsOpen]);

  // Handle navigation updates via effect - close menu when route changes
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    handleClose();
  }, [pathname, handleClose]);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        id="mobile-nav-toggle"
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen ? "true" : "false"}
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-1.5 border border-border bg-card/60 cyber-chamfer-sm hover:border-accent transition-colors"
      >
        <span
          className={`block w-5 h-px bg-accent transition-all duration-300 origin-center ${
            isOpen ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`block w-5 h-px bg-accent transition-all duration-300 ${
            isOpen ? "opacity-0 scale-x-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-px bg-accent transition-all duration-300 origin-center ${
            isOpen ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      <nav
        aria-label="Mobile navigation"
        className={`fixed top-16 right-0 w-full z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="border-b border-border bg-background/95 backdrop-blur-md shadow-2xl max-h-[80vh] overflow-y-auto relative">
          {/* Grid scanline decoration */}
          <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />

          <ul className="relative flex flex-col divide-y divide-border/50">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="flex flex-col">
                {link.children ? (
                  <>
                    <div className="flex items-center justify-between px-6 py-4">
                      <Link
                        href={link.href}
                        onClick={handleClose}
                        className={`flex items-center gap-3 font-sans text-sm uppercase tracking-widest transition-colors text-foreground/80 hover:text-accent ${pathname.startsWith(link.href) ? "text-accent" : ""}`}
                      >
                        <span className="font-mono text-accent/60 text-xs">
                          &gt;
                        </span>
                        {link.label}
                      </Link>
                      <button
                        onClick={() => setExpandedLabs(!expandedLabs)}
                        className="p-2 -mr-2 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${expandedLabs ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {expandedLabs && (
                      <ul className="bg-muted/10 divide-y divide-border/30">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={handleClose}
                              className={`flex items-center gap-3 pl-12 pr-6 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors ${pathname === child.href ? "text-accent" : "text-muted-foreground hover:text-accent"}`}
                            >
                              <span className="opacity-40">#</span>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    prefetch={link.href.endsWith(".xml") ? false : undefined}
                    onClick={handleClose}
                    className={`flex items-center gap-3 px-6 py-4 font-sans text-sm uppercase tracking-widest transition-colors ${
                      link.highlight
                        ? "text-accent border-l-2 border-accent hover:bg-accent/10"
                        : `text-foreground/80 border-l-2 border-transparent hover:border-accent ${link.accentClass}`
                    } ${pathname === link.href ? "text-accent border-l-accent border-l-2" : ""}`}
                  >
                    <span className="font-mono text-accent/60 text-xs">
                      &gt;
                    </span>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Corner accent */}
          <div className="absolute bottom-0 right-4 w-8 h-px bg-accent/30" />
        </div>
      </nav>
    </div>
  );
}
