export type HomeCategory =
  | "barber"
  | "salon"
  | "spa"
  | "massage"
  | "tattoo"
  | "nails"
  | "makeup"
  | "more";

export interface TrendingNearbyItem {
  id: string;
  name: string;
  image: string;
  avatar: string;
  service: string;
  address?: string;
  desktopService?: string;
  rating?: number;
  reviews?: string;
  description?: string;
  desktopServices?: DesktopService[];
  availability: string;
  distance?: string;
  online?: boolean;
  organizationId: string;
  category: HomeCategory;
}

export interface DesktopService {
  label: string;
  price: string;
  image: string;
}

export type ExpertLocationId =
  | "ascot-vale"
  | "moonee-ponds"
  | "cbd"
  | "box-hill"
  | "south-yarra"
  | "richmond"
  | "southbank"
  | "carlton"
  | "st-kilda"
  | "footscray"
  | "docklands"
  | "more";

export interface ExpertLocationOption {
  id: ExpertLocationId;
  label: string;
  image: string;
}

/** Store card shape matches Trending Nearby, filtered by location. */
export interface ExpertProvider extends TrendingNearbyItem {
  location: Exclude<ExpertLocationId, "more">;
}

export type NationalityId =
  | "aussie"
  | "vietnamese"
  | "chinese"
  | "thai"
  | "indian"
  | "korean"
  | "japanese"
  | "philippines"
  | "mix"
  | "indonesian"
  | "malaysian"
  | "more";

export interface NationalityOption {
  id: NationalityId;
  label: string;
  image: string;
}

/** Store card shape matches Trending Nearby, filtered by nationality. */
export interface NationalityProvider extends TrendingNearbyItem {
  nationality: Exclude<NationalityId, "more">;
}
