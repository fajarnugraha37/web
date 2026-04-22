import { pipeline } from "@xenova/transformers";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/blogs");
const CACHE_DIR = path.join(process.cwd(), ".cache");
const EMBEDDINGS_FILE = path.join(CACHE_DIR, "embeddings.json");

async function getFiles() {
  const files = await fs.readdir(CONTENT_DIR);
  return files.filter((f) => f.endsWith(".mdx"));
}

async function run() {
  console.log("Starting pre-build...");
  await fs.mkdir(CACHE_DIR, { recursive: true });

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
  console.log("Build-time processing complete.");
}

run();
