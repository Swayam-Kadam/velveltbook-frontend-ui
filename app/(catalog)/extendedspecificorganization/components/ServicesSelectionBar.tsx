"use client";

import { CalendarDays, ChevronRight } from "lucide-react";

interface ServicesSelectionBarProps {
  selectedCount: number;
  onBookNow: () => void;
}

export function ServicesSelectionBar({
  selectedCount,
  onBookNow,
}: ServicesSelectionBarProps) {
  const hasSelection = selectedCount > 0;

  return (
    <div
      className="
        mt-4 overflow-hidden rounded-xl
        border border-[color-mix(in_srgb,var(--accent-primary)_20%,var(--border))]
        primary-button shadow-(--shadow-glow)
      "
    >
      <button
        type="button"
        onClick={onBookNow}
        disabled={!hasSelection}
        className={`
          relative flex w-full items-center justify-center gap-2
          py-3.5 text-[11px] font-medium text-white
          transition-opacity duration-200
          ${hasSelection ? "hover:opacity-90" : "cursor-not-allowed opacity-50"}
        `}
      >
        <CalendarDays
          size={16}
          strokeWidth={1.8}
          className="absolute left-4"
        />
        <span>{hasSelection ? "Book Now" : "Select services to continue"}</span>
        <ChevronRight
          size={16}
          strokeWidth={2}
          className="absolute right-4"
        />
      </button>
    </div>
  );
}
