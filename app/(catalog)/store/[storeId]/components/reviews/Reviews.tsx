"use client";

import { SwiperSlide } from "swiper/react";

import type { Review, SectionData } from "../types";
import SectionHeader from "../shared/SectionHeader";
import SharedSlider from "../shared/SharedSlider";
import ReviewCard from "./ReviewCard";

const REVIEW_BREAKPOINTS = {
  0: { slidesPerView: 1.15, spaceBetween: 12 },
  640: { slidesPerView: 1.8, spaceBetween: 14 },
  1024: { slidesPerView: 2, spaceBetween: 16 },
  1280: { slidesPerView: 3, spaceBetween: 16 },
};

interface Props {
  meta: SectionData<Review>["meta"];
  items: SectionData<Review>["items"];
}

export default function Reviews({ meta, items }: Props) {
  return (
    <section>
      <SectionHeader
        title={meta.title}
        viewAllLabel={meta.viewAllLabel}
        viewAllHref={meta.viewAllHref}
      />

      <SharedSlider breakpoints={REVIEW_BREAKPOINTS}>
        {items.map((review) => (
          <SwiperSlide key={review.id}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </SharedSlider>
    </section>
  );
}
