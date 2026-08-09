"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Headphones,
  Heart,
  MapPin,
  PlayCircle,
  Plus,
  Send,
  ShieldCheck,
  ShoppingCart,
  Star,
  Trophy,
} from "lucide-react";
import { TimingsDropdown } from "@/components/TimingsDropdown";
import { buildBookingUrl } from "@/booking/booking.navigation";
import { useDeals } from "../hooks/useDeals";
import type { Deal } from "../deals.types";
import { useStoreDealsBooking } from "../hooks/useStoreDealsBooking";
import { DealTypeToggle } from "./DealTypeToggle";
import { DealsCategorySlider } from "./DealsCategorySlider";
import { DealsFilterSidebar } from "./DealsFilterSidebar";
import { DealsGrid } from "./DealsGrid";
import { DealsSearchFilterBar } from "./DealsSearchFilterBar";
import { DealsPagination } from "./DealsPagination";
import { PromoBanner } from "./PromoBanner";
import { StoreDealsBookingModal } from "./StoreDealsBookingModal";
import { DealCard } from "./DealCard";
import { PackageCard } from "./PackageCard";
import {
  buildDesktopBookingPackages,
  createDefaultServiceSelection,
  type BookingPackage,
} from "./desktopBookingPackages";

function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function getDealTags(deal: Deal) {
  return deal.type === "single"
    ? deal.tags
    : deal.includedServices.map((service) => service.label);
}

