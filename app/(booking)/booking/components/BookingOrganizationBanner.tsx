"use client";

import Image from "next/image";
import { BadgeCheck, Bell, MapPin, Phone } from "lucide-react";
import { TimingsDropdown } from "@/components/TimingsDropdown";
import { bookingLocation } from "../booking.data";

export interface BookingOrganizationBannerInfo {
  name: string;
  banner: string;
  availability: string;
  status: string;
  thumbnail?: string;
  address?: string;
}

interface BookingOrganizationBannerProps {
  organization?: BookingOrganizationBannerInfo;
  serviceLabels: string[];
}

export function BookingOrganizationBanner({
  organization,
  serviceLabels,
}: BookingOrganizationBannerProps) {
  const org = organization ?? {
    name: bookingLocation.name,
    banner: bookingLocation.banner,
    availability: bookingLocation.availability,
    status: bookingLocation.status,
    thumbnail: bookingLocation.image,
    address: bookingLocation.address,
  };

  const serviceSummary =
    serviceLabels.length > 0
      ? serviceLabels.slice(0, 3).join(" • ")
      : "Haircut • Beard • Styling";

  return (
    <section className="feature-card overflow-hidden rounded-xl">
      <div className="relative h-[115px] w-full">
        <Image
          src={org.banner}
          alt={org.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />

        <div className="absolute right-2 top-2">
          <TimingsDropdown
            summary={org.availability}
            buttonClassName="primary-button flex items-center gap-1 rounded-full px-3 py-1 text-[8px] font-medium text-white"
          />
        </div>

        <div className="absolute left-2 top-2 h-[8px] w-[8px] rounded-full bg-[#8BFFD1]" />
      </div>

      <div className="bg-(--bg-card) px-2.5 py-2">
        <div className="flex min-w-0 items-start gap-2">
          <div className="relative  h-14 w-14 shrink-0">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-(--bg-card) shadow-(--shadow-card)">
              <Image
                src={org.thumbnail ?? org.banner}
                alt={org.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-1">
              <h2 className="truncate font-[family-name:var(--font-heading)] text-sm font-bold text-(--text-primary)">
                {org.name}
              </h2>
              <BadgeCheck
                className="h-3.5 w-3.5 shrink-0 text-(--accent-primary)"
                strokeWidth={2}
              />
            </div>
            <p className="mt-0.5 truncate text-[9px] text-(--text-secondary)">
              {serviceSummary}
            </p>
            <p className="mt-0.5 flex items-center gap-0.5 text-[9px] text-(--text-secondary)">
              <MapPin className="h-2.5 w-2.5 shrink-0" strokeWidth={1.8} />
              <span className="truncate">
                {org.address ?? bookingLocation.address}
              </span>
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-1 pt-0.5">
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-(--border) bg-(--bg-primary) px-2 py-1 text-[7px] text-(--text-primary) shadow-[inset_0_0_0_1px_var(--border)]"
            >
              <Phone className="h-2.5 w-2.5 shrink-0 text-(--accent-primary)" />
              <span className="whitespace-nowrap">Flexible Booking</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-(--border) bg-(--bg-primary) px-2 py-1 text-[7px] text-(--text-primary) shadow-[inset_0_0_0_1px_var(--border)]"
            >
              <Bell className="h-2.5 w-2.5 shrink-0 text-(--accent-primary)" />
              <span className="whitespace-nowrap">Secure &amp; Private</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
