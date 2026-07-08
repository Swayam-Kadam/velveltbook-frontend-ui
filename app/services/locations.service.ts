import { MOCK_LOCATIONS } from "@/data/shared/suburbs";
import { simulateFetch } from "@/lib/api/simulate";
import type { LocationSuggestion } from "@/types/booking";

export function filterLocationsSync(query: string): LocationSuggestion[] {
  const q = query.trim().toLowerCase();
  const results = q
    ? MOCK_LOCATIONS.filter(
        (loc) =>
          loc.label.toLowerCase().includes(q) ||
          loc.suburb.toLowerCase().includes(q),
      )
    : MOCK_LOCATIONS.slice(0, 6);
  return results.slice(0, 8);
}

export async function searchLocations(
  query: string,
): Promise<LocationSuggestion[]> {
  return simulateFetch(filterLocationsSync(query), 120);
}
