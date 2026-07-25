"use client";

import Swal from "sweetalert2";
import { ArrowRightIcon } from "lucide-react";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import {
  BookingOrganizationBanner,
  type BookingOrganizationBannerInfo,
} from "../BookingOrganizationBanner";
import { BookingSelectedServicesPanel } from "../BookingSelectedServicesPanel";
import {
  bookingSeats,
  areAllServiceSchedulesComplete,
  areAllServiceStaffAssigned,
  calcServicesTotal,
  getSelectedServices,
  getStaff,
  isServiceScheduleComplete,
  isServiceStaffAssigned,
} from "../../booking.data";
import type {
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../../booking.types";
import { ServiceScheduleAccordion } from "./ServiceScheduleAccordion";
import { ServiceStaffAccordion } from "./ServiceStaffAccordion";
import SelectSeat from "./SelectSeat";
import "./SelectSeat/SelectSeat.css";

interface Step2StaffSelectionProps {
  selectedServiceIds: string[];
  organizationBanner?: BookingOrganizationBannerInfo;
  organizationId?: string;
  expertType: ExpertType;
  serviceStaff: ServiceStaffAssignments;
  lockStaffSelection?: boolean;
  serviceSchedules: ServiceSchedules;
  selectedSeatId: string;
  seatConfirmed: boolean;
  onSelectServiceStaff: (serviceId: string, staffId: string) => void;
  onSelectServiceDay: (serviceId: string, dayId: string) => void;
  onSelectServiceTime: (serviceId: string, time: string) => void;
  onSelectSeat: (id: string) => void;
  onConfirmSeat: () => void;
  onRemoveService?: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  onEditService: () => void;
}

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
  allowOutsideClick: false,
  allowEscapeKey: false,
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
  serviceStaff,
  lockStaffSelection = false,
  serviceSchedules,
  selectedSeatId,
  seatConfirmed,
  onSelectServiceStaff,
  onSelectServiceDay,
  onSelectServiceTime,
  onSelectSeat,
  onConfirmSeat,
  onRemoveService,
  onBack,
  onNext,
  onEditService,
}: Step2StaffSelectionProps) {
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const { subtotal } = calcServicesTotal(selectedServiceIds, organizationId);
  const allStaffAssigned = areAllServiceStaffAssigned(
    serviceStaff,
    selectedServiceIds,
  );
  const allScheduled = areAllServiceSchedulesComplete(
    serviceSchedules,
    selectedServiceIds,
  );

  const pendingStaffServices = selectedServices.filter(
    (service) => !isServiceStaffAssigned(serviceStaff, service.id),
  );
  const pendingScheduleServices = selectedServices.filter(
    (service) => !isServiceScheduleComplete(serviceSchedules[service.id]),
  );

  const assignedStaffNames = Array.from(
    new Set(
      selectedServiceIds
        .map((id) => serviceStaff[id])
        .filter(Boolean)
        .map((id) => getStaff(id).name),
    ),
  );
  const staffSummary =
    assignedStaffNames.length === 0
      ? "no therapist yet"
      : assignedStaffNames.length === 1
        ? assignedStaffNames[0]
        : `${assignedStaffNames.length} therapists`;

  const handleRemoveService = async (serviceId: string) => {
    if (!onRemoveService) return;

    const remainingCount = selectedServiceIds.filter(
      (id) => id !== serviceId,
    ).length;

    onRemoveService(serviceId);

    if (remainingCount === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Please select a service",
        text: "You need at least one service to continue booking.",
        ...swalDefaults,
      });
      onEditService();
    }
  };

  const handleContinue = async () => {
    if (!allStaffAssigned) {
      const pendingNames = pendingStaffServices
        .map((service) => service.name)
        .join(", ");
      await showBookingWarning(
        "Select a therapist",
        pendingStaffServices.length === 1
          ? `Please choose a therapist for ${pendingNames}.`
          : `Please choose a therapist for: ${pendingNames}.`,
      );
      return;
    }

    if (!allScheduled) {
      const pendingNames = pendingScheduleServices
        .map((service) => service.name)
        .join(", ");
      await showBookingWarning(
        "Schedule all services",
        pendingScheduleServices.length === 1
          ? `Please set a date and time for ${pendingNames}.`
          : `Please set a date and time for: ${pendingNames}.`,
      );
      return;
    }

    if (!seatConfirmed) {
      await showBookingWarning(
        "Confirm your seat",
        "Please select a seat before continuing.",
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
        onRemoveService={onRemoveService ? handleRemoveService : undefined}
        showOrganizationBanner={false}
      />

      <ServiceStaffAccordion
        selectedServiceIds={selectedServiceIds}
        organizationId={organizationId}
        expertType={expertType}
        assignments={serviceStaff}
        lockStaffSelection={lockStaffSelection}
        onSelectStaff={onSelectServiceStaff}
        onRemoveService={
          onRemoveService ? handleRemoveService : () => undefined
        }
      />

      <ServiceScheduleAccordion
        selectedServiceIds={selectedServiceIds}
        schedules={serviceSchedules}
        onSelectDay={onSelectServiceDay}
        onSelectTime={onSelectServiceTime}
        onRemoveService={
          onRemoveService ? handleRemoveService : () => undefined
        }
      />

      <SelectSeat
        seats={bookingSeats}
        selectedSeatId={selectedSeatId}
        seatConfirmed={seatConfirmed}
        onSelectSeat={onSelectSeat}
        onConfirmSeat={onConfirmSeat}
      />

      <section className="feature-card grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-[14px] p-2.5 sm:p-3">
        <div className="min-w-0">
          <p className="m-0 text-[10px] font-semibold leading-tight text-(--text-primary)">
            {selectedServices.length} service
            {selectedServices.length !== 1 ? "s" : ""} selected
          </p>
          <p className="m-0 text-[9px] font-normal leading-tight text-(--text-muted)">
            with {staffSummary}
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
