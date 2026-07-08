"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { heroSlides } from "./hero-slider.data";
import { HeroSlide } from "./HeroSlide";
import { HeroBottomCard } from "./HeroBottomCard";
import { CategorySlider } from "./CategorySlider";

export function HeroSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiper, setSwiper] = useState<SwiperType | null>(null);

    return (
        <div className="hero-slider lg:flex lg:flex-col">
            <div className="lg:order-2">
                <CategorySlider />
            </div>

            <div className="relative lg:order-1">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    slidesPerView={1}
                    spaceBetween={16}
                    loop
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    onSwiper={setSwiper}
                    onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
                    }}
                    className="lg:rounded-[8px]"
                >
                    {heroSlides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <HeroSlide {...slide} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() => swiper?.slidePrev()}
                    className="primary-button absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-(--brand-gold-light) shadow-(--shadow-glow) transition-transform duration-200 hover:scale-105 lg:flex"
                >
                    <ChevronLeft size={22} strokeWidth={2} />
                </button>

                <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => swiper?.slideNext()}
                    className="primary-button absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-(--brand-gold-light) shadow-(--shadow-glow) transition-transform duration-200 hover:scale-105 lg:flex"
                >
                    <ChevronRight size={22} strokeWidth={2} />
                </button>

                <HeroBottomCard
                    store={heroSlides[activeIndex].store}
                    className="lg:absolute lg:right-16 lg:top-1/2 lg:mt-0 lg:w-[300px] lg:-translate-y-1/2"
                />
            </div>
        </div>
    );
}
