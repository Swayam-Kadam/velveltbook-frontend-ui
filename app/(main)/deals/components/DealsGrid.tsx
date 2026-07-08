"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { DEALS_PAGE_SIZE } from "../deals.constants";
import type { Deal } from "../deals.types";
import { DealCard } from "./DealCard";
import { PackageCard } from "./PackageCard";

interface DealsGridProps {
  allDeals: Deal[];
  page: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onBookClick?: (deal: Deal) => void;
}

function splitRowDeals(deals: Deal[]) {
  const row1: Deal[] = [];
  const row2: Deal[] = [];

  for (let i = 0; i < deals.length; i += DEALS_PAGE_SIZE) {
    const chunk = deals.slice(i, i + DEALS_PAGE_SIZE);
    row1.push(...chunk.slice(0, 2));
    row2.push(...chunk.slice(2, 4));
  }

  return { row1, row2 };
}

function DealCardItem({
  deal,
  onBookClick,
}: {
  deal: Deal;
  onBookClick?: (deal: Deal) => void;
}) {
  return (
    <div data-deal-card className="w-[calc(50%-4px)] shrink-0 snap-start">
      {deal.type === "single" ? (
        <DealCard deal={deal} onBookClick={onBookClick} />
      ) : (
        <PackageCard deal={deal} onBookClick={onBookClick} />
      )}
    </div>
  );
}

interface DealsScrollRowProps {
  deals: Deal[];
  rowRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onBookClick?: (deal: Deal) => void;
}

function DealsScrollRow({ deals, rowRef, onScroll, onBookClick }: DealsScrollRowProps) {
  return (
    <div
      ref={rowRef}
      onScroll={onScroll}
      className="scrollbar-none flex snap-x snap-mandatory gap-2 overflow-x-auto px-1"
    >
      {deals.map((deal) => (
        <DealCardItem key={deal.id} deal={deal} onBookClick={onBookClick} />
      ))}
    </div>
  );
}

export function DealsGrid({
  allDeals,
  page,
  isLoading,
  onPageChange,
  onBookClick,
}: DealsGridProps) {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const { row1, row2 } = useMemo(() => splitRowDeals(allDeals), [allDeals]);

  const scrollToPage = useCallback(
    (targetPage: number, behavior: ScrollBehavior = "smooth") => {
      const row = row1Ref.current;
      if (!row) return;

      const card = row.querySelector<HTMLElement>("[data-deal-card]");
      if (!card) return;

      const gap = 8;
      const cardWidth = card.offsetWidth + gap;
      const scrollLeft = (targetPage - 1) * 2 * cardWidth;

      isSyncing.current = true;
      row1Ref.current?.scrollTo({ left: scrollLeft, behavior });
      row2Ref.current?.scrollTo({ left: scrollLeft, behavior });

      window.setTimeout(() => {
        isSyncing.current = false;
      }, behavior === "smooth" ? 350 : 0);
    },
    [],
  );

  useEffect(() => {
    scrollToPage(page, "auto");
  }, [page, row1.length, row2.length, scrollToPage]);

  const handleRowScroll = useCallback(
    (source: "row1" | "row2") => () => {
      if (isSyncing.current) return;

      const sourceRow = source === "row1" ? row1Ref.current : row2Ref.current;
      const targetRow = source === "row1" ? row2Ref.current : row1Ref.current;
      if (!sourceRow) return;

      const card = sourceRow.querySelector<HTMLElement>("[data-deal-card]");
      if (!card) return;

      const gap = 8;
      const cardWidth = card.offsetWidth + gap;
      const cardsScrolled = Math.round(sourceRow.scrollLeft / cardWidth);
      const newPage = Math.floor(cardsScrolled / 2) + 1;
      const totalPages = Math.max(1, Math.ceil(allDeals.length / DEALS_PAGE_SIZE));

      isSyncing.current = true;
      if (targetRow) {
        targetRow.scrollLeft = sourceRow.scrollLeft;
      }

      if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
        onPageChange(newPage);
      }

      window.setTimeout(() => {
        isSyncing.current = false;
      }, 50);
    },
    [allDeals.length, onPageChange, page],
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, row) => (
          <div key={row} className="flex gap-2 overflow-hidden px-1">
            {Array.from({ length: 2 }).map((__, col) => (
              <div
                key={col}
                className="h-[280px] w-[calc(50%-4px)] shrink-0 animate-pulse rounded-xl border border-(--border) bg-(--bg-card)"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (allDeals.length === 0) {
    return (
      <div className="px-1 py-8 text-center">
        <p className="text-[13px] font-medium text-(--text-primary)">No deals found</p>
        <p className="mt-1 text-[11px] text-(--text-secondary)">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DealsScrollRow
        deals={row1}
        rowRef={row1Ref}
        onScroll={handleRowScroll("row1")}
        onBookClick={onBookClick}
      />
      <DealsScrollRow
        deals={row2}
        rowRef={row2Ref}
        onScroll={handleRowScroll("row2")}
        onBookClick={onBookClick}
      />
    </div>
  );
}
