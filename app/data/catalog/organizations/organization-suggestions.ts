import suggestionsData from "@/data/catalog/stores/suggestions.json";
import type {
  SectionData,
  Suggestion,
  SuggestionsSectionMeta,
} from "@/types/store";

const organizationSuggestionStoreMap: Record<string, string> = {
  "store-1": "lori-massage-parlour",
  "org-trending-2": "lori-massage-parlour",
};

type SuggestionsSection = SectionData<Suggestion, SuggestionsSectionMeta>;

export function getOrganizationSuggestions(
  organizationId: string,
): SuggestionsSection {
  const storeKey =
    organizationSuggestionStoreMap[organizationId] ?? "lori-massage-parlour";
  const sections = suggestionsData as Record<string, SuggestionsSection>;

  return sections[storeKey] ?? sections["lori-massage-parlour"];
}
