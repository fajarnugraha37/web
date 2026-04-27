"use client";

import { useMemo } from "react";
import { BlogMetadata } from "@/types";

export interface UseBlogFilterProps {
  blogs: BlogMetadata[];
  searchQuery: string;
  selectedTags: string[];
}

export function useBlogFilter({
  blogs,
  searchQuery,
  selectedTags,
}: UseBlogFilterProps) {
  const allTags = useMemo(() => {
    return Array.from(new Set(blogs.flatMap((blog) => blog.tags))).sort();
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags =
        selectedTags.length > 0
          ? selectedTags.every((tag) => blog.tags.includes(tag))
          : true;
      
      return matchesSearch && matchesTags;
    });
  }, [blogs, searchQuery, selectedTags]);

  return {
    filteredBlogs,
    allTags,
  };
}
