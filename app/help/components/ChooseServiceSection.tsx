"use client";

import Image from "next/image";
import { Check, ChevronRight, Home, LayoutGrid } from "lucide-react";

import { homeServices } from "../help.data";

interface ChooseServiceSectionProps {
  selectedServiceId: string;
  onSelectService: (id: string) => void;
}

export function ChooseServiceSection({
  selectedServiceId,
  onSelectService,
}: ChooseServiceSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-[var(--text-primary)]">
        1. Choose a Service
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {homeServices.map((service) => {
          const active = service.id === selectedServiceId;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service.id)}
              className="w-[72px] shrink-0 text-left"
            >
              <div
                className={`
                  feature-card relative overflow-hidden rounded-xl
                  ${active ? "border-[var(--accent-primary)]" : ""}
                `}
              >
                <div className="relative h-[72px] w-[72px]">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                  {active && (
                    <span className="primary-button absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full">
                      <Check size={10} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
                <div className="p-1.5 text-center">
                  <p className="text-[8px] font-medium text-[var(--text-primary)]">
                    {service.name}
                  </p>
                  <p className="text-[8px] font-semibold text-[var(--brand-gold)]">
                    {service.price}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          className="feature-card flex h-[104px] w-[72px] shrink-0 flex-col items-center justify-center rounded-xl"
        >
          <LayoutGrid size={18} className="text-[var(--text-muted)]" />
          <span className="mt-1 text-[8px] text-[var(--text-secondary)]">More</span>
        </button>
      </div>

      <article className="feature-card mt-3 flex items-center gap-3 rounded-xl p-3">
        <div
          className="
            flex h-9 w-9 shrink-0 items-center justify-center rounded-full
            bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]
          "
        >
          <Home size={16} className="text-[var(--accent-primary)]" strokeWidth={1.6} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-medium text-[var(--text-primary)]">
            Experts will come to your location
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[7px] text-[var(--text-muted)]">
            Available at your selected address
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
          </p>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-0.5 text-[8px] text-[var(--accent-secondary)]"
        >
          Change
          <ChevronRight size={10} />
        </button>
      </article>
    </section>
  );
}
