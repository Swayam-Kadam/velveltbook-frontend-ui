export type DealType = "single" | "package";

export type DealCategory =
  | "all"
  | "hair"
  | "massage"
  | "facial"
  | "nails"
  | "spa"
  | "barber"
  | "makeup"
  | "more";

export type SortOption =
  | "popular"
  | "price-low"
  | "price-high"
  | "discount"
  | "rating";

export type DealsSuburbFilter =
  | "all"
  | "melbourne-cbd"
  | "richmond"
  | "south-yarra"
  | "fitzroy"
  | "south-melbourne"
  | "prahran";

export type DealsLanguageFilter =
  | "all"
  | "english"
  | "vietnamese"
  | "chinese"
  | "thai"
  | "hindi"
  | "korean"
  | "japanese"
  | "philippines";

export type DealsPriceFilter =
  | "any"
  | "under-30"
  | "30-75"
  | "75-150"
  | "150-plus";

export type DealsNationalityFilter =
  | "all"
  | "aussie"
  | "vietnamese"
  | "chinese"
  | "thai"
  | "indian"
  | "korean"
  | "japanese"
  | "philippines";

export interface DealService {
  label: string;
  icon?: string;
}

export interface BaseDeal {
  id: string;
  title: string;
  image: string;
  salonName: string;
  rating: number;
  reviewCount: string;
  location: string;
  discountPercent: number;
  currentPrice: number;
  originalPrice: number;
  category: DealCategory;
  isStore: boolean;
  popularity: number;
}

export interface SingleDeal extends BaseDeal {
  type: "single";
  tags: string[];
}

export interface PackageDeal extends BaseDeal {
  type: "package";
  includedServices: DealService[];
}

export type Deal = SingleDeal | PackageDeal;

export interface StoreProfile {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: string;
  location: string;
}

export interface StoreDealsResponse {
  store: StoreProfile;
  deals: Deal[];
}

export interface DealsQueryParams {
  type: DealType;
  category?: DealCategory;
  search?: string;
  sort?: SortOption;
  suburb?: DealsSuburbFilter;
  language?: DealsLanguageFilter;
  price?: DealsPriceFilter;
  nationality?: DealsNationalityFilter;
}

export interface DealsFilterState {
  dealType: DealType;
  category: DealCategory;
  search: string;
  sort: SortOption;
  suburb: DealsSuburbFilter;
  language: DealsLanguageFilter;
  price: DealsPriceFilter;
  nationality: DealsNationalityFilter;
}
