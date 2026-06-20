"use client";

import Image from "next/image";
import { Check, Clock3 } from "lucide-react";

import { bookingServices } from "../../booking.data";
import { Button } from "@/components/Button";
import { ChevronRight } from "lucide-react";

interface Step1ServiceSelectionProps {
  selectedServiceId: string;
  onSelectService: (id: string) => void;
  onNext: () => void;
}

export function Step1ServiceSelection({
  selectedServiceId,
  onSelectService,
  onNext,
}: Step1ServiceSelectionProps) {
  const selected = bookingServices.find((s) => s.id === selectedServiceId)!;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {bookingServices.map((service) => {
          const active = service.id === selectedServiceId;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service.id)}
              className={`
                feature-card overflow-hidden rounded-xl text-left
                transition-all duration-300
                ${active ? "border-[var(--accent-primary)] shadow-[var(--shadow-glow)]" : ""}
              `}
            >
              <div className="relative h-[72px]">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
                {active && (
                  <span className="primary-button text-white absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full">
                    <Check size={10} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="text-[9px] font-medium text-[var(--text-primary)]">
                  {service.name}
                </p>
                <p className="text-[8px] font-semibold text-[var(--brand-gold)]">
                  {service.priceLabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <article className="feature-card rounded-xl p-3">
        <div className="flex gap-3">
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm">
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium text-[var(--text-primary)]">
              {selected.name}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-[8px] text-[var(--text-muted)]">
              <Clock3 size={9} />
              <span>{selected.duration}</span>
            </div>
            <p className="mt-1 text-[10px] font-semibold text-[var(--brand-gold)]">
              {selected.priceLabel}
            </p>
            <p className="mt-1 text-[7px] leading-relaxed text-[var(--text-secondary)]">
              {selected.description}
            </p>
          </div>
        </div>
      </article>

      <Button
        variant="primary"
        fullWidth
        onClick={onNext}
        className="gap-2 rounded-xl py-3 text-[11px] font-medium"
      >
        Next: Select Staff
        <ChevronRight size={16} strokeWidth={2} />
      </Button>
    </div>
  );
}
