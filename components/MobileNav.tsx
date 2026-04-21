"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/blogs", label: "/Blogs", accentClass: "hover:text-accent" },
  {
    href: "/about",
    label: "/About",
    accentClass: "hover:text-accent-secondary",
  },
  {
    href: "/contacts",
    label: "Contact.exe",
    accentClass: "hover:text-accent-tertiary",
    highlight: true,
  },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close on route change
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        id="mobile-nav-toggle"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 border border-border bg-card/60 cyber-chamfer-sm hover:border-accent transition-colors"
      >
        <span
          className={`block w-5 h-px bg-accent transition-all duration-300 origin-center ${
            open ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`block w-5 h-px bg-accent transition-all duration-300 ${
            open ? "opacity-0 scale-x-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-px bg-accent transition-all duration-300 origin-center ${
            open ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 top-16 bg-background/70 backdrop-blur-sm z-30"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Dropdown menu */}
      <nav
        aria-label="Mobile navigation"
        className={`fixed top-16 right-0 w-full z-40 transition-all duration-300 ease-in-out ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="border-b border-border bg-background/95 backdrop-blur-md">
          {/* Grid scanline decoration */}
          <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />

          <ul className="relative flex flex-col divide-y divide-border/50">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-6 py-4 font-sans text-sm uppercase tracking-widest transition-colors ${
                    link.highlight
                      ? "text-accent border-l-2 border-accent hover:bg-accent/10"
                      : `text-foreground/80 border-l-2 border-transparent hover:border-accent ${link.accentClass}`
                  } ${pathname === link.href ? "text-accent border-l-accent border-l-2" : ""}`}
                >
                  <span className="font-mono text-accent/60 text-xs">&gt;</span>
                  {link.label}
                </Link>
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
