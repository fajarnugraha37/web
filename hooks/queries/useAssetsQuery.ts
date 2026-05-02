import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssetItem } from "@/types";
import { ENV } from "@/lib/env";

export const ASSETS_QUERY_KEY = ["assets"];

/**
 * Hook: useAssetsQuery
 * Fetches the list of assets from the server (write mode) or static index (read mode).
 */
export function useAssetsQuery(enabled: boolean = true) {
  return useQuery<AssetItem[], Error>({
    queryKey: ASSETS_QUERY_KEY,
    queryFn: async () => {
      // In production/static mode, fetch from the pre-built JSON index
      // In write/dev mode, fetch from the dynamic API
      const endpoint = ENV.IS_WRITE_MODE ? "/api/labs/assets" : "/assets-index.json";
      
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`Failed to fetch assets: ${res.statusText}`);
      }
      
      const json = await res.json();
      
      // API returns { data: [] }, static file returns [...]
      return ENV.IS_WRITE_MODE ? (json.data || []) : (json || []);
    },
    enabled: enabled,
  });
}

export function useUploadAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data: AssetItem },
    Error,
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      if (!ENV.IS_WRITE_MODE) {
        throw new Error("System in READ_ONLY mode. Transmit disabled.");
      }

      const res = await fetch("/api/labs/assets", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to upload asset");
      }
      const json = await res.json();
      return { success: true, data: json.data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
    },
  });
}

export function useDeleteAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (url: string) => {
      if (!ENV.IS_WRITE_MODE) {
        throw new Error("System in READ_ONLY mode. Purge disabled.");
      }

      const res = await fetch("/api/labs/assets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete asset");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY });
    },
  });
}
