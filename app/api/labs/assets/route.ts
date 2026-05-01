import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ENV } from "@/lib/env";
import { AssetCategory, AssetItem } from "@/types";

export const dynamic = "force-dynamic";

const ASSETS_DIR = path.join(process.cwd(), "public", "assets");

const CATEGORY_MAP: Record<string, AssetCategory> = {
  ".png": "img", ".jpg": "img", ".jpeg": "img", ".webp": "img", ".gif": "img", ".svg": "img",
  ".mp4": "video", ".mov": "video", ".avi": "video", ".webm": "video", ".mkv": "video",
  ".mp3": "audio", ".wav": "audio", ".aac": "audio", ".flac": "audio", ".ogg": "audio",
  ".md": "doc", ".mdx": "doc", ".txt": "doc", ".json": "doc", ".yaml": "doc", ".docs": "doc", 
  ".docx": "doc", ".ppt": "doc", ".pptx": "doc", ".csv": "doc", ".xls": "doc", ".xlsx": "doc", 
  ".pdf": "doc", ".zip": "doc", ".rar": "doc"
};

function getCategory(ext: string): AssetCategory {
  return CATEGORY_MAP[ext.toLowerCase()] || "doc";
}

function getAllAssets(): AssetItem[] {
  const assets: AssetItem[] = [];
  const categories: AssetCategory[] = ["img", "video", "audio", "doc"];

  for (const category of categories) {
    const dir = path.join(ASSETS_DIR, category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      continue;
    }

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        assets.push({
          name: file,
          url: `/assets/${category}/${file}`,
          category,
          size: stat.size,
          lastModified: stat.mtimeMs
        });
      }
    }
  }

  return assets.sort((a, b) => b.lastModified - a.lastModified);
}

export async function GET() {
  if (!ENV.IS_WRITE_MODE) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const assets = getAllAssets();
    return NextResponse.json({ data: assets });
  } catch (error: any) {
    console.error("Failed to read assets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!ENV.IS_WRITE_MODE) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = path.extname(file.name);
    const category = getCategory(ext);
    const categoryDir = path.join(ASSETS_DIR, category);

    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    let targetName = file.name;
    let targetPath = path.join(categoryDir, targetName);

    // Collision resolution (Option B: append timestamp)
    if (fs.existsSync(targetPath)) {
      const base = path.basename(targetName, ext);
      const timestamp = Date.now();
      targetName = `${base}-${timestamp}${ext}`;
      targetPath = path.join(categoryDir, targetName);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(targetPath, buffer);

    const asset: AssetItem = {
      name: targetName,
      url: `/assets/${category}/${targetName}`,
      category,
      size: buffer.length,
      lastModified: Date.now()
    };

    // Note: To keep the static JSON index somewhat updated in dev mode, we could optionally overwrite it here.
    // But since Write mode uses dynamic fetching anyway, it's not strictly necessary.

    return NextResponse.json({ data: asset });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!ENV.IS_WRITE_MODE) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 });
    }

    // Safely construct the local file path
    const relativePath = url.replace(/^\/assets\//, "");
    if (relativePath.includes("..")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const fullPath = path.join(ASSETS_DIR, relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete" }, { status: 500 });
  }
}
