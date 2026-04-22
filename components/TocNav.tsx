"use client";

import { useActiveSection } from "@/hooks/use-active-section";

export function TocNav({ headings }: { headings: any[] }) {
  const allIds = headings.flatMap(h => [h.id, ...h.children.map((c: any) => c.id)]);
  const activeId = useActiveSection(allIds);

  return (
    <nav className="text-muted-foreground space-y-3">
      {headings.map((h, i) => (
        <div key={i}>
          {h.level === 1 ? (
            <a 
              href={`#${h.id}`} 
              className={`block font-bold hover:text-accent transition-colors ${activeId === h.id ? "text-accent" : "text-foreground"}`}
            >
              {h.text}
            </a>
          ) : (
            <>
              <a 
                href={`#${h.id}`} 
                className={`block pl-4 hover:text-accent transition-colors border-l border-border/50 ${activeId === h.id ? "text-accent border-accent" : ""}`}
              >
                {h.text}
              </a>
              {h.children.map((child: any, j: number) => (
                <a 
                  key={j} 
                  href={`#${child.id}`} 
                  className={`block pl-8 hover:text-accent transition-colors border-l border-border/50 text-[10px] opacity-70 ${activeId === child.id ? "text-accent border-accent opacity-100" : ""}`}
                >
                  └ {child.text}
                </a>
              ))}
            </>
          )}
        </div>
      ))}
    </nav>
  );
}
