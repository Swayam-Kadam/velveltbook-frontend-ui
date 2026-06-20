import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, ChevronRight } from "lucide-react";

import { OrganizationService } from "../organization.types";

interface PopularServicesSectionProps {
  services: OrganizationService[];
}

export function PopularServicesSection({
  services,
}: PopularServicesSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-[var(--text-primary)]">
          Popular Services
        </h2>

        <button
          type="button"
          className="
            flex items-center gap-0.5 text-[8px]
            text-[var(--brand-gold)] transition-opacity duration-200
            hover:opacity-80
          "
        >
          <span>View All</span>
          <ArrowRight size={10} strokeWidth={2} />
        </button>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/specificservice/${service.id}`}
            className="
              flex w-full items-center gap-3 text-left
              transition-opacity duration-200 hover:opacity-80
            "
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[var(--text-primary)]">
                {service.name}
              </p>

              <div className="mt-0.5 flex items-center gap-0.5 text-[8px] text-[var(--text-muted)]">
                <Clock3 size={8} strokeWidth={1.6} />
                <span>{service.duration}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <span className="text-[10px] font-semibold text-[var(--text-primary)]">
                {service.price}
              </span>
              <ChevronRight size={12} className="text-[var(--text-muted)]" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
