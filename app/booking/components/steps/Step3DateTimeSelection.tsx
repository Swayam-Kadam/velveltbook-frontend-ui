"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Pencil,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";

import {
  bookingDays,
  bookingLocation,
  bookingSeats,
  calcServicesTotal,
  getBookingDay,
  getSelectedServices,
  getStaff,
  timeSlots,
} from "../../booking.data";
import { SeatSelectionSection } from "./SeatSelectionSection";
import { Step2DateTimeSection } from "./Step2DateTimeSection";

interface Step3DateTimeSelectionProps {
  selectedServiceIds: string[];
  staffId: string;
  selectedDayId: string;
  selectedTime: string;
  selectedSeatId: string;
  seatConfirmed: boolean;
  onSelectDay: (dayId: string) => void;
  onSelectTime: (time: string) => void;
  onSelectSeat: (id: string) => void;
  onConfirmSeat: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3DateTimeSelection({
  selectedServiceIds,
  staffId,
  selectedDayId,
  selectedTime,
  selectedSeatId,
  seatConfirmed,
  onSelectDay,
  onSelectTime,
  onSelectSeat,
  onConfirmSeat,
  onBack,
}: Step3DateTimeSelectionProps) {
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);

  const selectedServices = getSelectedServices(selectedServiceIds);
  const { subtotal } = calcServicesTotal(selectedServiceIds);
  const staff = getStaff(staffId);
  const selectedDay = getBookingDay(selectedDayId);
  const hasSelection = selectedServices.length > 0;

  return (
    <div className="space-y-4">
      <section className="feature-card overflow-hidden rounded-xl">
        <div className="relative h-[130px] w-full">
          <Image
            src={bookingLocation.banner}
            alt={bookingLocation.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />

          <div className="absolute right-2 top-2">
            <div className="primary-button rounded-full px-3 py-1 text-[8px] font-medium text-white">
              {bookingLocation.availability}
            </div>
          </div>

          <div className="absolute bottom-2 left-2.5 right-2.5">
            <p className="truncate text-[14px] font-bold text-white">
              {bookingLocation.name}
            </p>
            <p className="text-[9px] font-semibold text-(--success)">
              {bookingLocation.status}
            </p>
          </div>
        </div>
      </section>

      <section className="feature-card overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-(--border) px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="primary-button flex h-7 w-7 items-center justify-center rounded-full">
              <ShoppingBag size={13} strokeWidth={2} className="text-white" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-(--text-primary)">
                Selected Services
              </p>
              <p className="text-[8px] font-semibold text-(--text-muted)">
                {hasSelection
                  ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} added`
                  : "No services selected"}
              </p>
            </div>
          </div>
          {hasSelection && (
            <p className="text-[12px] font-bold text-(--brand-gold)">
              ${subtotal}
            </p>
          )}
        </div>

        {hasSelection ? (
          <div className="grid grid-cols-4 gap-2 p-3">
            {selectedServices.map((service) => (
              <article
                key={service.id}
                className="
                  overflow-hidden rounded-sm border border-(--border)
                  bg-[color-mix(in_srgb,var(--accent-primary)_4%,transparent)]
                "
              >
                <div className="relative h-14 w-full">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-0.5 p-1.5">
                  <p className="line-clamp-2 min-h-6 text-[7px] font-bold leading-tight text-(--text-primary)">
                    {service.name}
                  </p>
                  <div className="flex items-center gap-0.5 text-[6px] font-semibold text-(--text-secondary)">
                    <Clock3 size={6} />
                    <span className="truncate">{service.duration}</span>
                  </div>
                  <p className="text-[8px] font-bold text-(--brand-gold)">
                    {service.priceLabel}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-3 py-4 text-center text-[9px] font-medium text-(--text-muted)">
            No services selected yet
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-2">
        <div className="min-w-0">
          <h2 className="mb-2 text-sm font-bold text-(--text-primary)">
            Selected Therapist
          </h2>
          <article className="feature-card h-40 rounded-xl">
            <div className="flex h-full flex-col">
              <div className="relative h-16 w-full shrink-0 overflow-hidden rounded-t-sm">
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
                  onClick={onBack}
                  className="mt-auto flex items-center justify-center gap-0.5 pb-2 pt-3 text-[8px] font-bold text-(--accent-secondary)"
                >
                  <Pencil size={10} /> Change
                </button>
              </div>
            </div>
          </article>
        </div>

        <div className="min-w-0">
          <h2 className="mb-2 text-sm font-bold text-(--text-primary)">
            Date &amp; Time
          </h2>
          <article className="feature-card flex h-40 flex-col rounded-xl px-2 pt-2">
            <div className="flex flex-1 flex-col gap-2">
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
              className="mt-auto flex items-center justify-center gap-0.5 pb-2 pt-3 text-[8px] font-bold text-(--accent-secondary)"
            >
              <Pencil size={10} /> Change Date &amp; Time
            </button>
          </article>
        </div>
      </section>

      <SeatSelectionSection
        seats={bookingSeats}
        selectedSeatId={selectedSeatId}
        seatConfirmed={seatConfirmed}
        onSelectSeat={onSelectSeat}
        onConfirmSeat={onConfirmSeat}
      />

      {showDateTimeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2"
          onClick={() => setShowDateTimeModal(false)}
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
            aria-labelledby="datetime-modal-title"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3
                id="datetime-modal-title"
                className="text-sm font-bold text-(--text-primary)"
              >
                Change Date &amp; Time
              </h3>
              <button
                type="button"
                onClick={() => setShowDateTimeModal(false)}
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

            <Step2DateTimeSection
              days={bookingDays}
              times={timeSlots}
              activeDayId={selectedDayId}
              activeTime={selectedTime}
              onSelectDay={onSelectDay}
              onSelectTime={onSelectTime}
            />

            <button
              type="button"
              onClick={() => setShowDateTimeModal(false)}
              className="primary-button mt-3 w-full rounded-xl py-2.5 text-[11px] font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
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
