"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  PlayCircle,
  Send,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import { TimingsDropdown } from "@/components/TimingsDropdown";
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
import SuggestionsSidebar from "@/store/[storeId]/components/suggestions/SuggestionsSidebar";
import type { SectionData, Suggestion, SuggestionsSectionMeta } from "@/types/store";
import { ExtendedOrganization } from "../organization.types";
import { HeroBanner } from "./HeroBanner";

interface ExtendedOrganizationProfileProps {
  organization: ExtendedOrganization;
  suggestions: SectionData<Suggestion, SuggestionsSectionMeta>;
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

function DesktopSectionHeader({
  title,
  actionLabel = "View All",
}: {
  title: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-(--text-primary)">{title}</h2>
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm font-medium text-(--brand-gold) transition-opacity hover:opacity-80"
      >
        <span>{actionLabel}</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

export function ExtendedOrganizationProfile({
  organization,
  suggestions,
}: ExtendedOrganizationProfileProps) {
  const [activeCategory, setActiveCategory] = useState("massage");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

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

  const selectableServices = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        price: string;
        image: string;
        description?: string;
        duration?: string;
        categoryId?: string;
      }
    >();

    for (const service of organization.services) {
      map.set(service.id, service);
    }

    for (const service of allMenuServices) {
      if (!map.has(service.id)) {
        map.set(service.id, {
          id: service.id,
          name: service.title,
          price: service.price,
          image: service.image,
          duration: service.duration,
          categoryId: service.categoryId,
        });
      }
    }

    return map;
  }, [organization.services]);

