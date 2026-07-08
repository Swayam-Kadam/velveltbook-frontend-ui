import type {
  DealsLanguageFilter,
  DealsNationalityFilter,
  DealsPriceFilter,
  DealsSuburbFilter,
} from "@/types/deal";

export const SUBURB_FILTER_OPTIONS: {
  value: DealsSuburbFilter;
  label: string;
}[] = [
  { value: "all", label: "All Suburbs" },
  { value: "melbourne-cbd", label: "Melbourne CBD" },
  { value: "richmond", label: "Richmond" },
  { value: "south-yarra", label: "South Yarra" },
  { value: "fitzroy", label: "Fitzroy" },
  { value: "south-melbourne", label: "South Melbourne" },
  { value: "prahran", label: "Prahran" },
];

export const LANGUAGE_FILTER_OPTIONS: {
  value: DealsLanguageFilter;
  label: string;
}[] = [
  { value: "all", label: "All Languages" },
  { value: "english", label: "English" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "chinese", label: "Chinese" },
  { value: "thai", label: "Thai" },
  { value: "hindi", label: "Hindi" },
  { value: "korean", label: "Korean" },
  { value: "japanese", label: "Japanese" },
  { value: "philippines", label: "Philippines" },
];

export const PRICE_FILTER_OPTIONS: {
  value: DealsPriceFilter;
  label: string;
}[] = [
  { value: "any", label: "Any Price" },
  { value: "under-30", label: "$0 - $30" },
  { value: "30-75", label: "$30 - $75" },
  { value: "75-150", label: "$75 - $150" },
  { value: "150-plus", label: "$150 & above" },
];

export const NATIONALITY_FILTER_OPTIONS: {
  value: DealsNationalityFilter;
  label: string;
}[] = [
  { value: "all", label: "All Nationalities" },
  { value: "aussie", label: "Aussie" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "chinese", label: "Chinese" },
  { value: "thai", label: "Thai" },
  { value: "indian", label: "Indian" },
  { value: "korean", label: "Korean" },
  { value: "japanese", label: "Japanese" },
  { value: "philippines", label: "Philippines" },
];

export const SUBURB_LOCATION_MATCH: Record<
  Exclude<DealsSuburbFilter, "all">,
  string[]
> = {
  "melbourne-cbd": [
    "Collins",
    "Bourke",
    "Flinders",
    "Lonsdale",
    "Elizabeth",
    "Swanston",
    "Little Collins",
  ],
  richmond: ["Richmond", "Bridge Rd"],
  "south-yarra": ["South Yarra", "Toorak"],
  fitzroy: ["Fitzroy"],
  "south-melbourne": ["South Melbourne", "Albert Rd", "Southbank"],
  prahran: ["Prahran", "Chapel St"],
};
