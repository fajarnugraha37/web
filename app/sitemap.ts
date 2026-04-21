import { MetadataRoute } from "next";
import { getSortedBlogsData } from "@/lib/mdx";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getSortedBlogsData();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://fajarnugraha37.github.io/web";

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.date),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
    },
    ...blogUrls,
  ];
}
