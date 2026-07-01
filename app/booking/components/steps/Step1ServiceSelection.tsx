"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ShoppingBag,
  X,
} from "lucide-react";

import { CategorySidebar } from "@/menu/components/CategorySidebar";
import { ServiceCard } from "@/menu/components/ServiceCard";
import {
  getServicesByCategory,
  getTotalPages,
  menuCategories,
  paginateServices,
} from "@/menu/menu.data";
import {
  bookingLocation,
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
  const [activeCategory, setActiveCategory] = useState("massage");
  const [page, setPage] = useState(1);

  const selectedServices = getSelectedServices(selectedServiceIds);
  const { subtotal } = calcServicesTotal(selectedServiceIds);
  const hasSelection = selectedServices.length > 0;

  const categoryServices = useMemo(
    () => getServicesByCategory(activeCategory),
    [activeCategory],
  );

  const totalPages = getTotalPages(categoryServices.length);
  const paginatedServices = useMemo(
    () => paginateServices(categoryServices, page),
    [categoryServices, page],
  );

  const activeCategoryLabel =
    menuCategories.find((c) => c.id === activeCategory)?.label ?? "Services";

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="space-y-4">
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
            Tap a service below to add to your cart
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

      <div className="flex min-h-[420px] overflow-hidden rounded-xl border border-(--border)">
        <CategorySidebar
          categories={menuCategories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
          <div className="flex-1 overflow-y-auto scrollbar-none">
            <div className="px-2 pt-3 pb-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-medium text-(--text-primary)">
                    Select Services
                  </h3>
                  <p className="text-[8px] text-(--text-muted)">
                    {activeCategoryLabel} · {categoryServices.length} available
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    flex items-center gap-0.5 text-[8px]
                    text-(--brand-gold) transition-opacity duration-200
                    hover:opacity-80
                  "
                >
                  <span>View All</span>
                  <ArrowRight size={10} strokeWidth={2} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {paginatedServices.length > 0 ? (
                  paginatedServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedServiceIds.includes(service.id)}
                      onSelect={(s) => onToggleService(s.id)}
                    />
                  ))
                ) : (
                  <p className="col-span-3 py-8 text-center text-[10px] text-(--text-muted)">
                    No services in this category yet.
                  </p>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-3 flex items-center justify-end gap-2 pr-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="
                      flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px]
                      font-semibold text-(--text-primary) transition-colors
                      duration-200 hover:bg-(--bg-primary)
                      disabled:cursor-not-allowed disabled:opacity-40
                      disabled:hover:bg-transparent
                    "
                  >
                    <ChevronLeft size={14} strokeWidth={2.5} />
                    Back
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          aria-label={`Go to page ${p}`}
                          aria-current={page === p ? "page" : undefined}
                          className={`
                            flex h-6 w-6 items-center justify-center rounded-md
                            text-[11px] font-bold transition-colors duration-200
                            ${
                              page === p
                                ? "bg-(--text-primary) text-(--brand-gold)"
                                : "text-(--text-primary) hover:bg-(--bg-primary)"
                            }
                          `}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    className="
                      flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px]
                      font-semibold text-(--text-primary) transition-colors
                      duration-200 hover:bg-(--bg-primary)
                      disabled:cursor-not-allowed disabled:opacity-40
                      disabled:hover:bg-transparent
                    "
                  >
                    Next
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
