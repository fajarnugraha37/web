import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AssetItem } from "@/types";

export const ASSETS_QUERY_KEY = ["assets"];

export function useAssetsQuery() {
  return useQuery<AssetItem[], Error>({
    queryKey: ASSETS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/labs/assets");
      if (!res.ok) {
        throw new Error("Failed to fetch assets");
      }
      const json = await res.json();
      return json.data || [];
    },
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
