"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  MapPin,
  Navigation2,
  RotateCcw,
  Sparkles,
  Star,
  Undo2,
  UserRound,
} from "lucide-react";

import {
  bookingData,
  historyBookingData,
  historySubTabs,
  serviceBookingData,
  serviceSubTabs,
  suggestedServicesByTab,
  tabs,
  type Booking,
  type BookingOrganization,
  type BookingTab,
  type HistorySubTab,
  type ServiceSubTab,
  type SuggestedService,
} from "@/data/booking/my-bookings";
import { buildBookingUrl } from "@/booking/booking.navigation";
import {
  BookingPreviewCards,
  parseDateLabelForPreview,
} from "@/booking/components/BookingPreviewCards";
import { allMenuServices } from "@/data/catalog/menu/services";
import { SHARED_STAFF } from "@/data/shared/staff";
import { MyBookingsDesktop } from "./MyBookingsDesktop";
import { MyBookingTaxInvoice } from "./MyBookingTaxInvoice";
import DirectionsIcon from '@mui/icons-material/Directions';

type CardStatusTab = "upcoming" | HistorySubTab;

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

function getBookingWeekday(dateLabel: string) {
  const parsed = new Date(dateLabel);
  if (Number.isNaN(parsed.getTime())) return "Booked";
  return parsed.toLocaleDateString("en-US", { weekday: "short" });
}

