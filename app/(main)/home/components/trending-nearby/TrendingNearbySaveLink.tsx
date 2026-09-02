"use client";

import { Bookmark } from "lucide-react";

import type { TrendingNearbyItem } from "./trending-nearby.types";
import { useFavoriteStoreToggle } from "./useFavoriteStoreToggle";

interface TrendingNearbySaveLinkProps {
  store: TrendingNearbyItem;
}

export function TrendingNearbySaveLink({ store }: TrendingNearbySaveLinkProps) {
  const { saved, toggle } = useFavoriteStoreToggle(store);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Remove from favourites" : "Save to favourites"}
      aria-pressed={saved}
      className={`
        flex items-center gap-2 text-[13px] font-medium transition
        hover:text-(--accent-primary)
        ${saved ? "text-(--accent-primary)" : "text-(--text-primary)"}
      `}
    >
      <Bookmark
        size={16}
        className={
          saved
            ? "fill-(--accent-primary) text-(--accent-primary)"
            : undefined
        }
      />
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
