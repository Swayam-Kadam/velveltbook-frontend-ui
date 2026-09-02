"use client";

import { useCallback, useEffect, useState } from "react";

import {
  FAVORITE_STORES_EVENT,
  isFavoriteStore,
  removeFavoriteStore,
  saveFavoriteStore,
} from "@/lib/favorite-stores";
import type { TrendingNearbyItem } from "./trending-nearby.types";

export function useFavoriteStoreToggle(store: TrendingNearbyItem) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isFavoriteStore(store.id));

    sync();
    window.addEventListener(FAVORITE_STORES_EVENT, sync);
    return () => window.removeEventListener(FAVORITE_STORES_EVENT, sync);
  }, [store.id]);

  const toggle = useCallback(() => {
    if (isFavoriteStore(store.id)) {
      removeFavoriteStore(store.id);
      setSaved(false);
      return;
    }

    saveFavoriteStore(store);
    setSaved(true);
  }, [store]);

  return { saved, toggle };
}
