"use client";

import Image from "next/image";
import {
  Activity,
  ArrowRight,
  Check,
  Clock3,
  Pencil,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

import {
  bookingDays,
  bookingSeats,
  bookingStaff,
  getBookingDay,
  getService,
  getStaff,
  timeSlots,
} from "../../booking.data";
import { SeatSelectionSection } from "./SeatSelectionSection";
import { Step2DateTimeSection } from "./Step2DateTimeSection";

interface Step2StaffSelectionProps {
  serviceId: string;
  staffId: string;
  selectedDayId: string;
  selectedTime: string;
  selectedSeatId: string;
  seatConfirmed: boolean;
  onSelectStaff: (id: string) => void;
  onSelectDay: (id: string) => void;
  onSelectTime: (time: string) => void;
  onSelectSeat: (id: string) => void;
  onConfirmSeat: () => void;
  onBack: () => void;
  onNext: () => void;
  onEditService: () => void;
}

const serviceHighlights = [
  { icon: Clock3, label: "60 Minutes" },
  { icon: Sparkles, label: "Relaxation & Stress Relief" },
  { icon: Activity, label: "Full Body Therapy" },
];

export function Step2StaffSelection({
  serviceId,
  staffId,
  selectedDayId,
  selectedTime,
  selectedSeatId,
  seatConfirmed,
  onSelectStaff,
  onSelectDay,
  onSelectTime,
  onSelectSeat,
  onConfirmSeat,
  onNext,
  onEditService,
}: Step2StaffSelectionProps) {
  const service = getService(serviceId);
  const staff = getStaff(staffId);
  const selectedDay = getBookingDay(selectedDayId);

  return (
    <div className="space-y-4">
      {/* Selected Service Header */}
      <section
        className="
          relative overflow-hidden rounded-2xl
          bg-linear-to-r from-[#efe4fb] via-[#f1e7fc] to-[#e9dcfb]
          shadow-[0_8px_28px_rgba(61,28,77,0.12)]
        "
      >
        <div className="flex">
          <div className="relative w-[34%] shrink-0 overflow-hidden">
            <Image
              src={service.image}
              alt={service.name}
              fill
              sizes="130px"
              className="object-cover"
            />
          </div>

          <div className="relative flex-1 p-3">
            <span
              className="
                inline-flex rounded-full bg-(--accent-primary)/10
                px-2 py-0.5 text-[7px] font-semibold text-(--accent-primary)
              "
            >
              Selected Service
            </span>

            <div className="mt-1.5 flex items-start justify-between gap-2">
              <h2 className="text-base font-bold leading-tight text-(--accent-primary)">
                {service.name}
              </h2>
              <span className="shrink-0 text-lg font-bold text-(--accent-primary)">
                {service.priceLabel}
              </span>
            </div>

            <ul className="mt-2 space-y-1">
              {serviceHighlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 text-[8px] text-(--accent-primary)"
                >
                  <Icon
                    size={10}
                    strokeWidth={2}
                    className="shrink-0 text-(--accent-primary)"
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                className="
                  flex items-center gap-1 rounded-full border border-(--accent-primary)/30
                  bg-white/60 px-2 py-0.5 text-[7px] font-semibold text-(--accent-primary)
                  transition-colors hover:bg-white
                "
                onClick={() => onEditService()}
              >
                <Pencil size={8} strokeWidth={2} />
                Change Service
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Select Your Therapist */}
      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--accent-primary)/10">
              <Star size={11} className="text-(--accent-primary)" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-(--text-primary)">
                Select Your Therapist
              </h3>
              <p className="text-[8px] font-semibold text-(--brand-gold)">
                Male Expert
              </p>
            </div>
          </div>

          <button
            type="button"
            className="
              flex items-center gap-1 rounded-lg border border-(--border)
              bg-(--bg-card) px-2 py-1 text-[8px] font-semibold text-(--text-primary)
            "
          >
            <SlidersHorizontal size={10} />
            Filter
          </button>
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {bookingStaff.map((therapist) => {
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
                    <span className="border-3 border-white  primary-button absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-white">
                      <Check size={10} strokeWidth={2.5} />
                    </span>
                  )}
                </div>

                <p className="mt-1.5 truncate text-[13px] font-bold text-(--text-primary)">
                  {therapist.name}
                </p>

                <div className="mt-0.5 flex items-center gap-0.5">
                  <Star
                    size={9}
                    className="fill-(--brand-gold) text-(--brand-gold)"
                  />
                  <span className="text-[10px] font-bold text-(--text-primary)">
                    {therapist.rating}
                  </span>
                  <span className="text-[10px] text-(--text-muted)">
                    ({therapist.reviews})
                  </span>
                </div>

                <p className="mt-0.5 text-[10px] font-semibold text-(--text-muted)">
                  {therapist.experience}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <Step2DateTimeSection
        days={bookingDays}
        times={timeSlots}
        activeDayId={selectedDayId}
        activeTime={selectedTime}
        onSelectDay={onSelectDay}
        onSelectTime={onSelectTime}
      />

      <SeatSelectionSection
        seats={bookingSeats}
        selectedSeatId={selectedSeatId}
        seatConfirmed={seatConfirmed}
        onSelectSeat={onSelectSeat}
        onConfirmSeat={onConfirmSeat}
      />

      {/* Summary + Continue footer */}
      <section className="feature-card flex items-center gap-2 rounded-xl p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold text-(--text-primary)">
            {service.name}
          </p>
          <p className="truncate text-[8px] font-semibold text-(--text-muted)">
            with {staff.name}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-bold text-(--accent-primary)">
              {service.priceLabel}
            </span>
            <span className="flex items-center gap-0.5 text-[8px] font-semibold text-(--text-secondary)">
              <Clock3 size={9} />
              {service.duration}
            </span>
          </div>
          <p className="mt-0.5 text-[8px] font-semibold text-(--text-secondary)">
            {selectedDay.date}, {selectedTime}
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!seatConfirmed}
          className="
            primary-button flex shrink-0 items-center gap-1.5 rounded-xl
            px-5 py-3 text-[11px] font-semibold text-white
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          Continue
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </section>
    </div>
  );
}
