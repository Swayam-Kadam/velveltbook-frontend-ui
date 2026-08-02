"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGES_PER_WINDOW = 3;

interface DealsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(page: number, totalPages: number) {
  const windowStart =
    Math.floor((page - 1) / PAGES_PER_WINDOW) * PAGES_PER_WINDOW + 1;
  const windowEnd = Math.min(windowStart + PAGES_PER_WINDOW - 1, totalPages);

  return Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, i) => windowStart + i,
  );
}

export function DealsPagination({
  page,
  totalPages,
  onPageChange,
}: DealsPaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav
      aria-label="Deals pagination"
      className="flex items-center justify-center gap-3 px-1 py-2 lg:justify-start lg:gap-5 lg:py-3"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="
          flex items-center gap-0.5 text-[10px] font-semibold text-(--text-primary)
          transition-opacity duration-200 disabled:opacity-30
          lg:gap-1 lg:text-[15px]
        "
      >
        <ChevronLeft className="size-3.5 lg:size-5" strokeWidth={2} />
        <span>Back</span>
      </button>

      <div className="flex items-center gap-1.5 lg:gap-2.5">
        {visiblePages.map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            aria-label={`Page ${pageNum}`}
            aria-current={pageNum === page ? "page" : undefined}
            className={`
              flex h-6 w-6 items-center justify-center rounded-full
              text-[10px] font-semibold transition-all duration-200
              lg:h-11 lg:w-11 lg:text-[15px]
              ${pageNum === page
                ? "primary-button text-white shadow-(--shadow-glow)"
                : "border border-(--border) bg-(--bg-card) text-(--text-secondary) hover:border-(--brand-gold) hover:text-(--text-primary)"
              }
            `}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="
          flex items-center gap-0.5 text-[10px] font-semibold text-(--text-primary)
          transition-opacity duration-200 disabled:opacity-30
          lg:gap-1 lg:text-[15px]
        "
      >
        <span>Next</span>
        <ChevronRight className="size-3.5 lg:size-5" strokeWidth={2} />
      </button>
    </nav>
  );
}
