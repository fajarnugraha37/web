import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENV } from "@/lib/env";

export const MARKDOWN_QUERY_KEY = ["markdown", "blogs"];

export function useRemoteBlogs(params?: { 
  query?: string; 
  tag?: string; 
  page?: number; 
  limit?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: [...MARKDOWN_QUERY_KEY, params],
    queryFn: async () => {
      // In Read mode, we don't have a dynamic search API
      if (!ENV.IS_WRITE_MODE) {
        return { data: [], meta: { totalPages: 1 } };
      }

      const searchParams = new URLSearchParams();
      if (params?.query) searchParams.append("query", params.query);
      if (params?.tag) searchParams.append("tag", params.tag);
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());

      const res = await fetch(`/api/labs/markdown?${searchParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
    enabled: params?.enabled !== false && ENV.IS_WRITE_MODE,
  });
}

export function useMarkdownPostQuery(slug: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: [...MARKDOWN_QUERY_KEY, "post", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      // In Read mode, try to fetch the raw MDX from the public content folder if needed,
      // but usually the Content Editor is for WRITE mode.
      const res = await fetch(`/api/labs/markdown/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      const json = await res.json();
      return json.data;
    },
    enabled: !!slug && enabled && ENV.IS_WRITE_MODE,
  });
}

export function useSaveBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { slug: string; title: string; description: string; tags: string[]; content: string }) => {
      if (!ENV.IS_WRITE_MODE) throw new Error("System in READ_ONLY mode");

      const res = await fetch("/api/labs/markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save content");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKDOWN_QUERY_KEY });
    },
  });
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      if (!ENV.IS_WRITE_MODE) throw new Error("System in READ_ONLY mode");

      const res = await fetch(`/api/labs/markdown/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete content");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKDOWN_QUERY_KEY });
    },
  });
}

export function useGithubMarkdownMutation() {
  return useMutation({
    mutationFn: async (githubUrl: string) => {
      let rawUrl = githubUrl;
      if (githubUrl.includes("github.com") && !githubUrl.includes("raw.githubusercontent.com")) {
        rawUrl = githubUrl
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");
      }
      const res = await fetch(rawUrl);
      if (!res.ok) throw new Error("Failed to fetch from GitHub");
      const text = await res.text();
      const name = rawUrl.split("/").pop() || "github_import.md";
      return { name, text };
    },
  });
}
