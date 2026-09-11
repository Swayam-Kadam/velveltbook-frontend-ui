"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Flower2,
  History,
  Lock,
  MapPin,
  Phone,
  Plus,
  Receipt,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";

import {
  historyBookingData,
  historySubTabs,
  tabs,
  type Booking,
  type BookingTab,
  type HistorySubTab,
  type ServiceSubTab,
} from "@/data/booking/my-bookings";
import {
  BookingPreviewCards,
  parseDateLabelForPreview,
} from "@/booking/components/BookingPreviewCards";
import { ExpertProfileModal } from "@/booking/components/ExpertProfileModal";
import { BookingMonthCalendar } from "@/booking/components/steps/BookingMonthCalendar";
import {
  TimeSlotPicker,
} from "@/booking/components/steps/ServiceScheduleRows";
import { TimingsDropdown } from "@/components/TimingsDropdown";
import {
  allMenuServices,
  getServicesByCategory,
  menuCategories,
} from "@/menu/menu.data";
import { CategorySidebar } from "@/menu/components/CategorySidebar";
import { ServiceCard } from "@/menu/components/ServiceCard";
import {
  buildBookingDays,
  getAvailableTimeSlots,
  timeSlots,
} from "@/data/booking/booking";
import { SHARED_STAFF } from "@/data/shared/staff";
import { MyBookingTaxInvoice } from "./MyBookingTaxInvoice";

type CardStatusTab = "upcoming" | HistorySubTab;
type EditPanel = null | "service" | "staff" | "datetime";

const TAB_ICONS: Record<BookingTab, typeof CalendarDays> = {
  upcoming: CalendarDays,
  completed: Receipt,
  history: History,
};

const TAB_LABELS: Record<BookingTab, string> = {
  upcoming: "Service",
  completed: "Receipt",
  history: "History",
};

const WELLNESS_IMAGE =
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop";

const cardShell =
  "rounded-[18px] border border-[color-mix(in_srgb,var(--accent-primary)_8%,var(--border))] bg-white/95 shadow-[0_10px_30px_rgba(61,28,77,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(61,28,77,0.1)]";

function getStaffForBooking(therapistName: string) {
  const normalized = therapistName.trim().toLowerCase();
  return (
    SHARED_STAFF.find(
      (staff) => staff.name.trim().toLowerCase() === normalized,
    ) ?? SHARED_STAFF[0]
  );
}

function findMenuServiceByName(serviceName: string) {
  const normalized = serviceName.trim().toLowerCase();
  return allMenuServices.find(
    (service) => service.title.trim().toLowerCase() === normalized,
  );
}

function formatBookingDateLabel(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function findDayIdForDateLabel(dateLabel: string, days: ReturnType<typeof buildBookingDays>) {
  const parsed = new Date(dateLabel);
  if (Number.isNaN(parsed.getTime())) return days[0]?.id ?? "";
  const iso = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
  return days.find((day) => day.iso === iso)?.id ?? days[0]?.id ?? "";
}

function ChangeButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl
        bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-primary)_12%,white)_0%,color-mix(in_srgb,var(--accent-primary)_8%,#f7eef8)_100%)]
        py-2.5 text-[12px] font-semibold tracking-wide text-(--accent-primary)
        ring-1 ring-(--accent-primary)/10 transition-all duration-200
        hover:bg-[color-mix(in_srgb,var(--accent-primary)_16%,white)]
        hover:ring-(--accent-primary)/20 active:scale-[0.99]
      "
    >
      <CalendarDays size={13} strokeWidth={2.2} />
      Change
    </button>
  );
}

