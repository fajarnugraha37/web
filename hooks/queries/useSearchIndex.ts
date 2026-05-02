"use client";

import { useState, useMemo } from "react";
import MiniSearch from "minisearch";
import { useQuery } from "@tanstack/react-query";

export interface SearchResult {
  id: string;
  title: string;
  tags: string[];
  description: string;
}

export function useSearchIndex(indexPath: string = "/search-index.json") {
  const [query, setQuery] = useState("");

  const { data: miniSearch, isSuccess } = useQuery({
    queryKey: ["search-index", indexPath],
    queryFn: async () => {
      const res = await fetch(indexPath);
      if (!res.ok) throw new Error("Failed to fetch search index");
      const data = await res.json();
      const ms = new MiniSearch({
        fields: ["title", "tags", "description"],
        storeFields: ["title", "tags", "description"],
      });
      ms.addAll(data);
      return ms;
    },
    staleTime: Infinity,
  });

  const results = useMemo(() => {
    if (miniSearch && query) {
      return miniSearch.search(query, { fuzzy: 0.2 }) as unknown as SearchResult[];
    }
    return [];
  }, [query, miniSearch]);

  return {
    query,
    setQuery,
    results,
    isReady: isSuccess,
  };
}
