import fs from "fs";
import path from "path";
import matter from "gray-matter";

type BlogMetadata = {
  title: string;
  date: string;
  tags: string[];
  description: string;
  slug: string;
};

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

      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        tags: matterResult.data.tags || [],
        description: matterResult.data.description || "",
      };
    });

  return allBlogsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllBlogSlugs() {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(blogsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      return {
        slug: fileName.replace(/\.mdx$/, ""),
      };
    });
}

export function calculateContentStats(rawContent: string) {
  // Basic markdown stripping for accurate word counts
  const cleanText = rawContent
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  const charCount = cleanText.length;
  const words = cleanText.trim().split(/\s+/);
  const wordCount = words.length === 1 && words[0] === "" ? 0 : words.length;
  const readingTime = Math.ceil(wordCount / 200);
  return { charCount, wordCount, readingTime };
}

export async function getBlogData(slug: string) {
  const fullPath = path.join(blogsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);
  const stats = calculateContentStats(matterResult.content);

  return {
    slug,
    content: matterResult.content,
    title: matterResult.data.title,
    date: matterResult.data.date,
    tags: matterResult.data.tags || [],
    description: matterResult.data.description || "",
    stats,
  };
}
