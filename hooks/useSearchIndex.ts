"use client";

import { useState, useEffect, useMemo } from "react";
import MiniSearch from "minisearch";

export interface SearchResult {
  id: string;
  title: string;
  tags: string[];
  description: string;
}

export function useSearchIndex(indexPath: string = "/web/search-index.json") {
  const [query, setQuery] = useState("");
  const [miniSearch, setMiniSearch] = useState<MiniSearch | null>(null);

  const results = useMemo(() => {
    if (miniSearch && query) {
      return miniSearch.search(query, { fuzzy: 0.2 }) as unknown as SearchResult[];
    }
    return [];
  }, [query, miniSearch]);

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const res = await fetch(indexPath);
        const data = await res.json();
        const ms = new MiniSearch({
          fields: ["title", "tags", "description"],
          storeFields: ["title", "tags", "description"],
        });
        ms.addAll(data);
        setMiniSearch(ms);
      } catch (err) {
        console.error("Failed to fetch search index:", err);
      }
    };
    fetchIndex();
  }, [indexPath]);

  return {
    query,
    setQuery,
    results,
    isReady: !!miniSearch,
  };
}
