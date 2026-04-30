"use client";

import React from "react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Terminal } from "lucide-react";

export function BlogsHeader() {
  return (
    <PageHeader 
      title="BLOGS"
      tagText="DATA_STREAM // KNOWLEDGE_ARCHIVE"
      tagIcon={Terminal}
      subtitle="Archived knowledge fragments..."
      className="mb-12"
    />
  );
}
