"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CalendarPlus,
  ChevronRight,
  History,
  MapPin,
  Navigation2,
  Pencil,
  Receipt,
  RotateCcw,
  Sparkles,
  Star,
  Undo2,
  X,
} from "lucide-react";

import {
  historySubTabs,
  serviceSubTabs,
  tabs,
  type Booking,
  type BookingTab,
  type HistorySubTab,
  type ServiceSubTab,
} from "@/data/booking/my-bookings";
import { buildBookingUrl } from "@/booking/booking.navigation";
import {
  BookingPreviewCards,
  parseDateLabelForPreview,
} from "@/booking/components/BookingPreviewCards";
import { allMenuServices } from "@/data/catalog/menu/services";
import { SHARED_STAFF } from "@/data/shared/staff";

type CardStatusTab = "upcoming" | HistorySubTab;

const TAB_ICONS: Record<BookingTab, typeof CalendarDays> = {
  upcoming: CalendarDays,
  completed: Receipt,
  history: History,
};

function getRebookServiceId(serviceName: string): string | undefined {
  const normalized = serviceName.trim().toLowerCase();
  return allMenuServices.find(
    (service) => service.title.trim().toLowerCase() === normalized,
  )?.id;
}

function getStaffForBooking(therapistName: string) {
  const normalized = therapistName.trim().toLowerCase();
  return (
    SHARED_STAFF.find(
      (staff) => staff.name.trim().toLowerCase() === normalized,
    ) ?? SHARED_STAFF[0]
  );
}

const statusStyles: Record<
  CardStatusTab,
  { label: string; className: string }
> = {
  upcoming: {
    label: "Ongoing",
    className:
      "bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)] text-(--accent-primary)",
  },
  completed: {
    label: "Completed",
    className:
      "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-(--success)",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-500",
  },
  refund: {
    label: "Refunded",
    className:
      "bg-[color-mix(in_srgb,var(--brand-gold)_14%,transparent)] text-(--brand-gold)",
  },
};

function DesktopEmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-(--border) bg-(--bg-card) px-10 py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_8%,transparent)]">
        <CalendarDays size={32} className="text-(--accent-primary)" strokeWidth={1.5} />
      </div>
      <h3 className="text-[18px] font-semibold text-(--text-primary)">
        No {label} bookings
      </h3>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-(--text-muted)">
        When you book a service, it will show up here so you can manage it anytime.
      </p>
      <Link
        href="/booking"
        className="primary-button mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[14px] font-semibold text-white"
      >
        Explore Services
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}

function DesktopPricingSummary({ booking }: { booking: Booking }) {
  const items = booking.pricingItems ?? [];
  const subtotal = booking.summarySubtotal ?? booking.subtotal ?? booking.price;
  const taxes = booking.taxesAndFees ?? booking.tax ?? "$0";
  const additional = booking.additionalCharges ?? "$0";
  const total = booking.summaryTotal ?? booking.price;

  return (
    <aside className="sticky top-24 rounded-2xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
      <div className="border-b border-(--border) px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--brand-gold)_12%,transparent)]">
            <Sparkles size={17} className="text-(--brand-gold)" />
          </span>
          <div>
            <h2 className="text-[16px] font-semibold text-(--text-primary)">
              Pricing Summary
            </h2>
            <p className="text-[12px] text-(--text-muted)">Breakdown & add-ons</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.name}
                className="flex items-start justify-between gap-3 rounded-xl bg-(--bg-secondary) px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-(--text-primary)">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-(--text-muted)">{item.quantity}</p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold text-(--text-primary)">
                  {item.price}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-(--text-muted)">No add-ons for this booking.</p>
        )}

        <div className="mt-5 space-y-2.5 border-t border-(--border) pt-5 text-[13px]">
          <div className="flex justify-between text-(--text-secondary)">
            <span>Subtotal</span>
            <span className="font-medium text-(--text-primary)">{subtotal}</span>
          </div>
          <div className="flex justify-between text-(--text-secondary)">
            <span>Taxes & fees</span>
            <span className="font-medium text-(--text-primary)">{taxes}</span>
          </div>
          <div className="flex justify-between text-(--text-secondary)">
            <span>Additional charges</span>
            <span className="font-medium text-(--text-primary)">{additional}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--bg-card))] px-4 py-3.5">
          <span className="text-[14px] font-semibold text-(--text-primary)">Total</span>
          <span className="text-[22px] font-bold text-(--accent-primary)">{total}</span>
        </div>
      </div>
    </aside>
  );
}

