"use client";

import Image from "next/image";
import { useMemo } from "react";
import Swal from "sweetalert2";
import {
  ArrowRightIcon,
  Check,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import type { ExpertType } from "@/menu/components/ExpertSelection";
import {
  BookingOrganizationBanner,
  type BookingOrganizationBannerInfo,
} from "../BookingOrganizationBanner";
import { BookingSelectedServicesPanel } from "../BookingSelectedServicesPanel";
import {
  bookingSeats,
  areAllServiceSchedulesComplete,
  calcServicesTotal,
  getOrganizationStaff,
  getSelectedServices,
  getStaff,
  isServiceScheduleComplete,
} from "../../booking.data";
import type { ServiceSchedules } from "../../booking.types";
import { ServiceScheduleAccordion } from "./ServiceScheduleAccordion";
import SelectSeat from "./SelectSeat";
import "./SelectSeat/SelectSeat.css";

interface Step2StaffSelectionProps {
  selectedServiceIds: string[];
  organizationBanner?: BookingOrganizationBannerInfo;
  organizationId?: string;
  expertType: ExpertType;
  staffId: string;
  lockStaffSelection?: boolean;
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

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
} as const;

function showBookingWarning(title: string, text: string) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    ...swalDefaults,
  });
}

export function Step2StaffSelection({
  selectedServiceIds,
  organizationBanner,
  organizationId,
  expertType,
  staffId,
  lockStaffSelection = false,
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
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const { subtotal } = calcServicesTotal(selectedServiceIds, organizationId);
  const allScheduled = areAllServiceSchedulesComplete(
    serviceSchedules,
    selectedServiceIds,
  );

  const visibleStaff = useMemo(() => {
    if (lockStaffSelection) {
      return getOrganizationStaff(organizationId).filter(
        (therapist) => therapist.id === staffId,
      );
    }

    let therapists = getOrganizationStaff(organizationId);

    if (expertType === "male" || expertType === "female") {
      therapists = therapists.filter(
        (therapist) => therapist.gender === expertType,
      );
    }

    return therapists;
  }, [expertType, lockStaffSelection, organizationId, staffId]);

  const pendingServices = selectedServices.filter(
    (service) => !isServiceScheduleComplete(serviceSchedules[service.id]),
  );

  const handleContinue = async () => {
    if (!allScheduled) {
      const pendingNames = pendingServices.map((service) => service.name).join(", ");
      await showBookingWarning(
        "Schedule all services",
        pendingServices.length === 1
          ? `Please set a date and time for ${pendingNames}.`
          : `Please set a date and time for: ${pendingNames}.`,
      );
      return;
    }

    if (!seatConfirmed) {
      await showBookingWarning(
        "Confirm your seat",
        "Please select a seat and tap Confirm before continuing.",
      );
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-4">
      <BookingOrganizationBanner
        organization={organizationBanner}
        serviceLabels={selectedServices.map((service) => service.name)}
      />
      <BookingSelectedServicesPanel
        selectedServiceIds={selectedServiceIds}
        organization={organizationBanner}
        organizationId={organizationId}
        onRemoveService={onRemoveService}
        showOrganizationBanner={false}
      />

      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--accent-primary)/10">
              <Star size={11} className="text-(--accent-primary)" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-(--text-primary)">
                {lockStaffSelection ? "Selected Therapist" : "Select Your Therapist"}
              </h3>
              <p className="text-[8px] font-semibold text-(--brand-gold)">
                {lockStaffSelection
                  ? staff.name
                  : expertType
                    ? expertLabel[expertType]
                    : organizationId
                      ? "Organization Experts"
                      : "All Experts"}
              </p>
            </div>
          </div>

          {/* {!lockStaffSelection && (
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
          )} */}
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {visibleStaff.map((therapist) => {
            const active = therapist.id === staffId;

            return (
              <button
                key={therapist.id}
                type="button"
                onClick={() => {
                  if (!lockStaffSelection) onSelectStaff(therapist.id);
                }}
                disabled={lockStaffSelection}
                className={`
                  feature-card w-[96px] shrink-0 rounded-xl p-1.5 text-left
                  transition-all duration-200
                  ${
                    lockStaffSelection
                      ? "cursor-default"
                      : ""
                  }
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

      {/* <SeatSelectionSection
        seats={bookingSeats}
        selectedSeatId={selectedSeatId}
        seatConfirmed={seatConfirmed}
        onSelectSeat={onSelectSeat}
        onConfirmSeat={onConfirmSeat}
      /> */}
      <SelectSeat
        seats={bookingSeats}
        selectedSeatId={selectedSeatId}
        seatConfirmed={seatConfirmed}
        onSelectSeat={onSelectSeat}
        onConfirmSeat={onConfirmSeat}
      />
        

      {/* <section className="feature-card flex items-center gap-2 rounded-xl p-3">
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
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="
            primary-button flex shrink-0 items-center gap-1.5 rounded-xl
            px-5 py-3 text-[11px] font-semibold text-white
          "
        >
          Continue
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </section> */}

      <section className="feature-card grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-[14px] p-2.5 sm:p-3">
        <div className="min-w-0">
          <p className="m-0 text-[10px] font-semibold leading-tight text-(--text-primary)">
            {selectedServices.length} service
            {selectedServices.length !== 1 ? "s" : ""} selected
          </p>
          <p className="m-0 text-[9px] font-normal leading-tight text-(--text-muted)">
            with {staff.name}
          </p>
        </div>

        <p className="m-0 text-xl font-bold leading-none tracking-tight text-(--accent-primary)">
          ${subtotal}
        </p>

        <button
          type="button"
          onClick={handleContinue}
          className="
            primary-button inline-flex shrink-0 items-center justify-center gap-1.5
            rounded-xl px-3.5 py-2.5 text-[11px] font-semibold text-white
            whitespace-nowrap transition-opacity duration-200 hover:opacity-90
          "
        >
          Continue
          <ArrowRightIcon size={14} />
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
