import { getBlogData, getAllBlogSlugs, getHeadings } from "@/lib/mdx";
import { BlogContent } from "@/components/organisms/BlogContent";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/molecules/MDXComponents";
import type { Metadata } from "next";
import relations from "@/public/relations.json";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";

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
    title: `${postData.title} | Fajar Abdi Nugraha`,
    description: postData.description,
    authors: [{ name: "Fajar Abdi Nugraha" }],
    openGraph: {
      title: `${postData.title} | Fajar Abdi Nugraha`,
      description: postData.description,
      type: "article",
      publishedTime: postData.date,
      tags: postData.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${postData.title} | Fajar Abdi Nugraha`,
      description: postData.description,
    },
  };
}

/**
 * Blog Post Page
 * Server Component that fetches data and renders MDX content.
 * Rendered MDX is passed to BlogContent (Client) to avoid RSC async errors.
 */
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const postData = await getBlogData(resolvedParams.slug);
  const headings = getHeadings(postData.title, postData.content);

  const relatedSlugs =
    (relations as Record<string, { slug: string }[]>)[postData.slug] || [];
  const relatedPosts = await Promise.all(
    relatedSlugs.map((r) => getBlogData(r.slug)),
  );

  return (
    <BlogContent 
      postData={postData} 
      headings={headings} 
      relatedPosts={relatedPosts} 
    >
      <MDXRemote
        source={postData.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkMath, remarkEmoji, remarkGfm],
            rehypePlugins: [rehypeKatex, rehypeSlug, rehypeRaw],
          },
        }}
      />
    </BlogContent>
  );
}
