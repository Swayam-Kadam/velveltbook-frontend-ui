import Image from "next/image";
import Link from "next/link";
import { Clock3 } from "lucide-react";

import { SuggestedService } from "../service.types";

interface SuggestedServicesSectionProps {
  services: SuggestedService[];
  currentServiceId: string;
}

export function SuggestedServicesSection({
  services,
  currentServiceId,
}: SuggestedServicesSectionProps) {
  const suggested = services.filter((s) => s.id !== currentServiceId);

  if (suggested.length === 0) return null;

  return (
    <section className="pt-4">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="shrink-0 text-sm font-medium text-(--text-primary)">
          Suggested Services
        </h2>
        <div className="h-px flex-1 bg-(--border)" />
      </div>

      <div
        className="
          flex gap-2 overflow-x-auto pb-1
          snap-x snap-mandatory scrollbar-none
        "
      >
        {suggested.map((service) => (
          <Link
            key={service.id}
            href={`/specificservice/${service.id}`}
            className="
              feature-card w-[118px] shrink-0 snap-start overflow-hidden
              rounded-xl transition-all duration-300
              hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
              hover:shadow-(--shadow-glow)
              active:scale-[0.98]
            "
          >
            <div className="relative h-20 w-full overflow-hidden">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="118px"
                className="object-cover"
              />
            </div>

            <div className="px-2.5 py-1.5">
              <p className="line-clamp-2 h-8 text-center text-[10px] font-semibold leading-tight text-(--text-primary)">
                {service.name}
              </p>

              <p className="mt-1 text-center text-[11px] font-bold text-(--brand-gold)">
                {service.price}
              </p>

              <div className="mt-1 flex items-center justify-center gap-0.5 text-[8px] font-semibold text-(--text-secondary)">
                <Clock3 size={8} strokeWidth={3} />
                <span>{service.duration}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
