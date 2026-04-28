# Specification: lib/graph-utils.ts

## Overview
The `lib/graph-utils.ts` module provides data structures and transformation logic for converting raw blog post relationship and index data into a graph format suitable for `d3-force-3d` visualization.

## Functionality
*   **Data Structures:** Defines TypeScript interfaces `GraphNode`, `GraphLink`, and `GraphData`.
*   **Transformation Logic:** Implements `transformDataToGraph` to map JSON-based input into graph nodes and unique, undirected links.

## Logic & Data Handling
*   **Data Transformation:**
    *   `transformDataToGraph`: Iterates through search index to create nodes; iterates through relations to create unique links, using a `Set` to filter duplicate bidirectional relationships.

## Dependencies
*   `d3-force-3d` (Type interfaces).

## Potential Issues
*   The logic assumes IDs in `relations` exist in `searchIndex`. If `relations` references a blog post not in the index, the graph visualization might fail or show orphaned links.
*   The `val` property for nodes is currently hardcoded to `1`, which limits the visual scaling of the graph.
*   The `seenPairs` approach assumes a bidirectional graph relationship; verify this matches the desired visualization intent.
