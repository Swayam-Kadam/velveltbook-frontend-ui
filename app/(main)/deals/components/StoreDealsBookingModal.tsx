"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Check, ChevronLeft, ChevronRight, MapPin, Star, Store, X } from "lucide-react";
import { buildBookingUrl } from "@/booking/booking.navigation";
import type { BookingPackageService } from "./desktopBookingPackages";
import { useStoreDealsBooking } from "../hooks/useStoreDealsBooking";

function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}

interface SelectableStoreServiceCardProps {
  service: BookingPackageService;
  image: string;
  packageTitle: string;
  discountPercent: number;
  originalUnitPrice: number;
  isSelected: boolean;
  onToggle: () => void;
}

function SelectableStoreServiceCard({
  service,
  image,
  packageTitle,
  discountPercent,
  originalUnitPrice,
  isSelected,
  onToggle,
}: SelectableStoreServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        feature-card w-full overflow-hidden rounded-xl text-left
        transition-all duration-200
        ${isSelected
          ? "border-(--brand-gold) shadow-(--shadow-glow)"
          : "border-(--border)"
        }
      `}
    >
      <div className="flex gap-1.5 p-1.5">
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm">
          <Image
            src={image}
            alt={service.label}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5">
            <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-(--text-primary)">
              {service.label}
            </p>
            <span
              className={`
                flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border
                transition-colors duration-200
                ${isSelected
                  ? "primary-button border-transparent text-white"
                  : "border-(--border) bg-(--bg-card) text-transparent"
                }
              `}
            >
              {isSelected && <Check size={10} strokeWidth={2.5} />}
            </span>
          </div>

          <div className="mt-0.5 flex items-start gap-1.5">
            <div className="min-w-0 shrink-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className="
                    primary-button inline-flex
                    rounded-md px-1.5 py-px
                    text-[9px] font-semibold text-white
                  "
                >
                  -{discountPercent}%
                </span>
              </div>

              <div className="flex flex-col items-baseline ">
                <span className="text-[13px] font-bold text-(--brand-gold)">
                  {formatPrice(service.price)}
                </span>

                <span className="text-[10px] text-(--text-muted) line-through">
                  {formatPrice(originalUnitPrice)}
                </span>
                <span className="text-[9px] text-(--text-muted)">
                  Package service
                </span>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap content-start justify-end gap-1">
              <span
                className="
                  rounded-full border border-(--border)
                  bg-[color-mix(in_srgb,var(--accent-primary)_6%,var(--bg-card))]
                  px-1.5 py-0.5 text-[9px] text-(--text-secondary) font-bold
                "
              >
                {packageTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

interface StoreDealsBookingModalProps {
  booking: ReturnType<typeof useStoreDealsBooking>;
}

export function StoreDealsBookingModal({ booking }: StoreDealsBookingModalProps) {
  const {
    isOpen,
    isLoading,
    clickedDeal,
    store,
    packages,
    activePackageId,
    activePackage,
    selectedServiceIds,
    selectedServices,
    selectedTotal,
    closeBooking,
    setActivePackage,
    toggleService,
  } = booking;

  const packageScrollRef = useRef<HTMLDivElement>(null);

  const scrollPackages = (direction: "left" | "right") => {
    const el = packageScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -el.clientWidth : el.clientWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeBooking();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeBooking, isOpen]);

  if (!isOpen) return null;

  const bookingHref =
    selectedServiceIds.length > 0
      ? buildBookingUrl({
          serviceIds: selectedServiceIds,
          step: 2,
        })
      : "#";

  const tabPrefix = clickedDeal?.type === "single" ? "Single" : "Package";
  const packageLabels = [
    `${tabPrefix} 1`,
    `${tabPrefix} 2`,
    `${tabPrefix} 3`,
    `${tabPrefix} 4`,
    `${tabPrefix} 5`,
    `${tabPrefix} 6`,
  ];
  const originalUnitPrice =
    activePackage && activePackage.services.length > 0
      ? Number(
          (
            activePackage.originalPrice / activePackage.services.length
          ).toFixed(2),
        )
      : 0;

  return (
    <div
      className="
        fixed inset-x-0 top-0 bottom-[5.25rem] z-[60] flex items-end justify-center
        bg-black/45 px-2 pb-1 pt-2 lg:inset-0 lg:items-center lg:pb-0
      "
      role="dialog"
      aria-modal="true"
      aria-label="Store deals booking"
      onClick={closeBooking}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="
          flex max-h-[min(88dvh,720px)] w-full max-w-lg min-w-0 flex-col overflow-hidden
          rounded-xl border border-(--border) bg-(--bg-primary)
          shadow-(--shadow-card)
        "
      >
        <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-4 py-3">
          <h2 className="text-[15px] font-semibold text-(--text-primary)">Book Services</h2>
          <button
            type="button"
            onClick={closeBooking}
            aria-label="Close booking popup"
            className="
              flex h-8 w-8 items-center justify-center rounded-full
              text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
            "
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {store && (
          <div className="shrink-0 border-b border-(--border) px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-(--brand-gold)">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <Store size={10} strokeWidth={1.5} className="text-(--text-secondary)" />
                  <p className="truncate text-[12px] font-semibold text-(--text-primary)">
                    {store.name}
                  </p>
                </div>

                <div className="mt-0.5 flex items-center gap-2 text-[9px]">
                  <span className="flex items-center gap-0.5 text-(--text-primary)">
                    <Star size={9} className="fill-(--brand-gold) text-(--brand-gold)" />
                    {store.rating}
                  </span>
                  <span className="text-(--text-secondary)">({store.reviewCount})</span>
                </div>

                <div className="mt-0.5 flex items-start gap-1 text-[8px] text-(--text-muted)">
                  <MapPin size={8} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-1">{store.location}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {isLoading ? (
            <div className="space-y-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[76px] animate-pulse rounded-xl border border-(--border) bg-(--bg-card)"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="mb-1 text-[10px] font-medium text-(--text-secondary)">
                Select discounted services from this store
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollPackages("left")}
                  aria-label="Scroll packages left"
                  className="
                    flex h-5 w-5 shrink-0 items-center justify-center rounded-full
                    border border-(--border) bg-(--bg-card) text-(--text-primary)
                    transition-colors hover:bg-(--bg-card-hover)
                  "
                >
                  <ChevronLeft size={12} strokeWidth={2.5} />
                </button>

                <div
                  ref={packageScrollRef}
                  className="flex min-w-0 flex-1 gap-1 overflow-x-auto scroll-smooth scrollbar-none"
                >
                  {packageLabels.map((label, index) => {
                    const pkg = packages[index];
                    const isActive = Boolean(
                      pkg && pkg.id === (activePackage?.id ?? activePackageId),
                    );

                    return (
                      <button
                        key={label}
                        type="button"
                        disabled={!pkg}
                        onClick={() => {
                          if (pkg) setActivePackage(pkg.id);
                        }}
                        className={`
                          shrink-0 basis-[calc((100%-0.75rem)/4)] truncate
                          rounded-xs border border-(--border) py-1
                          text-center text-[10px] font-medium
                          disabled:cursor-not-allowed disabled:opacity-40
                          ${
                            isActive
                              ? "primary-button text-white"
                              : "bg-(--bg-card) text-(--text-primary)"
                          }
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
                    flex h-5 w-5 shrink-0 items-center justify-center rounded-full
                    border border-(--border) bg-(--bg-card) text-(--text-primary)
                    transition-colors hover:bg-(--bg-card-hover)
                  "
                >
                  <ChevronRight size={12} strokeWidth={2.5} />
                </button>
              </div>

              {activePackage?.services.map((service) => (
                <SelectableStoreServiceCard
                  key={service.id}
                  service={service}
                  image={activePackage.image}
                  packageTitle={activePackage.title}
                  discountPercent={activePackage.discountPercent}
                  originalUnitPrice={originalUnitPrice}
                  isSelected={selectedServiceIds.includes(service.id)}
                  onToggle={() =>
                    toggleService(activePackage.id, service.id)
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-(--border) bg-(--bg-primary) px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-(--text-secondary)">
                {selectedServices.length} service
                {selectedServices.length === 1 ? "" : "s"} selected
              </p>
              <p className="truncate text-[9px] text-(--text-muted)">
                {selectedServices.map((service) => service.label).join(", ") ||
                  "None selected"}
              </p>
            </div>
            <p className="shrink-0 text-[14px] font-bold text-(--brand-gold)">
              {formatPrice(selectedTotal)}
            </p>
          </div>

          <Link
            href={bookingHref}
            onClick={(event) => {
              if (selectedServices.length === 0) event.preventDefault();
            }}
            className={`
              primary-button flex h-8 w-full items-center justify-center
              rounded-lg text-[10px] font-medium text-white
              transition-opacity
              ${selectedServices.length === 0 ? "pointer-events-none opacity-50" : ""}
            `}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
