"use client";

import { SearchBar } from "@/components/header/SearchBar";
import { useHomeFilter } from "@/components/layout/HomeFilterContext";
import { ExpertProviders } from "./expert-providers/ExpertProviders";
import { HomeFilterSidebar } from "./filter-sidebar/HomeFilterSidebar";
import { HeroSlider } from "./hero-slider/HeroSlider";
import { TrendingNearby } from "./trending-nearby/TrendingNearby";

export function HomePageContent() {
  const {
    isHomeFilterOpen,
    closeHomeFilter,
    toggleHomeFilter,
  } = useHomeFilter();

  return (
    <main className="space-y-3 px-2 pb-20 lg:mx-auto lg:w-full lg:max-w-[1600px] lg:space-y-0 lg:px-5 lg:pb-8">
      <SearchBar className="lg:hidden" onFilterClick={toggleHomeFilter} />

      <div
        className={`
          space-y-3 transition-[grid-template-columns] duration-300 ease-out
          lg:grid lg:space-y-0
          ${isHomeFilterOpen
            ? "lg:grid-cols-[252px_minmax(0,1fr)] lg:gap-4"
            : "lg:grid-cols-[0_minmax(0,1fr)]"
          }
        `}
      >
        <HomeFilterSidebar
          isOpen={isHomeFilterOpen}
          onClose={closeHomeFilter}
        />

        <div className="min-w-0 space-y-3 lg:space-y-6">
          <HeroSlider />
          <TrendingNearby />
          <ExpertProviders />
        </div>
      </div>
    </main>
  );
}