function BookingListItem({
  booking,
  active,
  statusTab,
  onSelect,
}: {
  booking: Booking;
  active: boolean;
  statusTab: CardStatusTab;
  onSelect: () => void;
}) {
  const status = statusStyles[statusTab];
  const staff = getStaffForBooking(booking.therapist);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        group w-full rounded-xl border p-3.5 text-left transition-all duration-200
        ${
          active
            ? "border-(--accent-primary) bg-[color-mix(in_srgb,var(--accent-primary)_6%,var(--bg-card))] shadow-[var(--shadow-card)]"
            : "border-(--border) bg-(--bg-card) hover:border-[color-mix(in_srgb,var(--accent-primary)_22%,var(--border))] hover:shadow-sm"
        }
      `}
    >
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={booking.image}
            alt={booking.service}
            fill
            sizes="64px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-(--text-primary)">
              {booking.service}
            </p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${status.className}`}
            >
              {status.label}
            </span>
          </div>
          <p className="mt-1 truncate text-[12px] text-(--text-muted)">
            {booking.organization.name}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
            <span className="flex items-center gap-1 text-(--text-secondary)">
              <CalendarDays size={11} className="text-(--accent-primary)" />
              {booking.date}
            </span>
            <span className="font-bold text-(--brand-gold)">{booking.price}</span>
          </div>
        </div>
      </div>
      {active ? (
        <p className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-(--accent-primary)">
          with {staff.name} · {booking.time}
        </p>
      ) : null}
    </button>
  );
}

