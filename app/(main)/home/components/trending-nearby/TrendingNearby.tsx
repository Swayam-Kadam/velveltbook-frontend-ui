"use client";

import { useMemo } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { TrendingNearbyCard } from "./TrendingNearbyCard";
import { trendingNearbyData } from "./trending-nearby.data";
import type { HomeCategory } from "@/types/home";

import "swiper/css";
import "swiper/css/pagination";

interface TrendingNearbyProps {
  selectedCategory: HomeCategory | null;
}

export function TrendingNearby({ selectedCategory }: TrendingNearbyProps) {
  const filteredItems = useMemo(() => {
    if (!selectedCategory || selectedCategory === "more") {
      return trendingNearbyData;
    }

    const matches = trendingNearbyData.filter(
      (item) => item.category === selectedCategory,
    );

    return matches.length > 0 ? matches : trendingNearbyData;
  }, [selectedCategory]);

  return (
    <section className="relative">
      <div className="mb-5 flex items-center justify-between lg:mb-6">
        <div className="flex items-center gap-2">
          <Star
            className="fill-(--brand-gold) text-(--brand-gold)"
            size={18}
          />

          <h2 className="text-xs font-medium text-(--text-primary) lg:text-[28px]">
            Trending Nearby
          </h2>
        </div>

        <button className="flex items-center gap-2 text-(--accent-secondary)">
          <span className="text-[10px] lg:text-[15px]">View more</span>

          <ArrowRight size={18} />
        </button>
      </div>

      <Swiper
        key={selectedCategory}
        modules={[Pagination, Autoplay]}
        loop={filteredItems.length > 2}
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
        {filteredItems.map((item) => (
          <SwiperSlide key={item.id} className="pr-2">
            <TrendingNearbyCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
