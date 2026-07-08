/**
 * Shared domain types. Import from specific modules (e.g. `@/types/deal`)
 * when names collide across domains (SortOption, FilterGroup).
 */
export * from "./expert";
export * from "./legacy-expert";
export * from "./store";
export * from "./booking";
export * from "./organization";
export * from "./help";
export * from "./message";
export * from "./home";
export * from "./service-catalog";

export type {
  DealType,
  DealCategory,
  DealsSuburbFilter,
  DealsLanguageFilter,
  DealsPriceFilter,
  DealsNationalityFilter,
  DealService,
  BaseDeal,
  SingleDeal,
  PackageDeal,
  Deal,
  StoreProfile,
  StoreDealsResponse,
  DealsQueryParams,
  DealsFilterState,
  SortOption as DealsSortOption,
} from "./deal";

export type {
  FilterOption as SharedFilterOption,
  FilterGroup as SharedFilterGroup,
  SuburbOption,
  CategoryOption,
} from "./filter";
