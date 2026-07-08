"use client";

import { useEffect } from "react";
import {
  ArrowUpDown,
  DollarSign,
  Globe,
  MapPin,
  UserRound,
  X,
} from "lucide-react";
import {
  LANGUAGE_FILTER_OPTIONS,
  NATIONALITY_FILTER_OPTIONS,
  PRICE_FILTER_OPTIONS,
  SUBURB_FILTER_OPTIONS,
} from "../deals.filters.data";
import { SORT_OPTIONS } from "../deals.data";
import type {
  DealsFilterState,
  DealsLanguageFilter,
  DealsNationalityFilter,
  DealsPriceFilter,
  DealsSuburbFilter,
  SortOption,
} from "../deals.types";
import { DealsFilterDropdown } from "./DealsFilterDropdown";

const PANEL_TRANSITION_MS = 320;

interface DealsFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Pick<
    DealsFilterState,
    "suburb" | "language" | "price" | "nationality" | "sort"
  >;
  onSuburbChange: (value: DealsSuburbFilter) => void;
  onLanguageChange: (value: DealsLanguageFilter) => void;
  onPriceChange: (value: DealsPriceFilter) => void;
  onNationalityChange: (value: DealsNationalityFilter) => void;
  onSortChange: (value: SortOption) => void;
  onReset: () => void;
  /** Extra classes on overlay + panel (e.g. `lg:hidden` when embedded on home). */
  className?: string;
}

export function DealsFilterSidebar({
  isOpen,
  onClose,
  filters,
  onSuburbChange,
  onLanguageChange,
  onPriceChange,
  onNationalityChange,
  onSortChange,
  onReset,
  className = "",
}: DealsFilterSidebarProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };

    document.addEventListener("keydown", handleEscape);

    if (!isOpen) {
      return () => document.removeEventListener("keydown", handleEscape);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.setTimeout(() => {
        document.body.style.overflow = previousOverflow;
      }, PANEL_TRANSITION_MS);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        className={`
          fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px]
          transition-opacity duration-300 ease-out
          ${className}
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Deal filters"
        aria-hidden={!isOpen}
        className={`
          fixed inset-y-0 left-0 z-[60] flex w-[min(100%,200px)] flex-col
          border-r border-(--border) bg-(--bg-primary)
          shadow-(--shadow-card)
          transition-transform duration-300 ease-out
          ${className}
          ${isOpen ? "translate-x-0" : "pointer-events-none -translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-4">
          <h2 className="text-[20px] font-semibold text-(--text-primary)">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="
              flex h-8 w-8 items-center justify-center rounded-full
              text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
            "
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <DealsFilterDropdown
            icon={MapPin}
            label="Suburbs"
            value={filters.suburb}
            options={SUBURB_FILTER_OPTIONS}
            onChange={onSuburbChange}
          />

          <DealsFilterDropdown
            icon={Globe}
            label="Languages"
            value={filters.language}
            options={LANGUAGE_FILTER_OPTIONS}
            onChange={onLanguageChange}
          />

          <DealsFilterDropdown
            icon={DollarSign}
            label="Price"
            value={filters.price}
            options={PRICE_FILTER_OPTIONS}
            onChange={onPriceChange}
          />

          <DealsFilterDropdown
            icon={UserRound}
            label="Nationalities"
            value={filters.nationality}
            options={NATIONALITY_FILTER_OPTIONS}
            onChange={onNationalityChange}
          />

          <DealsFilterDropdown
            icon={ArrowUpDown}
            label="Sort by"
            value={filters.sort}
            options={SORT_OPTIONS}
            onChange={onSortChange}
          />
        </div>

        <div className="space-y-2 border-t border-(--border) p-4">
          <button
            type="button"
            onClick={onReset}
            className="
              w-full rounded-full border border-(--border)
              bg-(--bg-card) py-2.5 text-[11px] font-medium text-(--text-primary)
              transition-colors hover:border-(--brand-gold)
            "
          >
            Reset Filters
          </button>
          <button
            type="button"
            onClick={onClose}
            className="primary-button w-full rounded-full py-2.5 text-[12px] font-medium text-white"
          >
            Apply
          </button>
        </div>
      </aside>
    </>
  );
}
