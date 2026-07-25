"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ExpertProviderCard } from "./ExpertProviderCard";
import { LocationSlider } from "./LocationSlider";
import { expertLocations, expertProviders } from "./expert-providers.data";
import type { ExpertLocationId } from "./expert-providers.types";

import "swiper/css";
import "swiper/css/pagination";

export function ExpertProviders() {
  const [selectedLocation, setSelectedLocation] =
    useState<ExpertLocationId | null>(null);

  const filteredProviders = useMemo(() => {
    if (!selectedLocation || selectedLocation === "more") {
      return expertProviders;
    }

    const matches = expertProviders.filter(
      (provider) => provider.location === selectedLocation,
    );

    return matches.length > 0 ? matches : expertProviders;
  }, [selectedLocation]);

  return (
    <section className="relative pb-3">
      <div className="mb-4 flex items-start justify-between lg:mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Star
              className="fill-(--brand-gold) text-(--brand-gold)"
              size={16}
            />
            <h2 className="text-xs font-medium text-(--text-primary) lg:text-[18px]">
              Expert Providers
            </h2>
          </div>

          <p className="mt-0.5 text-[8px] text-(--text-muted) lg:text-[11px]">
            Top rated experts in your area
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-[8px] text-(--accent-secondary) lg:text-[12px]"
        >
          <span className="lg:hidden">View All</span>
          <span className="hidden lg:inline">View all</span>
          <ArrowRight size={10} className="lg:h-4 lg:w-4" />
        </button>
      </div>

      <div className="mb-4">
        <LocationSlider
          locations={expertLocations}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
        />
      </div>

      <Swiper
        key={selectedLocation ?? "all"}
        modules={[Pagination, Autoplay]}
        loop={filteredProviders.length > 2}
        centeredSlides={false}
        watchOverflow={false}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          1024: {
            slidesPerView: 2.15,
            spaceBetween: 10,
          },
          1440: {
            slidesPerView: 2.2,
            spaceBetween: 10,
          },
        }}
        className="trending-swiper"
      >
        {filteredProviders.map((provider) => (
          <SwiperSlide key={provider.id} className="pr-2">
            <ExpertProviderCard provider={provider} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
