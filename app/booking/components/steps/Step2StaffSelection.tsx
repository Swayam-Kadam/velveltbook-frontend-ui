"use client";

import Image from "next/image";
import { useMemo } from "react";
import {
  ArrowRight,
  Check,
  SlidersHorizontal,
  Star,
} from "lucide-react";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import { BookingSelectedServicesPanel } from "../BookingSelectedServicesPanel";
import {
  bookingSeats,
  bookingStaff,
  areAllServiceSchedulesComplete,
  calcServicesTotal,
  formatServiceSchedule,
  getSelectedServices,
  getStaff,
  isServiceScheduleComplete,
} from "../../booking.data";
import type { ServiceSchedules } from "../../booking.types";
import { SeatSelectionSection } from "./SeatSelectionSection";
import { ServiceScheduleAccordion } from "./ServiceScheduleAccordion";

interface OrganizationBannerInfo {
  name: string;
  banner: string;
  availability: string;
  status: string;
}

interface Step2StaffSelectionProps {
  selectedServiceIds: string[];
  organizationBanner?: OrganizationBannerInfo;
  expertType: ExpertType;
  staffId: string;
  serviceSchedules: ServiceSchedules;
  selectedSeatId: string;
  seatConfirmed: boolean;
  onSelectStaff: (id: string) => void;
  onSelectServiceDay: (serviceId: string, dayId: string) => void;
  onSelectServiceTime: (serviceId: string, time: string) => void;
  onSelectSeat: (id: string) => void;
  onConfirmSeat: () => void;
  onRemoveService?: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  onEditService: () => void;
}

const expertLabel: Record<"male" | "female", string> = {
  male: "Male Expert",
  female: "Female Expert",
};

export function Step2StaffSelection({
  selectedServiceIds,
  organizationBanner,
  expertType,
  staffId,
  serviceSchedules,
  selectedSeatId,
  seatConfirmed,
  onSelectStaff,
  onSelectServiceDay,
  onSelectServiceTime,
  onSelectSeat,
  onConfirmSeat,
  onRemoveService,
  onBack,
  onNext,
}: Step2StaffSelectionProps) {
  const staff = getStaff(staffId);
  const selectedServices = getSelectedServices(selectedServiceIds);
  const { subtotal } = calcServicesTotal(selectedServiceIds);
  const allScheduled = areAllServiceSchedulesComplete(
    serviceSchedules,
    selectedServiceIds,
  );

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
                {expertType ? expertLabel[expertType] : "All Experts"}
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
                    <span className="border-3 border-white primary-button absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-white">
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

      <ServiceScheduleAccordion
        selectedServiceIds={selectedServiceIds}
        schedules={serviceSchedules}
        onSelectDay={onSelectServiceDay}
        onSelectTime={onSelectServiceTime}
      />

      <SeatSelectionSection
        seats={bookingSeats}
        selectedSeatId={selectedSeatId}
        seatConfirmed={seatConfirmed}
        onSelectSeat={onSelectSeat}
        onConfirmSeat={onConfirmSeat}
      />

      <section className="feature-card flex items-center gap-2 rounded-xl p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold text-(--text-primary)">
            {selectedServices.length} service
            {selectedServices.length !== 1 ? "s" : ""} selected
          </p>
          <p className="truncate text-[8px] font-semibold text-(--text-muted)">
            with {staff.name}
          </p>
          <div className="mt-1 space-y-0.5">
            <span className="text-sm font-bold text-(--accent-primary)">
              ${subtotal}
            </span>
            {/* {selectedServices.map((service) => {
              const schedule = serviceSchedules[service.id];
              const scheduled = isServiceScheduleComplete(schedule);

              return (
                <p
                  key={service.id}
                  className="truncate text-[8px] font-semibold text-(--text-secondary)"
                >
                  • {service.name} —{" "}
                  {scheduled
                    ? formatServiceSchedule(schedule)
                    : "not scheduled yet"}
                </p>
              );
            })} */}
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!seatConfirmed || !allScheduled}
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
