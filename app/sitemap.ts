import { MetadataRoute } from "next";
import { getSortedBlogsData } from "@/lib/mdx";
import { ENV } from "@/lib/env";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getSortedBlogsData();
  const baseUrl = ENV.BASE_URL;

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.date),
  }));

  const labPaths = [
    "/labs",
    "/labs/postgresql",
    "/labs/duckdb",
    "/labs/knowledge-graph",
    "/labs/markdown",
  ];

  const labUrls = labPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
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
    ...labUrls,
    ...blogUrls,
  ];
}
