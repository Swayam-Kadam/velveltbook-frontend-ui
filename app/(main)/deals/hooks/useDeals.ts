"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchDeals } from "../deals.api";
import { DEALS_PAGE_SIZE } from "../deals.constants";
import type {
  Deal,
  DealsFilterState,
  DealsLanguageFilter,
  DealsNationalityFilter,
  DealsPriceFilter,
  DealsSuburbFilter,
  SortOption,
} from "../deals.types";

const DEFAULT_FILTERS: DealsFilterState = {
  dealType: "single",
  category: "all",
  search: "",
  sort: "popular",
  suburb: "all",
  language: "all",
  price: "any",
  nationality: "all",
};

export function useDeals(initialFilters?: Partial<DealsFilterState>) {
  const [filters, setFilters] = useState<DealsFilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [deals, setDeals] = useState<Deal[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadDeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchDeals({
        type: filters.dealType,
        category: filters.category,
        search: filters.search,
        sort: filters.sort,
        suburb: filters.suburb,
        language: filters.language,
        price: filters.price,
        nationality: filters.nationality,
      });
      setDeals(result);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  useEffect(() => {
    setPage(1);
  }, [
    filters.dealType,
    filters.category,
    filters.search,
    filters.sort,
    filters.suburb,
    filters.language,
    filters.price,
    filters.nationality,
  ]);

  const totalPages = Math.max(1, Math.ceil(deals.length / DEALS_PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const setDealType = (dealType: DealsFilterState["dealType"]) =>
    setFilters((prev) => ({ ...prev, dealType }));

  const setCategory = (category: DealsFilterState["category"]) =>
    setFilters((prev) => ({ ...prev, category }));

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search }));

  const setSort = (sort: SortOption) =>
    setFilters((prev) => ({ ...prev, sort }));

  const setSuburb = (suburb: DealsSuburbFilter) =>
    setFilters((prev) => ({ ...prev, suburb }));

  const setLanguage = (language: DealsLanguageFilter) =>
    setFilters((prev) => ({ ...prev, language }));

  const setPrice = (price: DealsPriceFilter) =>
    setFilters((prev) => ({ ...prev, price }));

  const setNationality = (nationality: DealsNationalityFilter) =>
    setFilters((prev) => ({ ...prev, nationality }));

  const resetSidebarFilters = () =>
    setFilters((prev) => ({
      ...prev,
      suburb: DEFAULT_FILTERS.suburb,
      language: DEFAULT_FILTERS.language,
      price: DEFAULT_FILTERS.price,
      nationality: DEFAULT_FILTERS.nationality,
      sort: DEFAULT_FILTERS.sort,
    }));

  return {
    allDeals: deals,
    filters,
    page,
    totalPages,
    isLoading,
    setPage,
    setDealType,
    setCategory,
    setSearch,
    setSort,
    setSuburb,
    setLanguage,
    setPrice,
    setNationality,
    resetSidebarFilters,
    reload: loadDeals,
  };
}
