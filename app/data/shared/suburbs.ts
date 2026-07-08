import type { LocationSuggestion } from "@/types/booking";

/** Melbourne suburb options for location search (booking flow). */
export const MOCK_LOCATIONS: LocationSuggestion[] = [
  { id: "south-yarra", label: "South Yarra, 3141 VIC", suburb: "South Yarra" },
  { id: "richmond", label: "Richmond, 3121 VIC", suburb: "Richmond" },
  { id: "st-kilda", label: "St Kilda, 3182 VIC", suburb: "St Kilda" },
  { id: "carlton", label: "Carlton, 3053 VIC", suburb: "Carlton" },
  { id: "fitzroy", label: "Fitzroy, 3065 VIC", suburb: "Fitzroy" },
  { id: "brunswick", label: "Brunswick, 3056 VIC", suburb: "Brunswick" },
  { id: "southbank", label: "Southbank, 3006 VIC", suburb: "Southbank" },
  { id: "cbd", label: "Melbourne CBD, 3000 VIC", suburb: "CBD" },
  { id: "prahran", label: "Prahran, 3181 VIC", suburb: "Prahran" },
  { id: "hawthorn", label: "Hawthorn, 3122 VIC", suburb: "Hawthorn" },
  { id: "collingwood", label: "Collingwood, 3066 VIC", suburb: "Collingwood" },
  { id: "docklands", label: "Docklands, 3008 VIC", suburb: "Docklands" },
  { id: "footscray", label: "Footscray, 3011 VIC", suburb: "Footscray" },
  { id: "camberwell", label: "Camberwell, 3124 VIC", suburb: "Camberwell" },
  { id: "toorak", label: "Toorak, 3142 VIC", suburb: "Toorak" },
];

/** Suburb labels for the experts page toolbar dropdown. */
export const EXPERT_SUBURB_OPTIONS = [
  "All Melbourne",
  "CBD",
  "Southbank",
  "Richmond",
  "St Kilda",
  "Carlton",
  "Fitzroy",
  "Brunswick",
  "Docklands",
  "South Yarra",
  "Prahran",
  "Footscray",
] as const;
