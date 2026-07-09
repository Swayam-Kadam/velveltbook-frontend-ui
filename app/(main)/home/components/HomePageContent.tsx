"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/header/SearchBar";
import { useHomeFilter } from "@/components/layout/HomeFilterContext";
import { DealsFilterSidebar } from "@/deals/components/DealsFilterSidebar";
import type {
  DealsLanguageFilter,
  DealsNationalityFilter,
  DealsPriceFilter,
  DealsSuburbFilter,
  SortOption,
} from "@/types/deal";
import { ExpertProviders } from "./expert-providers/ExpertProviders";
import { HomeFilterSidebar } from "./filter-sidebar/HomeFilterSidebar";
import { HeroSlider } from "./hero-slider/HeroSlider";
import type { HomeCategory } from "@/types/home";
import { TrendingNearby } from "./trending-nearby/TrendingNearby";

const DEFAULT_MOBILE_FILTERS = {
  suburb: "all" as DealsSuburbFilter,
  language: "all" as DealsLanguageFilter,
  price: "any" as DealsPriceFilter,
  nationality: "all" as DealsNationalityFilter,
  sort: "popular" as SortOption,
};

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const sync = () => setIsMobile(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

export function HomePageContent() {
  const {
    isHomeFilterOpen,
    closeHomeFilter,
    openHomeFilter,
    toggleHomeFilter,
  } = useHomeFilter();
  const isMobile = useIsMobileViewport();
  const [mobileFilters, setMobileFilters] = useState(DEFAULT_MOBILE_FILTERS);
  const [selectedCategory, setSelectedCategory] = useState<HomeCategory | null>(
    null,
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const syncDesktopFilter = () => {
      if (media.matches) {
        openHomeFilter();
      }
    };

    syncDesktopFilter();
    media.addEventListener("change", syncDesktopFilter);
    return () => media.removeEventListener("change", syncDesktopFilter);
  }, [openHomeFilter]);

  const resetMobileFilters = () => {
    setMobileFilters(DEFAULT_MOBILE_FILTERS);
  };

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
          <HeroSlider
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <TrendingNearby selectedCategory={selectedCategory} />
          <ExpertProviders />
        </div>
      </div>

      <DealsFilterSidebar
        className="lg:hidden"
        isOpen={isHomeFilterOpen && isMobile}
        onClose={closeHomeFilter}
        filters={mobileFilters}
        onSuburbChange={(suburb) =>
          setMobileFilters((prev) => ({ ...prev, suburb }))
        }
        onLanguageChange={(language) =>
          setMobileFilters((prev) => ({ ...prev, language }))
        }
        onPriceChange={(price) =>
          setMobileFilters((prev) => ({ ...prev, price }))
        }
        onNationalityChange={(nationality) =>
          setMobileFilters((prev) => ({ ...prev, nationality }))
        }
        onSortChange={(sort) =>
          setMobileFilters((prev) => ({ ...prev, sort }))
        }
        onReset={resetMobileFilters}
      />
    </main>
  );
}