  const selectedServices = useMemo(
    () =>
      selectedServiceIds
        .map((id) => selectableServices.get(id))
        .filter((service): service is NonNullable<typeof service> => Boolean(service)),
    [selectableServices, selectedServiceIds],
  );

  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, s) => sum + parsePrice(s.price), 0),
    [selectedServices],
  );

  const categorySelectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const service of selectedServices) {
      if (service.categoryId) {
        counts[service.categoryId] = (counts[service.categoryId] ?? 0) + 1;
      }
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
    <>
      <div className="space-y-4 px-2 pb-32 pt-2 lg:hidden">
        <HeroBanner
          images={organization.heroImages}
          availability={organization.availability}
          salonName={organization.name}
          organization={organization}
          canBook={canBook}
          bookingUrl={bookingUrl}
          onBookNow={handleBookNow}
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
              <div className="px-2 pb-3 pt-3">
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
                Select Staff <ArrowRight size={14} strokeWidth={2.5} />
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
                Select Staff <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <main className="min-h-screen bg-(--bg-primary) pb-10">
          <div className="mx-auto max-w-[1600px] px-4 py-6 xl:px-8">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)_500px] xl:gap-6">
              <SuggestionsSidebar
                meta={suggestions.meta}
                items={suggestions.items}
              />

              <div className="order-1 space-y-6 xl:order-none xl:space-y-8">
                <section className="overflow-hidden rounded-[28px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_0.9fr]">
                    <div className="relative h-[240px] sm:h-[280px] lg:min-h-[280px]">
                      <Image
                        src={organization.heroImages[0] ?? organization.thumbnail}
                        alt={organization.name}
                        fill
                        sizes="(min-width: 1000px) 720px, 100vw"
                        className="object-cover"
                        priority
                      />

                      <div className="absolute left-4 top-4 z-10">
                        <div className="flex items-center gap-2">
                          <TimingsDropdown
                            summary={organization.availability}
                            buttonClassName="flex items-center gap-1 rounded-full bg-(--accent-primary) px-4 py-2 text-[10px] font-semibold text-white shadow-lg"
                            type="Right-most"
                          />
                        </div>
                      </div>

                      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Send"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-primary) text-white shadow-lg transition-opacity hover:opacity-90"
                        >
                          <Send size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label="Share"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-primary) text-white shadow-lg transition-opacity hover:opacity-90"
                        >
                          <Share2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-2 bg-(--bg-secondary) p-6 lg:p-3">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-(--accent-primary) px-4 py-2 text-xs font-semibold text-white shadow-sm">
                          <Star size={14} className="fill-(--brand-gold) text-(--brand-gold)" />
                          <span>4.8 (120+ reviews)</span>
                        </div>

                        <h1 className="mt-2 text-[24px] leading-tight font-medium text-(--text-primary)">
                          {organization.name}
                        </h1>
                      </div>

                      <p className="max-w-[360px] text-[14px] leading-4 text-(--text-secondary)">
                        Specialized deep tissue and traditional oil therapies for body
                        recovery and relaxation.
                      </p>

                      <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-card) px-3 py-2 text-[10px] font-medium text-(--text-primary)">
                          <span className="h-2.5 w-2.5 rounded-full bg-(--success)" />
                          Online
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-card) px-3 py-2 text-[10px] font-medium text-(--text-secondary)">
                          <MapPin size={14} />
                          Indore, India
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-1">
                        <Link
                          // href={bookingUrl}
                          href={"#"}
                          className="primary-button inline-flex h-8 items-center justify-center gap-2 rounded-full px-2 text-[10px] font-semibold text-white"
                        >
                          <CalendarDays size={16} />
                          Book Now
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-(--border) bg-(--bg-card) px-2 text-[10px] font-semibold text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)"
                        >
                          <PlayCircle size={16} />
                          Watch Video
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <DesktopSectionHeader title="Staff" actionLabel="View All" />
                  <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-4">
                    {organization.staff.map((member, index) => (
                      <article
                        key={member.id}
                        className={`flex h-full w-full flex-col overflow-hidden rounded-[22px] border bg-(--bg-card)  shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 ${
                          selectedStaffId === member.id
                            ? "border-(--accent-primary) ring-1 ring-(--accent-primary)"
                            : "border-(--border)"
                        }`}
                      >
                        <div className="relative mb-3 h-[190px] overflow-hidden rounded-t-[18px] bg-(--bg-secondary)">
                          <span className="absolute left-3 top-3 z-10 h-2.5 w-2.5 rounded-full bg-(--success)" />
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="220px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col text-center">
                          <h3 className="line-clamp-1 text-[17px] font-semibold text-(--text-primary)">
                            {member.name}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-sm text-(--text-secondary)">
                            {index === 0
                              ? "Massage Expert"
                              : index === 1
                                ? "Spa Therapist"
                                : index === 2
                                  ? "Wellness Coach"
                                  : "Thai Specialist"}
                          </p>

                          <div className="mt-3 flex items-center justify-center gap-1 text-[15px] font-medium text-(--text-secondary)">
                            <Star
                              size={14}
                              className="fill-(--brand-gold) text-(--brand-gold)"
                            />
                            <span>{(4.9 - index * 0.1).toFixed(1)}</span>
                          </div>
                              <div className="p-3">
                          <button
                            type="button"
                            onClick={() => setSelectedStaffId(member.id)}
                            className={
                              selectedStaffId === member.id
                                ? "primary-button mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white"
                                : "secondary-button mt-4 flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold "
                            }
                          >
                            {selectedStaffId === member.id ? (
                              <>
                                <Check size={16} />
                                Selected
                              </>
                            ) : (
                              "Select"
                            )}
                          </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* <section>
                  <DesktopSectionHeader title="Reviews" actionLabel="View All" />
                  <div className="grid gap-4 xl:grid-cols-2">
                    {organization.reviews.map((review) => (
                      <article
                        key={review.id}
                        className="relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 lg:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-(--border)">
                            <Image
                              src={review.avatar}
                              alt={review.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <h3 className="text-sm font-semibold text-(--text-primary)">
                              {review.name}
                            </h3>
                            <div className="mt-0.5 flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <Star
                                    key={index}
                                    size={12}
                                    className={
                                      index < Math.floor(review.rating)
                                        ? "fill-(--brand-gold) text-(--brand-gold)"
                                        : "text-(--border)"
                                    }
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-(--text-muted) lg:text-xs">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 flex-1 text-xs leading-relaxed text-(--text-secondary) lg:text-sm">
                          {review.text}
                        </p>
                      </article>
                    ))}
                  </div>
                </section> */}
              </div>

              <aside className="order-3 xl:order-none">
                <div className="space-y-5 xl:sticky xl:top-24">
                  <div className="rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:p-5">
                    <DesktopSectionHeader title="Service Menu" actionLabel="Select" />

                    <div className="flex min-h-[520px] overflow-hidden rounded-xl border border-(--border)">
                      <CategorySidebar
                        categories={menuCategories}
                        activeId={activeCategory}
                        onSelect={handleCategorySelect}
                        selectedCounts={categorySelectedCounts}
                        largeText
                      />

                      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
                        <div className="flex-1 overflow-y-auto scrollbar-none">
                          <div className="px-2 pb-3 pt-3">
                            <div className="mb-3">
                              <h3 className="text-sm font-semibold text-(--text-primary)">
                                Select Services
                              </h3>
                              <p className="text-[11px] text-(--text-muted)">
                                {activeCategoryLabel} · {categoryServices.length} available
                                {selectedServiceIds.length > 0 &&
                                  ` · ${selectedServiceIds.length} selected`}
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              {paginatedServices.length > 0 ? (
                                paginatedServices.map((service) => (
                                  <ServiceCard
                                    key={service.id}
                                    compact
                                    largeText
                                    service={service}
                                    selected={selectedServiceIds.includes(service.id)}
                                    onSelect={() => toggleService(service.id)}
                                  />
                                ))
                              ) : (
                                <p className="col-span-3 py-8 text-center text-sm text-(--text-muted)">
                                  No services in this category yet.
                                </p>
                              )}
                            </div>

                            {totalPages > 1 && (
                              <div className="mt-3 flex items-center justify-end gap-2 pr-1">
                                <button
                                  type="button"
                                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                                  disabled={visiblePage === 1}
                                  aria-label="Previous page"
                                  className="flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px] font-semibold text-(--text-primary) transition-colors duration-200 hover:bg-(--bg-primary) disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
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
                                        aria-current={visiblePage === p ? "page" : undefined}
                                        className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold transition-colors duration-200 ${
                                          visiblePage === p
                                            ? "bg-(--text-primary) text-(--brand-gold)"
                                            : "text-(--text-primary) hover:bg-(--bg-primary)"
                                        }`}
                                      >
                                        {p}
                                      </button>
                                    ),
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                  disabled={visiblePage === totalPages}
                                  aria-label="Next page"
                                  className="flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px] font-semibold text-(--text-primary) transition-colors duration-200 hover:bg-(--bg-primary) disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
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
                </div>
              </aside>
            </div>
          </div>
        </main>

        {/* <div className="pointer-events-none fixed bottom-6 right-20 z-40 hidden lg:block ">
          {canBook ? (
            <Link
              href={""}
              className="px-35 pointer-events-auto primary-button inline-flex h-14 items-center justify-center rounded-full px-8 text-lg font-semibold text-white shadow-[var(--shadow-card)]"
            >
              NEXT
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBookNow}
              className="px-35 pointer-events-auto primary-button inline-flex h-14 items-center justify-center rounded-full px-8 text-lg font-semibold text-white opacity-60 shadow-[var(--shadow-card)]"
            >
              NEXT
            </button>
          )}
        </div> */}
        <div
          className="
            fixed bottom-10 right-15 z-40 w-[calc(100vw-1rem)] max-w-[350px]
            overflow-hidden rounded-xl border border-(--border)
            bg-(--bg-card)/95 shadow-(--shadow-card) backdrop-blur-xl
          "
        >
          <div className="flex items-stretch ">
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
                href={""}
                className="
                  primary-button flex flex-1 items-center justify-center
                  rounded-none px-3 py-3 text-[11px] font-semibold text-white
                "
              >
                NEXT <ArrowRight size={14} strokeWidth={2.5} />
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
                NEXT <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
