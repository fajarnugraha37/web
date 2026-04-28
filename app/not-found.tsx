import { NotFoundContent } from "@/components/organisms/NotFoundContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 // PAGE_NOT_FOUND",
  description: "The requested node does not exist in this sector of the net.",
};

/**
 * 404 Not Found Page
 * Standardized system error fallback.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