function getBookingDateShort(dateLabel: string) {
  const parsed = new Date(dateLabel);
  if (Number.isNaN(parsed.getTime())) return dateLabel;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const statusStyles: Record<
  CardStatusTab,
  { label: string; color: string; bg: string }
> = {
  upcoming: {
    label: "Ongoing",
    color: "#e2536b",
    bg: "color-mix(in srgb, #e2536b 14%, transparent)",
  },
  completed: {
    label: "Completed",
    color: "var(--success)",
    bg: "color-mix(in srgb, var(--success) 14%, transparent)",
  },
  cancelled: {
    label: "Cancelled",
    color: "#e2536b",
    bg: "color-mix(in srgb, #e2536b 14%, transparent)",
  },
  refund: {
    label: "Refunded",
    color: "var(--brand-gold)",
    bg: "color-mix(in srgb, var(--brand-gold) 14%, transparent)",
  },
};

function OrganizationBanner({
  organization,
  serviceLabel,
  variant = "default",
  receiptVisible = false,
  onToggleReceipt,
  serialNumber,
}: {
  organization: BookingOrganization;
  serviceLabel?: string;
  variant?: "default" | "receipt";
  receiptVisible?: boolean;
  onToggleReceipt?: () => void;
  serialNumber?: string;
}) {
  return (
    <div className="border-t-8 border-(--accent-primary) bg-(--bg-card) px-2.5 py-2">
      <div className="flex min-w-0 items-start gap-2">
        <div className="relative h-14 w-14 shrink-0">
          <div className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-(--bg-card) shadow-(--shadow-card)">
            <Image
              src={organization.thumbnail}
              alt={organization.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-0.5 ml-1">
          <div className="flex items-center gap-1">
            <h2 className="truncate font-[family-name:var(--font-heading)] text-lg font-bold text-(--text-primary)">
              {organization.name}
            </h2>
            <BadgeCheck
              className="h-3.5 w-3.5 shrink-0 text-(--accent-primary)"
              strokeWidth={2}
            />
          </div>
          {serviceLabel ? (
            <p className="mt-0.5 truncate text-[11px] text-(--text-secondary)">
              {serviceLabel}
            </p>
          ) : null}
          <p className="mt-0.5 flex gap-0.5 text-[12px] text-(--text-secondary)">
            <MapPin
              className="mt-0.5 h-2.5 w-2.5 shrink-0"
              strokeWidth={1.8}
            />
            <span>{organization.address}</span>
          </p>
          {/* {serialNumber ? (
            <p className="mt-0.5 text-[10px] font-semibold text-(--text-muted)">
              {serialNumber}
            </p>
          ) : null} */}
        </div>

        {variant === "receipt" && onToggleReceipt ? (
          <button
            type="button"
            onClick={onToggleReceipt}
            aria-expanded={receiptVisible}
            aria-label={receiptVisible ? "Hide receipt" : "View receipt"}
            className="
              shrink-0 rounded-lg bg-(--accent-primary) px-2 py-1.5
              text-[10px] font-bold text-white transition-opacity duration-200
              hover:opacity-90 flex items-center gap-1
            "
          >
            {receiptVisible ? "Hide Receipt" : "View Receipt"}
            {receiptVisible ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        ) : (
          <button
            type="button"
            aria-label="Get directions"
            className="
              flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              border border-(--border) bg-(--bg-card)
              text-(--accent-primary)
            "
          >
            <DirectionsIcon className="h-2 w-2 " />
          </button>
        )}
      </div>
    </div>
  );
}

function ReceiptCard({ booking }: { booking: Booking }) {
  const [receiptOpen, setReceiptOpen] = useState(false);

  return (
    <article className="feature-card overflow-hidden rounded-xl">
      <OrganizationBanner
        organization={booking.organization}
        serviceLabel={booking.service}
        variant="receipt"
        receiptVisible={receiptOpen}
        onToggleReceipt={() => setReceiptOpen((open) => !open)}
        serialNumber={booking.number}
      />

      {receiptOpen ? (
        <div className="border-t border-(--border) p-2.5">
          <MyBookingTaxInvoice booking={booking} />
        </div>
      ) : null}
    </article>
  );
}

function groupBookingsByStore(bookings: Booking[]): Booking[][] {
  const groups = new Map<string, Booking[]>();
  for (const booking of bookings) {
    const key = booking.organization.id;
    const current = groups.get(key) ?? [];
    current.push(booking);
    groups.set(key, current);
  }
  return Array.from(groups.values());
}

function BookingCard({
  bookings,
  tab,
  serviceSubTab,
}: {
  bookings: Booking[];
  tab: CardStatusTab;
  serviceSubTab?: ServiceSubTab;
}) {
  const [activeServiceId, setActiveServiceId] = useState(
    () => bookings[0]?.id ?? "",
  );
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bookings.length === 0) {
      setActiveServiceId("");
      return;
    }
    if (!bookings.some((booking) => booking.id === activeServiceId)) {
      setActiveServiceId(bookings[0]?.id ?? "");
    }
  }, [bookings, activeServiceId]);

  const booking =
    bookings.find((item) => item.id === activeServiceId) ?? bookings[0];
  if (!booking) return null;

  const status = statusStyles[tab];
  const rebookServiceId = getRebookServiceId(booking.service);
  const bookAgainHref = buildBookingUrl({
    serviceIds: rebookServiceId ? [rebookServiceId] : [],
    step: 2,
  });
  const staff = getStaffForBooking(booking.therapist);
  const datePreview = parseDateLabelForPreview(booking.date);
  const serviceSummary = bookings.map((item) => item.service).slice(0, 3).join(" • ");

  const scrollTabs = (direction: "left" | "right") => {
    tabsScrollRef.current?.scrollBy({
      left: direction === "left" ? -120 : 120,
      behavior: "smooth",
    });
  };

  return (
    <article className="feature-card overflow-hidden rounded-xl">
      <OrganizationBanner
        organization={booking.organization}
        serviceLabel={serviceSummary || booking.service}
      />

      <div className="p-2.5">
        {bookings.length > 0 ? (
          <div className="relative mb-2.5 px-5">
            {bookings.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => scrollTabs("left")}
                  aria-label="Scroll service tabs left"
                  className="
                    absolute left-0 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2
                    items-center justify-center rounded-full border border-(--border)
                    bg-(--bg-card) text-(--text-primary)
                  "
                >
                  <ChevronLeft size={13} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTabs("right")}
                  aria-label="Scroll service tabs right"
                  className="
                    absolute right-0 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2
                    items-center justify-center rounded-full border border-(--border)
                    bg-(--bg-card) text-(--text-primary)
                  "
                >
                  <ChevronRight size={13} strokeWidth={2.5} />
                </button>
              </>
            ) : null}

            <div
              ref={tabsScrollRef}
              className="scrollbar-none ml-1 mr-1 flex gap-1.5 px-2 overflow-x-auto scroll-smooth"
              role="tablist"
              aria-label="Store services"
            >
              {bookings.map((item, index) => {
                const active = item.id === booking.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveServiceId(item.id)}
                    className={`
                      inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5
                      text-[10px] font-semibold transition-all duration-200
                      ${
                        active
                          ? "primary-button border-transparent text-white"
                          : "border-(--border) bg-(--bg-card) text-(--text-primary)"
                      }
                    `}
                  >
                    {/* {active ? (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-(--success)">
                        <Check size={9} strokeWidth={3} className="text-white" />
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-[#c45c26]" />
                    )} */}
                    Service - {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab !== "upcoming" && (
          <div className="mb-2 flex justify-end">
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ color: status.color, background: status.bg }}
            >
              {status.label}
            </span>
          </div>
        )}

        <BookingPreviewCards
          serviceName={booking.service}
          serviceImage={booking.image}
          serviceDuration={booking.duration ?? "—"}
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

        <div className="mt-2.5 flex gap-2 border-t border-(--border) pt-2.5">
          <button
            type="button"
            className="
              flex flex-1 items-center justify-center gap-1 rounded-lg
              border border-(--border) py-1.5 text-[10px] font-bold
              text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
            "
          >
            {tab === "upcoming" ? "Cancel" : status.label}
          </button>
          {tab === "upcoming" ? (
            <button
              type="button"
              className="
                flex flex-1 items-center justify-center gap-1 rounded-lg
                border border-(--border) py-1.5 text-[10px] font-bold
                text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
              "
            >
              <CalendarPlus size={12} />
              Change
            </button>
          ) : tab === "completed" ? (
            <Link
              href={bookAgainHref}
              className="
                flex flex-1 items-center justify-center gap-1 rounded-lg
                border border-(--border) py-1.5 text-[10px] font-bold
                text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
              "
            >
              <RotateCcw size={12} />
              Book Again
            </Link>
          ) : null}

          {tab === "upcoming" && (
            <button
              type="button"
              className="
                flex flex-1 items-center justify-center gap-1 rounded-lg
                border border-(--border) py-1.5 text-[10px] font-bold
                text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
              "
            >
              <Undo2 size={12} />
              Reschedule
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function SuggestedServiceCard({ service }: { service: SuggestedService }) {
  return (
    <Link
      href="/booking"
      className="
        feature-card group block overflow-hidden rounded-xl
        transition-all duration-300
        hover:border-[color-mix(in_srgb,var(--accent-secondary)_25%,var(--border))]
        hover:shadow-(--shadow-glow)
        active:scale-[0.98]
      "
    >
      <div className="relative h-[72px] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="120px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-0.5 p-1.5">
        <h4 className="line-clamp-2 h-8 text-[10px] font-bold leading-tight text-(--text-primary)">
          {service.title}
        </h4>
        <p className="text-[11px] font-bold text-(--brand-gold)">{service.price}</p>
        <div className="flex items-center gap-0.5 text-[8px] font-bold text-(--text-primary)">
          <Clock3 size={9} strokeWidth={3} />
          <span>{service.duration}</span>
        </div>
      </div>
    </Link>
  );
}

function SuggestedServices({ tab }: { tab: BookingTab }) {
  const services = suggestedServicesByTab[tab];

  return (
    <section className="mt-4 border-t border-(--border) pt-4">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-(--brand-gold)" strokeWidth={2} />
          <h3 className="text-xs font-bold text-(--text-primary)">
            Suggested Services
          </h3>
        </div> 

        <Link
          href="/menu"
          className="
            flex items-center gap-0.5 text-[9px] font-semibold
            text-(--brand-gold) transition-opacity duration-200 hover:opacity-80
          "
        >
          <span>View all</span>
          <ArrowRight size={10} strokeWidth={2} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {services.map((service) => (
          <SuggestedServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}

function SubTabs<T extends string>({
  tabs: tabItems,
  activeTab,
  onSelect,
}: {
  tabs: { id: T; label: string }[];
  activeTab: T;
  onSelect: (tab: T) => void;
}) {
  return (
    <div className="mb-3 flex gap-1.5 rounded-xl bg-(--bg-secondary) p-1">
      {tabItems.map((subTab) => {
        const active = activeTab === subTab.id;
        return (
          <button
            key={subTab.id}
            type="button"
            onClick={() => onSelect(subTab.id)}
            className={`
              flex-1 rounded-lg py-2 text-center text-[10px] font-bold
              transition-all duration-200
              ${
                active
                  ? "primary-button text-white shadow-(--shadow-glow)"
                  : "text-(--text-muted) hover:text-(--text-primary)"
              }
            `}
          >
            {subTab.label === "Booked" ? "Ongoing" : subTab.label}
          </button>
        );
      })}
    </div>
  );
}

function HistorySubTabs({
  activeSubTab,
  onSelect,
}: {
  activeSubTab: HistorySubTab;
  onSelect: (tab: HistorySubTab) => void;
}) {
  return (
    <SubTabs
      tabs={historySubTabs}
      activeTab={activeSubTab}
      onSelect={onSelect}
    />
  );
}

function ServiceSubTabs({
  activeSubTab,
  onSelect,
}: {
  activeSubTab: ServiceSubTab;
  onSelect: (tab: ServiceSubTab) => void;
}) {
  return (
    <SubTabs
      tabs={serviceSubTabs}
      activeTab={activeSubTab}
      onSelect={onSelect}
    />
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: "color-mix(in srgb, var(--accent-primary) 8%, transparent)",
        }}
      >
        <CalendarDays size={28} className="text-(--text-muted)" strokeWidth={1.6} />
      </div>

      <p className="text-sm font-medium text-(--text-muted)">
        No {label} bookings found.
      </p>

      <Link
        href="/booking"
        className="
          primary-button mt-5 rounded-full px-6 py-2.5 text-[11px]
          font-bold uppercase tracking-wide text-white
        "
      >
        Book a Service
      </Link>
    </div>
  );
}

export default function MyBookingPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [activeServiceSubTab, setActiveServiceSubTab] =
    useState<ServiceSubTab>("booked");
  const [activeHistorySubTab, setActiveHistorySubTab] =
    useState<HistorySubTab>("completed");

  const bookings =
    activeTab === "history"
      ? historyBookingData[activeHistorySubTab]
      : activeTab === "upcoming"
        ? serviceBookingData[activeServiceSubTab]
        : bookingData[activeTab];

  const emptyLabel =
    activeTab === "history"
      ? activeHistorySubTab
      : activeTab === "upcoming"
        ? activeServiceSubTab
        : "receipt";

  return (
    <main>
      <div className="lg:hidden px-2 pb-20">
      {/* Tabs */}
      <div className="flex border-b border-(--border)">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 py-3 text-center text-[11px] font-bold uppercase tracking-wide transition-colors"
              style={{
                color: active ? "var(--accent-secondary)" : "var(--text-muted)",
              }}
            >
              {tab.label}
              {active && (
                <span
                  className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-full"
                  style={{ background: "var(--accent-secondary)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="pt-3">
        {activeTab === "upcoming" && (
          <ServiceSubTabs
            activeSubTab={activeServiceSubTab}
            onSelect={setActiveServiceSubTab}
          />
        )}

        {activeTab === "history" && (
          <HistorySubTabs
            activeSubTab={activeHistorySubTab}
            onSelect={setActiveHistorySubTab}
          />
        )}

        {bookings.length > 0 ? (
          <div className="space-y-2.5">
            {activeTab === "completed"
              ? bookings.map((booking) => (
                  <ReceiptCard key={booking.id} booking={booking} />
                ))
              : groupBookingsByStore(bookings).map((storeBookings) => (
                  <BookingCard
                    key={storeBookings[0]?.organization.id}
                    bookings={storeBookings}
                    tab={
                      activeTab === "history" ? activeHistorySubTab : "upcoming"
                    }
                    serviceSubTab={
                      activeTab === "upcoming"
                        ? activeServiceSubTab
                        : undefined
                    }
                  />
                ))}
          </div>
        ) : (
          <EmptyState label={emptyLabel} />
        )}

        {/* {activeTab === "upcoming" && <SuggestedServices tab={activeTab} />} */}
      </div>
      </div>

      <div className="hidden lg:block">
        <MyBookingsDesktop
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeServiceSubTab={activeServiceSubTab}
          onServiceSubTabChange={setActiveServiceSubTab}
          activeHistorySubTab={activeHistorySubTab}
          onHistorySubTabChange={setActiveHistorySubTab}
          bookings={bookings}
          emptyLabel={emptyLabel}
        />
      </div>
    </main>
  );
}
