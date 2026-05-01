/**
 * Centralized Environment Variables
 */
export const ENV = {
  APP_MODE: process.env.NEXT_PUBLIC_APP_MODE || "read",
  IS_WRITE_MODE: process.env.NEXT_PUBLIC_APP_MODE === "write",
  DISABLE_HMR: process.env.DISABLE_HMR === "true",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://fajarnugraha37.github.io",
  IS_DEV: process.env.NODE_ENV === "development",
};
