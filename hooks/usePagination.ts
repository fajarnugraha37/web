"use client";

import { useState, useCallback, useMemo } from "react";
import { PaginationState } from "@/types";

export interface UsePaginationProps {
  totalRecords: number;
  pageSize: number;
  initialPage?: number;
}

export interface UsePaginationReturn extends PaginationState {
  safePage: number;
  handlePageChange: (newPage: number) => void;
  startIndex: number;
  endIndex: number;
}

export function usePagination({
  totalRecords,
  pageSize,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalRecords / pageSize)),
    [totalRecords, pageSize]
  );

  const safePage = useMemo(
    () => Math.min(Math.max(1, currentPage), totalPages),
    [currentPage, totalPages]
  );

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    currentPage,
    pageSize,
    totalRecords,
    totalPages,
    safePage,
    handlePageChange,
    startIndex,
    endIndex,
  };
}
