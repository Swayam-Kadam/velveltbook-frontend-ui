import { expertProviders } from "@/data/main/home/expert-providers";
import { nationalityProviders } from "@/data/main/home/nationality-providers";
import { trendingNearbyData } from "@/home/components/trending-nearby/trending-nearby.data";
import type { TrendingNearbyItem } from "@/types/home";

function toSuggestionItem(item: TrendingNearbyItem): TrendingNearbyItem {
  return {
    id: item.id,
    name: item.name,
    image: item.image,
    avatar: item.avatar,
    service: item.service,
    address: item.address,
    desktopService: item.desktopService,
    rating: item.rating,
    reviews: item.reviews,
    description: item.description,
    desktopServices: item.desktopServices,
    availability: item.availability,
    distance: item.distance,
    online: item.online,
    organizationId: item.organizationId,
    category: item.category,
  };
}

/** Unique suggestion stores (no duplicate names/ids), excluding favourites. */
export function getSuggestionStores(
  excludeStoreIds: string[] = [],
): TrendingNearbyItem[] {
  const excluded = new Set(excludeStoreIds);
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const suggestions: TrendingNearbyItem[] = [];

  const candidates = [
    ...expertProviders,
    ...nationalityProviders,
    ...trendingNearbyData,
  ];

  for (const item of candidates) {
    if (excluded.has(item.id) || seenIds.has(item.id)) continue;

    const nameKey = item.name.trim().toLowerCase();
    if (seenNames.has(nameKey)) continue;

    seenIds.add(item.id);
    seenNames.add(nameKey);
    suggestions.push(toSuggestionItem(item));
  }

  return suggestions;
}
