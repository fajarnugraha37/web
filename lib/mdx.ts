import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogMetadata, Blog, ContentStats } from "@/types";

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
