"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  MapPin,
  ReceiptText,
  Store,
  Tag,
  X,
  XCircle,
} from "lucide-react";

import {
  bookingLocation,
  buildBookingDays,
  calcServicesTotal,
  createDefaultServiceSchedule,
  getBookingDay,
  getSelectedServices,
  isServiceScheduleComplete,
  TAX_RATE,
  timeSlots,
} from "../booking.data";
import type { ServiceSchedule, ServiceSchedules } from "../booking.types";
import type { BookingOrganizationBannerInfo } from "./BookingOrganizationBanner";
import {
  BookingConfirmedReceipt,
  type ReceiptLineItem,
} from "./BookingConfirmedReceipt";
import { Step2DateTimeSection } from "./steps/Step2DateTimeSection";

interface PackageBookingConfirmedScreenProps {
  selectedServiceIds: string[];
  organizationId?: string;
  organizationBanner?: BookingOrganizationBannerInfo;
  serviceSchedules: ServiceSchedules;
  packageName: string;
  packagePrice?: number;
  packageOriginalPrice?: number;
  packageImage?: string;
  billingName?: string;
  billingPhone?: string;
  paymentMethod?: string;
  onReschedule?: (dayId: string, time: string) => void;
  onCancelBooking?: () => void;
}

function parseDurationMinutes(duration: string): number {
  const value = duration.trim().toLowerCase();
  if (!value) return 0;

  const hoursMatch = value.match(/(\d+(?:\.\d+)?)\s*h/);
  const minutesMatch = value.match(/(\d+(?:\.\d+)?)\s*m/);
  let total = 0;

  if (hoursMatch) total += Number(hoursMatch[1]) * 60;
  if (minutesMatch) total += Number(minutesMatch[1]);

  if (!hoursMatch && !minutesMatch) {
    const numeric = Number(value.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(numeric)) total = numeric;
  }

  return Math.max(0, Math.round(total));
}

