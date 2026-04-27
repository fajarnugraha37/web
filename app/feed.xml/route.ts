import { getSortedBlogsData } from "@/lib/mdx";

export const dynamic = "force-static";

export async function GET() {
  const blogs = getSortedBlogsData();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://fajarnugraha37.github.io";

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SYS//OP - Lead Backend Engineer</title>
    <link>${baseUrl}</link>
    <description>High-performance backend engineering, cloud architecture, and AI-driven development.</description>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${blogs
      .map(
        (blog) => `
      <item>
        <title><![CDATA[${blog.title}]]></title>
        <link>${baseUrl}/blogs/${blog.slug}</link>
        <guid>${baseUrl}/blogs/${blog.slug}</guid>
        <pubDate>${new Date(blog.date).toUTCString()}</pubDate>
        <description><![CDATA[${blog.description}]]></description>
      </item>
    `,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
