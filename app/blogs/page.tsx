import { getSortedBlogsData } from "@/lib/mdx";
import { BlogListSection } from "@/components/organisms/BlogListSection";
import { PageTransition } from "@/components/atoms/PageTransition";
import { BlogsHeader } from "@/components/organisms/BlogsHeader";
import { Metadata } from "next";
import { Suspense } from "react";

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
        <BlogsHeader />

        <Suspense fallback={<div className="flex items-center justify-center py-24 font-mono text-accent animate-pulse tracking-widest">LOADING_ARCHIVES...</div>}>
          <BlogListSection blogs={allBlogs} />
        </Suspense>
      </div>
    </PageTransition>
  );
}
