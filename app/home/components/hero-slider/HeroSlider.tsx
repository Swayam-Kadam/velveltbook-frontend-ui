"use client";

import { useState } from "react";
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

    return (
        <div className="hero-slider">
            <CategorySlider />
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
                onSlideChange={(swiper) => {
                    setActiveIndex(swiper.realIndex);
                }}
            >
                {heroSlides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <HeroSlide {...slide} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <HeroBottomCard store={heroSlides[activeIndex].store} />
        </div>
    );
}