function DesktopSalonSidebar({
  deals,
  dealType,
  bookingDeal,
  packages,
  activePackageId,
  selectedServicesByPackage,
  onBookClick,
  onActivePackageChange,
  onToggleService,
}: {
  deals: Deal[];
  dealType: Deal["type"];
  bookingDeal: Deal | null;
  packages: BookingPackage[];
  activePackageId: string;
  selectedServicesByPackage: Record<string, string[]>;
  onBookClick?: (deal: Deal) => void;
  onActivePackageChange: (packageId: string) => void;
  onToggleService: (packageId: string, serviceId: string) => void;
}) {
  const isBooking = Boolean(bookingDeal);
  const featured = bookingDeal ?? deals[0];
  const listDeals = deals.slice(0, 4);
  const packageScrollRef = useRef<HTMLDivElement>(null);

  const activePackage =
    packages.find((pkg) => pkg.id === activePackageId) ?? packages[0] ?? null;

  const selectedServiceIds = activePackage
    ? (selectedServicesByPackage[activePackage.id] ?? [])
    : [];

  if (!featured) return null;

  const tabPrefix = dealType === "single" ? "Single" : "Package";
  const isPackageFlow = dealType !== "single";
  const packageLabels = [
    `${tabPrefix} 1`,
    `${tabPrefix} 2`,
    `${tabPrefix} 3`,
    `${tabPrefix} 4`,
    `${tabPrefix} 5`,
    `${tabPrefix} 6`,
  ];

  const scrollPackages = (direction: "left" | "right") => {
    const el = packageScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -el.clientWidth : el.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <aside className="space-y-3">
      <section className="overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
        <div className="relative h-[168px]">
          <Image
            src={
              isBooking && activePackage
                ? activePackage.image
                : featured.image
            }
            alt={featured.salonName}
            fill
            sizes="420px"
            className="object-cover"
          />

          <div className="absolute left-3 top-3">
            <TimingsDropdown
              summary="9AM - 8PM"
              buttonClassName="flex items-center gap-1 rounded-full bg-(--accent-primary) px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg"
              type="Right-most"
            />
          </div>

          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button
              type="button"
              aria-label="Share"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-primary) text-white shadow-lg"
            >
              <Send size={14} />
            </button>
            <button
              type="button"
              aria-label="Save"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-(--accent-primary) text-white shadow-lg"
            >
              <Heart size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary) px-3 py-1.5 text-[11px] font-semibold text-white">
            <Star size={12} className="fill-(--brand-gold) text-(--brand-gold)" />
            {featured.rating} ({featured.reviewCount} reviews)
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-[24px] font-semibold leading-tight text-(--text-primary)">
              {featured.salonName}
            </h2>
            <BadgeCheck
              size={18}
              className="shrink-0 fill-(--accent-primary) text-white"
            />
          </div>

          <p className="text-[13px] leading-5 text-(--text-secondary)">
            Specialized deep tissue and traditional oil therapies for body
            recovery and relaxation.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-secondary) px-3 py-1.5 text-[11px] font-medium text-(--text-primary)">
              <span className="h-2 w-2 rounded-full bg-(--success)" />
              Online
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--bg-secondary) px-3 py-1.5 text-[11px] font-medium text-(--text-secondary)">
              <MapPin size={13} />
              Indore, India
            </span>
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-(--border) bg-(--bg-secondary) px-4 text-[12px] font-semibold text-(--text-primary)"
          >
            <PlayCircle size={15} />
            Watch Video
          </button>
        </div>
      </section>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => scrollPackages("left")}
          aria-label="Scroll packages left"
          className="
            flex h-7 w-7 shrink-0 items-center justify-center rounded-full
            border border-(--border) bg-(--bg-card) text-(--text-primary)
            transition-colors hover:bg-(--bg-card-hover)
          "
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
        </button>

        <div
          ref={packageScrollRef}
          className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto scroll-smooth scrollbar-none"
        >
          {packageLabels.map((label, index) => {
            const pkg = packages[index];
            const isActive = isBooking
              ? Boolean(pkg && pkg.id === activePackage?.id)
              : index === 0;

            return (
              <button
                key={label}
                type="button"
                disabled={!isBooking || !pkg}
                onClick={() => {
                  if (pkg) onActivePackageChange(pkg.id);
                }}
                className={`
                  h-9 shrink-0 basis-[calc((100%-1.125rem)/4)] truncate
                  rounded-xl border text-[11px] font-semibold transition-colors
                  ${
                    isActive
                      ? "border-(--accent-primary) bg-(--accent-primary) text-white"
                      : "border-(--border) bg-(--bg-card) text-(--text-primary)"
                  }
                  ${!isBooking || !pkg ? "cursor-default" : ""}
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollPackages("right")}
          aria-label="Scroll packages right"
          className="
            flex h-7 w-7 shrink-0 items-center justify-center rounded-full
            border border-(--border) bg-(--bg-card) text-(--text-primary)
            transition-colors hover:bg-(--bg-card-hover)
          "
        >
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      <section className="space-y-2.5">
        {isBooking && activePackage
          ? activePackage.services.map((service) => {
              const isSelected = isPackageFlow
                ? true
                : selectedServiceIds.includes(service.id);

              return (
                <article
                  key={service.id}
                  className={`flex items-center gap-3 rounded-2xl border bg-(--bg-card) p-2.5 shadow-[var(--shadow-card)] ${
                    isSelected
                      ? "border-(--brand-gold)"
                      : "border-(--border)"
                  }`}
                >
                  <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={activePackage.image}
                      alt={service.label}
                      fill
                      sizes="78px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-(--text-primary)">
                      {service.label}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <span className="rounded-md bg-(--accent-primary) px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        -{activePackage.discountPercent}%
                      </span>
                      <span className="rounded-full border border-(--border) bg-(--bg-secondary) px-1.5 py-0.5 text-[9px] text-(--text-secondary)">
                        {activePackage.title}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-[20px] font-bold leading-none text-(--brand-gold)">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-[11px] text-(--text-muted) line-through">
                        {formatPrice(
                          Number(
                            (
                              activePackage.originalPrice /
                              activePackage.services.length
                            ).toFixed(2),
                          ),
                        )}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[10px] text-(--text-muted)">
                      {dealType === "single"
                        ? "Single deal"
                        : "Package service"}
                    </p>
                  </div>

                  {isPackageFlow ? (
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent-primary) text-white"
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onToggleService(activePackage.id, service.id)
                      }
                      aria-label={
                        isSelected
                          ? `Remove ${service.label}`
                          : `Add ${service.label}`
                      }
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full cursor-pointer ${
                        isSelected
                          ? "bg-(--accent-primary) text-white"
                          : "bg-white text-(--accent-primary) border border-(--border) border-3"
                      }`}
                    >
                      {isSelected ? (
                        <Check size={16} strokeWidth={2.5} />
                      ) : (
                        <Plus size={16} strokeWidth={2.5} />
                      )}
                    </button>
                  )}
                </article>
              );
            })
          : listDeals.map((deal) => {
              const tags = getDealTags(deal).slice(0, 3);

              return (
                <article
                  key={deal.id}
                  className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--bg-card) p-2.5 shadow-[var(--shadow-card)]"
                >
                  <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      sizes="78px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-(--text-primary)">
                      {deal.title}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <span className="rounded-md bg-(--accent-primary) px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        -{deal.discountPercent}%
                      </span>
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-(--border) bg-(--bg-secondary) px-1.5 py-0.5 text-[9px] text-(--text-secondary)"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-[20px] font-bold leading-none text-(--brand-gold)">
                        {formatPrice(deal.currentPrice)}
                      </span>
                      <span className="text-[11px] text-(--text-muted) line-through">
                        {formatPrice(deal.originalPrice)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[10px] text-(--text-muted)">
                      {deal.type === "single" ? "Single deal" : "Package deal"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookClick?.(deal)}
                    aria-label={`Add ${deal.title}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent-primary) text-white"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </article>
              );
            })}
      </section>
    </aside>
  );
}

function DesktopDealsCartBar({
  isBooking,
  cartCount,
  cartTotal,
  bookingHref,
}: {
  isBooking: boolean;
  cartCount: number;
  cartTotal: number;
  bookingHref: string;
}) {
  return (
    <div className="flex w-full max-w-[420px] items-center gap-3 rounded-2xl border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)]">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--accent-primary) text-white">
        <ShoppingCart size={22} />
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--brand-gold) px-1 text-[10px] font-bold text-(--text-primary)">
          {cartCount}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-(--text-muted)">Total</p>
        <p className="text-[28px] font-bold leading-none text-(--brand-gold)">
          {formatPrice(cartTotal)}
        </p>
        <p className="mt-1 text-[11px] text-(--text-secondary)">
          {isBooking
            ? `${cartCount} service${cartCount === 1 ? "" : "s"}`
            : `${cartCount} items`}
        </p>
      </div>

      {isBooking ? (
        cartCount > 0 ? (
          <Link
            href={bookingHref}
            className="primary-button flex h-11 shrink-0 items-center justify-center rounded-xl px-5 text-[13px] font-semibold text-white"
          >
            Book Now
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="primary-button h-11 shrink-0 rounded-xl px-5 text-[13px] font-semibold text-white opacity-50"
          >
            Book Now
          </button>
        )
      ) : (
        <button
          type="button"
          className="primary-button h-11 shrink-0 rounded-xl px-5 text-[13px] font-semibold text-white"
        >
          View Cart
        </button>
      )}
    </div>
  );
}

function DesktopDealsGrid({
  deals,
  onBookClick,
}: {
  deals: Deal[];
  onBookClick?: (deal: Deal) => void;
}) {
  if (deals.length === 0) {
    return (
      <div className="rounded-[24px] border border-(--border) bg-(--bg-card) px-6 py-16 text-center shadow-[var(--shadow-card)]">
        <p className="text-[16px] font-medium text-(--text-primary)">
          No deals found
        </p>
        <p className="mt-2 text-[13px] text-(--text-secondary)">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3.5">
      {deals.slice(0, 6).map((deal) =>
        deal.type === "single" ? (
          <DealCard
            key={deal.id}
            deal={deal}
            desktop
            onBookClick={onBookClick}
          />
        ) : (
          <PackageCard
            key={deal.id}
            deal={deal}
            desktop
            onBookClick={onBookClick}
          />
        ),
      )}
    </div>
  );
}

function DesktopTrustBar() {
  const items = [
    {
      icon: Trophy,
      title: "Best Price Guarantee",
      subtitle: "We match the best price.",
    },
    {
      icon: ShieldCheck,
      title: "Verified & Trusted",
      subtitle: "All salons & spas are verified.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      subtitle: "100% secure checkout.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      subtitle: "We're here to help.",
    },
  ];

  return (
    <section className="grid grid-cols-4 gap-3 rounded-[22px] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)]">
      {items.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex items-start gap-3 px-2 py-1">
          <Icon
            size={22}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0 text-(--accent-primary)"
          />
          <div>
            <p className="text-[13px] font-semibold text-(--text-primary)">
              {title}
            </p>
            <p className="mt-0.5 text-[11px] text-(--text-secondary)">
              {subtitle}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

export function DealsPageContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const storeBooking = useStoreDealsBooking();

  const [desktopBookingDeal, setDesktopBookingDeal] = useState<Deal | null>(
    null,
  );
  const [desktopPackages, setDesktopPackages] = useState<BookingPackage[]>([]);
  const [activePackageId, setActivePackageId] = useState("");
  const [selectedServicesByPackage, setSelectedServicesByPackage] = useState<
    Record<string, string[]>
  >({});

  const {
    allDeals,
    filters,
    isLoading,
    page,
    totalPages,
    setPage,
    setDealType,
    setCategory,
    setSearch,
    setSort,
    setSuburb,
    setLanguage,
    setPrice,
    setNationality,
    resetSidebarFilters,
  } = useDeals();

  const openDesktopBooking = (deal: Deal) => {
    const packages = buildDesktopBookingPackages(deal, allDeals);
    setDesktopBookingDeal(deal);
    setDesktopPackages(packages);
    setActivePackageId(packages[0]?.id ?? "");
    setSelectedServicesByPackage(createDefaultServiceSelection(packages));
  };

  // Keep desktop sidebar options in sync with Single / Package toggle.
  useEffect(() => {
    if (allDeals.length === 0) {
      setDesktopBookingDeal(null);
      setDesktopPackages([]);
      setActivePackageId("");
      setSelectedServicesByPackage({});
      return;
    }

    const firstDeal = allDeals[0];
    const packages = buildDesktopBookingPackages(firstDeal, allDeals);
    setDesktopBookingDeal(firstDeal);
    setDesktopPackages(packages);
    setActivePackageId(packages[0]?.id ?? "");
    setSelectedServicesByPackage(createDefaultServiceSelection(packages));
  }, [allDeals, filters.dealType]);

  const toggleDesktopService = (packageId: string, serviceId: string) => {
    setSelectedServicesByPackage((current) => {
      const existing = current[packageId] ?? [];
      const next = existing.includes(serviceId)
        ? existing.filter((id) => id !== serviceId)
        : [...existing, serviceId];
      return {
        ...current,
        [packageId]: next,
      };
    });
  };

  const isDesktopBooking = Boolean(desktopBookingDeal);
  const activePackage =
    desktopPackages.find((pkg) => pkg.id === activePackageId) ??
    desktopPackages[0] ??
    null;
  const selectedServiceIds = activePackage
    ? (selectedServicesByPackage[activePackage.id] ?? [])
    : [];
  const browseDeals = allDeals.slice(0, 4);
  const cartCount = isDesktopBooking
    ? selectedServiceIds.length
    : browseDeals.length;
  const cartTotal = isDesktopBooking
    ? (activePackage?.services
        .filter((service) => selectedServiceIds.includes(service.id))
        .reduce((sum, service) => sum + service.price, 0) ?? 0)
    : browseDeals.reduce((sum, deal) => sum + deal.currentPrice, 0);
  const bookingServiceIds = activePackage
    ? Array.from(
        new Set(
          activePackage.services
            .filter((service) => selectedServiceIds.includes(service.id))
            .map((service) => service.menuServiceId),
        ),
      )
    : [];
  const bookingHref =
    bookingServiceIds.length > 0
      ? buildBookingUrl({
          serviceIds: bookingServiceIds,
          step: 2,
        })
      : "#";

  return (
    <main className="space-y-3 px-2 pb-24 pt-3 lg:mx-auto lg:w-full lg:max-w-[1600px] lg:space-y-4 lg:px-5 lg:pb-8 lg:pt-4">
      <div className="space-y-3 lg:hidden">
        <DealTypeToggle value={filters.dealType} onChange={setDealType} />

        <DealsSearchFilterBar
          dealType={filters.dealType}
          value={filters.search}
          onChange={setSearch}
          onFilterClick={() => setIsFilterOpen(true)}
        />

        <DealsCategorySlider active={filters.category} onChange={setCategory} />

        <DealsGrid
          allDeals={allDeals}
          page={page}
          isLoading={isLoading}
          onPageChange={setPage}
          onBookClick={storeBooking.openBooking}
        />

        <DealsPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <PromoBanner dealType={filters.dealType} />
      </div>

      <div className="hidden lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start lg:gap-5">
        <DesktopSalonSidebar
          deals={allDeals}
          dealType={filters.dealType}
          bookingDeal={desktopBookingDeal}
          packages={desktopPackages}
          activePackageId={activePackageId}
          selectedServicesByPackage={selectedServicesByPackage}
          onBookClick={openDesktopBooking}
          onActivePackageChange={setActivePackageId}
          onToggleService={toggleDesktopService}
        />

        <div className="space-y-4">
          <DealTypeToggle value={filters.dealType} onChange={setDealType} />

          {isLoading ? (
            <div className="grid grid-cols-3 gap-3.5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[340px] animate-pulse rounded-2xl border border-(--border) bg-(--bg-card)"
                />
              ))}
            </div>
          ) : (
            <DesktopDealsGrid
              deals={allDeals}
              onBookClick={openDesktopBooking}
            />
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <DealsPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>

            <DesktopDealsCartBar
              isBooking={isDesktopBooking}
              cartCount={cartCount}
              cartTotal={cartTotal}
              bookingHref={bookingHref}
            />
          </div>

          <DesktopTrustBar />
        </div>
      </div>

      <DealsFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onSuburbChange={setSuburb}
        onLanguageChange={setLanguage}
        onPriceChange={setPrice}
        onNationalityChange={setNationality}
        onSortChange={setSort}
        onReset={resetSidebarFilters}
      />

      <StoreDealsBookingModal booking={storeBooking} />
    </main>
  );
}
