import { getSortedBlogsData } from "@/lib/mdx";
import { ENV } from "@/lib/env";

export const dynamic = "force-static";

export async function GET() {
  const blogs = getSortedBlogsData();
  const baseUrl = ENV.BASE_URL;

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
