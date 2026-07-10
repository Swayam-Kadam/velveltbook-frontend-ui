"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  CreditCard,
  MapPin,
  Navigation2,
  Receipt,
  RotateCcw,
  Sparkles,
  Star,
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

type CardStatusTab = "upcoming" | HistorySubTab;

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
  variant = "default",
  receiptVisible = false,
  onToggleReceipt,
  serialNumber,
}: {
  organization: BookingOrganization;
  variant?: "default" | "receipt";
  receiptVisible?: boolean;
  onToggleReceipt?: () => void;
  serialNumber?: string;
}) {
  return (
    <div className="border-b border-(--border)">
      <div className="relative h-[88px] w-full">
        <Image
          src={organization.banner}
          alt={organization.name}
          fill
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />

        <div className="absolute left-2 top-2 flex items-center gap-1.5">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full border border-white/80 shadow-sm ${
              organization.isOpen ? "bg-(--success)" : "bg-(--danger)"
            }`}
            aria-label={organization.isOpen ? "Store open" : "Store closed"}
          />
          {serialNumber && (
            <span className="rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
              {serialNumber}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 px-2.5 py-2">
        <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl  border-2 border-white">
          <Image
            src={organization.thumbnail}
            alt={organization.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-bold text-(--text-primary)">
            {organization.name}
          </p>
          <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold">
            <MapPin size={9} className="shrink-0 text-(--text-secondary)" />
            <span className="truncate text-(--text-secondary)">
              {organization.address}
            </span>
          </div>
        </div>

        {variant === "receipt" && onToggleReceipt ? (
          <button
            type="button"
            onClick={onToggleReceipt}
            aria-expanded={receiptVisible}
            aria-label={receiptVisible ? "Hide receipt" : "Show receipt"}
            className="
              shrink-0 rounded-lg bg-(--accent-primary) px-2 py-1.5
              text-[10px] font-bold text-white transition-opacity duration-200
              hover:opacity-90 flex items-center gap-1
            "
          >
            {receiptVisible ? "Hide Receipt" : "Show Receipt"}
            
            {receiptVisible ? <ChevronUp size={15} />: <ChevronDown size={15} />}
            
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
            <Navigation2 size={14} strokeWidth={1.6} />
          </button>
        )}
      </div>
    </div>
  );
}

function ReceiptDivider() {
  return (
    <div
      className="my-3 border-t border-dashed border-(--border)"
      aria-hidden
    />
  );
}

function ReceiptRow({
  label,
  value,
  bold,
  gold,
}: {
  label: string;
  value: string;
  bold?: boolean;
  gold?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-[10px]">
      <span className="shrink-0 font-semibold text-(--text-muted)">{label}</span>
      <span
        className={`text-right ${bold ? "text-[12px] font-bold" : "font-semibold"} ${gold ? "text-(--brand-gold)" : "text-(--text-primary)"}`}
      >
        {value}
      </span>
    </div>
  );
}

function ReceiptDetails({
  booking,
  statusLabel = "Completed",
  statusColor = "var(--success)",
  stampLabel = "Paid",
}: {
  booking: Booking;
  statusLabel?: string;
  statusColor?: string;
  stampLabel?: string;
}) {
  return (
    <div className="relative border-t border-(--border) bg-(--bg-card) px-3 py-3">
      <div
        className="
          pointer-events-none absolute right-3 top-2 flex h-14 w-14
          rotate-[-12deg] items-center justify-center rounded-full border-2
          border-[color-mix(in_srgb,var(--success)_45%,transparent)]
          text-[color-mix(in_srgb,var(--success)_70%,transparent)]
        "
        aria-hidden
      >
        <span className="text-[7px] font-bold uppercase tracking-wider">
          {stampLabel}
        </span>
      </div>

      <div className="flex items-start justify-between gap-2 pr-12">
        <div>
          <div className="flex items-center gap-1.5">
            <Receipt size={13} className="text-(--brand-gold)" strokeWidth={2} />
            <h3 className="text-[12px] font-bold uppercase tracking-wide text-(--text-primary)">
              Receipt
            </h3>
          </div>
          <p className="mt-0.5 font-mono text-[9px] font-semibold text-(--text-muted)">
            {booking.receiptNumber ?? `RCP-${booking.id.toUpperCase()}`}
          </p>
        </div>
        <span
          className="
            flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5
            text-[8px] font-bold
          "
          style={{
            color: statusColor,
            background: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
          }}
        >
          <CheckCircle2 size={9} />
          {statusLabel}
        </span>
      </div>

      <ReceiptDivider />

      <div className="space-y-2">
        <div className="flex gap-2.5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={booking.image}
              alt={booking.service}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold text-(--text-primary)">
              {booking.service}
            </p>
            {booking.duration && (
              <p className="mt-0.5 text-[9px] font-semibold text-(--text-muted)">
                {booking.duration}
              </p>
            )}
            <p className="mt-1 text-[13px] font-bold text-(--brand-gold)">
              {booking.price}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 rounded-lg bg-(--bg-secondary) px-2.5 py-2">
          <ReceiptRow label="Therapist" value={booking.therapist} />
          <ReceiptRow label="Date" value={booking.date} />
          <ReceiptRow label="Time" value={booking.time} />
          <ReceiptRow label="Location" value={booking.location} />
        </div>
      </div>

      <ReceiptDivider />

      <div className="space-y-1.5">
        <ReceiptRow label="Subtotal" value={booking.subtotal ?? booking.price} />
        <ReceiptRow label="GST (10%)" value={booking.tax ?? "$0.00"} />
        <div className="border-t border-(--border) pt-1.5">
          <ReceiptRow label="Total Paid" value={booking.price} bold gold />
        </div>
      </div>

      <ReceiptDivider />

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[9px] font-semibold text-(--text-secondary)">
          <CreditCard size={11} className="text-(--accent-primary)" />
          <span>{booking.paymentMethod ?? "Card payment"}</span>
        </div>
        <p className="text-[9px] font-semibold text-(--text-muted)">
          Paid on {booking.paidAt ?? `${booking.date} · ${booking.time}`}
        </p>
      </div>

      <div
        className="
          mt-3 flex items-center justify-center gap-0.5 overflow-hidden
          py-1 opacity-40
        "
        aria-hidden
      >
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className={`inline-block bg-(--text-muted) ${i % 3 === 0 ? "h-5 w-0.5" : "h-3 w-px"}`}
          />
        ))}
      </div>
      <div className="mt-2.5 flex gap-2 border-t border-(--border) pt-2.5">
          <button
            type="button"
            className="
              flex flex-1 items-center justify-center gap-1 rounded-lg
              border border-(--border) py-1.5 text-[10px] font-bold
              text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
            "
          >
            <Star size={12} className="text-(--brand-gold)" />
            Rate
          </button>
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
        variant="receipt"
        receiptVisible={receiptOpen}
        onToggleReceipt={() => setReceiptOpen((open) => !open)}
        serialNumber={booking.number}
      />

      {/* <div className="p-2.5">
        <div className="flex gap-3">
          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-sm">
            <Image
              src={booking.image}
              alt={booking.service}
              fill
              sizes="72px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-[13px] font-bold text-(--text-primary)">
                {booking.service}
              </h3>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold text-(--success)"
                style={{
                  background:
                    "color-mix(in srgb, var(--success) 14%, transparent)",
                }}
              >
                Completed
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-(--text-secondary)">
              <UserRound size={11} className="text-(--accent-primary)" />
              <span className="truncate">with {booking.therapist}</span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] font-semibold text-(--text-secondary)">
              <span className="flex items-center gap-1">
                <CalendarDays size={10} className="text-(--accent-primary)" />
                {booking.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock3 size={10} className="text-(--accent-primary)" />
                {booking.time}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1 text-[9px] font-semibold text-(--text-muted)">
                <MapPin size={10} className="shrink-0 text-(--accent-primary)" />
                <span className="truncate">{booking.location}</span>
              </span>
              <span className="shrink-0 text-[13px] font-bold text-(--brand-gold)">
                {booking.price}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex gap-2 border-t border-(--border) pt-2.5">
          <button
            type="button"
            className="
              flex flex-1 items-center justify-center gap-1 rounded-lg
              border border-(--border) py-1.5 text-[10px] font-bold
              text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
            "
          >
            <Star size={12} className="text-(--brand-gold)" />
            Rate
          </button>
          <Link
            href="/booking"
            className="
              flex flex-1 items-center justify-center gap-1 rounded-lg
              border border-(--border) py-1.5 text-[10px] font-bold
              text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
            "
          >
            <RotateCcw size={12} />
            Book Again
          </Link>
        </div>
      </div> */}

      {receiptOpen && <ReceiptDetails booking={booking} />}
    </article>
  );
}

function BookingCard({
  booking,
  tab,
  serviceSubTab,
}: {
  booking: Booking;
  tab: CardStatusTab;
  serviceSubTab?: ServiceSubTab;
}) {
  const status = statusStyles[tab];
  const showViewButton = tab === "upcoming" && serviceSubTab === "booked";

  return (
    <article className="feature-card overflow-hidden rounded-xl">
      <OrganizationBanner organization={booking.organization} />

      <div className="p-2.5">
      <div className="flex gap-3">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-sm">
          <Image
            src={booking.image}
            alt={booking.service}
            fill
            sizes="72px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[13px] font-bold text-(--text-primary)">
              {booking.service}
            </h3>
            {showViewButton && (
              <span
                className="flex shrink-0 items-center gap-1 rounded-full bg-(--text-primary) px-2 py-0.5 text-[10px] font-bold text-white"
              >
                view <ChevronDown size={12} />
              </span>
            )}
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ color: status.color, background: status.bg }}
            >
              {tab === "upcoming" ? "Cancel" : status.label}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-(--text-secondary)">
            <UserRound size={11} className="text-(--accent-primary)" />
            <span className="truncate">with {booking.therapist}</span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] font-semibold text-(--text-secondary)">
            <span className="flex items-center gap-1">
              <CalendarDays size={10} className="text-(--accent-primary)" />
              {booking.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock3 size={10} className="text-(--accent-primary)" />
              {booking.time}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1 text-[9px] font-semibold text-(--text-muted)">
              <MapPin size={10} className="shrink-0 text-(--accent-primary)" />
              <span className="truncate">{booking.location}</span>
            </span>
            <span className="shrink-0 text-[13px] font-bold text-(--brand-gold)">
              {booking.price}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex gap-2 border-t border-(--border) pt-2.5">
        <button
          type="button"
          className="
            flex flex-1 items-center justify-center gap-1 rounded-lg
            border border-(--border) py-1.5 text-[10px] font-bold
            text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
          "
        >
          {tab === "upcoming" ? "Ongoing" : status.label}
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
        ) : (
          <Link
            href="/booking"
            className="
              flex flex-1 items-center justify-center gap-1 rounded-lg
              border border-(--border) py-1.5 text-[10px] font-bold
              text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)
            "
          >
            <RotateCcw size={12} />
            Book Again
          </Link>
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
    <main className="px-2 pb-20">
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
            {bookings.map((booking) =>
              activeTab === "completed" ? (
                <ReceiptCard key={booking.id} booking={booking} />
              ) : activeTab === "history" ? (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  tab={activeHistorySubTab}
                />
              ) : (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  tab="upcoming"
                  serviceSubTab={activeServiceSubTab}
                />
              ),
            )}
          </div>
        ) : (
          <EmptyState label={emptyLabel} />
        )}

        {/* {activeTab === "upcoming" && <SuggestedServices tab={activeTab} />} */}
      </div>
    </main>
  );
}
