"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { ExtendedOrganization } from "../organization.types";
import { SalonInfoCard } from "./SalonInfoCard";
import { QuickActions } from "./QuickActions";

interface HeroBannerProps {
  images: string[];
  availability: string;
  salonName: string;
  organization: ExtendedOrganization;
}

export function HeroBanner({ images, availability, salonName, organization }: HeroBannerProps) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative overflow-hidden rounded-t-xl border border-[var(--border)] rounded-b-xl">
      <div className="relative h-[130px] w-full mb-2">
        <Image
          src={images[index]}
          alt={salonName}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />

        <button
          type="button"
          onClick={prev}
          aria-label="Previous image"
          className="
            primary-button absolute left-2 bottom-[-0.5rem] text-white flex h-7 w-7
            -translate-y-1/2 items-center justify-center rounded-full
          "
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next image"
          className="
            primary-button absolute right-2 bottom-[-0.5rem] text-white flex h-7 w-7
            -translate-y-1/2 items-center justify-center rounded-full
          "
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>

        <div className="absolute right-2 top-2 flex items-center gap-1">
          <div className="primary-button rounded-full px-3 py-1 text-[8px] font-medium text-white">
            {availability}
          </div>
          <button
            type="button"
            aria-label="Share"
            className="flex p-1 items-center justify-center primary-button rounded-full  text-white backdrop-blur-sm"
          >
            <Share2 size={12} />
          </button>
        </div>
      </div>

      <SalonInfoCard organization={organization} />
      <QuickActions />
    </div>
  );
}
