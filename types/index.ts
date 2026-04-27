/**
 * Global Type Definitions
 * 
 * Central source of truth for all domain entities, database states,
 * and common UI patterns.
 */

// --- Blog & Content ---

export interface BlogMetadata {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
}

export interface ContentStats {
  charCount: number;
  wordCount: number;
  readingTime: number;
}

export interface Blog extends BlogMetadata {
  content: string;
  stats: ContentStats;
}

// --- Database & Labs ---

export type DbStatus = "initializing" | "ready" | "error" | "volatile" | "executing";

export interface QueryResult {
  rows: any[];
  result?: any;
}

// --- UI & State ---

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

// --- Lab Specifics ---

export interface LabFile {
  id: string;
  name: string;
  content: string;
}

export type ViewMode = "editor" | "split" | "preview";
