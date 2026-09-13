"use client";

import Link from "next/link";
import { Settings2 } from "lucide-react";

import { TrendingNearbyCard } from "@/home/components/trending-nearby/TrendingNearbyCard";
import { getSuggestionStores } from "./suggestion-stores";

const DESKTOP_PANEL_HEIGHT = "h-[calc(100vh-7rem)]";

interface FavoriteStoresSuggestionsSidebarProps {
  excludeStoreIds?: string[];
  title?: string;
}

export function FavoriteStoresSuggestionsSidebar({
  excludeStoreIds = [],
  title = "Suggestions",
}: FavoriteStoresSuggestionsSidebarProps) {
  const suggestions = getSuggestionStores(excludeStoreIds);

  return (
    <aside className="hidden w-[min(100%,420px)] shrink-0 lg:sticky lg:top-24 lg:flex lg:flex-col lg:self-start xl:w-[460px]">
      <div
        className={`
          flex ${DESKTOP_PANEL_HEIGHT} flex-col overflow-hidden rounded-[22px]
          border border-(--border)
          bg-[color-mix(in_srgb,var(--accent-primary)_7%,var(--bg-primary))]
          shadow-(--shadow-card)
        `}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-(--border) bg-(--bg-card)/70 px-4 py-4">
          <h2 className="font-[family-name:var(--font-heading)] text-[20px] font-semibold text-(--text-primary)">
            {title}
          </h2>
          <button
            type="button"
            aria-label={`Filter ${title.toLowerCase()}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border) bg-(--bg-card) text-(--text-muted) transition-colors hover:bg-(--bg-card-hover) hover:text-(--text-primary)"
          >
            <Settings2 size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 scrollbar-thin scrollbar-thumb-(--accent-primary)/30 scrollbar-track-transparent">
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <div key={item.id} className="min-w-0">
                <TrendingNearbyCard item={item} variant="favorite" />
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-(--text-muted)">
              No suggestions right now.
            </p>
          )}
        </div>

        <div className="shrink-0 border-t border-(--border) bg-(--bg-card)/70 px-4 py-3 text-center">
          <Link
            href="/home"
            className="text-[13px] font-semibold text-(--accent-primary) transition-opacity hover:opacity-80"
          >
            View More &gt;
          </Link>
        </div>
      </div>
    </aside>
  );
}
