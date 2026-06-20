import Image from "next/image";
import { ChevronRight, Clock3, Star } from "lucide-react";

import { ServiceDetail } from "../service.types";

interface ServiceInfoSectionProps {
  service: ServiceDetail;
}

export function ServiceInfoSection({ service }: ServiceInfoSectionProps) {
  return (
    <section className="flex gap-3">
      <div className="relative h-[188px] w-[132px] shrink-0 overflow-hidden rounded-xl">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="132px"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="text-lg font-semibold leading-tight text-[var(--text-primary)]">
          {service.name}
        </h1>

        <div className="mt-1.5 flex items-center gap-1 text-[9px] text-[var(--text-secondary)]">
          <Star
            size={10}
            className="fill-[var(--brand-gold)] text-[var(--brand-gold)]"
          />
          <span>
            {service.rating} ({service.reviews} Reviews)
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-[9px] text-[var(--text-secondary)]">
          <Clock3 size={10} strokeWidth={1.6} className="text-[var(--brand-gold)]" />
          <span>Duration: {service.duration}</span>
        </div>

        <p className="mt-2 line-clamp-4 text-[8px] leading-relaxed text-[var(--text-muted)]">
          {service.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="text-xl font-semibold text-[var(--text-primary)]">
            {service.price}
          </span>

          <button
            type="button"
            className="
              secondary-button inline-flex items-center gap-0.5
              rounded-xs px-2.5 py-1.5 text-[8px] font-medium
              text-[var(--text-primary)] transition-all duration-300
              hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
            "
          >
            <span>View More</span>
            <ChevronRight size={10} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
