"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Armchair,
  CalendarDays,
  Check,
  Clock3,
  Pencil,
  Star,
  X,
} from "lucide-react";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import {
  bookingDays,
  bookingSeats,
  bookingStaff,
  getBookingDay,
  getBookingSeat,
  getStaff,
  timeSlots,
} from "../../booking.data";
import { BookingSelectedServicesPanel } from "../BookingSelectedServicesPanel";
import { SeatSelectionSection } from "./SeatSelectionSection";
import { Step2DateTimeSection } from "./Step2DateTimeSection";

interface OrganizationBannerInfo {
  name: string;
  banner: string;
  availability: string;
  status: string;
}

interface Step3DateTimeSelectionProps {
  selectedServiceIds: string[];
  organizationBanner?: OrganizationBannerInfo;
  expertType: ExpertType;
  staffId: string;
  selectedDayId: string;
  selectedTime: string;
  selectedSeatId: string;
  seatConfirmed: boolean;
  onSelectDay: (dayId: string) => void;
  onSelectTime: (time: string) => void;
  onSelectStaff: (id: string) => void;
  onSelectSeat: (id: string) => void;
  onConfirmSeat: () => void;
  onRemoveService: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const expertLabel: Record<"male" | "female", string> = {
  male: "Male Expert",
  female: "Female Expert",
};

function BookingModal({
  title,
  titleId,
  onClose,
  children,
  onDone,
}: {
  title: string;
  titleId: string;
  onClose: () => void;
  children: ReactNode;
  onDone?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="
          max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-2xl
          bg-(--bg-primary) p-3 shadow-(--shadow-glow) scrollbar-none
        "
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3
            id={titleId}
            className="text-sm font-bold text-(--text-primary)"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex h-7 w-7 items-center justify-center rounded-full
              border border-(--border) text-(--text-muted)
              transition-colors hover:text-(--text-primary)
            "
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {children}

        <button
          type="button"
          onClick={onDone ?? onClose}
          className="primary-button mt-3 w-full rounded-xl py-2.5 text-[11px] font-semibold text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export function Step3DateTimeSelection({
  selectedServiceIds,
  organizationBanner,
  expertType,
  staffId,
  selectedDayId,
  selectedTime,
  selectedSeatId,
  seatConfirmed,
  onSelectDay,
  onSelectTime,
  onSelectStaff,
  onSelectSeat,
  onConfirmSeat,
  onRemoveService,
  onBack,
}: Step3DateTimeSelectionProps) {
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showTherapistModal, setShowTherapistModal] = useState(false);

  const staff = getStaff(staffId);
  const selectedDay = getBookingDay(selectedDayId);
  const selectedSeat = getBookingSeat(selectedSeatId);

  const visibleStaff = useMemo(() => {
    if (expertType === "male" || expertType === "female") {
      return bookingStaff.filter((therapist) => therapist.gender === expertType);
    }
    return bookingStaff;
  }, [expertType]);

