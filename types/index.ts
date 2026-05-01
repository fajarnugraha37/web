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

export interface TocHeading {
  level: number;
  text: string;
  id: string;
  children: TocHeading[];
}

// --- Professional & Academic ---

export interface Experience {
  year: string;
  company: string;
  role: string;
  descriptions: string[];
  tech: string[];
}

export interface Education {
  year: string;
  degree: string;
  school: string;
  location: string;
  description: string;
}

export interface ContactLink {
  name: string;
  url: string;
  desc: string;
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
  metadata?: {
    slug: string;
    title: string;
    description: string;
    tags: string[];
  };
}

export type ViewMode = "editor" | "split" | "preview";

// --- Assets Picker ---

export type AssetCategory = "img" | "video" | "audio" | "doc";

export interface AssetItem {
  name: string;
  url: string;
  category: AssetCategory;
  size: number;
  lastModified: number;
}
