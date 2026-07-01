export interface StoreHero {
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  videoUrl: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  coverImage: string;
  logo: string;
  address: string;
  timing: string;
  rating: number;
  totalReviews: number;
  distance: string;
  phone: string;
  description: string;
  location: string;
  isOnline: boolean;
  hero: StoreHero;
}

/**
 * Static, store-agnostic UI labels for the hero (button text, etc.).
 * Lives in hero.json today; can move to a CMS/API response later.
 */
export interface HeroLabels {
  welcomeText: string;
  onlineLabel: string;
  offlineLabel: string;
  bookNowLabel: string;
  bookNowHref: string;
  watchVideoLabel: string;
}

/**
 * Fully resolved hero content for a single store. Built by combining
 * per-store data (Store) with shared labels (HeroLabels). Swapping the
 * data source to an API later only changes getStoreHero().
 */
export interface HeroViewModel {
  welcomeText: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
  ratingLabel: string;
  timing: string;
  location: string;
  isOnline: boolean;
  statusLabel: string;
  bookNowLabel: string;
  bookNowHref: string;
  watchVideoLabel: string;
  videoUrl: string;
}

export interface SectionData<TItem, TMeta = SectionMeta> {
  meta: TMeta;
  items: TItem[];
}

export interface StaffSectionMeta extends SectionMeta {
  bookServiceLabel: string;
}

export interface SuggestionsSectionMeta {
  title: string;
  bookNowLabel: string;
  footerLabel: string;
  footerHref: string;
}

export interface StorePageData {
  store: Store;
  services: SectionData<Service>;
  staff: SectionData<StaffMember, StaffSectionMeta>;
  products: SectionData<Product>;
  reviews: SectionData<Review>;
  menu: SectionData<MenuItem, SidebarMeta>;
  suggestions: SectionData<Suggestion, SuggestionsSectionMeta>;
}

export interface Suggestion {
  id: number;
  image: string;
  name: string;
  subtitle: string;
  timing: string;
  rating: number;
  reviewsLabel: string;
  distance: string;
  storeId: string;
}

export interface MenuItem {
  id: number;
  image: string;
  title: string;
  description: string;
  price: string;
}

export interface Service {
  id: number;
  image: string;
  title: string;
  price: string;
  isExplore?: boolean;
}

export interface StaffMember {
  id: number;
  image: string;
  name: string;
  designation: string;
  experience: string;
  specialty: string;
  rating: number;
}

export interface Product {
  id: number;
  image: string;
  title: string;
  price: string;
}

export interface Review {
  id: number;
  avatar: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SectionMeta {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  footerLabel?: string;
}

export interface SidebarMeta {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  footerLabel: string;
  footerHref: string;
}

import type { SwiperOptions } from "swiper/types";

export interface SliderBreakpoints extends NonNullable<SwiperOptions["breakpoints"]> {}
