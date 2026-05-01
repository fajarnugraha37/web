import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getSortedBlogsData, getBlogData } from "@/lib/mdx";
import { ENV } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!ENV.IS_WRITE_MODE) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 5;

  let blogs = getSortedBlogsData();
  
  if (search) {
    const lowercaseSearch = search.toLowerCase();
    blogs = blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(lowercaseSearch) ||
        b.description.toLowerCase().includes(lowercaseSearch) ||
        b.slug.toLowerCase().includes(lowercaseSearch)
    );
  }

  const total = blogs.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedBlogs = blogs.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    data: paginatedBlogs.map((b) => ({
      slug: b.slug,
      title: b.title,
      description: b.description,
    })),
    meta: {
      total,
      page,
      totalPages,
    },
  });
}

export async function POST(request: Request) {
  if (!ENV.IS_WRITE_MODE) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { slug, title, tags, description, content } = body;

    if (!slug || !title || !tags || !description || !content) {
      return NextResponse.json(
        { error: "Missing required metadata fields (slug, title, tags, description, content)" },
        { status: 400 }
      );
    }

    const blogsDirectory = path.join(process.cwd(), "content", "blogs");
    if (!fs.existsSync(blogsDirectory)) {
      fs.mkdirSync(blogsDirectory, { recursive: true });
    }

    const fullPath = path.join(blogsDirectory, `${slug}.mdx`);
    
    // Format tags array to string for gray-matter stringification
    // matter.stringify takes an object and formats it
    const today = new Date().toISOString().split("T")[0];
    
    // Check if updating existing or new
    let date = today;
    if (fs.existsSync(fullPath)) {
      const existing = await getBlogData(slug);
      if (existing.date) date = existing.date;
    }

    const fileContent = matter.stringify(content, {
      title,
      date,
      tags: Array.isArray(tags) ? tags : tags.split(",").map((t: string) => t.trim()),
      description,
    });

    fs.writeFileSync(fullPath, fileContent, "utf8");

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    console.error("Save error:", error);
    return NextResponse.json({ error: error.message || "Failed to save" }, { status: 500 });
  }
}
