import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogMetadata, Blog, ContentStats, TocHeading } from "@/types";

const blogsDirectory = path.join(process.cwd(), "content", "blogs");

export function getSortedBlogsData(): BlogMetadata[] {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(blogsDirectory);
  const allBlogsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        description: data.description || "",
      };
    });

  return allBlogsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllBlogSlugs() {
  if (!fs.existsSync(blogsDirectory)) return [];
  return fs.readdirSync(blogsDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

export function calculateContentStats(rawContent: string): ContentStats {
  const cleanText = rawContent
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  const charCount = cleanText.length;
  const words = cleanText.trim().split(/\s+/);
  const wordCount = words.length === 1 && words[0] === "" ? 0 : words.length;
  const readingTime = Math.ceil(wordCount / 200);
  return { charCount, wordCount, readingTime };
}

/**
 * Utility: getHeadings
 * Extracts h1-h3 headings from MDX content for TOC generation.
 */
export function getHeadings(title: string, content: string): TocHeading[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [
    {
      level: 1,
      text: title,
      id: title.toLowerCase().replace(/\s+/g, "-"),
      children: [],
    },
  ];

  const contentWithoutCode = content.replace(/```[\s\S]*?```/g, "");
  let match;
  while ((match = headingRegex.exec(contentWithoutCode)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/\s+/g, "-");

    if (level === 2) {
      headings.push({ level, text, id, children: [] });
    } else if (level === 3 && headings.length > 0) {
      headings[headings.length - 1].children.push({ level, text, id, children: [] });
    }
  }
  return headings;
}

export async function getBlogData(slug: string): Promise<Blog> {
  const fullPath = path.join(blogsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = calculateContentStats(content);

  return {
    slug,
    content,
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    description: data.description || "",
    stats,
  };
}
