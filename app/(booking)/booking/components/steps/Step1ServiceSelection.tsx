"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";

import { CategorySidebar } from "@/menu/components/CategorySidebar";
import { ServiceCard } from "@/menu/components/ServiceCard";
import {
  BookingOrganizationBanner,
  type BookingOrganizationBannerInfo,
} from "../BookingOrganizationBanner";
import {
  allMenuServices,
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
import { TimingsDropdown } from "@/components/TimingsDropdown";

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
  allowOutsideClick: false,
  allowEscapeKey: false,
} as const;

interface Step1ServiceSelectionProps {
  selectedServiceIds: string[];
  organizationBanner?: BookingOrganizationBannerInfo;
  onToggleService: (id: string) => void;
  onNext: () => void;
}

export function Step1ServiceSelection({
  selectedServiceIds,
  organizationBanner,
  onToggleService,
  onNext,
}: Step1ServiceSelectionProps) {
  const [activeCategory, setActiveCategory] = useState("massage");
  const [page, setPage] = useState(1);

  const selectedServices = getSelectedServices(selectedServiceIds);
  const { subtotal } = calcServicesTotal(selectedServiceIds);
  const hasSelection = selectedServices.length > 0;

  const org = organizationBanner ?? {
    name: bookingLocation.name,
    banner: bookingLocation.banner,
    availability: bookingLocation.availability,
    status: bookingLocation.status,
    thumbnail: bookingLocation.image,
    address: bookingLocation.address,
  };

  const categoryServices = useMemo(
    () => getServicesByCategory(activeCategory),
    [activeCategory],
  );

  const totalPages = getTotalPages(categoryServices.length);
  const visiblePage = Math.min(page, totalPages);
  const paginatedServices = useMemo(
    () => paginateServices(categoryServices, visiblePage),
    [categoryServices, visiblePage],
  );

  const activeCategoryLabel =
    menuCategories.find((c) => c.id === activeCategory)?.label ?? "Services";

  const categorySelectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const id of selectedServiceIds) {
      const menuService = allMenuServices.find((s) => s.id === id);
      if (menuService) {
        counts[menuService.categoryId] =
          (counts[menuService.categoryId] ?? 0) + 1;
      }
    }
    return counts;
  }, [selectedServiceIds]);

  const handleSelectCategory = (id: string) => {
    setActiveCategory(id);
    setPage(1);
  };

  const handleNext = async () => {
    if (!hasSelection) {
      await Swal.fire({
        icon: "warning",
        title: "Please select a service",
        text: "Choose at least one service before continuing.",
        ...swalDefaults,
      });
      return;
    }

    onNext();
  };

  const pagination = totalPages > 1 && (
    <div className="mt-3 flex items-center justify-end gap-2 pr-1">
      <button
        type="button"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={visiblePage === 1}
        aria-label="Previous page"
        className="
          flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px]
          font-semibold text-(--text-primary) transition-colors
          duration-200 hover:bg-(--bg-primary)
          disabled:cursor-not-allowed disabled:opacity-40
          disabled:hover:bg-transparent
          lg:text-[12px]
        "
      >
        <ChevronLeft size={14} strokeWidth={2.5} />
        Back
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPage(p)}
            aria-label={`Go to page ${p}`}
            aria-current={visiblePage === p ? "page" : undefined}
            className={`
              flex h-6 w-6 items-center justify-center rounded-md
              text-[11px] font-bold transition-colors duration-200
              lg:h-7 lg:w-7 lg:text-[12px]
              ${
                visiblePage === p
                  ? "bg-(--text-primary) text-(--brand-gold)"
                  : "text-(--text-primary) hover:bg-(--bg-primary)"
              }
            `}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={visiblePage === totalPages}
        aria-label="Next page"
        className="
          flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px]
          font-semibold text-(--text-primary) transition-colors
          duration-200 hover:bg-(--bg-primary)
          disabled:cursor-not-allowed disabled:opacity-40
          disabled:hover:bg-transparent
          lg:text-[12px]
        "
      >
        Next
        <ChevronRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  );

  return (
    <>
      {/* ================= MOBILE (unchanged) ================= */}
      <div className="space-y-4 lg:hidden">
        <BookingOrganizationBanner
          organization={organizationBanner}
          serviceLabels={selectedServices.map((service) => service.name)}
        />

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
          onClick={handleNext}
          className="gap-2 rounded-xl py-3 text-[11px] font-medium"
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
            onSelect={handleSelectCategory}
            selectedCounts={categorySelectedCounts}
          />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
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
                        onSelect={() => onToggleService(service.id)}
                      />
                    ))
                  ) : (
                    <p className="col-span-3 py-8 text-center text-[10px] text-(--text-muted)">
                      No services in this category yet.
                    </p>
                  )}
                </div>

                {pagination}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      {/*
        Full-screen 2-column layout:
        LEFT  → vertical split (banner on top, selected services below)
        RIGHT → category sidebar + service list
      */}
      <div className="hidden lg:grid lg:h-[calc(100vh-140px)] lg:min-h-[680px] lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[440px_minmax(0,1fr)]">
        {/* LEFT COLUMN */}
        <aside className="flex min-h-0 flex-col gap-4">
          {/* Top: Banner */}
          <section className="relative h-[240px] shrink-0 overflow-hidden rounded-[22px] border border-(--border) xl:h-[260px]">
            <Image
              src={org.banner}
              alt={org.name}
              fill
              sizes="440px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-(--success)" />

              <div className=" inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary) px-3 py-1.5 text-[11px] font-semibold text-white">
              <Star
                size={12}
                className="fill-(--brand-gold) text-(--brand-gold)"
              />
              4.8 (120+)
            </div>
            </div>
            

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <TimingsDropdown
                summary={org.availability}
                buttonClassName="primary-button flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
              />
            </div>
            

            <div className="absolute right-4 bottom-4 left-4">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[22px] font-semibold text-white xl:text-[24px]">
                  {org.name}
                </h2>
                <BadgeCheck
                  size={18}
                  className="shrink-0 fill-(--brand-gold) text-(--accent-primary)"
                />
              </div>
              <p className="mt-1 text-[13px] font-medium text-(--success)">
                {org.status}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-white/80">
                <MapPin size={13} />
                {org.address ?? "Melbourne, Australia"}
              </p>
            </div>
          </section>

          {/* Bottom: Selected services */}
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card)">
            <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="primary-button flex h-9 w-9 items-center justify-center rounded-xl">
                  <ShoppingBag size={16} className="text-white" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-(--text-primary)">
                    Selected Services
                  </p>
                  <p className="text-[12px] text-(--text-muted)">
                    {hasSelection
                      ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} selected`
                      : "No services selected yet"}
                  </p>
                </div>
              </div>
              {hasSelection && (
                <p className="text-[22px] font-bold text-(--brand-gold)">
                  ${subtotal}
                </p>
              )}
            </div>

            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3.5 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
              {hasSelection ? (
                selectedServices.map((service) => (
                  <article
                    key={service.id}
                    className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--bg-secondary) p-2.5"
                  >
                    <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        sizes="68px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-(--text-primary)">
                        {service.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[12px] text-(--text-secondary)">
                        <Clock3 size={12} />
                        <span>{service.duration}</span>
                      </div>
                      <p className="mt-1 text-[15px] font-bold text-(--brand-gold)">
                        {service.priceLabel}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleService(service.id)}
                      aria-label={`Remove ${service.name}`}
                      className="
                        flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                        border border-(--border) bg-(--bg-card) text-(--text-muted)
                        transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary)
                      "
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) px-4 text-center">
                  <ShoppingBag
                    size={28}
                    className="mb-3 text-(--text-muted) opacity-50"
                  />
                  <p className="text-[14px] font-medium text-(--text-primary)">
                    No services selected
                  </p>
                  <p className="mt-1 text-[12px] text-(--text-muted)">
                    Pick services from the menu on the right
                  </p>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-(--border) p-3.5">
              <button
                type="button"
                onClick={handleNext}
                className="
                  primary-button flex h-12 w-full items-center justify-center gap-2
                  rounded-xl text-[14px] font-semibold text-white
                  transition-opacity hover:opacity-90
                "
              >
                Next: Select Staff
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </section>
        </aside>

        {/* RIGHT COLUMN — category-wise service list */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card)">
          <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-5 py-4">
            <div>
              <h2 className="text-[20px] font-semibold text-(--text-primary)">
                Service Menu
              </h2>
              <p className="mt-0.5 text-[13px] text-(--text-muted)">
                {activeCategoryLabel} · {categoryServices.length} available
                {hasSelection ? ` · ${selectedServices.length} selected` : ""}
              </p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            <CategorySidebar
              categories={menuCategories}
              activeId={activeCategory}
              onSelect={handleSelectCategory}
              selectedCounts={categorySelectedCounts}
              largeText
            />

            <div className="flex min-w-0 flex-1 flex-col bg-(--bg-secondary)">
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
                <div className="mb-4">
                  <h3 className="text-[16px] font-semibold text-(--text-primary)">
                    {activeCategoryLabel}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-(--text-muted)">
                    Tap a service to add it to your selection
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 xl:grid-cols-4">
                  {paginatedServices.length > 0 ? (
                    paginatedServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        compact
                        largeText
                        service={service}
                        selected={selectedServiceIds.includes(service.id)}
                        onSelect={() => onToggleService(service.id)}
                      />
                    ))
                  ) : (
                    <p className="col-span-3 py-16 text-center text-[14px] text-(--text-muted) xl:col-span-4">
                      No services in this category yet.
                    </p>
                  )}
                </div>

                {pagination}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
