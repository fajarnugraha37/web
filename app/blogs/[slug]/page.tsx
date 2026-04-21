import { getBlogData, getAllBlogSlugs } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const postData = await getBlogData(resolvedParams.slug);
  return {
    title: `${postData.title} // SYS_OP`,
    description: postData.description,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const postData = await getBlogData(resolvedParams.slug);

  return (
    <article className="py-12 md:py-20 max-w-4xl mx-auto">
      <div className="mb-8 border-b border-border pb-8">
        <Link 
          href="/blogs" 
          className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3 justify-center mr-2" />
          RETURN_TO_INDEX
        </Link>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <time className="text-accent-secondary font-mono text-sm bg-accent-secondary/10 px-2 py-1">[ TS: {postData.date} ]</time>
          <div className="flex gap-2">
            {postData.tags.map((t: string) => (
              <span key={t} className="text-xs uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 bg-card">
                {t}
              </span>
            ))}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black font-sans text-foreground drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          {postData.title}
        </h1>
      </div>

      {/* Cyberpunk HUD styling for content area */}
      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent hidden md:block" />
        <div className="markdown-body p-4 md:p-6 bg-card/30 cyber-chamfer border border-border/50 text-foreground/90 font-mono">
          <MDXRemote source={postData.content} />
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-border flex justify-between items-center text-xs font-mono text-muted-foreground">
        <span>EOF</span>
        <span className="animate-blink cursor-text">_</span>
      </div>
    </article>
  );
}
