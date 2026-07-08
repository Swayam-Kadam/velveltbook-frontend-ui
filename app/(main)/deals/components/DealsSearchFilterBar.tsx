"use client";

import { Filter, Search } from "lucide-react";
import type { DealType } from "../deals.types";

interface DealsSearchFilterBarProps {
  dealType: DealType;
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
}

const placeholders = {
  single: "Search services, salons, or spas...",
  package: "Search for packages, salons, or spas...",
};

export function DealsSearchFilterBar({
  dealType,
  value,
  onChange,
  onFilterClick,
}: DealsSearchFilterBarProps) {
  return (
    <div className="flex items-center gap-2 px-1">
      <div
        className="
          search-glass
          flex h-10 flex-1 items-center gap-2
          rounded-xl border px-3
          backdrop-blur-2xl
        "
      >
        <Search
          className="h-3.5 w-3.5 shrink-0 text-(--text-secondary)"
          strokeWidth={1.4}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholders[dealType]}
          className="
            flex-1 bg-transparent text-[11px] text-(--text-primary)
            placeholder:text-(--text-muted) focus:outline-none
          "
        />
      </div>

      <button
        type="button"
        onClick={onFilterClick}
        className="
          search-glass
          flex h-10 shrink-0 items-center gap-1.5
          rounded-xl border px-3
          text-[10px] font-medium text-(--text-primary)
          transition-all duration-200
          hover:border-[color-mix(in_srgb,var(--accent-glow)_18%,transparent)]
        "
      >
        <Filter size={12} strokeWidth={1.5} />
        Filters
      </button>
    </div>
  );
}
