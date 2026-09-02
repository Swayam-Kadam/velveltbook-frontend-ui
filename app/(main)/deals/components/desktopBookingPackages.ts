import { allMenuServices } from "@/data/catalog/menu/services";
import type { Deal, PackageDeal, SingleDeal } from "../deals.types";
import { packageDealsData, singleDealsData } from "../deals.data";

export interface BookingPackageService {
  id: string;
  label: string;
  price: number;
  /** Underlying real menu service id used to preselect this service in booking. */
  menuServiceId: string;
}

export interface BookingPackage {
  id: string;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discountPercent: number;
  services: BookingPackageService[];
}

const MAX_BOOKING_OPTIONS = 6;
const SERVICES_PER_PACKAGE = 4;

function toBookingPackageFromSingle(
  deal: SingleDeal,
  optionIndex: number,
): BookingPackage {
  const labels = [...deal.tags];
  while (labels.length < SERVICES_PER_PACKAGE) {
    const menuIndex =
      (optionIndex * SERVICES_PER_PACKAGE + labels.length) %
      Math.max(allMenuServices.length, 1);
    labels.push(allMenuServices[menuIndex]?.title ?? deal.title);
  }

  const serviceLabels = labels.slice(0, SERVICES_PER_PACKAGE);
  const unit = Number((deal.currentPrice / serviceLabels.length).toFixed(2));

  return {
    id: deal.id,
    title: deal.title,
    image: deal.image,
    currentPrice: deal.currentPrice,
    originalPrice: deal.originalPrice,
    discountPercent: deal.discountPercent,
    services: serviceLabels.map((label, index) => {
      const menuIndex =
        (optionIndex * SERVICES_PER_PACKAGE + index) %
        Math.max(allMenuServices.length, 1);
      const menu = allMenuServices[menuIndex] ?? allMenuServices[0];

      return {
        id: `${deal.id}-${menu.id}-${index}`,
        label,
        price: unit,
        menuServiceId: menu.id,
      };
    }),
  };
}

function toBookingPackageFromPackage(
  deal: PackageDeal,
  packageIndex: number,
): BookingPackage {
  const services = deal.includedServices.slice(0, SERVICES_PER_PACKAGE);
  while (services.length < SERVICES_PER_PACKAGE) {
    const menuIndex =
      (packageIndex * SERVICES_PER_PACKAGE + services.length) %
      Math.max(allMenuServices.length, 1);
    services.push({
      label: allMenuServices[menuIndex]?.title ?? "Add-on Service",
    });
  }

  const unit =
    services.length > 0
      ? Number((deal.currentPrice / services.length).toFixed(2))
      : deal.currentPrice;

  return {
    id: deal.id,
    title: deal.title,
    image: deal.image,
    currentPrice: deal.currentPrice,
    originalPrice: deal.originalPrice,
    discountPercent: deal.discountPercent,
    services: services.map((service, index) => {
      const menuIndex =
        (packageIndex * SERVICES_PER_PACKAGE + index) %
        Math.max(allMenuServices.length, 1);
      const menu = allMenuServices[menuIndex] ?? allMenuServices[0];

      return {
        id: `${deal.id}-${menu.id}-${index}`,
        label: service.label,
        price: unit,
        menuServiceId: menu.id,
      };
    }),
  };
}

function orderDealsBySalon<T extends Deal>(
  clickedDeal: Deal,
  candidates: T[],
): T[] {
  const sameSalon = candidates.filter(
    (deal) => deal.salonName === clickedDeal.salonName,
  );
  const otherSalon = candidates.filter(
    (deal) => deal.salonName !== clickedDeal.salonName,
  );

  const ordered: T[] = [];

  if (candidates.some((deal) => deal.id === clickedDeal.id)) {
    ordered.push(clickedDeal as T);
  }

  for (const deal of [...sameSalon, ...otherSalon]) {
    if (!ordered.some((item) => item.id === deal.id)) {
      ordered.push(deal);
    }
    if (ordered.length >= MAX_BOOKING_OPTIONS) break;
  }

  return ordered.slice(0, MAX_BOOKING_OPTIONS);
}

/** Build booking sidebar options for the clicked deal type (single or package). */
export function buildDesktopBookingPackages(
  clickedDeal: Deal,
  allDeals: Deal[] = [],
): BookingPackage[] {
  if (clickedDeal.type === "single") {
    const fromPage = allDeals.filter(
      (deal): deal is SingleDeal => deal.type === "single",
    );
    const catalogSingles = singleDealsData.filter(
      (deal): deal is SingleDeal => deal.type === "single",
    );
    const ordered = orderDealsBySalon(clickedDeal, [
      ...fromPage,
      ...catalogSingles,
    ]);
    return ordered.map((deal, index) =>
      toBookingPackageFromSingle(deal, index),
    );
  }

  const fromPage = allDeals.filter(
    (deal): deal is PackageDeal => deal.type === "package",
  );
  const catalogPackages = packageDealsData.filter(
    (deal): deal is PackageDeal => deal.type === "package",
  );
  const ordered = orderDealsBySalon(clickedDeal, [
    ...fromPage,
    ...catalogPackages,
  ]);
  return ordered.map((deal, index) =>
    toBookingPackageFromPackage(deal, index),
  );
}

export function createDefaultServiceSelection(
  packages: BookingPackage[],
  preselectAll = true,
): Record<string, string[]> {
  const selection: Record<string, string[]> = {};
  for (const pkg of packages) {
    selection[pkg.id] = preselectAll
      ? pkg.services.map((service) => service.id)
      : [];
  }
  return selection;
}
