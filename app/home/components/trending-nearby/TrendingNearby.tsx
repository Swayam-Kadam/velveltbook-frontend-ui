"use client";

import { ArrowRight, Star } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { TrendingNearbyCard } from "./TrendingNearbyCard";
import { trendingNearbyData } from "./trending-nearby.data";

import "swiper/css";
import "swiper/css/pagination";

export function TrendingNearby() {
    return (
        <section className="">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Star
                        size={10}
                        className="fill-[var(--brand-gold)] text-[var(--brand-gold)]"
                    />

                    <h2 className="text-xs font-medium text-[var(--text-primary)]">
                        Trending Nearby
                    </h2>
                </div>

                <button className="flex items-center gap-1 text-[8px] text-[var(--accent-secondary)]">
                    <span>View more</span>

                    <ArrowRight size={10} />
                </button>
            </div>

            <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={2}
                spaceBetween={8}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                className="trending-swiper"
            >
                {trendingNearbyData.map((item) => (
                    <SwiperSlide
                        key={item.id}
                        className="!w-[calc(100vw-52px)] max-w-[174px]"
                    >
                        <TrendingNearbyCard item={item} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}