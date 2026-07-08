"use client";

import { useCallback, useMemo, useState } from "react";
import { fetchStoreDeals } from "../deals.api";
import type { Deal, StoreProfile } from "../deals.types";

export function useStoreDealsBooking() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedDeal, setClickedDeal] = useState<Deal | null>(null);
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [storeDeals, setStoreDeals] = useState<Deal[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const openBooking = useCallback(async (deal: Deal) => {
    setClickedDeal(deal);
    setSelectedIds([deal.id]);
    setIsOpen(true);
    setIsLoading(true);

    try {
      const result = await fetchStoreDeals(deal.salonName, deal.id);
      setStore(result.store);
      setStoreDeals(result.deals);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    setClickedDeal(null);
    setStore(null);
    setStoreDeals([]);
    setSelectedIds([]);
  }, []);

  const toggleDeal = useCallback((dealId: string) => {
    setSelectedIds((prev) =>
      prev.includes(dealId)
        ? prev.filter((id) => id !== dealId)
        : [...prev, dealId],
    );
  }, []);

  const selectedDeals = useMemo(
    () => storeDeals.filter((deal) => selectedIds.includes(deal.id)),
    [selectedIds, storeDeals],
  );

  const selectedTotal = useMemo(
    () => selectedDeals.reduce((sum, deal) => sum + deal.currentPrice, 0),
    [selectedDeals],
  );

  return {
    isOpen,
    isLoading,
    clickedDeal,
    store,
    storeDeals,
    selectedIds,
    selectedDeals,
    selectedTotal,
    openBooking,
    closeBooking,
    toggleDeal,
  };
}