  return (
    <div className="space-y-4">
      <BookingSelectedServicesPanel
        selectedServiceIds={selectedServiceIds}
        organization={organizationBanner}
        onRemoveService={onRemoveService}
      />

      <section className="grid grid-cols-2 gap-2">
        <div className="min-w-0">
          <h2 className="mb-2 text-sm font-bold text-(--text-primary)">
            Selected Therapist
          </h2>
          <article className="feature-card rounded-xl">
            <div className="flex h-full flex-col">
              <div className="relative h-27 w-full shrink-0 overflow-hidden rounded-t-sm">
                <Image
                  src={staff.image}
                  alt={staff.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col px-2 pt-2">
                <p className="truncate text-[11px] font-bold text-(--text-primary)">
                  {staff.name}
                </p>
                <div className="mt-1 flex flex-col gap-0.5 text-[8px] font-bold text-(--text-primary)">
                  <div className="flex items-center gap-0.5">
                    <Star
                      size={10}
                      className="fill-(--brand-gold) text-(--brand-gold)"
                    />
                    <span>{staff.rating}</span>
                  </div>
                  <span className="truncate">• {staff.experience}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTherapistModal(true)}
                  className="mt-auto flex items-center justify-center gap-0.5 pb-2 pt-3 text-[8px] font-bold text-(--accent-secondary)"
                >
                  <Pencil size={10} /> Change Therapist
                </button>
              </div>
            </div>
          </article>
        </div>

        <div className="min-w-0 space-y-2">
          <h2 className="text-sm font-bold text-(--text-primary)">
            Schedule &amp; Seat
          </h2>

          <article className="feature-card rounded-xl px-2 pt-2">
            <div className="space-y-2 pb-1">
              <div className="flex items-start gap-1.5">
                <CalendarDays
                  size={12}
                  className="mt-0.5 shrink-0 text-(--accent-primary)"
                />
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold text-(--text-muted)">
                    Date
                  </p>
                  <p className="text-[10px] font-bold text-(--text-primary)">
                    {selectedDay.weekday}, {selectedDay.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Clock3
                  size={12}
                  className="mt-0.5 shrink-0 text-(--accent-primary)"
                />
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold text-(--text-muted)">
                    Time
                  </p>
                  <p className="text-[10px] font-bold text-(--text-primary)">
                    {selectedTime}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDateTimeModal(true)}
              className="flex w-full items-center justify-center gap-0.5 border-t border-(--border) py-2 text-[8px] font-bold text-(--accent-secondary)"
            >
              <Pencil size={10} /> Change Date &amp; Time
            </button>
          </article>

          <article className="feature-card rounded-xl px-2 pt-2">
            <div className="flex items-start gap-1.5 pb-1">
              <Armchair
                size={12}
                className="mt-0.5 shrink-0 text-(--accent-primary)"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-semibold text-(--text-muted)">
                  Selected Seat
                </p>
                <p className="text-[10px] font-bold text-(--text-primary)">
                  {selectedSeat.label}
                </p>
                <p
                  className={`mt-0.5 text-[8px] font-semibold ${
                    seatConfirmed ? "text-(--success)" : "text-(--text-muted)"
                  }`}
                >
                  {seatConfirmed ? "Seat confirmed" : "Not confirmed yet"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSeatModal(true)}
              className="flex w-full items-center justify-center gap-0.5 border-t border-(--border) py-2 text-[8px] font-bold text-(--accent-secondary)"
            >
              <Pencil size={10} /> Change Seat
            </button>
          </article>
        </div>
      </section>

      {showDateTimeModal && (
        <BookingModal
          title="Change Date & Time"
          titleId="datetime-modal-title"
          onClose={() => setShowDateTimeModal(false)}
        >
          <Step2DateTimeSection
            days={bookingDays}
            times={timeSlots}
            activeDayId={selectedDayId}
            activeTime={selectedTime}
            onSelectDay={onSelectDay}
            onSelectTime={onSelectTime}
          />
        </BookingModal>
      )}

      {showSeatModal && (
        <BookingModal
          title="Change Seat"
          titleId="seat-modal-title"
          onClose={() => setShowSeatModal(false)}
        >
          <SeatSelectionSection
            seats={bookingSeats}
            selectedSeatId={selectedSeatId}
            seatConfirmed={seatConfirmed}
            onSelectSeat={onSelectSeat}
            onConfirmSeat={onConfirmSeat}
          />
        </BookingModal>
      )}

      {showTherapistModal && (
        <BookingModal
          title="Change Therapist"
          titleId="therapist-modal-title"
          onClose={() => setShowTherapistModal(false)}
        >
          <p className="mb-2 text-[9px] font-semibold text-(--text-muted)">
            {expertType ? expertLabel[expertType] : "All available therapists"}
          </p>
          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
            {visibleStaff.map((therapist) => {
              const active = therapist.id === staffId;

              return (
                <button
                  key={therapist.id}
                  type="button"
                  onClick={() => onSelectStaff(therapist.id)}
                  className={`
                    feature-card w-[96px] shrink-0 rounded-xl p-1.5 text-left
                    transition-all duration-200
                    ${
                      active
                        ? "border-(--accent-primary) shadow-(--shadow-glow)"
                        : "hover:border-[color-mix(in_srgb,var(--accent-primary)_30%,var(--border))]"
                    }
                  `}
                >
                  <div className="relative h-[78px] overflow-hidden rounded-sm">
                    <Image
                      src={therapist.image}
                      alt={therapist.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    {active && (
                      <span className="primary-button absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full border-3 border-white text-white">
                        <Check size={10} strokeWidth={2.5} />
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 truncate text-[11px] font-bold text-(--text-primary)">
                    {therapist.name}
                  </p>

                  <div className="mt-0.5 flex items-center gap-0.5">
                    <Star
                      size={9}
                      className="fill-(--brand-gold) text-(--brand-gold)"
                    />
                    <span className="text-[9px] font-bold text-(--text-primary)">
                      {therapist.rating}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-[8px] font-semibold text-(--text-muted)">
                    {therapist.experience}
                  </p>
                </button>
              );
            })}
          </div>
        </BookingModal>
      )}

      <button
        type="button"
        onClick={onBack}
        className="secondary-button w-full rounded-xl py-2 text-[9px] font-medium"
      >
        BACK
      </button>
    </div>
  );
}
