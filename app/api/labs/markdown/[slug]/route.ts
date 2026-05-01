import { NextResponse } from "next/server";
import { getBlogData } from "@/lib/mdx";
import { ENV } from "@/lib/env";

import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  if (!ENV.IS_WRITE_MODE) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
  
  try {
    const params = await props.params;
    const data = await getBlogData(params.slug);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ slug: string }> }) {
  if (!ENV.IS_WRITE_MODE) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const params = await props.params;
    const blogsDirectory = path.join(process.cwd(), "content", "blogs");
    const fullPath = path.join(blogsDirectory, `${params.slug}.mdx`);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete" }, { status: 500 });
  }
}