function DesktopBookingDetail({
  booking,
  statusTab,
  showServiceActions,
}: {
  booking: Booking;
  statusTab: CardStatusTab;
  showServiceActions: boolean;
}) {
  const status = statusStyles[statusTab];
  const staff = getStaffForBooking(booking.therapist);
  const datePreview = parseDateLabelForPreview(booking.date);
  const rebookServiceId = getRebookServiceId(booking.service);
  const bookAgainHref = buildBookingUrl({
    serviceIds: rebookServiceId ? [rebookServiceId] : [],
    step: 2,
  });

  return (
    <article className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)]">
      {/* Store header */}
      <div className="border-t-4 border-(--accent-primary)">
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-(--border)">
            <Image
              src={booking.organization.thumbnail}
              alt={booking.organization.name}
              fill
              sizes="56px"
              className="object-cover"
            />
            <span
              className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border border-white ${
                booking.organization.isOpen ? "bg-(--success)" : "bg-(--danger)"
              }`}
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-bold text-(--text-primary)">
              {booking.organization.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-(--text-secondary)">
              <MapPin size={12} className="shrink-0 text-(--accent-primary)" />
              <span className="truncate">{booking.organization.address}</span>
            </p>
          </div>
          <button
            type="button"
            aria-label="Get directions"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--border) bg-(--bg-secondary) text-(--accent-primary) transition-colors hover:bg-[color-mix(in_srgb,var(--accent-primary)_10%,var(--bg-card))]"
          >
            <Navigation2 size={16} strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {/* Hero + meta */}
      <div className="relative mx-5 overflow-hidden rounded-xl">
        <div className="relative h-[180px] w-full">
          <Image
            src={booking.organization.banner}
            alt={booking.service}
            fill
            sizes="700px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${status.className}`}
            >
              {status.label}
            </span>
            <h2 className="mt-2 truncate text-[22px] font-bold text-white">
              {booking.service}
            </h2>
            <p className="mt-0.5 text-[13px] text-white/80">
              Ref #{booking.number} · {booking.duration ?? "60 min"}
            </p>
          </div>
          {showServiceActions && statusTab === "upcoming" ? (
            <button
              type="button"
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-3 py-2 text-[12px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <Pencil size={13} />
              Edit
            </button>
          ) : null}
        </div>
      </div>

      {/* Preview cards */}
      <div className="p-5">
        <BookingPreviewCards
          serviceName={booking.service}
          serviceImage={booking.image}
          serviceDuration={booking.duration ?? "60 min"}
          servicePriceLabel={booking.price}
          staffName={booking.therapist}
          staffImage={staff.image}
          monthLabel={datePreview.monthLabel}
          dateLabel={datePreview.dateLabel}
          weekdayLabel={datePreview.weekdayLabel}
          timeLabel={booking.time}
          scheduled={datePreview.scheduled}
          totalAmountLabel={booking.price}
        />

        {/* Actions */}
        {showServiceActions && statusTab === "upcoming" ? (
          <div className="mt-5 flex flex-wrap gap-2.5 border-t border-(--border) pt-5">
            <button
              type="button"
              className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--bg-card) px-4 py-2.5 text-[13px] font-semibold text-(--text-primary) transition-colors hover:bg-(--bg-secondary)"
            >
              <Pencil size={15} />
              Change
            </button>
            <button
              type="button"
              className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl border border-(--border) bg-(--bg-card) px-4 py-2.5 text-[13px] font-semibold text-(--text-primary) transition-colors hover:bg-(--bg-secondary)"
            >
              <CalendarPlus size={15} />
              Reschedule
            </button>
            <button
              type="button"
              className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
            >
              <X size={15} />
              Cancel
            </button>
          </div>
        ) : null}

        {statusTab === "completed" ? (
          <div className="mt-5 flex flex-wrap gap-2.5 border-t border-(--border) pt-5">
            <button
              type="button"
              className="inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl border border-(--border) px-4 py-2.5 text-[13px] font-semibold text-(--text-primary) transition-colors hover:bg-(--bg-secondary)"
            >
              <Star size={15} className="text-(--brand-gold)" />
              Rate Service
            </button>
            <Link
              href={bookAgainHref}
              className="primary-button inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white"
            >
              <RotateCcw size={15} />
              Book Again
            </Link>
          </div>
        ) : null}

        {(statusTab === "cancelled" || statusTab === "refund") && (
          <div className="mt-5 border-t border-(--border) pt-5">
            <Link
              href={bookAgainHref}
              className="primary-button inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold text-white"
            >
              <Undo2 size={15} />
              Book Again
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

interface MyBookingsDesktopProps {
  activeTab: BookingTab;
  onTabChange: (tab: BookingTab) => void;
  activeServiceSubTab: ServiceSubTab;
  onServiceSubTabChange: (tab: ServiceSubTab) => void;
  activeHistorySubTab: HistorySubTab;
  onHistorySubTabChange: (tab: HistorySubTab) => void;
  bookings: Booking[];
  emptyLabel: string;
}

export function MyBookingsDesktop({
  activeTab,
  onTabChange,
  activeServiceSubTab,
  onServiceSubTabChange,
  activeHistorySubTab,
  onHistorySubTabChange,
  bookings,
  emptyLabel,
}: MyBookingsDesktopProps) {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedBookingId(bookings[0]?.id ?? null);
  }, [bookings, activeTab, activeServiceSubTab, activeHistorySubTab]);

  const selectedBooking =
    bookings.find((booking) => booking.id === selectedBookingId) ?? bookings[0];

  const statusTab: CardStatusTab =
    activeTab === "history"
      ? activeHistorySubTab
      : activeTab === "completed"
        ? "completed"
        : "upcoming";

  const showPricingSidebar =
    Boolean(selectedBooking?.pricingItems?.length) && activeTab !== "history";

  const bookingCountLabel =
    bookings.length === 1 ? "1 booking" : `${bookings.length} bookings`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-(--bg-primary)">
      <div className="mx-auto max-w-[1440px] px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold tracking-tight text-(--text-primary)">
              My Bookings
            </h1>
            <p className="mt-1.5 text-[15px] text-(--text-muted)">
              View and manage your appointments in one place.
            </p>
          </div>
          <Link
            href="/booking"
            className="primary-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            New Booking
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* Mobile / tablet tab bar */}
        <div className="mb-5 flex gap-1 rounded-xl border border-(--border) bg-(--bg-card) p-1 xl:hidden">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex-1 rounded-lg py-2.5 text-[12px] font-bold uppercase tracking-wide
                  ${active ? "primary-button text-white" : "text-(--text-muted)"}
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-6">
          {/* Left navigation — desktop */}
          <aside className="hidden w-[220px] shrink-0 xl:block">
            <nav className="sticky top-24 space-y-1 rounded-2xl border border-(--border) bg-(--bg-card) p-2 shadow-[var(--shadow-card)]">
              {tabs.map((tab) => {
                const Icon = TAB_ICONS[tab.id];
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[14px] font-medium
                      transition-all duration-200
                      ${
                        active
                          ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-(--accent-primary)"
                          : "text-(--text-secondary) hover:bg-(--bg-secondary) hover:text-(--text-primary)"
                      }
                    `}
                  >
                    <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            {/* Sub-filters */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {activeTab === "upcoming"
                  ? serviceSubTabs.map((subTab) => {
                      const active = activeServiceSubTab === subTab.id;
                      return (
                        <button
                          key={subTab.id}
                          type="button"
                          onClick={() => onServiceSubTabChange(subTab.id)}
                          className={`
                            rounded-full px-4 py-2 text-[12px] font-semibold transition-all
                            ${
                              active
                                ? "bg-(--accent-primary) text-white shadow-sm"
                                : "border border-(--border) bg-(--bg-card) text-(--text-secondary) hover:text-(--text-primary)"
                            }
                          `}
                        >
                          {subTab.label === "Booked" ? "Ongoing" : subTab.label}
                        </button>
                      );
                    })
                  : null}

                {activeTab === "history"
                  ? historySubTabs.map((subTab) => {
                      const active = activeHistorySubTab === subTab.id;
                      return (
                        <button
                          key={subTab.id}
                          type="button"
                          onClick={() => onHistorySubTabChange(subTab.id)}
                          className={`
                            rounded-full px-4 py-2 text-[12px] font-semibold transition-all
                            ${
                              active
                                ? "bg-(--accent-primary) text-white shadow-sm"
                                : "border border-(--border) bg-(--bg-card) text-(--text-secondary) hover:text-(--text-primary)"
                            }
                          `}
                        >
                          {subTab.label}
                        </button>
                      );
                    })
                  : null}
              </div>

              {bookings.length > 0 ? (
                <p className="text-[13px] text-(--text-muted)">{bookingCountLabel}</p>
              ) : null}
            </div>

            {bookings.length === 0 ? (
              <DesktopEmptyState label={emptyLabel} />
            ) : (
              <div
                className={`grid gap-5 ${
                  showPricingSidebar
                    ? "xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)_300px]"
                    : bookings.length > 1
                      ? "lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
                      : "grid-cols-1"
                }`}
              >
                {/* Booking list — sidebar on desktop when multiple or always for easier nav */}
                {bookings.length > 1 ? (
                  <div className="space-y-2.5 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:pr-1 scrollbar-thin scrollbar-thumb-(--accent-primary)/20">
                    {bookings.map((booking) => (
                      <BookingListItem
                        key={booking.id}
                        booking={booking}
                        active={selectedBooking?.id === booking.id}
                        statusTab={statusTab}
                        onSelect={() => setSelectedBookingId(booking.id)}
                      />
                    ))}
                  </div>
                ) : null}

                {/* Detail */}
                {selectedBooking ? (
                  <DesktopBookingDetail
                    booking={selectedBooking}
                    statusTab={statusTab}
                    showServiceActions={activeTab !== "completed"}
                  />
                ) : null}

                {/* Pricing */}
                {showPricingSidebar && selectedBooking ? (
                  <DesktopPricingSummary booking={selectedBooking} />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
