"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  ShoppingBag,
  Star,
  Store,
  Tag,
  UserRound,
  X,
} from "lucide-react";

import { TimingsDropdown } from "@/components/TimingsDropdown";
import { bookingLocation } from "../../booking.data";
import type { BookingDay } from "../../booking.types";
import { Step2DateTimeSection } from "./Step2DateTimeSection";

type SelectedService = {
  id: string;
  name: string;
  image: string;
  duration: string;
  priceLabel: string;
};

interface PackageStep2DesktopProps {
  org: {
    name: string;
    banner: string;
    availability: string;
    status: string;
    address?: string;
  };
  packageName: string;
  packageHero: string;
  selectedServices: SelectedService[];
  paidAmount: number;
  savedAmount: number;
  monthLabel: string;
  weekdayLabel: string;
  dayNumber: string | number;
  shortDate: string;
  startTime: string;
  endTime: string;
  totalDurationLabel: string;
  bookingDays: BookingDay[];
  times: string[];
  activeDayId: string;
  activeTime: string;
  scheduleOpen: boolean;
  onOpenSchedule: () => void;
  onCloseSchedule: () => void;
  onSelectDay: (dayId: string) => void;
  onSelectTime: (time: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onRemoveService?: (serviceId: string) => void;
}

export function PackageStep2Desktop({
  org,
  packageName,
  packageHero,
  selectedServices,
  paidAmount,
  savedAmount,
  monthLabel,
  weekdayLabel,
  dayNumber,
  shortDate,
  startTime,
  endTime,
  totalDurationLabel,
  bookingDays,
  times,
  activeDayId,
  activeTime,
  scheduleOpen,
  onOpenSchedule,
  onCloseSchedule,
  onSelectDay,
  onSelectTime,
  onContinue,
  onBack,
  onRemoveService,
}: PackageStep2DesktopProps) {
  const router = useRouter();
  const hasSelection = selectedServices.length > 0;
  const dayDateLabel =
    shortDate && weekdayLabel
      ? `${weekdayLabel.charAt(0)}${weekdayLabel.slice(1, 3).toLowerCase()}, ${shortDate}`
      : shortDate;

  return (
    <>
      <div className="hidden lg:grid lg:h-[calc(100vh-140px)] lg:min-h-[680px] lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        {/* LEFT */}
        <aside className="flex min-h-0 flex-col gap-4">
          <section className="relative h-[240px] shrink-0 overflow-hidden rounded-[22px] border border-(--border) xl:h-[260px]">
            <Image
              src={org.banner}
              alt={org.name}
              fill
              sizes="440px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-(--success)" />
              <div className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary) px-3 py-1.5 text-[11px] font-semibold text-white">
                <Star
                  size={12}
                  className="fill-(--brand-gold) text-(--brand-gold)"
                />
                4.8 (120+)
              </div>
            </div>

            <div className="absolute top-3 right-3">
              <TimingsDropdown
                summary={org.availability}
                buttonClassName="primary-button flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
              />
            </div>

            <div className="absolute right-4 bottom-4 left-4">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[22px] font-semibold text-white xl:text-[24px]">
                  {org.name}
                </h2>
                <BadgeCheck
                  size={18}
                  className="shrink-0 fill-(--brand-gold) text-(--accent-primary)"
                />
              </div>
              <p className="mt-1 text-[13px] font-medium text-(--success)">
                {org.status}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-white/80">
                <MapPin size={13} />
                {org.address ?? "Melbourne, Australia"}
              </p>
            </div>
          </section>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card)">
            <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="primary-button flex h-9 w-9 items-center justify-center rounded-xl">
                  <ShoppingBag size={16} className="text-white" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-(--text-primary)">
                    Selected Services
                  </p>
                  <p className="text-[12px] text-(--text-muted)">
                    {hasSelection
                      ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} · packages`
                      : "No services selected yet"}
                  </p>
                </div>
              </div>
              {hasSelection && (
                <p className="text-[22px] font-bold text-(--brand-gold)">
                  ${paidAmount}
                </p>
              )}
            </div>

            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3.5 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
              {hasSelection ? (
                selectedServices.map((service) => (
                  <article
                    key={service.id}
                    className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--bg-secondary) p-2.5"
                  >
                    <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        sizes="68px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-(--text-primary)">
                        {service.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[12px] text-(--text-secondary)">
                        <Clock3 size={12} />
                        <span>{service.duration}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[12px] text-(--text-secondary)">
                        <UserRound
                          size={12}
                          className="text-(--accent-primary)"
                        />
                        <span className="truncate">packages</span>
                      </div>
                      <p className="mt-1 text-[15px] font-bold text-(--brand-gold)">
                        {service.priceLabel}
                      </p>
                    </div>
                    {onRemoveService && (
                      <button
                        type="button"
                        onClick={() => onRemoveService(service.id)}
                        aria-label={`Remove ${service.name}`}
                        className="
                          flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                          border border-(--border) bg-(--bg-card) text-(--text-muted)
                          transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary)
                        "
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    )}
                  </article>
                ))
              ) : (
                <div className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) px-4 text-center">
                  <ShoppingBag
                    size={28}
                    className="mb-3 text-(--text-muted) opacity-50"
                  />
                  <p className="text-[14px] font-medium text-(--text-primary)">
                    No services selected
                  </p>
                </div>
              )}
            </div>

            <div className="shrink-0 space-y-2.5 border-t border-(--border) p-3.5">
              <button
                type="button"
                onClick={onContinue}
                className="
                  primary-button flex h-12 w-full items-center justify-center gap-2
                  rounded-xl text-[14px] font-semibold text-white
                  transition-opacity hover:opacity-90
                "
              >
                Continue
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={onBack}
                className="
                  secondary-button flex h-10 w-full items-center justify-center
                  rounded-xl text-[13px] font-medium
                "
              >
                Back
              </button>
            </div>
          </section>
        </aside>

        {/* RIGHT — red section: Booking Details + Appointment/Price + footer */}
        <div className="flex min-h-0 flex-col gap-4">
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.2fr)_minmax(290px,0.9fr)] gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.85fr)]">
            {/* Booking Details */}
            <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card)">
              <div className="flex shrink-0 items-center gap-2 border-b border-(--border) px-4 py-3.5">
                <CalendarDays size={15} className="text-(--accent-primary)" />
                <h2 className="text-[15px] font-bold text-(--text-primary)">
                  Booking Details
                </h2>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-3.5 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
                <div className="grid h-full min-h-[280px] grid-cols-[148px_minmax(0,1fr)] gap-3 xl:grid-cols-[168px_minmax(0,1fr)]">
                  <div className="relative flex flex-col overflow-hidden rounded-xl bg-(--accent-primary)">
                    <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-(--brand-gold) px-2.5 py-1 text-[9px] font-bold tracking-wide text-white">
                      PACKAGE
                    </span>
                    <p className="mt-9 px-2 text-center text-[15px] font-bold leading-snug text-(--brand-gold) xl:text-[16px]">
                      {packageName}
                    </p>
                    <div className="relative mx-auto mt-3 h-[110px] w-[110px] overflow-hidden rounded-lg xl:h-[120px] xl:w-[120px]">
                      <Image
                        src={packageHero}
                        alt={packageName}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-auto flex items-center justify-center gap-1 bg-[color-mix(in_srgb,black_22%,transparent)] px-2 py-2.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                      <CalendarDays size={11} />
                      {selectedServices.length} SERVICES SELECTED
                    </div>
                  </div>

                  <div className="min-w-0 rounded-xl border border-(--border) bg-(--bg-card) p-3.5">
                    <div className="flex items-start gap-2">
                      <Store
                        size={15}
                        className="mt-0.5 shrink-0 text-(--accent-primary)"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold text-(--text-primary)">
                          {org.name}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[12px] text-(--text-secondary)">
                          <span className="text-(--brand-gold)">★</span>
                          4.9 (380+)
                        </p>
                        <p className="mt-1 flex items-start gap-1 text-[11px] leading-snug text-(--text-muted)">
                          <MapPin size={12} className="mt-0.5 shrink-0" />
                          <span>{org.address ?? bookingLocation.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="mb-2 text-[13px] font-bold text-(--text-primary)">
                        {selectedServices.length} Services Booked
                      </p>
                      <div className="space-y-2">
                        {selectedServices.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between gap-2 text-[12px]"
                          >
                            <span className="inline-flex min-w-0 items-center gap-1.5 text-(--text-secondary)">
                              <CheckCircle2
                                size={14}
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
              </div>
            </section>

            {/* Appointment + Price */}
            <div className="flex min-h-0 flex-col gap-4">
              <article className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card)">
                <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Clock3 size={14} className="text-(--accent-primary)" />
                    <p className="text-[14px] font-bold text-(--text-primary)">
                      Your Appointment Time
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenSchedule}
                    className="text-[11px] font-semibold bg-(--accent-secondary) rounded-xs px-2 py-1 text-left text-white cursor-pointer" 
                  >
                    Change
                  </button>
                </div>

                <div className="space-y-3 p-3.5">
                  <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 xl:grid-cols-[120px_minmax(0,1fr)]">
                    <div className="overflow-hidden rounded-xl border border-(--border)">
                      <div className="bg-(--accent-primary) px-2 py-1.5 text-center text-[9px] font-bold tracking-wide text-white">
                        {monthLabel}
                      </div>
                      <div className="bg-(--bg-secondary) px-2 py-2.5 text-center">
                        <p className="text-[9px] font-semibold tracking-wide text-(--text-muted)">
                          {weekdayLabel}
                        </p>
                        <p className="mt-1 text-[34px] leading-none font-bold text-(--accent-primary)">
                          {dayNumber || "—"}
                        </p>
                        <p className="mt-1 text-[9px] font-semibold text-(--text-secondary)">
                          {shortDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col justify-center">
                      <div className="flex items-center gap-1.5">
                        <div className="min-w-0 flex-1 rounded-lg bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] px-2 py-2.5 text-center">
                          <p className="text-[8px] font-semibold tracking-wide text-(--text-muted)">
                            START TIME
                          </p>
                          <p className="mt-0.5 text-[15px] font-bold text-(--accent-primary)">
                            {startTime || "—"}
                          </p>
                          {dayDateLabel ? (
                            <p className="mt-0.5 text-[9px] text-(--text-muted)">
                              {dayDateLabel}
                            </p>
                          ) : null}
                        </div>
                        <ArrowRight
                          size={14}
                          className="shrink-0 text-(--text-muted)"
                        />
                        <div className="min-w-0 flex-1 rounded-lg border border-(--border) bg-(--bg-secondary) px-2 py-2.5 text-center">
                          <p className="text-[8px] font-semibold tracking-wide text-(--text-muted)">
                            END TIME
                          </p>
                          <p className="mt-0.5 text-[15px] font-bold text-(--brand-gold)">
                            {endTime || "—"}
                          </p>
                          {dayDateLabel ? (
                            <p className="mt-0.5 text-[9px] text-(--text-muted)">
                              {dayDateLabel}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[color-mix(in_srgb,var(--accent-primary)_10%,white)] px-2.5 py-2 text-[11px] font-semibold text-(--text-primary)">
                    <Clock3 size={12} className="text-(--accent-primary)" />
                    Total Duration: {totalDurationLabel}
                  </div>
                </div>
              </article>

              <article className="overflow-hidden rounded-2xl border border-(--border) bg-(--bg-card)">
                <div className="flex items-center gap-1.5 border-b border-(--border) px-4 py-3">
                  <Tag size={14} className="text-(--accent-primary)" />
                  <p className="text-[14px] font-bold text-(--text-primary)">
                    Price Summary
                  </p>
                </div>

                <div className="flex items-stretch gap-3 p-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="text-(--text-secondary)">
                        Package Price
                      </span>
                      <span className="font-bold text-(--text-primary)">
                        ${paidAmount}
                      </span>
                    </div>
                    {savedAmount > 0 && (
                      <div className="inline-flex items-center gap-1 rounded-md bg-[color-mix(in_srgb,var(--success)_14%,white)] px-2 py-1 text-[10px] font-semibold text-(--success)">
                        You Saved
                        <span>- ${savedAmount}</span>
                      </div>
                    )}
                  </div>

                  <div className="w-px self-stretch bg-(--border)" />

                  <div className="flex min-w-[110px] flex-col items-end justify-center gap-1">
                    <p className="text-[10px] font-semibold text-(--text-muted)">
                      Total Paid
                    </p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[24px] font-bold text-(--brand-gold)">
                        ${paidAmount}
                      </p>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-[color-mix(in_srgb,var(--success)_16%,white)] px-1.5 py-0.5 text-[9px] font-bold text-(--success)">
                        Paid
                        <Check size={9} strokeWidth={3} />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className="shrink-0 space-y-2.5">
            <button
              type="button"
              // onClick={() => router.push("/mybooking")}
              className="w-full rounded-xl bg-(--accent-primary) py-3.5 text-[14px] font-semibold text-white"
            >
              View My Bookings
            </button>
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="w-full rounded-xl border border-(--accent-primary) bg-(--bg-card) py-3.5 text-[14px] font-semibold text-(--accent-primary)"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {scheduleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onCloseSchedule}
          role="presentation"
        >
          <div
            className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-(--text-primary)">
                  Select Date &amp; Time
                </h3>
                <p className="mt-0.5 truncate text-[11px] text-(--text-muted)">
                  {packageName}
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseSchedule}
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
                times={times}
                activeDayId={activeDayId}
                activeTime={activeTime}
                onSelectDay={onSelectDay}
                onSelectTime={onSelectTime}
              />
            </div>
            <div className="border-t border-(--border) p-3.5">
              <button
                type="button"
                onClick={onCloseSchedule}
                className="primary-button h-11 w-full rounded-xl text-[14px] font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
