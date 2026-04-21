import { getBlogData, getAllBlogSlugs } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import * as motion from "motion/react-client";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const postData = await getBlogData(resolvedParams.slug);
  return {
    title: `${postData.title} // SYS_OP`,
    description: postData.description,
    openGraph: {
      title: `${postData.title} // SYS_OP`,
      description: postData.description,
      type: "article",
      publishedTime: postData.date,
      tags: postData.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${postData.title} // SYS_OP`,
      description: postData.description,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const postData = await getBlogData(resolvedParams.slug);

  return (
    <PageTransition>
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-screen overflow-x-clip"
      >
        <article className="max-w-4xl mx-auto relative z-10 px-4 pt-12 md:pt-20">
          {/* Enhanced Sticky HUD - Wide span version */}
          <div className="sticky top-16 z-30 mb-12 -mx-4 md:-mx-8 lg:-mx-16">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-accent/20 shadow-[0_15px_35px_rgba(0,0,0,0.9)]" />

            <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
              <Link
                href="/blogs"
                className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-all group"
              >
                <div className="mr-3 p-1 border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-black transition-all cyber-chamfer-sm">
                  <ChevronLeft className="w-3 h-3" />
                </div>
                <span className="sm:inline">DISCONNECT</span>
              </Link>

              <div className="flex items-center gap-3">
                <time className="text-accent-secondary font-mono text-[9px] bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-0.5 tracking-tighter shadow-[0_0_10px_rgba(var(--accent-secondary-rgb),0.1)]">
                  [ TS: {postData.date} ]
                </time>
              </div>

              {/* Visual HUD accent line */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            </div>
          </div>

          <div className="mb-16">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-black font-sans text-foreground drop-shadow-[0_0_20px_rgba(255,255,255,0.05)] leading-tight tracking-tighter mb-6"
            >
              {postData.title}
            </motion.h1>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2"
            >
              {postData.tags.map((t: string) => (
                <span
                  key={t}
                  className="text-[10px] md:text-xs uppercase font-mono tracking-[0.15em] text-accent-tertiary bg-accent-tertiary/10 border border-accent-tertiary/30 px-3 py-1 cyber-chamfer-sm hover:bg-accent-tertiary/20 transition-colors"
                >
                  #{t}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="relative group/content pb-20">
            {/* HUD Corner Accents */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-accent opacity-20 group-hover/content:opacity-100 transition-opacity" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-accent opacity-20 group-hover/content:opacity-100 transition-opacity" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-accent opacity-20 group-hover/content:opacity-100 transition-opacity" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-accent opacity-20 group-hover/content:opacity-100 transition-opacity" />

            <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent hidden lg:block" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="markdown-body p-6 md:p-10 bg-card/5 backdrop-blur-[1px] cyber-chamfer border border-border/20 text-foreground/90 font-mono relative overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] pointer-events-none z-0"
                style={{ backgroundSize: "100% 4px, 4px 100%" }}
              />

              <div className="relative z-10">
                <MDXRemote source={postData.content} />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 pt-8 border-t border-border flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase tracking-widest"
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-accent/40 rounded-full" />{" "}
                TRANSMISSION_COMPLETE
              </span>
              <span className="text-border">|</span>
              <span>NODE: {postData.slug}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>EOF</span>
              <span className="w-1.5 h-3 bg-accent animate-blink" />
            </div>
          </motion.div>
        </article>

        {/* Ambient Room Glows */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-accent/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-accent-secondary/5 blur-[150px] rounded-full" />
        </div>
      </motion.div>
    </PageTransition>
  );
}
