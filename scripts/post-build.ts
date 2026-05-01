import fs from "fs/promises";
import path from "path";

const API_DIR = path.join(process.cwd(), "app/api");

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

async function run() {
  console.log("Starting post-build...");

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

      // After build is complete, restore the API routes regardless of mode
      // so that the workspace returns to its clean, original state.
      if (hiddenExists && !activeExists) {
        console.log(`Restoring ${hiddenPath} back to ${activePath}`);
        await fs.rename(hiddenPath, activePath);
      }
    }
  } catch (e) {
    console.error("Failed to restore API routes:", e);
  }
}

run();
