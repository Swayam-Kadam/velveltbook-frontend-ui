import Image from "next/image";

import { bookingLocation } from "@/booking/booking.data";

export function OrganizationBanner() {
  return (
    <section className="feature-card overflow-hidden rounded-xl">
      <div className="relative h-[130px] w-full">
        <Image
          src={bookingLocation.banner}
          alt={bookingLocation.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />

        <div className="absolute right-2 top-2">
          <div className="primary-button rounded-full px-3 py-1 text-[8px] font-medium text-white">
            {bookingLocation.availability}
          </div>
        </div>

        <div className="absolute bottom-2 left-2.5 right-2.5">
          <p className="truncate text-[14px] font-bold text-white">
            {bookingLocation.name}
          </p>
          <p className="text-[9px] font-semibold text-(--success)">
            {bookingLocation.status}
          </p>
        </div>
      </div>
    </section>
  );
}
