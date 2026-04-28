# Specification: scripts/pre-build.ts

## Overview
The `pre-build.ts` script performs heavy data processing tasks (embedding generation and semantic similarity computation) for the blog archive. It runs during the build process to generate static search and relationship indices used by the frontend.

## Functionality
*   **Vector Embeddings:** Uses the `all-MiniLM-L6-v2` transformer model to generate semantic embeddings for blog content.
*   **Search Index:** Generates `public/search-index.json` containing blog metadata.
*   **Relationships:** Computes a 3-nearest-neighbor semantic relationship graph (`public/relations.json`) using cosine similarity.
*   **Caching:** Caches vector embeddings based on file modification time (`mtime`) to skip re-computation if content hasn't changed.

## Behavior
*   Executed by `bun` (implied by environment) before the build.
*   Uses `gray-matter` for frontmatter extraction and `@xenova/transformers` for NLP processing.

## State Management
*   None (File-based output).

## Logic & Data Handling
*   **ML Pipeline:** `pipeline("feature-extraction", ...)` creates a vector representation of post content.
*   **Similarity Computation:** Calculates score using vector dot products of embeddings.

## Dependencies
*   `@xenova/transformers` (ML library).
*   `gray-matter`.
*   Node.js `fs` / `path`.

## Potential Issues
*   **Build Performance:** Generating embeddings for every build can be very slow as the blog list grows.
*   **Memory Usage:** Transformer models have significant memory overhead.
*   **Build Environment:** Requires machine environment (ML libraries) at build time, which might be tricky in restricted CI/CD environments.
