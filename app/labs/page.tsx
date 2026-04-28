import { LabsDashboardContent } from "@/components/organisms/LabsDashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laboratory | Fajar Abdi Nugraha",
  description: "Experimental hub for WASM databases, big data analytics, and interactive neural mapping.",
};

/**
 * Laboratory Dashboard Page
 * Serves as the central hub for accessing various experimental modules.
 */
export default function LabsDashboard() {
  return <LabsDashboardContent />;
}
