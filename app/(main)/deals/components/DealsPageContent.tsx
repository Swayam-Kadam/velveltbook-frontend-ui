"use client";

import { useState } from "react";
import { useDeals } from "../hooks/useDeals";
import { useStoreDealsBooking } from "../hooks/useStoreDealsBooking";
import { DealTypeToggle } from "./DealTypeToggle";
import { DealsCategorySlider } from "./DealsCategorySlider";
import { DealsFilterSidebar } from "./DealsFilterSidebar";
import { DealsGrid } from "./DealsGrid";
import { DealsSearchFilterBar } from "./DealsSearchFilterBar";
import { DealsPagination } from "./DealsPagination";
import { PromoBanner } from "./PromoBanner";
import { StoreDealsBookingModal } from "./StoreDealsBookingModal";

export function DealsPageContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const storeBooking = useStoreDealsBooking();

  const {
    allDeals,
    filters,
    isLoading,
    page,
    totalPages,
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
  } = useDeals();

  return (
    <main className="space-y-3 px-2 pt-3 pb-24 lg:mx-auto lg:w-full lg:max-w-[1600px] lg:space-y-4 lg:px-5 lg:pt-4 lg:pb-8">
      <DealTypeToggle value={filters.dealType} onChange={setDealType} />

      <DealsSearchFilterBar
        dealType={filters.dealType}
        value={filters.search}
        onChange={setSearch}
        onFilterClick={() => setIsFilterOpen(true)}
      />

      <DealsCategorySlider active={filters.category} onChange={setCategory} />

      <DealsGrid
        allDeals={allDeals}
        page={page}
        isLoading={isLoading}
        onPageChange={setPage}
        onBookClick={storeBooking.openBooking}
      />

      <DealsPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <PromoBanner dealType={filters.dealType} />

      <DealsFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onSuburbChange={setSuburb}
        onLanguageChange={setLanguage}
        onPriceChange={setPrice}
        onNationalityChange={setNationality}
        onSortChange={setSort}
        onReset={resetSidebarFilters}
      />

      <StoreDealsBookingModal booking={storeBooking} />
    </main>
  );
}
