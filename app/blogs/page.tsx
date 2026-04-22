import { getSortedBlogsData } from "@/lib/mdx";
import { BlogList } from "@/components/BlogList";
import { PageTransition } from "@/components/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logs | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
  description:
    "Technical deep-dives, architectural fragments, and engineering logs by Fajar Abdi Nugraha (SYS//OP).",
  openGraph: {
    title: "Logs | Fajar Abdi Nugraha - Software Engineer & Solution Architect",
    description:
      "Technical deep-dives, architectural fragments, and engineering logs by Fajar Abdi Nugraha (SYS//OP).",
    type: "website",
    url: "/blogs",
  },
};

export default function BlogsPage() {
  const blogs = getSortedBlogsData();

  return (
    <PageTransition>
      <div className="py-12 md:py-20">
        <div className="mb-12">
          <div className="inline-block border border-border bg-card px-3 py-1 text-xs font-mono mb-4 text-accent-secondary">
            <span className="animate-blink mr-2">&gt;</span> DIRECTORY_INDEX
          </div>
          <h1
            className="text-4xl md:text-6xl font-black uppercase tracking-widest text-foreground cyber-glitch-text"
            data-text="SYSTEM_LOGS"
          >
            SYSTEM_LOGS
          </h1>
        </div>

        <BlogList blogs={blogs} />
      </div>
    </PageTransition>
  );
}
