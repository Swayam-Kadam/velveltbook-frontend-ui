import { trendingNearbyData } from "@/home/components/trending-nearby/trending-nearby.data";
import type { TrendingNearbyItem } from "@/types/home";

export const MIN_SUGGESTION_STORES = 15;

/** Build at least `minCount` suggestion stores, excluding favourites. */
export function getSuggestionStores(
  excludeStoreIds: string[] = [],
  minCount = MIN_SUGGESTION_STORES,
): TrendingNearbyItem[] {
  const excluded = new Set(excludeStoreIds);
  const pool = trendingNearbyData.filter((item) => !excluded.has(item.id));

  if (pool.length === 0) return [];

  const suggestions: TrendingNearbyItem[] = [];
  let index = 0;

  while (suggestions.length < Math.max(minCount, pool.length)) {
    const base = pool[index % pool.length];
    const cycle = Math.floor(index / pool.length);

    suggestions.push(
      cycle === 0
        ? base
        : {
            ...base,
            id: `${base.id}-suggest-${cycle}`,
          },
    );
    index += 1;
  }

  return suggestions;
}
