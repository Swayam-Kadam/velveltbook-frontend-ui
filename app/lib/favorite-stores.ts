import type { TrendingNearbyItem } from "@/types/home";

export const FAVORITE_STORES_KEY = "velvetbook-favorite-stores";
export const FAVORITE_STORES_EVENT = "favorite-stores-changed";

export type FavoriteStore = TrendingNearbyItem;

function readFavoriteStores(): FavoriteStore[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(FAVORITE_STORES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteStore[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavoriteStores(stores: FavoriteStore[]) {
  localStorage.setItem(FAVORITE_STORES_KEY, JSON.stringify(stores));
  window.dispatchEvent(new Event(FAVORITE_STORES_EVENT));
}

export function getFavoriteStores(): FavoriteStore[] {
  return readFavoriteStores();
}

export function isFavoriteStore(storeId: string) {
  return readFavoriteStores().some((store) => store.id === storeId);
}

export function saveFavoriteStore(store: FavoriteStore) {
  const current = readFavoriteStores();
  if (current.some((item) => item.id === store.id)) return;
  writeFavoriteStores([...current, store]);
}

export function removeFavoriteStore(storeId: string) {
  writeFavoriteStores(
    readFavoriteStores().filter((store) => store.id !== storeId),
  );
}
