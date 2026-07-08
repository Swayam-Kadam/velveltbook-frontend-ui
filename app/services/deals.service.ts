import { allDealsData } from "@/data/main/deals/deals";
import { SUBURB_LOCATION_MATCH } from "@/data/main/deals/filters";
import type { Deal, DealsQueryParams, StoreDealsResponse, StoreProfile } from "@/types/deal";

function filterByCategory(deals: Deal[], category?: DealsQueryParams["category"]) {
  if (!category || category === "all") return deals;
  return deals.filter((d) => d.category === category);
}

function filterBySearch(deals: Deal[], search?: string) {
  if (!search?.trim()) return deals;
  const q = search.toLowerCase();
  return deals.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.salonName.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q),
  );
}

function filterBySuburb(deals: Deal[], suburb?: DealsQueryParams["suburb"]) {
  if (!suburb || suburb === "all") return deals;
  const needles = SUBURB_LOCATION_MATCH[suburb];
  return deals.filter((deal) =>
    needles.some((needle) => deal.location.includes(needle)),
  );
}

function filterByPrice(deals: Deal[], price?: DealsQueryParams["price"]) {
  if (!price || price === "any") return deals;

  switch (price) {
    case "under-30":
      return deals.filter((deal) => deal.currentPrice <= 30);
    case "30-75":
      return deals.filter(
        (deal) => deal.currentPrice > 30 && deal.currentPrice <= 75,
      );
    case "75-150":
      return deals.filter(
        (deal) => deal.currentPrice > 75 && deal.currentPrice <= 150,
      );
    case "150-plus":
      return deals.filter((deal) => deal.currentPrice > 150);
    default:
      return deals;
  }
}

function sortDeals(deals: Deal[], sort: DealsQueryParams["sort"] = "popular") {
  const sorted = [...deals];
  switch (sort) {
    case "price-low":
      return sorted.sort((a, b) => a.currentPrice - b.currentPrice);
    case "price-high":
      return sorted.sort((a, b) => b.currentPrice - a.currentPrice);
    case "discount":
      return sorted.sort((a, b) => b.discountPercent - a.discountPercent);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "popular":
    default:
      return sorted.sort((a, b) => b.popularity - a.popularity);
  }
}

export async function fetchDeals(params: DealsQueryParams): Promise<Deal[]> {
  const typeFiltered = allDealsData.filter((d) =>
    params.type === "single" ? d.type === "single" : d.type === "package",
  );

  const categoryFiltered = filterByCategory(typeFiltered, params.category);
  const searchFiltered = filterBySearch(categoryFiltered, params.search);
  const suburbFiltered = filterBySuburb(searchFiltered, params.suburb);
  const priceFiltered = filterByPrice(suburbFiltered, params.price);

  return sortDeals(priceFiltered, params.sort);
}

export async function fetchDealById(id: string): Promise<Deal | null> {
  return allDealsData.find((d) => d.id === id) ?? null;
}

function toStoreId(salonName: string) {
  return salonName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function toStoreProfile(deal: Deal): StoreProfile {
  return {
    id: toStoreId(deal.salonName),
    name: deal.salonName,
    logo: deal.image,
    rating: deal.rating,
    reviewCount: deal.reviewCount,
    location: deal.location,
  };
}

export async function fetchStoreDeals(
  salonName: string,
  clickedDealId: string,
): Promise<StoreDealsResponse> {
  const storeDeals = allDealsData.filter((d) => d.salonName === salonName);
  const clicked = storeDeals.find((d) => d.id === clickedDealId);
  const remaining = storeDeals.filter((d) => d.id !== clickedDealId);
  const deals = clicked ? [clicked, ...remaining] : storeDeals;
  const anchor = clicked ?? storeDeals[0];

  if (!anchor) {
    throw new Error(`No deals found for store: ${salonName}`);
  }

  return {
    store: toStoreProfile(anchor),
    deals,
  };
}