function ChangeServiceMenuModal({
  currentServiceId,
  onPick,
  onClose,
}: {
  currentServiceId: string;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState(() => {
    return (
      allMenuServices.find((service) => service.id === currentServiceId)
        ?.categoryId ??
      menuCategories[0]?.id ??
      "massage"
    );
  });

  const categoryServices = useMemo(
    () => getServicesByCategory(activeCategory),
    [activeCategory],
  );

  const activeCategoryLabel =
    menuCategories.find((category) => category.id === activeCategory)?.label ??
    "Services";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex h-[85dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between gap-2 border-b border-(--border) px-3 py-3">
          <div>
            <h3 className="text-sm font-bold text-(--text-primary)">
              Change Service
            </h3>
            <p className="mt-0.5 text-[10px] text-(--text-muted)">
              Browse categories and tap a service
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <CategorySidebar
            categories={menuCategories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
            <div className="flex-1 overflow-y-auto px-2 pt-3 pb-3 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
              <div className="mb-3">
                <h4 className="text-xs font-medium text-(--text-primary)">
                  Select Services
                </h4>
                <p className="text-[8px] text-(--text-muted)">
                  {activeCategoryLabel} · {categoryServices.length} available
                </p>
              </div>

              {categoryServices.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {categoryServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={service.id === currentServiceId}
                      onSelect={() => onPick(service.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-[10px] text-(--text-muted)">
                  No services in this category yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-(--border) px-3 py-3">
          <button
            type="button"
            onClick={onClose}
            className="primary-button w-full rounded-xl py-2.5 text-[12px] font-semibold text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function DesktopEmptyState({ label }: { label: string }) {
  return (
    <div className={`${cardShell} flex min-h-0 flex-1 flex-col items-center justify-center px-10 py-16 text-center`}>
      <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--accent-primary)_18%,white),color-mix(in_srgb,var(--accent-primary)_6%,white))]">
        <CalendarDays size={30} className="text-(--accent-primary)" strokeWidth={1.5} />
      </div>
      <h3 className="font-[family-name:var(--font-heading)] text-[20px] font-semibold text-(--text-primary)">
        No {label} bookings
      </h3>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-(--text-muted)">
        When you book a service, it will show up here so you can manage it anytime.
      </p>
      <Link
        href="/booking"
        className="primary-button mt-7 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white shadow-(--shadow-glow)"
      >
        Explore Services
      </Link>
    </div>
  );
}

function ReceiptListCard({
  booking,
  active,
  onSelect,
  statusLabel,
  statusTone = "text-(--success)",
  statusBg = "bg-[color-mix(in_srgb,var(--success)_14%,white)]",
}: {
  booking: Booking;
  active: boolean;
  onSelect: () => void;
  statusLabel?: string;
  statusTone?: string;
  statusBg?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full overflow-hidden rounded-[18px] border text-left transition-all duration-200
        ${
          active
            ? "border-(--accent-primary)/40 bg-white shadow-[0_14px_34px_rgba(61,28,77,0.12)] ring-1 ring-(--accent-primary)/20"
            : "border-(--border) bg-white/90 shadow-[0_8px_24px_rgba(61,28,77,0.05)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(61,28,77,0.08)]"
        }
      `}
    >
      <div className="relative h-[120px] w-full">
        <Image
          src={booking.organization.banner}
          alt={booking.organization.name}
          fill
          sizes="280px"
          className="object-cover"
        />
        {statusLabel ? (
          <span
            className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusBg} ${statusTone}`}
          >
            {statusLabel}
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-3.5">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-[15px] font-semibold text-(--accent-primary)">
            {booking.organization.name.replace(/,.*/, "")}
          </h3>
          <BadgeCheck size={14} className="shrink-0 text-(--accent-primary)" />
        </div>
        <p className="truncate text-[12px] font-medium text-(--text-primary)">
          {booking.service}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-(--text-secondary)">
          <Star size={11} className="fill-(--brand-gold) text-(--brand-gold)" />
          <span className="font-medium text-(--text-primary)">4.8</span>
          <span>(320+)</span>
        </div>
        <p className="flex items-start gap-1 text-[11px] leading-snug text-(--text-muted)">
          <MapPin size={11} className="mt-0.5 shrink-0 text-(--accent-primary)" />
          <span className="line-clamp-2">{booking.organization.address}</span>
        </p>
        <div className="flex items-center justify-between gap-2 pt-0.5 text-[11px] text-(--text-secondary)">
          <span>
            {booking.date} · {booking.time}
          </span>
          <span className="font-semibold text-(--brand-gold)">{booking.price}</span>
        </div>
      </div>
    </button>
  );
}

function HistoryStatusPanel({
  status,
  booking,
  statusCopy,
}: {
  status: HistorySubTab;
  booking: Booking;
  statusCopy: {
    label: string;
    detail: string;
    tone: string;
    iconBg: string;
    ring: string;
  };
}) {
  return (
    <div className="flex min-h-0 flex-col gap-3.5 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-(--accent-primary)/25">
      <section className={`${cardShell} p-4 ring-1 ${statusCopy.ring}`}>
        <div className="flex items-start gap-3.5">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${statusCopy.iconBg}`}
          >
            <CheckCircle2 size={22} className={statusCopy.tone} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
              Booking Status
            </p>
            <p
              className={`mt-1 font-[family-name:var(--font-heading)] text-[24px] font-semibold leading-none ${statusCopy.tone}`}
            >
              {statusCopy.label}
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-(--text-secondary)">
              {statusCopy.detail}
            </p>
          </div>
        </div>
      </section>

      <section className={`${cardShell} p-4`}>
        <h3 className="mb-3 text-[14px] font-semibold text-(--accent-primary)">
          Past Service Summary
        </h3>
        <div className="space-y-2.5 text-[13px]">
          <div className="flex items-center justify-between gap-3 text-(--text-secondary)">
            <span>Service</span>
            <span className="truncate font-semibold text-(--text-primary)">
              {booking.service}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-(--text-secondary)">
            <span>Therapist</span>
            <span className="font-semibold text-(--text-primary)">
              {booking.therapist}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-(--text-secondary)">
            <span>Date &amp; Time</span>
            <span className="text-right font-semibold text-(--text-primary)">
              {booking.date} · {booking.time}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-(--border) pt-3">
            <span className="font-semibold text-(--text-primary)">Amount</span>
            <span className="text-[18px] font-bold text-(--accent-primary)">
              {booking.price}
            </span>
          </div>
        </div>

        {status === "cancelled" ? (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-[12px] leading-relaxed text-red-600">
            This booking was cancelled and is kept in your history for reference.
          </p>
        ) : null}
        {status === "refund" ? (
          <p className="mt-4 rounded-xl bg-[color-mix(in_srgb,var(--brand-gold)_12%,white)] px-3 py-2.5 text-[12px] leading-relaxed text-(--text-primary)">
            A refund was issued for this booking. Keep this record for your
            payment history.
          </p>
        ) : null}
      </section>

      <section
        className={`
          ${cardShell} relative mt-auto overflow-hidden px-5 py-6 text-center
          bg-[linear-gradient(160deg,color-mix(in_srgb,var(--accent-primary)_8%,white)_0%,color-mix(in_srgb,var(--accent-primary)_3%,white)_100%)]
        `}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(61,28,77,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(61,28,77,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-(--accent-primary) shadow-sm">
            <History size={18} />
          </span>
          <p className="text-[15px] font-semibold text-(--accent-primary)">
            Past booking history
          </p>
          <p className="mt-1.5 text-[12px] text-(--text-secondary)">
            Review completed, cancelled, and refunded services anytime.
          </p>
        </div>
      </section>
    </div>
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
  activeServiceSubTab: _activeServiceSubTab,
  onServiceSubTabChange: _onServiceSubTabChange,
  activeHistorySubTab,
  onHistorySubTabChange,
  bookings,
  emptyLabel,
}: MyBookingsDesktopProps) {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [bookingOverrides, setBookingOverrides] = useState<
    Record<string, Partial<Booking>>
  >({});
  const [editPanel, setEditPanel] = useState<EditPanel>(null);
  const [viewExpertId, setViewExpertId] = useState<string | null>(null);

  const bookingDays = useMemo(() => buildBookingDays(new Date()), []);

  useEffect(() => {
    setSelectedBookingId(bookings[0]?.id ?? null);
    setEditPanel(null);
    setViewExpertId(null);
  }, [bookings, activeTab, activeHistorySubTab]);

  const baseBooking =
    bookings.find((booking) => booking.id === selectedBookingId) ?? bookings[0];

  const selectedBooking = baseBooking
    ? { ...baseBooking, ...(bookingOverrides[baseBooking.id] ?? {}) }
    : undefined;

  const patchSelectedBooking = (partial: Partial<Booking>) => {
    if (!baseBooking) return;
    setBookingOverrides((current) => ({
      ...current,
      [baseBooking.id]: {
        ...(current[baseBooking.id] ?? {}),
        ...partial,
      },
    }));
  };

  const statusTab: CardStatusTab =
    activeTab === "history"
      ? activeHistorySubTab
      : activeTab === "completed"
        ? "completed"
        : "upcoming";

  const cancelledCount = historyBookingData.cancelled?.length ?? 0;

  const staff = selectedBooking
    ? getStaffForBooking(selectedBooking.therapist)
    : null;
  const datePreview = selectedBooking
    ? parseDateLabelForPreview(selectedBooking.date)
    : null;

  const currentMenuService = selectedBooking
    ? findMenuServiceByName(selectedBooking.service) ?? allMenuServices[0]
    : allMenuServices[0];

  const scheduleDayId = selectedBooking
    ? findDayIdForDateLabel(selectedBooking.date, bookingDays)
    : bookingDays[0]?.id ?? "";

  const viewExpert =
    SHARED_STAFF.find((member) => member.id === viewExpertId) ?? null;

  const paymentMethod =
    selectedBooking?.paymentMethod ?? "Visa •••• 4242";
  const paidAt =
    selectedBooking?.paidAt ??
    (selectedBooking
      ? `${selectedBooking.date} · ${selectedBooking.time}`
      : "");
  const servicePrice =
    selectedBooking?.summarySubtotal ??
    selectedBooking?.subtotal ??
    selectedBooking?.price ??
    "$0";
  const taxes =
    selectedBooking?.taxesAndFees ?? selectedBooking?.tax ?? "$0";
  const totalPaid =
    selectedBooking?.summaryTotal ?? selectedBooking?.price ?? "$0";

  const handlePickService = (serviceId: string) => {
    const menuService = allMenuServices.find((service) => service.id === serviceId);
    if (!menuService) return;
    patchSelectedBooking({
      service: menuService.title,
      image: menuService.image,
      price: menuService.price,
      duration: menuService.duration,
      summarySubtotal: menuService.price,
      summaryTotal: menuService.price,
    });
    setEditPanel(null);
  };

  const handlePickStaff = (staffId: string) => {
    const nextStaff = SHARED_STAFF.find((member) => member.id === staffId);
    if (!nextStaff) return;
    patchSelectedBooking({ therapist: nextStaff.name });
    setEditPanel(null);
  };

  const handleSelectDay = (dayId: string) => {
    const times = getAvailableTimeSlots(dayId, timeSlots);
    const nextTime =
      selectedBooking && times.includes(selectedBooking.time)
        ? selectedBooking.time
        : (times[0] ?? selectedBooking?.time ?? timeSlots[0]);
    patchSelectedBooking({
      date: formatBookingDateLabel(dayId),
      time: nextTime,
    });
  };

  const handleSelectTime = (time: string) => {
    patchSelectedBooking({ time });
  };

  const statusCopy = useMemo(() => {
    if (statusTab === "completed") {
      return {
        label: "Completed",
        detail: "This appointment has been completed.",
        tone: "text-(--success)",
        iconBg:
          "bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--success)_28%,white),color-mix(in_srgb,var(--success)_10%,white))]",
        ring: "ring-(--success)/15",
      };
    }
    if (statusTab === "cancelled") {
      return {
        label: "Cancelled",
        detail: "This appointment was cancelled.",
        tone: "text-red-500",
        iconBg: "bg-red-50",
        ring: "ring-red-500/10",
      };
    }
    if (statusTab === "refund") {
      return {
        label: "Refunded",
        detail: "Payment for this appointment was refunded.",
        tone: "text-(--brand-gold)",
        iconBg:
          "bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--brand-gold)_28%,white),color-mix(in_srgb,var(--brand-gold)_10%,white))]",
        ring: "ring-(--brand-gold)/15",
      };
    }
    return {
      label: "Ongoing",
      detail: "This appointment is upcoming.",
      tone: "text-(--accent-primary)",
      iconBg:
        "bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--accent-primary)_22%,white),color-mix(in_srgb,var(--accent-primary)_8%,white))]",
      ring: "ring-(--accent-primary)/12",
    };
  }, [statusTab]);

  return (
    <div
      className="
        relative flex h-[calc(100vh-4rem)] overflow-hidden
        bg-[radial-gradient(ellipse_at_top_right,rgba(247,236,248)_0%,transparent_42%),radial-gradient(ellipse_at_bottom_left,rgba(252,246,236)_0%,transparent_40%),linear-gradient(180deg,#FBF7F3_0%,#F8F3EF_100%)]
      "
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,28,77,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(61,28,77,0.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Purple sidebar */}
      <aside
        className="
          relative z-10 m-3 mr-0 flex w-[248px] shrink-0 flex-col overflow-hidden
          rounded-[24px] text-white
          bg-[linear-gradient(165deg,#4A2863_0%,#3E1F55_38%,#2B1540_72%,#1F0F30_100%)]
          shadow-[0_20px_50px_rgba(43,21,64,0.35)]
        "
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C45B8B]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-[#6B3FA0]/25 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.45) 0 1px, transparent 1.5px), radial-gradient(circle at 78% 68%, rgba(255,255,255,0.28) 0 1px, transparent 1.5px)",
            backgroundSize: "26px 26px, 34px 34px",
          }}
        />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-4 pt-6">
          <div className="mb-7 px-1">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Velvetbook
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold leading-tight">
              My Bookings
            </h2>
            <p className="mt-1.5 text-[12px] leading-relaxed text-white/65">
              Manage appointments, receipts and history in one calm place.
            </p>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = TAB_ICONS[tab.id];
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    group flex w-full items-center gap-3 rounded-full px-3.5 py-3
                    text-left text-[14px] font-medium transition-all duration-300
                    ${
                      active
                        ? "bg-[linear-gradient(90deg,#7A4BB8_0%,#C45B8B_100%)] text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] ring-1 ring-white/30"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-full transition-colors
                      ${active ? "bg-white/18" : "bg-white/8 group-hover:bg-white/12"}
                    `}
                  >
                    <Icon size={15} strokeWidth={active ? 2.3 : 1.8} />
                  </span>
                  {TAB_LABELS[tab.id]}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto overflow-hidden rounded-[20px] border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
            <div className="px-3.5 pt-3.5">
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#E8C4FF_0%,#C45B8B_100%)] text-[#3E1F55] shadow-sm">
                  <Flower2 size={15} strokeWidth={2.2} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold tracking-wide">
                    Wellness is a Lifestyle
                  </p>
                  <p className="text-[10px] text-white/60">
                    Book calm, feel renewed.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative mx-3 mb-3 h-[112px] overflow-hidden rounded-2xl ring-1 ring-white/20">
              <Image
                src={WELLNESS_IMAGE}
                alt="Wellness lifestyle"
                fill
                sizes="220px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#2B1540]/45 via-transparent to-transparent" />
            </div>
            <div className="border-t border-white/10 px-3 py-3">
              <Link
                href="/home"
                className="
                  flex w-full items-center justify-center gap-1.5 rounded-full
                  border border-white/40 bg-white/5 px-3 py-2.5 text-[12px]
                  font-semibold text-white transition-all duration-200
                  hover:bg-white/15 hover:border-white/55
                "
              >
                Explore Services
                <span aria-hidden className="translate-y-px">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col px-5 py-4 xl:px-6 xl:py-5">
        <div className="mb-4 flex shrink-0 items-end justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-[32px] font-semibold leading-none tracking-tight text-(--accent-primary) xl:text-[36px]">
              My Bookings
            </h1>
            <p className="mt-2 text-[13px] text-(--text-muted)">
              View and manage your appointments in one place.
            </p>
          </div>
          <Link
            href="/booking"
            className="
              primary-button inline-flex items-center gap-1.5 rounded-full px-5 py-2.5
              text-[13px] font-semibold text-white shadow-(--shadow-glow)
              transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]
            "
          >
            <Plus size={15} strokeWidth={2.5} />
            New Booking
          </Link>
        </div>

        {bookings.length === 0 ? (
          <DesktopEmptyState label={emptyLabel} />
        ) : (activeTab === "completed" || activeTab === "history") &&
          selectedBooking &&
          staff &&
          datePreview ? (
          <div className="flex min-h-0 flex-1 flex-col gap-3.5">
            {activeTab === "history" ? (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {historySubTabs.map((subTab) => {
                  const active = activeHistorySubTab === subTab.id;
                  const count = historyBookingData[subTab.id]?.length ?? 0;
                  return (
                    <button
                      key={subTab.id}
                      type="button"
                      onClick={() => onHistorySubTabChange(subTab.id)}
                      className={`
                        rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all duration-200
                        ${
                          active
                            ? "bg-white text-(--accent-primary) shadow-[0_6px_18px_rgba(61,28,77,0.1)] ring-1 ring-(--accent-primary)/35"
                            : "bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] text-(--accent-primary)/75 hover:bg-[color-mix(in_srgb,var(--accent-primary)_16%,white)] hover:text-(--accent-primary)"
                        }
                      `}
                    >
                      {subTab.label} ({count})
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div
              key={`${activeTab}-${activeHistorySubTab}-${selectedBooking.id}`}
              className="grid min-h-0 flex-1 grid-cols-[minmax(220px,0.7fr)_minmax(0,1fr)_minmax(340px,1.15fr)] gap-3.5 xl:gap-4"
            >
            {/* LEFT — booking list */}
            <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-(--accent-primary)/25">
              {bookings.map((booking) => {
                const display = {
                  ...booking,
                  ...(bookingOverrides[booking.id] ?? {}),
                };
                const badge =
                  activeTab === "history"
                    ? activeHistorySubTab === "cancelled"
                      ? {
                          label: "Cancelled",
                          tone: "text-red-600",
                          bg: "bg-red-50",
                        }
                      : activeHistorySubTab === "refund"
                        ? {
                            label: "Refunded",
                            tone: "text-(--brand-gold)",
                            bg: "bg-[color-mix(in_srgb,var(--brand-gold)_14%,white)]",
                          }
                        : {
                            label: "Completed",
                            tone: "text-(--success)",
                            bg: "bg-[color-mix(in_srgb,var(--success)_14%,white)]",
                          }
                    : null;

                return (
                  <ReceiptListCard
                    key={booking.id}
                    booking={display}
                    active={selectedBooking.id === booking.id}
                    onSelect={() => setSelectedBookingId(booking.id)}
                    statusLabel={badge?.label}
                    statusTone={badge?.tone}
                    statusBg={badge?.bg}
                  />
                );
              })}
            </div>

            {/* MIDDLE — booking details */}
            <div className="flex min-h-0 flex-col gap-3.5 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-(--accent-primary)/25">
              <section className="shrink-0 overflow-hidden rounded-[18px] border border-[color-mix(in_srgb,var(--accent-primary)_8%,var(--border))] bg-white shadow-[0_10px_30px_rgba(61,28,77,0.06)]">
                <div className="relative aspect-[16/9] w-full min-h-[168px] max-h-[220px]">
                  <Image
                    src={selectedBooking.organization.banner}
                    alt={selectedBooking.organization.name}
                    fill
                    sizes="560px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
                  <div className="absolute right-3 top-3">
                    <TimingsDropdown
                      summary="Timings"
                      buttonClassName="flex items-center gap-1 rounded-full border border-white/55 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-(--text-primary) shadow-sm backdrop-blur-md"
                    />
                  </div>
                </div>

                <div className="relative z-10 -mt-7 space-y-2.5 bg-white px-4 pb-4 pt-0">
                  <div className="flex items-end gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-[3px] border-white bg-(--bg-secondary) shadow-md ring-1 ring-(--border)">
                      <Image
                        src={selectedBooking.organization.thumbnail}
                        alt={selectedBooking.organization.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate font-[family-name:var(--font-heading)] text-[20px] font-semibold text-(--accent-primary)">
                          {selectedBooking.organization.name.replace(/,.*/, "")}
                        </h3>
                        <BadgeCheck
                          size={17}
                          className="shrink-0 fill-(--accent-primary) text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-(--text-secondary)">
                    <span className="inline-flex items-center gap-1">
                      <Star
                        size={12}
                        className="fill-(--brand-gold) text-(--brand-gold)"
                      />
                      <span className="font-semibold text-(--text-primary)">4.8</span>
                      <span>(320+)</span>
                    </span>
                    <span className="inline-flex min-w-0 items-center gap-1">
                      <MapPin
                        size={12}
                        className="shrink-0 text-(--accent-primary)"
                      />
                      <span className="line-clamp-1">
                        {selectedBooking.organization.address}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {["Massage", "Spa", "Wellness"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-(--border) bg-(--bg-secondary) px-2.5 py-1 text-[10px] font-medium text-(--text-secondary)"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <section className={`${cardShell} shrink-0 p-4`}>
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles size={15} className="text-(--accent-primary)" />
                  <h3 className="text-[14px] font-semibold text-(--accent-primary)">
                    Selected Services
                  </h3>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--bg-secondary)/50 p-2.5">
                  <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={selectedBooking.image}
                      alt={selectedBooking.service}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-(--text-primary)">
                      {selectedBooking.service}
                    </p>
                    <p className="mt-1 text-[12px] text-(--text-muted)">
                      {selectedBooking.duration ?? "60 min"}
                    </p>
                  </div>
                </div>
              </section>

              <section className={`${cardShell} shrink-0 p-4`}>
                <div className="mb-3 flex items-center gap-2">
                  <UserRound size={15} className="text-(--accent-primary)" />
                  <h3 className="text-[14px] font-semibold text-(--accent-primary)">
                    Therapist / Staff
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm ring-2 ring-(--accent-primary)/15">
                    <Image
                      src={staff.image}
                      alt={staff.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-(--text-primary)">
                      {staff.name}
                    </p>
                    <p className="text-[12px] text-(--text-muted)">Therapist</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px]">
                      <span className="inline-flex items-center gap-1">
                        <Star
                          size={12}
                          className="fill-(--brand-gold) text-(--brand-gold)"
                        />
                        <span className="font-semibold text-(--text-primary)">
                          {staff.rating}
                        </span>
                        <span className="text-(--text-muted)">({staff.reviews})</span>
                      </span>
                      <span className="text-(--text-muted)">{staff.experience}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className={`${cardShell} shrink-0 p-4`}>
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays size={15} className="text-(--accent-primary)" />
                  <h3 className="text-[14px] font-semibold text-(--accent-primary)">
                    Appointment Details
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-(--border) bg-(--bg-secondary)/40 px-3 py-3.5 text-center">
                    <p className="text-[11px] font-medium text-(--text-muted)">Date</p>
                    <p className="mt-1.5 text-[15px] font-semibold text-(--accent-primary)">
                      {datePreview.dateLabel}
                    </p>
                    <p className="mt-0.5 text-[12px] text-(--text-secondary)">
                      {datePreview.weekdayLabel}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-(--border) bg-(--bg-secondary)/40 px-3 py-3.5 text-center">
                    <p className="text-[11px] font-medium text-(--text-muted)">Time</p>
                    <p className="mt-1.5 inline-flex items-center justify-center gap-1.5 text-[15px] font-semibold text-(--accent-primary)">
                      <Clock3 size={14} />
                      {selectedBooking.time}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT — invoice or history status */}
            {activeTab === "completed" || activeHistorySubTab === "completed" ? (
              <MyBookingTaxInvoice booking={selectedBooking} />
            ) : (
              <HistoryStatusPanel
                status={activeHistorySubTab}
                booking={selectedBooking}
                statusCopy={statusCopy}
              />
            )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3.5 flex shrink-0 flex-wrap items-center gap-2">
              {bookings.map((booking, index) => {
                const active = selectedBooking?.id === booking.id;
                return (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => setSelectedBookingId(booking.id)}
                    className={`
                      rounded-full px-4 py-1.5 text-[12px] font-semibold
                      transition-all duration-200
                      ${
                        active
                          ? "bg-white text-(--accent-primary) shadow-[0_6px_18px_rgba(61,28,77,0.1)] ring-1 ring-(--accent-primary)/35"
                          : "bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] text-(--accent-primary)/75 hover:bg-[color-mix(in_srgb,var(--accent-primary)_16%,white)] hover:text-(--accent-primary)"
                      }
                    `}
                  >
                    Service - {index + 1}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  onTabChange("history");
                  onHistorySubTabChange("cancelled");
                }}
                className="rounded-full bg-white/80 px-4 py-1.5 text-[12px] font-semibold text-(--text-muted) ring-1 ring-(--border) transition-colors hover:text-(--text-primary)"
              >
                Cancelled ({cancelledCount})
              </button>
            </div>

            {selectedBooking && staff && datePreview ? (
              <div
                key={selectedBooking.id}
                className="grid min-h-0 flex-1 grid-cols-[minmax(220px,0.9fr)_minmax(0,1.35fr)_minmax(240px,0.85fr)] gap-3.5 xl:gap-4"
              >
                {/* LEFT */}
                <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-(--accent-primary)/25">
                  <article className={`${cardShell} p-3.5`}>
                    <div className="flex items-center gap-3">
                      <div className="relative h-[78px] w-[92px] shrink-0 overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
                        <Image
                          src={selectedBooking.image}
                          alt={selectedBooking.service}
                          fill
                          sizes="92px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-(--text-primary)">
                          {selectedBooking.service}
                        </p>
                        <p className="mt-1.5 text-[12px] text-(--text-muted)">
                          {selectedBooking.duration ?? "60 min"}
                          <span className="mx-1.5 text-(--border)">•</span>
                          <span className="font-semibold text-(--brand-gold)">
                            {selectedBooking.price}
                          </span>
                        </p>
                      </div>
                    </div>
                    {statusTab === "upcoming" ? (
                      <ChangeButton onClick={() => setEditPanel("service")} />
                    ) : null}
                  </article>

                  <article className={`${cardShell} p-3.5`}>
                    <div className="flex items-center gap-3">
                      <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
                        <Image
                          src={staff.image}
                          alt={staff.name}
                          fill
                          sizes="78px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-(--text-primary)">
                          {staff.name}
                        </p>
                        <p className="text-[12px] text-(--text-muted)">Therapist</p>
                        <div className="mt-1.5 flex items-center gap-1 text-[12px]">
                          <Star
                            size={12}
                            className="fill-(--brand-gold) text-(--brand-gold)"
                          />
                          <span className="font-semibold text-(--text-primary)">
                            {staff.rating}
                          </span>
                          <span className="text-(--text-muted)">
                            ({staff.reviews})
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-(--text-muted)">
                          {staff.experience}
                        </p>
                      </div>
                    </div>
                    {statusTab === "upcoming" ? (
                      <ChangeButton onClick={() => setEditPanel("staff")} />
                    ) : null}
                  </article>

                  <article className={`${cardShell} overflow-hidden`}>
                    <div className="bg-[linear-gradient(90deg,var(--accent-primary)_0%,#5a2d6e_100%)] px-3 py-2.5 text-center">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/95">
                        {datePreview.monthLabel}
                      </p>
                    </div>
                    <div className="bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--accent-primary)_6%,white),white_55%)] px-3 py-5 text-center">
                      <p className="font-[family-name:var(--font-heading)] text-[32px] font-semibold leading-none text-(--accent-primary)">
                        {datePreview.dateLabel}
                      </p>
                      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                        {datePreview.weekdayLabel}
                      </p>
                      <p className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-(--text-primary) shadow-sm ring-1 ring-(--border)">
                        <Clock3 size={14} className="text-(--accent-primary)" />
                        {selectedBooking.time}
                      </p>
                    </div>
                    {statusTab === "upcoming" ? (
                      <div className="px-3.5 pb-3.5">
                        <ChangeButton onClick={() => setEditPanel("datetime")} />
                      </div>
                    ) : null}
                  </article>
                </div>

                {/* MIDDLE */}
                <div className="flex min-h-0 flex-col gap-3.5 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-(--accent-primary)/25">
                  <section className={`${cardShell} overflow-hidden`}>
                    <div className="relative h-[172px] w-full xl:h-[196px]">
                      <Image
                        src={selectedBooking.organization.banner}
                        alt={selectedBooking.organization.name}
                        fill
                        sizes="560px"
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/5 to-transparent" />
                      <div className="absolute right-3 top-3">
                        <TimingsDropdown
                          summary={
                            selectedBooking.organization.isOpen
                              ? "Open now"
                              : "Closed"
                          }
                          buttonClassName="flex items-center gap-1 rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-(--text-primary) shadow-sm backdrop-blur-md"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 px-4 py-3.5">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-md ring-1 ring-(--border)">
                        <Image
                          src={selectedBooking.organization.thumbnail}
                          alt={selectedBooking.organization.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate font-[family-name:var(--font-heading)] text-[17px] font-semibold text-(--accent-primary)">
                            {selectedBooking.organization.name}
                          </h3>
                          <BadgeCheck
                            size={16}
                            className="shrink-0 text-(--accent-primary)"
                          />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-(--text-secondary)">
                          <span className="inline-flex items-center gap-1">
                            <Star
                              size={11}
                              className="fill-(--brand-gold) text-(--brand-gold)"
                            />
                            <span className="font-medium text-(--text-primary)">
                              4.8
                            </span>
                            <span>(320+)</span>
                          </span>
                          <span className="inline-flex min-w-0 items-center gap-1">
                            <MapPin size={11} className="shrink-0 text-(--accent-primary)" />
                            <span className="truncate">
                              {selectedBooking.organization.address}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 flex-col gap-1.5 xl:flex">
                        <span className="inline-flex items-center gap-1 rounded-full border border-(--accent-primary)/15 bg-[color-mix(in_srgb,var(--accent-primary)_4%,white)] px-2.5 py-1 text-[9px] font-medium text-(--text-primary)">
                          <Phone size={10} className="text-(--accent-primary)" />
                          Flexible Booking
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-(--accent-primary)/15 bg-[color-mix(in_srgb,var(--accent-primary)_4%,white)] px-2.5 py-1 text-[9px] font-medium text-(--text-primary)">
                          <Lock size={10} className="text-(--accent-primary)" />
                          Secure &amp; Private
                        </span>
                      </div>
                    </div>
                  </section>

                  <section
                    className={`
                      ${cardShell} min-h-0 flex-1 border-(--brand-gold)/35 p-4
                      bg-[linear-gradient(180deg,white_0%,color-mix(in_srgb,var(--brand-gold)_4%,white)_100%)]
                    `}
                  >
                    <div className="mb-3.5 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[14px] font-semibold text-(--text-primary)">
                          Selected Services
                        </p>
                        <p className="mt-0.5 text-[11px] text-(--text-muted)">
                          Total Services - 1
                        </p>
                      </div>
                      <span className="rounded-full bg-(--accent-primary) px-3.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                        Service - 1
                      </span>
                    </div>

                    <BookingPreviewCards
                      serviceName={selectedBooking.service}
                      serviceImage={selectedBooking.image}
                      serviceDuration={selectedBooking.duration ?? "60 min"}
                      servicePriceLabel={selectedBooking.price}
                      staffName={staff.name}
                      staffImage={staff.image}
                      monthLabel={datePreview.monthLabel}
                      dateLabel={datePreview.dateLabel}
                      weekdayLabel={datePreview.weekdayLabel}
                      timeLabel={selectedBooking.time}
                      scheduled={datePreview.scheduled}
                      totalAmountLabel={selectedBooking.price}
                      showChangeButtons={statusTab === "upcoming"}
                      // onChangeService={() => setEditPanel("service")}
                      // onChangeStaff={() => setEditPanel("staff")}
                      // onChangeDateTime={() => setEditPanel("datetime")}
                    />
                  </section>
                </div>

                {/* RIGHT */}
                <div className="flex min-h-0 flex-col gap-3.5 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-(--accent-primary)/25">
                  <section className={`${cardShell} p-4 ring-1 ${statusCopy.ring}`}>
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${statusCopy.iconBg}`}
                      >
                        <CheckCircle2 size={22} className={statusCopy.tone} />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                          Booking Status
                        </p>
                        <p
                          className={`mt-1 font-[family-name:var(--font-heading)] text-[24px] font-semibold leading-none ${statusCopy.tone}`}
                        >
                          {statusCopy.label}
                        </p>
                        <p className="mt-2 text-[12px] leading-relaxed text-(--text-secondary)">
                          {statusCopy.detail}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className={`${cardShell} p-4`}>
                    <div className="mb-3.5 flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]">
                        <CreditCard size={15} className="text-(--accent-primary)" />
                      </span>
                      <h3 className="text-[14px] font-semibold text-(--text-primary)">
                        Payment Details
                      </h3>
                    </div>

                    <div className="space-y-2.5 text-[13px]">
                      <div className="flex items-center justify-between rounded-xl bg-(--bg-secondary)/70 px-3 py-2.5 text-(--text-secondary)">
                        <span>Service Price</span>
                        <span className="font-semibold text-(--text-primary)">
                          {servicePrice}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-(--bg-secondary)/70 px-3 py-2.5 text-(--text-secondary)">
                        <span>Taxes &amp; fees</span>
                        <span className="font-semibold text-(--text-primary)">
                          {taxes}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-[color-mix(in_srgb,var(--accent-primary)_6%,white)] px-3 py-3">
                        <span className="font-semibold text-(--text-primary)">
                          Total Paid
                        </span>
                        <span className="text-[20px] font-bold text-(--accent-primary)">
                          {totalPaid}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--success)_14%,transparent)] px-3 py-1.5 text-[11px] font-bold text-(--success) ring-1 ring-(--success)/15">
                      <Check size={12} strokeWidth={2.5} />
                      Paid
                    </div>

                    <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-(--border) pt-3 text-[11px] text-(--text-muted)">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <CreditCard size={13} className="text-(--accent-primary)" />
                        {paymentMethod}
                      </span>
                      <span className="text-right">{paidAt}</span>
                    </div>
                  </section>

                  <section
                    className="
                      mt-auto overflow-hidden rounded-[18px] border border-(--accent-primary)/12
                      bg-[linear-gradient(145deg,color-mix(in_srgb,var(--accent-primary)_10%,white)_0%,color-mix(in_srgb,#C45B8B_8%,white)_100%)]
                      p-4 shadow-[0_10px_30px_rgba(61,28,77,0.06)]
                    "
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-(--accent-primary) shadow-sm ring-1 ring-(--accent-primary)/10">
                        <Sparkles size={16} />
                      </span>
                      <div>
                        <p className="text-[12px] font-semibold text-(--accent-primary)">
                          Thank you
                        </p>
                        <p className="mt-1 text-[12px] leading-relaxed text-(--text-primary)/85">
                          Thank you for choosing Velvetbook! We look forward to
                          serving you again.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      {editPanel === "service" && currentMenuService ? (
        <ChangeServiceMenuModal
          currentServiceId={currentMenuService.id}
          onPick={handlePickService}
          onClose={() => setEditPanel(null)}
        />
      ) : null}

      {editPanel === "staff" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
          onClick={() => setEditPanel(null)}
          role="presentation"
        >
          <div
            className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-(--text-primary)">
                  Change Staff / Therapist
                </h3>
                <p className="mt-0.5 text-[11px] text-(--text-muted)">
                  Choose a therapist for this service
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditPanel(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-3">
              <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-2">
                <div className="scrollbar-none flex gap-3 overflow-x-auto pb-0.5">
                  {SHARED_STAFF.map((therapist) => {
                    const active = staff?.id === therapist.id;
                    return (
                      <button
                        key={therapist.id}
                        type="button"
                        onClick={() => handlePickStaff(therapist.id)}
                        className={`
                          feature-card w-[140px] shrink-0 rounded-xl p-2 text-left
                          transition-all duration-200
                          ${
                            active
                              ? "border-(--accent-primary) shadow-(--shadow-glow)"
                              : "hover:border-[color-mix(in_srgb,var(--accent-primary)_30%,var(--border))]"
                          }
                        `}
                      >
                        <div className="relative h-[120px] overflow-hidden rounded-lg">
                          <Image
                            src={therapist.image}
                            alt={therapist.name}
                            fill
                            sizes="140px"
                            className="object-cover"
                          />
                          {active ? (
                            <span className="border-3 border-white primary-button absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-white">
                              <Check size={10} strokeWidth={2.5} />
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1.5 truncate text-[13px] font-bold text-(--text-primary)">
                          {therapist.name}
                        </p>

                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            setViewExpertId(therapist.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.stopPropagation();
                              setViewExpertId(therapist.id);
                            }
                          }}
                          className="mt-1 block w-full rounded-sm bg-(--accent-primary) px-2 text-center text-[10px] font-semibold uppercase tracking-wide text-white"
                        >
                          View
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {viewExpert ? (
        <ExpertProfileModal
          staff={viewExpert}
          onClose={() => setViewExpertId(null)}
        />
      ) : null}

      {editPanel === "datetime" && selectedBooking ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-3"
          onClick={() => setEditPanel(null)}
          role="presentation"
        >
          <div
            className="flex max-h-[92dvh] w-[95%] max-w-2xl flex-col overflow-hidden rounded-2xl bg-(--bg-primary)"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-(--text-primary)">
                  Change Date &amp; Time
                </h3>
                <p className="mt-0.5 text-[11px] text-(--text-muted)">
                  {selectedBooking.service}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditPanel(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              <BookingMonthCalendar
                days={bookingDays}
                activeDayId={scheduleDayId}
                onSelectDay={handleSelectDay}
              />
              <TimeSlotPicker
                activeDayId={scheduleDayId}
                activeTime={selectedBooking.time}
                onSelectTime={handleSelectTime}
              />
            </div>
            <div className="border-t border-(--border) p-3.5">
              <button
                type="button"
                onClick={() => setEditPanel(null)}
                className="primary-button h-11 w-full rounded-xl text-[14px] font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
