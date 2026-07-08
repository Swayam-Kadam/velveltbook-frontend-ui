"use client";

import { SwiperSlide } from "swiper/react";

import type { SectionData, StaffMember, StaffSectionMeta } from "../types";
import SectionHeader from "../shared/SectionHeader";
import SharedSlider from "../shared/SharedSlider";
import StaffCard from "./StaffCard";

const STAFF_BREAKPOINTS = {
  0: { slidesPerView: 2.4, spaceBetween: 12 },
  640: { slidesPerView: 2.4, spaceBetween: 14 },
  1024: { slidesPerView: 3, spaceBetween: 16 },
  1280: { slidesPerView: 4, spaceBetween: 16 },
};

interface Props {
  meta: StaffSectionMeta;
  items: SectionData<StaffMember, StaffSectionMeta>["items"];
}

export default function Staff({ meta, items }: Props) {
  return (
    <section>
      <SectionHeader
        title={meta.title}
        viewAllLabel={meta.viewAllLabel}
        viewAllHref={meta.viewAllHref}
      />

      <SharedSlider breakpoints={STAFF_BREAKPOINTS}>
        {items.map((member) => (
          <SwiperSlide key={member.id}>
            <StaffCard
              member={member}
              bookServiceLabel={meta.bookServiceLabel}
            />
          </SwiperSlide>
        ))}
      </SharedSlider>
    </section>
  );
}
