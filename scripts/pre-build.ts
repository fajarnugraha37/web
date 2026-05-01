import { pipeline } from "@xenova/transformers";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/blogs");
const CACHE_DIR = path.join(process.cwd(), ".cache");
const EMBEDDINGS_FILE = path.join(CACHE_DIR, "embeddings.json");
const API_DIR = path.join(process.cwd(), "app/api");
const ASSETS_DIR = path.join(process.cwd(), "public/assets");

async function generateAssetsIndex() {
  console.log("Generating assets index...");
  const assets: any[] = [];
  const categories = ["img", "video", "audio", "doc"];

  for (const category of categories) {
    const dir = path.join(ASSETS_DIR, category);
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile()) {
          const stat = await fs.stat(path.join(dir, entry.name));
          assets.push({
            name: entry.name,
            url: `/assets/${category}/${entry.name}`,
            category,
            size: stat.size,
            lastModified: stat.mtimeMs
          });
        }
      }
    } catch (e) {
      // Directory might not exist, skip
    }
  }

  assets.sort((a, b) => b.lastModified - a.lastModified);
  await fs.writeFile(
    path.join(process.cwd(), "public/assets-index.json"),
    JSON.stringify(assets)
  );
}

async function getApiRoutes(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return getApiRoutes(fullPath);
        } else if (entry.name === "route.ts" || entry.name === "_route.ts") {
          return [fullPath];
        }
        return [];
      })
    );
    return files.flat();
  } catch (e) {
    return [];
  }
}

async function getFiles() {
  const files = await fs.readdir(CONTENT_DIR);
  return files.filter((f) => f.endsWith(".mdx"));
}

async function run() {
  console.log("Starting pre-build...");
  await fs.mkdir(CACHE_DIR, { recursive: true });

  const isWriteMode = process.env.NEXT_PUBLIC_APP_MODE === "write";
  
  try {
    const routePaths = await getApiRoutes(API_DIR);
    
    for (const routePath of routePaths) {
      // Ensure activePath always points to the standard 'route.ts'
      const activePath = routePath.endsWith("_route.ts") 
        ? routePath.replace("_route.ts", "route.ts") 
        : routePath;
        
      const hiddenPath = activePath.replace("route.ts", "_route.ts");
      
      const activeExists = await fs.stat(activePath).then(() => true).catch(() => false);
      const hiddenExists = await fs.stat(hiddenPath).then(() => true).catch(() => false);

      if (isWriteMode) {
        if (hiddenExists && !activeExists) {
          console.log(`Restoring ${hiddenPath} to ${activePath}`);
          await fs.rename(hiddenPath, activePath);
        }
      } else {
        if (activeExists) {
          console.log(`Hiding ${activePath} to ${hiddenPath} for Read Mode`);
          await fs.rename(activePath, hiddenPath);
        }
      }
    }
  } catch (e) {
    console.error("Failed to toggle API route modes:", e);
  }

  const files = await getFiles();
  let cache = {};
  try {
    cache = JSON.parse(await fs.readFile(EMBEDDINGS_FILE, "utf-8"));
  } catch (e) {
    console.log("No cache found, starting fresh.");
  }

  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
  );
  const embeddings = {};
  const searchIndex = [];

  for (const file of files) {
    console.log("Processing " + file);
    const fullPath = path.join(CONTENT_DIR, file);
    const mtime = (await fs.stat(fullPath)).mtimeMs;
    const slug = file.replace(".mdx", "");

    const raw = await fs.readFile(fullPath, "utf-8");
    const { data, content } = matter(raw);

    searchIndex.push({
      id: slug,
      title: data.title,
      tags: data.tags || [],
      description: data.description,
    });

    //@ts-ignore
    if (cache[file]?.mtime === mtime) {
      //@ts-ignore
      embeddings[slug] = cache[file].vector;
    } else {
      console.log(`Embedding ${file}...`);
      const output = await embedder(content, {
        pooling: "mean",
        normalize: true,
      });
      const vector = Array.from(output.data);
      //@ts-ignore
      embeddings[slug] = vector;
      //@ts-ignore
      cache[file] = { mtime, vector };
    }
  }

  await fs.writeFile(EMBEDDINGS_FILE, JSON.stringify(cache));
  await fs.writeFile(
    path.join(process.cwd(), "public/search-index.json"),
    JSON.stringify(searchIndex),
  );

  // Compute relations
  const slugs = Object.keys(embeddings);
  const relations = {};

  for (const s1 of slugs) {
    console.log("Computing relations for " + s1);
    //@ts-ignore
    relations[s1] = slugs
      .filter((s2) => s1 !== s2)
      .map((s2) => ({
        slug: s2,
        //@ts-ignore
        score: embeddings[s1].reduce(
          //@ts-ignore
          (acc, val, i) => acc + val * embeddings[s2][i],
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  await fs.writeFile(
    path.join(process.cwd(), "public/relations.json"),
    JSON.stringify(relations),
  );
  
  await generateAssetsIndex();
  
  console.log("Build-time processing complete.");
}

run();