function parseTimeToMinutes(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const period = match[3].toUpperCase();

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

function formatMinutesToTime(totalMinutes: number): string {
  const minutesInDay = 24 * 60;
  const normalized =
    ((Math.round(totalMinutes) % minutesInDay) + minutesInDay) % minutesInDay;
  let hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

function formatDurationLabel(totalMinutes: number): string {
  if (totalMinutes <= 0) return "—";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  if (minutes <= 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

function money(value: number) {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`;
}

function formatInvoiceStamp(schedule?: ServiceSchedule) {
  if (!schedule?.dayId) return "";
  const day = getBookingDay(schedule.dayId);
  const [year, month, date] = day.iso.split("-");
  return `${date}-${month}-${year.slice(2)} ${schedule.time}`;
}

function Sparkle({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      fill={color}
    >
      <path d="M8 0c.4 3.2 1.6 5.2 4 6.4C9.6 7.6 8.4 9.6 8 12.8 7.6 9.6 6.4 7.6 4 6.4 6.4 5.2 7.6 3.2 8 0Z" />
    </svg>
  );
}

function CancelBookingModal({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[340px] rounded-2xl bg-(--bg-primary) p-4 shadow-(--shadow-glow)"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-cancel-title"
      >
        <h3
          id="package-cancel-title"
          className="text-[16px] font-bold text-(--text-primary)"
        >
          Cancel this booking?
        </h3>
        <p className="mt-2 text-[12px] leading-snug text-(--text-secondary)">
          This will delete your package booking. This action cannot be undone.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-(--accent-primary) py-2.5 text-[13px] font-semibold text-(--accent-primary)"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-(--danger) py-2.5 text-[13px] font-semibold text-white"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}

function PackageReceiptModal({
  storeName,
  storeAddress,
  docketNo,
  serialNo,
  dateLabel,
  servedBy,
  customerName,
  customerPhone,
  paymentMethod,
  items,
  onClose,
}: {
  storeName: string;
  storeAddress: string;
  docketNo: string;
  serialNo: string;
  dateLabel: string;
  servedBy: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  items: ReceiptLineItem[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="mt-6 flex max-h-[83dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-receipt-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-4 py-3">
          <h3
            id="package-receipt-title"
            className="text-[15px] font-bold text-(--text-primary)"
          >
            Tax Invoice
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close receipt"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border) text-(--text-primary)"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
          <BookingConfirmedReceipt
            storeName={storeName}
            storeAddress={storeAddress}
            docketNo={docketNo}
            serialNo={serialNo}
            dateLabel={dateLabel}
            servedBy={servedBy}
            customerName={customerName}
            customerPhone={customerPhone}
            paymentMethod={paymentMethod}
            items={items}
            onBack={onClose}
          />
        </div>
      </div>
    </div>
  );
}

function PackageRescheduleModal({
  packageName,
  bookingDays,
  initialDayId,
  initialTime,
  onConfirm,
  onClose,
}: {
  packageName: string;
  bookingDays: ReturnType<typeof buildBookingDays>;
  initialDayId: string;
  initialTime: string;
  onConfirm: (dayId: string, time: string) => void;
  onClose: () => void;
}) {
  const [dayId, setDayId] = useState(initialDayId);
  const [time, setTime] = useState(initialTime);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
          <div>
            <h3 className="text-sm font-bold text-(--text-primary)">
              Reschedule Package
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-(--text-muted)">
              {packageName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <Step2DateTimeSection
            embedded
            days={bookingDays}
            times={timeSlots}
            activeDayId={dayId}
            activeTime={time}
            onSelectDay={setDayId}
            onSelectTime={setTime}
          />
        </div>

        <div className="border-t border-(--border) p-3.5">
          <button
            type="button"
            onClick={() => onConfirm(dayId, time)}
            className="primary-button h-11 w-full rounded-xl text-[14px] font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function PackageBookingConfirmedScreen({
  selectedServiceIds,
  organizationId,
  organizationBanner,
  serviceSchedules,
  packageName,
  packagePrice,
  packageOriginalPrice,
  packageImage,
  billingName = "",
  billingPhone = "",
  paymentMethod = "card",
  onReschedule,
  onCancelBooking,
}: PackageBookingConfirmedScreenProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [editActionsOpen, setEditActionsOpen] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const { subtotal } = calcServicesTotal(selectedServiceIds, organizationId);
  const bookingDays = useMemo(() => buildBookingDays(new Date()), []);

  const org = organizationBanner ?? {
    name: bookingLocation.name,
    banner: bookingLocation.banner,
    availability: bookingLocation.availability,
    status: bookingLocation.status,
    thumbnail: bookingLocation.image,
    address: bookingLocation.address,
  };

  const heroImage =
    packageImage ||
    selectedServices[0]?.image ||
    org.thumbnail ||
    org.banner;

  const paidAmount = packagePrice && packagePrice > 0 ? packagePrice : subtotal;
  const originalAmount =
    packageOriginalPrice && packageOriginalPrice > paidAmount
      ? packageOriginalPrice
      : Math.round(paidAmount * 1.27);
  const savedAmount = Math.max(0, originalAmount - paidAmount);

  const primarySchedule = useMemo(() => {
    const firstComplete = selectedServiceIds
      .map((id) => serviceSchedules[id])
      .find((schedule) => isServiceScheduleComplete(schedule));
    return (
      firstComplete ??
      serviceSchedules[selectedServiceIds[0] ?? ""] ??
      createDefaultServiceSchedule()
    );
  }, [selectedServiceIds, serviceSchedules]);

  const bookingDay = primarySchedule?.dayId
    ? getBookingDay(primarySchedule.dayId)
    : null;

  const totalDurationMinutes = selectedServices.reduce(
    (sum, service) => sum + parseDurationMinutes(service.duration),
    0,
  );

  const startTime = primarySchedule?.time ?? "";
  const startMinutes = startTime ? parseTimeToMinutes(startTime) : null;
  const endTime =
    startMinutes != null
      ? formatMinutesToTime(startMinutes + totalDurationMinutes)
      : "";

  const bookingId = useMemo(() => {
    const stamp = bookingDay?.iso?.replaceAll("-", "").slice(2) ?? "000000";
    const hash =
      selectedServiceIds.join("").length * 17 +
      Math.round(paidAmount) * 3 +
      totalDurationMinutes;
    return `VBK-${stamp}-${String(1000 + (hash % 9000))}`;
  }, [bookingDay?.iso, paidAmount, selectedServiceIds, totalDurationMinutes]);

  const monthLabel = bookingDay
    ? new Date(`${bookingDay.iso}T12:00:00`)
        .toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
        .toUpperCase()
    : "DATE";

  const weekdayLabel = bookingDay
    ? new Date(`${bookingDay.iso}T12:00:00`)
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toUpperCase()
    : "";

  const dayNumber = bookingDay
    ? new Date(`${bookingDay.iso}T12:00:00`).getDate()
    : "";

  const shortDate = bookingDay
    ? new Date(`${bookingDay.iso}T12:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const dayDateLabel =
    shortDate && weekdayLabel
      ? `${weekdayLabel.charAt(0)}${weekdayLabel.slice(1, 3).toLowerCase()}, ${shortDate}`
      : shortDate;

  const paymentLabel =
    {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "Amex",
      apple: "Apple Pay",
      google: "Google Pay",
      paypal: "PayPal",
      card: "Credit / Debit Card",
      razorpay: "Razorpay",
    }[paymentMethod] ?? "Card";

  const unitPrice =
    selectedServices.length > 0
      ? Number((paidAmount / selectedServices.length).toFixed(2))
      : paidAmount;
  const unitTax = Number((unitPrice * TAX_RATE).toFixed(2));

  const receiptItems: ReceiptLineItem[] = selectedServices.map((service) => ({
    id: service.id,
    name: service.name,
    staffName: "packages",
    arrival: formatInvoiceStamp(serviceSchedules[service.id]) || "—",
    duration: service.duration,
    price: unitPrice,
    tax: unitTax,
    quantity: 1,
  }));

  const invoiceDate =
    formatInvoiceStamp(primarySchedule) ||
    new Date()
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  const serialNo = String((selectedServiceIds.join("").length * 11) % 90 + 10);
  const docketNo = `39${serialNo}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-(--bg-primary) px-3.5 pb-8 pt-5">
      <div className="relative mb-5 overflow-hidden rounded-2xl px-3 py-5 text-center">
        <Sparkle className="left-8 top-3 h-3 w-3" color="var(--brand-gold)" />
        <Sparkle
          className="right-10 top-4 h-2.5 w-2.5"
          color="var(--accent-secondary)"
        />
        <Sparkle
          className="bottom-6 left-12 h-2 w-2"
          color="var(--brand-gold-light)"
        />
        <Sparkle
          className="right-14 bottom-5 h-3 w-3"
          color="var(--accent-glow)"
        />

        <div className="relative z-10 flex flex-col items-center">
          <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-(--accent-primary) shadow-(--shadow-glow)">
            <Check size={32} strokeWidth={3} className="text-white" />
          </span>
          <h1 className="text-[24px] font-bold text-(--text-primary)">
            Booking Confirmed!
          </h1>
          <p className="mt-1 text-[12px] text-(--text-secondary)">
            Your appointment has been successfully booked.
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className="
              mt-3 inline-flex items-center gap-1.5 rounded-full
              bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)]
              px-3 py-1.5 text-[11px] font-semibold text-(--text-primary)
            "
          >
            Booking ID: {bookingId}
            {copied ? (
              <Check size={12} className="text-(--success)" />
            ) : (
              <Copy size={12} className="text-(--text-muted)" />
            )}
          </button>
        </div>
      </div>

      <section className="mb-3 overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-(--shadow-card)">
        <div className="flex items-center justify-between border-b border-(--border) px-3.5 py-3">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-(--accent-primary)" />
            <h2 className="text-[13px] font-bold text-(--text-primary)">
              Booking Details
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setEditActionsOpen((open) => !open)}
            className="rounded-xs bg-(--accent-primary) px-2.5 py-1 text-[10px] font-bold tracking-wide text-white"
          >
            {editActionsOpen ? "DONE" : "EDIT"}
          </button>
        </div>

        <div className="grid grid-cols-[118px_minmax(0,1fr)] gap-3 p-3">
          <div className="relative flex flex-col overflow-hidden rounded-xl bg-(--accent-primary)">
            <span
              className="
                absolute left-0 top-0 z-10 rounded-br-lg bg-(--brand-gold)
                px-2 py-0.5 text-[8px] font-bold tracking-wide text-white
              "
            >
              PACKAGE
            </span>
            <p className="mt-7 px-1.5 text-center text-[12px] font-bold leading-snug text-(--brand-gold)">
              {packageName}
            </p>
            <div className="relative mx-auto mt-2 h-[78px] w-[78px] overflow-hidden rounded-sm">
              <Image
                src={heroImage}
                alt={packageName}
                fill
                sizes="78px"
                className="object-cover"
              />
            </div>
            <div className="mt-auto flex items-center justify-center gap-1 bg-[color-mix(in_srgb,black_22%,transparent)] px-2 py-2 text-center text-[8px] font-semibold uppercase tracking-wide text-white">
              <CalendarDays size={10} />
              {selectedServices.length} SERVICES SELECTED
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-start gap-1.5">
              <Store
                size={13}
                className="mt-0.5 shrink-0 text-(--accent-primary)"
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-(--text-primary)">
                  {org.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-(--text-secondary)">
                  <span className="text-(--brand-gold)">★</span>
                  4.9 (380+)
                </p>
                <p className="mt-0.5 flex items-start gap-1 text-[9px] leading-snug text-(--text-muted)">
                  <MapPin size={10} className="mt-0.5 shrink-0" />
                  <span>{org.address ?? bookingLocation.address}</span>
                </p>
              </div>
            </div>

            <div className="mt-2.5">
              <p className="mb-1.5 text-[11px] font-bold text-(--text-primary)">
                {selectedServices.length} Services Booked
              </p>
              <div className="space-y-1">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between gap-2 text-[10px]"
                  >
                    <span className="inline-flex min-w-0 items-center gap-1.5 text-(--text-secondary)">
                      <CheckCircle2
                        size={12}
                        className="shrink-0 text-(--accent-primary)"
                      />
                      <span className="truncate">{service.name}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-(--text-muted)">
                      {service.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-3 overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-(--shadow-card)">
        <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 p-3">
          <div className="overflow-hidden rounded-xl border border-(--border)">
            <div className="bg-(--accent-primary) px-2 py-1.5 text-center text-[9px] font-bold tracking-wide text-white">
              {monthLabel}
            </div>
            <div className="flex flex-col items-center bg-(--bg-secondary) px-2 py-2 text-center">
              <p className="text-[9px] font-semibold tracking-wide text-(--text-muted)">
                {weekdayLabel}
              </p>
              <p className="my-1 text-[34px] leading-none font-bold text-(--accent-primary)">
                {dayNumber}
              </p>
              <p className="text-[9px] font-semibold text-(--text-secondary)">
                {shortDate}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-1.5">
              <Clock3 size={13} className="text-(--accent-primary)" />
              <p className="text-[12px] font-bold text-(--text-primary)">
                Your Appointment Time
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="min-w-0 flex-1 rounded-sm bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] px-2 py-2 text-center">
                <p className="text-[8px] font-semibold tracking-wide text-(--text-muted)">
                  START TIME
                </p>
                <p className="mt-0.5 text-[13px] font-bold text-(--accent-primary)">
                  {startTime || "—"}
                </p>
                {dayDateLabel ? (
                  <p className="mt-0.5 text-[8px] text-(--text-muted)">
                    {dayDateLabel}
                  </p>
                ) : null}
              </div>
              <ArrowRight size={14} className="shrink-0 text-(--text-muted)" />
              <div className="min-w-0 flex-1 rounded-sm border border-(--border) bg-(--bg-secondary) px-2 py-2 text-center">
                <p className="text-[8px] font-semibold tracking-wide text-(--text-muted)">
                  END TIME
                </p>
                <p className="mt-0.5 text-[13px] font-bold text-(--brand-gold)">
                  {endTime || "—"}
                </p>
                {dayDateLabel ? (
                  <p className="mt-0.5 text-[8px] text-(--text-muted)">
                    {dayDateLabel}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-1 rounded-lg bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] px-2.5 py-1.5 text-[10px] font-semibold text-(--text-primary)">
              <Clock3 size={11} className="text-(--accent-primary)" />
              Total Duration: {formatDurationLabel(totalDurationMinutes)}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4 overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card) shadow-(--shadow-card)">
        <div className="flex items-center gap-1.5 border-b border-(--border) px-3.5 py-3">
          <Tag size={14} className="text-(--accent-primary)" />
          <h2 className="text-[13px] font-bold text-(--text-primary)">
            Price Summary
          </h2>
        </div>

        <div className="flex items-stretch gap-3 p-3.5">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2 text-[12px]">
              <span className="text-(--text-secondary)">Package Price</span>
              <span className="font-bold text-(--text-primary)">
                {money(paidAmount)}
              </span>
            </div>
            {savedAmount > 0 && (
              <div className="inline-flex items-center gap-1 rounded-md bg-[color-mix(in_srgb,var(--success)_14%,white)] px-2 py-1 text-[10px] font-semibold text-(--success)">
                You Saved
                <span>- {money(savedAmount)}</span>
              </div>
            )}
          </div>

          <div className="w-px self-stretch bg-(--border)" />

          <div className="flex min-w-[120px] flex-col items-end justify-center gap-1.5">
            <p className="text-[10px] font-semibold text-(--text-muted)">
              Total Paid
            </p>
            <div className="flex items-center gap-2">
              <p className="text-[22px] font-bold text-(--brand-gold)">
                {money(paidAmount)}
              </p>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[color-mix(in_srgb,var(--success)_16%,white)] px-2 py-0.5 text-[9px] font-bold text-(--success)">
                Paid
                <Check size={10} strokeWidth={3} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-13 space-y-2.5">
        {editActionsOpen && (
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setShowReceiptModal(true)}
              className="flex items-center gap-1.5 rounded-sm bg-(--accent-primary) px-2 py-2.5 text-left text-white"
            >
              <ReceiptText size={14} strokeWidth={2} className="shrink-0" />
              <span className="min-w-0 flex-1 text-[7px] font-semibold leading-tight">
                View Receipt
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowRescheduleModal(true)}
              className="flex items-center gap-1.5 rounded-sm bg-(--accent-primary) px-2 py-2.5 text-left text-white"
            >
              <CalendarClock size={14} strokeWidth={2} className="shrink-0" />
              <span className="min-w-0 flex-1 text-[7px] font-semibold leading-tight">
                Reschedule
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-1.5 rounded-sm bg-(--accent-primary) px-2 py-2.5 text-left text-white"
            >
              <XCircle size={14} strokeWidth={2} className="shrink-0" />
              <span className="min-w-0 flex-1 text-[7px] font-semibold leading-tight">
                Cancel Booking
              </span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => router.push("/mybooking")}
          className="w-full rounded-xl bg-(--accent-primary) py-3.5 text-[14px] font-semibold text-white"
        >
          View My Bookings
        </button>
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="w-full text-center text-[13px] font-semibold text-(--accent-primary)"
        >
          Back to Home
        </button>
      </div>

      {showReceiptModal && (
        <PackageReceiptModal
          storeName={org.name}
          storeAddress={org.address ?? bookingLocation.address}
          docketNo={docketNo}
          serialNo={serialNo}
          dateLabel={invoiceDate}
          servedBy="packages"
          customerName={billingName}
          customerPhone={billingPhone}
          paymentMethod={paymentLabel}
          items={receiptItems}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

      {showRescheduleModal && (
        <PackageRescheduleModal
          packageName={packageName}
          bookingDays={bookingDays}
          initialDayId={primarySchedule.dayId}
          initialTime={primarySchedule.time}
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={(dayId, time) => {
            onReschedule?.(dayId, time);
            setShowRescheduleModal(false);
            setEditActionsOpen(false);
          }}
        />
      )}

      {showCancelModal && (
        <CancelBookingModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={() => {
            setShowCancelModal(false);
            onCancelBooking?.();
            router.push("/home");
          }}
        />
      )}
    </div>
  );
}
