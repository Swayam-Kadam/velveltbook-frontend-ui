"use client";

import { useEffect, useState } from "react";
import { Bookmark, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  isFavoriteStore,
  saveFavoriteStore,
  removeFavoriteStore,
  FAVORITE_STORES_EVENT,
} from "@/lib/favorite-stores";
import type { TrendingNearbyItem } from "./trending-nearby.types";

interface TrendingNearbyActionsProps {
  store: TrendingNearbyItem;
}

export function TrendingNearbyActions({ store }: TrendingNearbyActionsProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isFavoriteStore(store.id));

    sync();
    window.addEventListener(FAVORITE_STORES_EVENT, sync);
    return () => window.removeEventListener(FAVORITE_STORES_EVENT, sync);
  }, [store.id]);

  const handleSave = () => {
    if (saved) {
      removeFavoriteStore(store.id);
      setSaved(false);
      return;
    }

    saveFavoriteStore(store);
    setSaved(true);
    // router.push("/favoritestore");
  };

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
        onClick={handleSave}
        aria-label={saved ? "Remove from favourites" : "Save to favourites"}
        aria-pressed={saved}
        className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-(--border) bg-(--bg-card) transition-colors hover:border-(--accent-primary)/40"
      >
        <Bookmark
          size={14}
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
