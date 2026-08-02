import { allMenuServices } from "@/data/catalog/menu/services";
import type { Deal, PackageDeal } from "../deals.types";
import { packageDealsData } from "../deals.data";

export interface BookingPackageService {
  id: string;
  label: string;
  price: number;
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

function toBookingPackage(deal: PackageDeal, packageIndex: number): BookingPackage {
  const services = deal.includedServices.slice(0, 4);
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
        (packageIndex * 4 + index) % Math.max(allMenuServices.length, 1);
      const menu = allMenuServices[menuIndex] ?? allMenuServices[0];

      return {
        id: menu.id,
        label: service.label,
        price: unit,
      };
    }),
  };
}

/** Build up to 4 packages (4 services each) for the desktop booking sidebar. */
export function buildDesktopBookingPackages(
  clickedDeal: Deal,
  allDeals: Deal[] = [],
): BookingPackage[] {
  const fromPage = allDeals.filter(
    (deal): deal is PackageDeal => deal.type === "package",
  );
  const catalogPackages = packageDealsData.filter(
    (deal): deal is PackageDeal => deal.type === "package",
  );

  const sameSalonPackages = [...fromPage, ...catalogPackages].filter(
    (deal) => deal.salonName === clickedDeal.salonName,
  );

  const otherPackages = [...fromPage, ...catalogPackages].filter(
    (deal) => deal.salonName !== clickedDeal.salonName,
  );

  const ordered: PackageDeal[] = [];

  if (clickedDeal.type === "package") {
    ordered.push(clickedDeal);
  }

  for (const deal of [...sameSalonPackages, ...otherPackages]) {
    if (!ordered.some((item) => item.id === deal.id)) {
      ordered.push(deal);
    }
    if (ordered.length >= 4) break;
  }

  return ordered.slice(0, 4).map((deal, index) => toBookingPackage(deal, index));
}

export function createDefaultServiceSelection(
  packages: BookingPackage[],
): Record<string, string[]> {
  const selection: Record<string, string[]> = {};
  for (const pkg of packages) {
    selection[pkg.id] = pkg.services.map((service) => service.id);
  }
  return selection;
}
