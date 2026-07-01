import labelsData from "../data/hero.json";
import type { HeroLabels, HeroViewModel, Store } from "../types";

const labels = labelsData as HeroLabels;

/**
 * Builds the hero view model for a given store by combining per-store
 * data with shared UI labels. This is the single place that knows how
 * hero content is assembled, so moving from JSON to an API later only
 * requires changing this function.
 */
export function getStoreHero(store: Store): HeroViewModel {
  return {
    welcomeText: labels.welcomeText,
    titlePrefix: store.hero.titlePrefix,
    titleHighlight: store.hero.titleHighlight,
    titleSuffix: store.hero.titleSuffix,
    description: store.description,
    ratingLabel: `${store.rating} (${store.totalReviews}+ reviews)`,
    timing: store.timing,
    location: store.location,
    isOnline: store.isOnline,
    statusLabel: store.isOnline ? labels.onlineLabel : labels.offlineLabel,
    bookNowLabel: labels.bookNowLabel,
    bookNowHref: labels.bookNowHref,
    watchVideoLabel: labels.watchVideoLabel,
    videoUrl: store.hero.videoUrl,
  };
}
