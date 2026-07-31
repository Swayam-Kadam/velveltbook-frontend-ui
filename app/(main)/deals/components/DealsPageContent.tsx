"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
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
  onBookClick,
}: {
  deals: Deal[];
  onBookClick?: (deal: Deal) => void;
}) {
  const featured = deals[0];
  const listDeals = deals.slice(0, 4);
  const total = listDeals.reduce((sum, deal) => sum + deal.currentPrice, 0);

  if (!featured) return null;

  return (
    <aside className="space-y-3">
      <section className="overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
        <div className="relative h-[168px]">
          <Image
            src={featured.image}
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

      <div className="grid grid-cols-4 gap-1.5">
        {["Package 1", "Package 2", "Package 3", "Package 4"].map(
          (label, index) => (
            <button
              key={label}
              type="button"
              className={`h-9 rounded-xl border text-[11px] font-semibold transition-colors ${
                index === 0
                  ? "border-(--accent-primary) bg-(--accent-primary) text-white"
                  : "border-(--border) bg-(--bg-card) text-(--text-primary)"
              }`}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <section className="space-y-2.5">
        {listDeals.map((deal) => {
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

      <div className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)]">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--accent-primary) text-white">
          <ShoppingCart size={22} />
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--brand-gold) px-1 text-[10px] font-bold text-(--text-primary)">
            {listDeals.length}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-(--text-muted)">Total</p>
          <p className="text-[28px] font-bold leading-none text-(--brand-gold)">
            {formatPrice(total)}
          </p>
          <p className="mt-1 text-[11px] text-(--text-secondary)">
            {listDeals.length} items
          </p>
        </div>

        <button
          type="button"
          className="primary-button h-11 shrink-0 rounded-xl px-5 text-[13px] font-semibold text-white"
        >
          View Cart
        </button>
      </div>
    </aside>
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
          onBookClick={storeBooking.openBooking}
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
              onBookClick={storeBooking.openBooking}
            />
          )}

          <DealsPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

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
