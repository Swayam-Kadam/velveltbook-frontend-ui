"use client";

import { useCallback, useMemo, useState } from "react";
import { fetchStoreDeals } from "../deals.api";
import type { Deal, StoreProfile } from "../deals.types";
import {
  buildDesktopBookingPackages,
  createDefaultServiceSelection,
  type BookingPackage,
} from "../components/desktopBookingPackages";

export function useStoreDealsBooking() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedDeal, setClickedDeal] = useState<Deal | null>(null);
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [storeDeals, setStoreDeals] = useState<Deal[]>([]);
  const [packages, setPackages] = useState<BookingPackage[]>([]);
  const [activePackageId, setActivePackageId] = useState("");
  const [selectedServicesByPackage, setSelectedServicesByPackage] = useState<
    Record<string, string[]>
  >({});

  const openBooking = useCallback(async (deal: Deal) => {
    setClickedDeal(deal);
    setIsOpen(true);
    setIsLoading(true);
    setPackages([]);
    setActivePackageId("");
    setSelectedServicesByPackage({});

    try {
      const result = await fetchStoreDeals(deal.salonName, deal.id);
      setStore(result.store);
      setStoreDeals(result.deals);

      const nextPackages = buildDesktopBookingPackages(deal, result.deals);
      setPackages(nextPackages);
      setActivePackageId(nextPackages[0]?.id ?? "");
      setSelectedServicesByPackage(createDefaultServiceSelection(nextPackages));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    setClickedDeal(null);
    setStore(null);
    setStoreDeals([]);
    setPackages([]);
    setActivePackageId("");
    setSelectedServicesByPackage({});
  }, []);

  const setActivePackage = useCallback((packageId: string) => {
    setActivePackageId(packageId);
  }, []);

  const toggleService = useCallback((packageId: string, serviceId: string) => {
    setSelectedServicesByPackage((current) => {
      const existing = current[packageId] ?? [];
      const next = existing.includes(serviceId)
        ? existing.filter((id) => id !== serviceId)
        : [...existing, serviceId];
      return {
        ...current,
        [packageId]: next,
      };
    });
  }, []);

  const activePackage = useMemo(
    () =>
      packages.find((pkg) => pkg.id === activePackageId) ?? packages[0] ?? null,
    [packages, activePackageId],
  );

  const selectedServiceIds = useMemo(
    () =>
      activePackage
        ? (selectedServicesByPackage[activePackage.id] ?? [])
        : [],
    [activePackage, selectedServicesByPackage],
  );

  const selectedServices = useMemo(() => {
    if (!activePackage) return [];
    return activePackage.services.filter((service) =>
      selectedServiceIds.includes(service.id),
    );
  }, [activePackage, selectedServiceIds]);

  const selectedTotal = useMemo(
    () => selectedServices.reduce((sum, service) => sum + service.price, 0),
    [selectedServices],
  );

  return {
    isOpen,
    isLoading,
    clickedDeal,
    store,
    storeDeals,
    packages,
    activePackageId,
    activePackage,
    selectedServiceIds,
    selectedServices,
    selectedTotal,
    openBooking,
    closeBooking,
    setActivePackage,
    toggleService,
  };
}
