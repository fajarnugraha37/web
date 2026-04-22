import { ForceNode, ForceLink } from "d3-force-3d";

export interface GraphNode extends ForceNode {
  id: string;
  title: string;
  tags: string[];
  description: string;
  val: number; // For node sizing
}

export interface GraphLink extends ForceLink<GraphNode> {
  source: string;
  target: string;
  value: number; // Similarity score
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function transformDataToGraph(
  relations: Record<string, { slug: string; score: number }[]>,
  searchIndex: { id: string; title: string; tags: string[]; description: string }[]
): GraphData {
  const nodes: GraphNode[] = searchIndex.map((item) => ({
    id: item.id,
    title: item.title,
    tags: item.tags,
    description: item.description,
    val: 1, // Default size
  }));

  const links: GraphLink[] = [];
  const seenPairs = new Set<string>();

  Object.entries(relations).forEach(([source, targets]) => {
    targets.forEach((target) => {
      // Create a unique key for the pair to avoid duplicate edges in undirected graph
      const pairKey = [source, target.slug].sort().join("|");
      if (!seenPairs.has(pairKey)) {
        links.push({
          source,
          target: target.slug,
          value: target.score,
        });
        seenPairs.add(pairKey);
      }
    });
  });

  return { nodes, links };
}
