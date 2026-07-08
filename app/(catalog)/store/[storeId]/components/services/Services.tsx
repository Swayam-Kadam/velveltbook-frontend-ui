"use client";

import { SwiperSlide } from "swiper/react";

import type { SectionData, Service } from "../types";
import SectionHeader from "../shared/SectionHeader";
import SharedSlider from "../shared/SharedSlider";
import ServiceCard from "./ServiceCard";

const SERVICE_BREAKPOINTS = {
  0: { slidesPerView: 2.4, spaceBetween: 12 },
  640: { slidesPerView: 3.4, spaceBetween: 12 },
  1024: { slidesPerView: 4.2, spaceBetween: 14 },
  1280: { slidesPerView: 5, spaceBetween: 14 },
};

interface Props {
  meta: SectionData<Service>["meta"];
  items: SectionData<Service>["items"];
}

export default function Services({ meta, items }: Props) {
  return (
    <section>
      <SectionHeader
        title={meta.title}
        viewAllLabel={meta.viewAllLabel}
        viewAllHref={meta.viewAllHref}
      />

      <SharedSlider breakpoints={SERVICE_BREAKPOINTS}>
        {items.map((service) => (
          <SwiperSlide key={service.id}>
            <ServiceCard service={service} />
          </SwiperSlide>
        ))}
      </SharedSlider>
    </section>
  );
}
