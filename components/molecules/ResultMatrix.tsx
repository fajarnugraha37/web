"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface ResultMatrixProps {
  results: any[] | null;
  error: string | null;
  executionTime: number | null;
  onExportFull?: () => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

const PAGE_SIZE_OPTIONS = [10, 50, 100, 500, 1000];

export function ResultMatrix({
  results,
  error,
  executionTime,
  onExportFull,
  pagination,
}: ResultMatrixProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(pagination.totalRecords / pagination.pageSize);

  const columns = useMemo(() => {
    if (!results || results.length === 0) return [];
    return Object.keys(results[0]);
  }, [results]);

  const rowVirtualizer = useVirtualizer({
    count: results?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  const exportCurrentPage = () => {
    if (!results || results.length === 0) return;
    const headers = Object.keys(results[0]);
    const csvContent = [
      headers.join(','),
      ...results.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `query_results_page_${pagination.currentPage}.csv`;
    link.click();
  };

  if (error) {
    return (
      <div className="flex-1 min-h-[200px] border border-destructive/30 bg-destructive/5 p-6 font-mono text-sm overflow-auto relative">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <span className="animate-pulse">⚠</span>
          <span className="font-bold">QUERY_FAILURE:</span>
        </div>
        <pre className="text-destructive/90 whitespace-pre-wrap">{error}</pre>
        <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,51,102,0.05)_2px,rgba(255,51,102,0.05)_4px)]" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex-1 min-h-[200px] border border-border bg-card/20 flex items-center justify-center font-mono text-xs text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-pulse">[ WAITING_FOR_INPUT ]</span>
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-[400px] border border-border bg-[#0a0a0f] overflow-hidden relative">
      {/* HUD Telemetry Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 font-mono text-[10px] tracking-tight relative z-10">
        <div className="flex items-center gap-4">
          <span className="text-accent">MATRIX_VIEW: ACTIVE</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-accent-secondary">
            RECORDS_IN_VIEW: {results.length} / {pagination.totalRecords}
          </span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-2 mr-4 border-r border-border pr-4">
            <button 
              onClick={exportCurrentPage}
              className="hover:text-accent transition-colors"
            >
              [EXPORT_PAGE]
            </button>
            <button 
              onClick={onExportFull}
              className="hover:text-accent transition-colors"
            >
              [EXPORT_FULL]
            </button>
          </div>
          <span>LATENCY: {executionTime?.toFixed(2)}ms</span>
        </div>
      </div>

      {/* Table Container */}
      <div
        ref={parentRef}
        className="flex-1 overflow-auto relative font-mono text-[11px]"
      >
        {/* Header Row (Fixed) - Moved outside the relative height div to avoid overlap with absolute rows */}
        <div className="sticky top-0 z-20 flex bg-[#12121a] border-b border-border shadow-lg">
          {columns.map((col) => (
            <div
              key={col}
              className="flex-1 min-w-[150px] px-3 py-2 text-accent font-bold uppercase tracking-wider border-r border-border/50 bg-accent/5"
            >
              {col}
            </div>
          ))}
        </div>

        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* Virtualized Rows */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = results[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                className={`absolute top-0 left-0 w-full flex border-b border-border/30 hover:bg-accent/5 transition-colors ${
                  virtualRow.index % 2 === 0 ? "bg-white/[0.02]" : ""
                }`}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {columns.map((col) => (
                  <div
                    key={col}
                    className="flex-1 min-w-[150px] px-3 py-2 border-r border-border/20 truncate text-foreground/80"
                  >
                    {row[col] === null ? (
                      <span className="text-muted-foreground opacity-30 italic">
                        NULL
                      </span>
                    ) : typeof row[col] === "object" ? (
                      <span className="text-accent-tertiary">
                        {JSON.stringify(row[col])}
                      </span>
                    ) : (
                      String(row[col])
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* IDE-style Pagination Footer */}
      <div className="border-t border-border bg-muted/20 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground uppercase">Page Size:</span>
            <select
              value={pagination.pageSize}
              onChange={(e) =>
                pagination.onPageSizeChange(Number(e.target.value))
              }
              className="bg-background border border-border px-1 py-0.5 text-accent focus:border-accent outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <span className="text-muted-foreground">
            {pagination.totalRecords > 0 ? (
              <>
                OFFSET: {(pagination.currentPage - 1) * pagination.pageSize} |
                TOTAL: {pagination.totalRecords}
              </>
            ) : (
              "READY"
            )}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <PaginationButton
            onClick={() => pagination.onPageChange(1)}
            disabled={
              pagination.currentPage === 1 || pagination.totalRecords === 0
            }
            icon={<ChevronsLeft className="w-3 h-3" />}
          />
          <PaginationButton
            onClick={() =>
              pagination.onPageChange(Math.max(1, pagination.currentPage - 1))
            }
            disabled={
              pagination.currentPage === 1 || pagination.totalRecords === 0
            }
            icon={<ChevronLeft className="w-3 h-3" />}
          />

          <div className="px-3 py-0.5 border border-border bg-background text-accent flex items-center gap-1">
            <span className="text-muted-foreground">PAGE</span>
            <span>{pagination.currentPage}</span>
            <span className="text-muted-foreground">/</span>
            <span>{Math.max(1, totalPages)}</span>
          </div>

          <PaginationButton
            onClick={() =>
              pagination.onPageChange(
                Math.min(totalPages, pagination.currentPage + 1),
              )
            }
            disabled={
              pagination.currentPage >= totalPages ||
              pagination.totalRecords === 0
            }
            icon={<ChevronRight className="w-3 h-3" />}
          />
          <PaginationButton
            onClick={() => pagination.onPageChange(totalPages)}
            disabled={
              pagination.currentPage >= totalPages ||
              pagination.totalRecords === 0
            }
            icon={<ChevronsRight className="w-3 h-3" />}
          />
        </div>
      </div>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] cyber-grid-bg" />
    </div>
  );
}

function PaginationButton({
  onClick,
  disabled,
  icon,
}: {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-1 border border-border bg-card/60 hover:border-accent hover:text-accent disabled:opacity-20 disabled:cursor-not-allowed transition-all"
    >
      {icon}
    </button>
  );
}
