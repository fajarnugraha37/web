import { getSortedBlogsData } from "@/lib/mdx";
import { BlogListSection } from "@/components/organisms/BlogListSection";
import { PageTransition } from "@/components/atoms/PageTransition";
import { Metadata } from "next";

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
  const allBlogs = getSortedBlogsData();

  return (
    <PageTransition>
      <div className="py-8 md:py-12">
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            <span className="text-accent">Logs</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm mt-2 uppercase tracking-widest">
            // Archived knowledge fragments...
          </p>
        </header>

        <BlogListSection blogs={allBlogs} />
      </div>
    </PageTransition>
  );
}
