"use client";

import { Bookmark, CalendarDays } from "lucide-react";
import Link from "next/link";

import type { TrendingNearbyItem } from "./trending-nearby.types";
import { useFavoriteStoreToggle } from "./useFavoriteStoreToggle";

interface TrendingNearbyActionsProps {
  store: TrendingNearbyItem;
}

export function TrendingNearbyActions({ store }: TrendingNearbyActionsProps) {
  const { saved, toggle } = useFavoriteStoreToggle(store);

  return (
    <div className="mt-5 flex gap-1 lg:mt-4 lg:gap-4">
      <Link
        href="/specificorganizationbook/store-1"
        className="
    primary-button inline-flex flex-1 items-center justify-center gap-2
    rounded-[4px] py-1 text-[8px] font-medium text-white
    lg:py-2 lg:text-[11px]
  "
      >
        <CalendarDays size={12} />
        <span>Book Now</span>
      </Link>

      <button
        type="button"
        onClick={toggle}
        aria-label={saved ? "Remove from favourites" : "Save to favourites"}
        aria-pressed={saved}
        className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-(--border) bg-(--bg-card) transition-colors hover:border-(--accent-primary)/40"
      >
        <Bookmark
          size={23}
          className={
            saved
              ? "fill-(--accent-primary) text-(--accent-primary)"
              : "text-(--text-primary)"
          }
        />
      </button>
    </div>
  );
}
