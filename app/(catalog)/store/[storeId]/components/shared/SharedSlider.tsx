"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";

import type { SliderBreakpoints } from "../types";

import "swiper/css";
import "swiper/css/pagination";
import "./store-slider.css";

interface SharedSliderProps {
  children: ReactNode;
  breakpoints?: SliderBreakpoints;
  loop?: boolean;
  className?: string;
}

const DEFAULT_BREAKPOINTS: SliderBreakpoints = {
  0: { slidesPerView: 1.2, spaceBetween: 12 },
  640: { slidesPerView: 2.2, spaceBetween: 14 },
  1024: { slidesPerView: 3, spaceBetween: 16 },
  1280: { slidesPerView: 4, spaceBetween: 16 },
};

export default function SharedSlider({
  children,
  breakpoints = DEFAULT_BREAKPOINTS,
  loop = true,
  className = "store-slider",
}: SharedSliderProps) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const arrowBase =
    "primary-button absolute top-[calc(50%-16px)] z-20 hidden h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white opacity-0 shadow-[var(--shadow-glow)] transition-opacity duration-300 pointer-events-none group-hover/slider:opacity-100 group-hover/slider:pointer-events-auto lg:flex";

  return (
    <div className="group/slider relative px-1">
      <Swiper
        modules={[Pagination, Autoplay]}
        onSwiper={setSwiper}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={loop}
        grabCursor
        breakpoints={breakpoints}
        className={className}
      >
        {children}
      </Swiper>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => swiper?.slidePrev()}
        className={`${arrowBase} -left-1`}
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={() => swiper?.slideNext()}
        className={`${arrowBase} -right-1`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
