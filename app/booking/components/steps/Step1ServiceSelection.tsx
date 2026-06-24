"use client";

import Image from "next/image";
import { Check, ChevronRight, Clock3, Grid2X2, Grid2X2Check, Grid2X2Plus, LayoutGrid, Menu, Plus, ShoppingBag, X } from "lucide-react";

import {
  bookingServices,
  calcServicesTotal,
  getSelectedServices,
} from "../../booking.data";
import { Button } from "@/components/Button";

interface Step1ServiceSelectionProps {
  selectedServiceIds: string[];
  onToggleService: (id: string) => void;
  onNext: () => void;
}

export function Step1ServiceSelection({
  selectedServiceIds,
  onToggleService,
  onNext,
}: Step1ServiceSelectionProps) {
  const selectedServices = getSelectedServices(selectedServiceIds);
  const { subtotal } = calcServicesTotal(selectedServiceIds);
  const hasSelection = selectedServices.length > 0;

  return (
    <div className="space-y-4">
      <section className="feature-card overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-(--border) px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="primary-button flex h-7 w-7 items-center justify-center rounded-full">
              <ShoppingBag size={13} strokeWidth={2} className="text-white" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-(--text-primary)">
                Your Cart
              </p>
              <p className="text-[8px] font-semibold text-(--text-muted)">
                {hasSelection
                  ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} added`
                  : "No services added yet"}
              </p>
            </div>
          </div>
          {hasSelection && (
            <p className="text-[12px] font-bold text-(--brand-gold)">
              ${subtotal}
            </p>
          )}
        </div>

        {hasSelection ? (
          <div className="space-y-2 p-3">
            {selectedServices.map((service) => (
              <article
                key={service.id}
                className="flex items-center gap-2.5 rounded-sm border border-(--border) bg-[color-mix(in_srgb,var(--accent-primary)_4%,transparent)] p-2"
              >
                <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold text-(--text-primary)">
                    {service.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1 text-[8px] font-semibold text-(--text-secondary)">
                    <Clock3 size={8} />
                    <span>{service.duration}</span>
                  </div>
                  
                </div>
                <div>
                <p className="mt-0.5 text-[11px] font-bold text-(--brand-gold)">
                    {service.priceLabel}
                  </p>
                <button
                  type="button"
                  onClick={() => onToggleService(service.id)}
                  aria-label={`Remove ${service.name}`}
                  className="
                    flex h-6 w-6 shrink-0 items-center justify-center rounded-full
                    border border-(--border) text-(--text-muted)
                    transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary)
                  "
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-3 py-4 text-center text-[9px] font-medium text-(--text-muted)">
            Tap + below to add services to your cart
          </p>
        )}
      </section>

      <Button
        variant="primary"
        fullWidth
        onClick={onNext}
        disabled={!hasSelection}
        className="gap-2 rounded-xl py-3 text-[11px] font-medium disabled:opacity-50"
      >
        Next: Select Staff
        <ChevronRight size={16} strokeWidth={2} />
      </Button>

      <h2 className="mb-[1px] ml-2 text-lg font-bold text-(--text-primary)">
        Add Services
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {bookingServices.map((service) => {
          const inCart = selectedServiceIds.includes(service.id);

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onToggleService(service.id)}
              className={`
                feature-card relative overflow-hidden rounded-xl text-left
                transition-all duration-300
                ${inCart ? "border-(--accent-primary) shadow-(--shadow-glow)" : ""}
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
                {inCart ? (
                  <span className="primary-button absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full text-white">
                    <Check size={10} strokeWidth={2.5} />
                  </span>
                ) : (
                  <span
                    className="
                      absolute bottom-[-3.8rem] right-1 flex h-5 w-5 items-center justify-center
                      rounded-full border border-(--border) bg-(--surface)
                      text-(--accent-primary) shadow-sm
                    "
                  >
                    <Plus size={11} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="text-[10px] font-medium text-(--text-primary) h-8">
                  {service.name}
                </p>
                <p className="text-[12px] font-semibold text-(--brand-gold)">
                  {service.priceLabel}
                </p>
              </div>
            </button>
          );
        })}

<button
              // key={service.id}
              type="button"
              // onClick={() => onToggleService(service.id)}
              className={`
                feature-card relative overflow-hidden rounded-xl text-left
                transition-all duration-300
       
              `}
            >
              <div className=" h-[72px] flex flex-col items-center justify-center">
                
                <LayoutGrid size={30} strokeWidth={1.5}  className="text-(--text-primary) font-bold"/>
                <p className="text-[14px] font-medium text-(--text-primary)">More</p>
              
              </div>
            </button>
      </div>
    </div>
  );
}
