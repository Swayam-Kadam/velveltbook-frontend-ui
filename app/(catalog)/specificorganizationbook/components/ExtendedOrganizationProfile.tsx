"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { CategorySidebar } from "@/menu/components/CategorySidebar";
import { ServiceCard } from "@/menu/components/ServiceCard";
import {
  allMenuServices,
  getServicesByCategory,
  getTotalPages,
  menuCategories,
  paginateServices,
} from "@/menu/menu.data";
import { buildBookingUrl } from "@/booking/booking.navigation";
import { ExtendedOrganization } from "../organization.types";
import { HeroBanner } from "./HeroBanner";

interface ExtendedOrganizationProfileProps {
  organization: ExtendedOrganization;
}

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
} as const;

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

export function ExtendedOrganizationProfile({
  organization,
}: ExtendedOrganizationProfileProps) {
  const [activeCategory, setActiveCategory] = useState("massage");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

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

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const selectedServices = useMemo(
    () => allMenuServices.filter((s) => selectedServiceIds.includes(s.id)),
    [selectedServiceIds],
  );

  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, s) => sum + parsePrice(s.price), 0),
    [selectedServices],
  );

  const categorySelectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const service of selectedServices) {
      counts[service.categoryId] = (counts[service.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [selectedServices]);

  const handleBookNow = () => {
    if (selectedServiceIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select a service first",
        text: "Please choose at least one service before booking.",
        ...swalDefaults,
      });
    }
  };

  const canBook = selectedServiceIds.length > 0;
  const bookingUrl = buildBookingUrl({
    serviceIds: selectedServiceIds,
    expertType: "",
    organizationId: organization.id,
    step: 2,
  });

  return (
    <div className="space-y-4 px-2 pb-32 pt-2">
      <HeroBanner
        images={organization.heroImages}
        availability={organization.availability}
        salonName={organization.name}
        organization={organization}
      />

      <div className="flex min-h-[420px] overflow-hidden rounded-xl border border-(--border)">
        <CategorySidebar
          categories={menuCategories}
          activeId={activeCategory}
          onSelect={handleCategorySelect}
          selectedCounts={categorySelectedCounts}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
          <div className="flex-1 overflow-y-auto scrollbar-none">
            <div className="px-2 pt-3 pb-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h1 className="text-xs font-medium text-(--text-primary)">
                    Select Services
                  </h1>
                  <p className="text-[8px] text-(--text-muted)">
                    {activeCategoryLabel} · {categoryServices.length} available
                    {selectedServiceIds.length > 0 &&
                      ` · ${selectedServiceIds.length} selected`}
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
                      compact
                      service={service}
                      selected={selectedServiceIds.includes(service.id)}
                      onSelect={() => toggleService(service.id)}
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

      <div
        className="
          fixed inset-x-2 bottom-[85px] z-40 overflow-hidden rounded-xl
          border border-(--border) bg-(--bg-card)/95 shadow-(--shadow-card)
          backdrop-blur-xl
        "
      >
        <div className="flex items-stretch">
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            <div className="relative shrink-0">
              <span
                className="
                  primary-button flex h-10 w-10 items-center justify-center
                  rounded-xl
                "
              >
                <ShoppingCart size={18} strokeWidth={2} className="text-white" />
              </span>
              {selectedServiceIds.length > 0 && (
                <span
                  className="
                    absolute -right-1 -top-1 flex h-4 min-w-4 items-center
                    justify-center rounded-full bg-(--brand-gold) px-1
                    text-[8px] font-bold text-(--text-primary)
                  "
                  aria-label={`${selectedServiceIds.length} services in cart`}
                >
                  {selectedServiceIds.length}
                </span>
              )}
            </div>

            <div className="min-w-0">
              {selectedServiceIds.length > 0 && (
                <span className="text-sm font-semibold text-(--brand-gold)">
                  ${totalPrice}
                </span>
              )}
            </div>
          </div>

          {canBook ? (
            <Link
              href={bookingUrl}
              className="
                primary-button flex flex-1 items-center justify-center
                rounded-none px-3 py-3 text-[11px] font-semibold text-white
              "
            >
              {/* Book Now */}
              Select Staff  <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBookNow}
              className="
                primary-button flex flex-1 items-center justify-center
                rounded-none px-3 py-3 text-[11px] font-semibold text-white
                opacity-60
              "
            >
              {/* Book Now */}
              Select Staff  <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
