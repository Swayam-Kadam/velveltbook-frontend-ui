"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Armchair,
  CalendarDays,
  Clock3,
  Pencil,
  X,
} from "lucide-react";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import {
  BookingOrganizationBanner,
  type BookingOrganizationBannerInfo,
} from "../BookingOrganizationBanner";
import {
  bookingSeats,
  getBookingDay,
  getBookingSeat,
  getPrimaryStaffId,
  getSelectedServices,
  getStaff,
  isServiceScheduleComplete,
} from "../../booking.data";
import type {
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../../booking.types";
import { BookingSelectedServicesPanel } from "../BookingSelectedServicesPanel";
import { ServiceScheduleAccordion } from "./ServiceScheduleAccordion";
import { ServiceStaffAccordion } from "./ServiceStaffAccordion";
import SelectSeat from "./SelectSeat";
import Swal from "sweetalert2";

interface Step3DateTimeSelectionProps {
  selectedServiceIds: string[];
  organizationBanner?: BookingOrganizationBannerInfo;
  organizationId?: string;
  expertType: ExpertType;
  serviceStaff: ServiceStaffAssignments;
  serviceSchedules: ServiceSchedules;
  selectedSeatId: string;
  seatConfirmed: boolean;
  onSelectServiceDay: (serviceId: string, dayId: string) => void;
  onSelectServiceTime: (serviceId: string, time: string) => void;
  onSelectServiceStaff: (serviceId: string, staffId: string) => void;
  onSelectSeat: (id: string) => void;
  onConfirmSeat: () => void;
  onRemoveService: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  onEditService: () => void;
}

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
  organizationId,
  expertType,
  serviceStaff,
  serviceSchedules,
  selectedSeatId,
  seatConfirmed,
  onSelectServiceDay,
  onSelectServiceTime,
  onSelectServiceStaff,
  onSelectSeat,
  onConfirmSeat,
  onRemoveService,
  onBack,
  onEditService,
}: Step3DateTimeSelectionProps) {
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showTherapistModal, setShowTherapistModal] = useState(false);

  const primaryStaffId = getPrimaryStaffId(serviceStaff, selectedServiceIds);
  const staff = getStaff(primaryStaffId);
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const selectedSeat = getBookingSeat(selectedSeatId);
  const swalDefaults = {
    confirmButtonText: "Okay",
    confirmButtonColor: "#b8860b",
    background: "#1a1a1a",
    color: "#ffffff",
    allowOutsideClick: false,
    allowEscapeKey: false,
  } as const;

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

  return (
    <div className="space-y-4">
      <BookingOrganizationBanner
        organization={organizationBanner}
        serviceLabels={selectedServices.map((service) => service.name)}
      />
      <BookingSelectedServicesPanel
        selectedServiceIds={selectedServiceIds}
        organization={organizationBanner}
        onRemoveService={onRemoveService}
        showOrganizationBanner={false}
      />

      <section className="grid grid-cols-2 gap-2">
        <div className="min-w-0">
          <h2 className="mb-2 text-sm font-bold text-(--text-primary)">
            Selected Therapists
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
                <div className="min-h-16 space-y-1.5">
                  {selectedServices.map((service) => {
                    const assignedId = serviceStaff[service.id];
                    const assigned = assignedId
                      ? getStaff(assignedId)
                      : null;

                    return (
                      <div key={service.id} className="min-w-0">
                        <p className="truncate text-[8px] font-semibold text-(--text-muted)">
                          {service.name}
                        </p>
                        <p className="truncate text-[9px] font-bold text-(--text-primary)">
                          {assigned?.name ?? "Not selected"}
                        </p>
                      </div>
                    );
                  })}
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
            <div className="space-y-2 pb-1 min-h-16">
              {selectedServices.map((service) => {
                const schedule = serviceSchedules[service.id];
                const scheduled = isServiceScheduleComplete(schedule);

                return (
                  <div key={service.id} className="min-w-0">
                    <p className="truncate text-[8px] font-semibold text-(--text-muted)">
                      {service.name}
                    </p>
                    {scheduled ? (
                      <div className="mt-0.5 space-y-0.5">
                        <div className="flex items-start gap-1.5">
                          <CalendarDays
                            size={10}
                            className="mt-0.5 shrink-0 text-(--accent-primary)"
                          />
                          <p className="text-[9px] font-bold text-(--text-primary)">
                            {getBookingDay(schedule.dayId).weekday},{" "}
                            {getBookingDay(schedule.dayId).date}
                          </p>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Clock3
                            size={10}
                            className="mt-0.5 shrink-0 text-(--accent-primary)"
                          />
                          <p className="text-[9px] font-bold text-(--text-primary)">
                            {schedule.time}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-0.5 text-[9px] font-semibold text-(--text-muted)">
                        Not scheduled yet
                      </p>
                    )}
                  </div>
                );
              })}
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
          <ServiceScheduleAccordion
            selectedServiceIds={selectedServiceIds}
            schedules={serviceSchedules}
            onSelectDay={onSelectServiceDay}
            onSelectTime={onSelectServiceTime}
            onRemoveService={ handleRemoveService}
          />
        </BookingModal>
      )}

      {showSeatModal && (
        <BookingModal
          title="Change Seat"
          titleId="seat-modal-title"
          onClose={() => setShowSeatModal(false)}
        >
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
        </BookingModal>
      )}

      {showTherapistModal && (
        <BookingModal
          title="Change Therapist"
          titleId="therapist-modal-title"
          onClose={() => setShowTherapistModal(false)}
        >
          <ServiceStaffAccordion
            selectedServiceIds={selectedServiceIds}
            organizationId={organizationId}
            expertType={expertType}
            assignments={serviceStaff}
            onSelectStaff={onSelectServiceStaff}
            onRemoveService={handleRemoveService}
          />
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
