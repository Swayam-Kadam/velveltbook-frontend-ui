"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  Armchair,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Pencil,
  ShoppingBag,
  Star,
  UserRound,
  X,
} from "lucide-react";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import { TimingsDropdown } from "@/components/TimingsDropdown";
import {
  BookingOrganizationBanner,
  type BookingOrganizationBannerInfo,
} from "../BookingOrganizationBanner";
import {
  bookingLocation,
  bookingSeats,
  calcServicesTotal,
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
import { ServiceScheduleAccordion } from "./ServiceScheduleAccordion";
import { ServiceStaffAccordion } from "./ServiceStaffAccordion";
import SelectSeat from "./SelectSeat";
import "./SelectSeat/SelectSeat.css";

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

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
  allowOutsideClick: false,
  allowEscapeKey: false,
} as const;

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
          bg-(--bg-primary) p-3 shadow-(--shadow-glow) scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)
          lg:max-w-2xl lg:p-5
        "
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="mb-3 flex items-center justify-between gap-2 lg:mb-4">
          <h3
            id={titleId}
            className="text-sm font-bold text-(--text-primary) lg:text-[18px]"
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
              lg:h-9 lg:w-9
            "
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {children}
        <button
          type="button"
          onClick={onDone ?? onClose}
          className="primary-button mt-3 w-full rounded-xl py-2.5 text-[11px] font-semibold text-white lg:mt-4 lg:py-3.5 lg:text-[14px]"
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
  onNext,
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
  const { subtotal } = calcServicesTotal(selectedServiceIds, organizationId);
  const hasSelection = selectedServices.length > 0;

  const org = organizationBanner ?? {
    name: bookingLocation.name,
    banner: bookingLocation.banner,
    availability: bookingLocation.availability,
    status: bookingLocation.status,
    thumbnail: bookingLocation.image,
    address: bookingLocation.address,
  };

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
    // Seat selection removed — no seat confirmation required.
    // if (!seatConfirmed) {
    //   await Swal.fire({
    //     icon: "warning",
    //     title: "Confirm your seat",
    //     text: "Please select and confirm a seat before continuing.",
    //     ...swalDefaults,
    //   });
    //   return;
    // }
    onNext();
  };

  const modals = (
    <>
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
            onRemoveService={handleRemoveService}
          />
        </BookingModal>
      )}

      {/* Seat selection removed
      {showSeatModal && (
        <BookingModal
          title="Change Seat"
          titleId="seat-modal-title"
          onClose={() => setShowSeatModal(false)}
        >
          <SelectSeat
            seats={bookingSeats}
            selectedSeatId={selectedSeatId}
            seatConfirmed={seatConfirmed}
            onSelectSeat={onSelectSeat}
            onConfirmSeat={onConfirmSeat}
          />
        </BookingModal>
      )}
      */}

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
    </>
  );

  return (
    <>
      {/* ================= MOBILE (unchanged) ================= */}
      <div className="space-y-4 lg:hidden">
        <BookingOrganizationBanner
          organization={organizationBanner}
          serviceLabels={selectedServices.map((service) => service.name)}
        />
        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-(--text-primary)">
              Selected Services
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowTherapistModal(true)}
                className="flex items-center gap-0.5 text-[9px] font-bold text-(--accent-secondary)"
              >
                <Pencil size={10} /> Staff
              </button>
              <button
                type="button"
                onClick={() => setShowDateTimeModal(true)}
                className="flex items-center gap-0.5 text-[9px] font-bold text-(--accent-secondary)"
              >
                <Pencil size={10} /> Time
              </button>
            </div>
          </div>

          <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
            {selectedServices.map((service) => {
              const assignedId = serviceStaff[service.id];
              const assigned = assignedId ? getStaff(assignedId) : null;
              const schedule = serviceSchedules[service.id];
              const scheduled = isServiceScheduleComplete(schedule);

              return (
                <article
                  key={service.id}
                  className="feature-card relative rounded-sm p-2"
                >
                  <button
                    type="button"
                    aria-label={`Remove ${service.name}`}
                    onClick={() => handleRemoveService(service.id)}
                    className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-(--bg-card)/90 text-(--text-secondary) shadow-(--shadow-card) transition-colors hover:text-(--text-primary)"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>

                  <div className="flex gap-1.5">
                    <div className="relative h-14 flex-1 overflow-hidden rounded-sm">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                      <span className="absolute bottom-1 left-1 rounded-md bg-(--bg-card)/90 px-1 py-0.5 text-[7px] font-semibold text-(--text-primary)">
                        Service
                      </span>
                    </div>
                    <div className="relative h-14 flex-1 overflow-hidden rounded-sm">
                      <Image
                        src={assigned?.image ?? staff.image}
                        alt={assigned?.name ?? "Therapist"}
                        fill
                        sizes="140px"
                        className="object-cover"
                      />
                      <span className="absolute bottom-1 left-1 rounded-md bg-(--bg-card)/90 px-1 py-0.5 text-[7px] font-semibold text-(--text-primary)">
                        Therapist
                      </span>
                    </div>
                  </div>

                  {/* <p className="mt-1.5 truncate pr-6 text-[11px] font-bold text-(--text-primary)">
                    {service.name} 
                  </p> */}
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-(--text-primary)">
                    
                  <p className=" truncate pr-6 text-[11px] font-bold text-(--text-primary)">
                    {service.name} 
                  </p>
                    
                    <span className="truncate">
                      with {assigned?.name ?? "Not selected"}
                    </span>
                    {assigned && (
                      <span className="flex shrink-0 items-center gap-0.5 text-(--text-secondary)">
                        <Star
                          size={9}
                          className="fill-(--brand-gold) text-(--brand-gold)"
                        />
                        {assigned.rating}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    {scheduled ? (
                      <div className="flex items-center gap-2 text-[9px] font-bold text-(--text-primary)">
                        <span className="flex items-center gap-1">
                          <CalendarDays
                            size={10}
                            className="text-(--accent-primary)"
                          />
                          {getBookingDay(schedule.dayId).weekday},{" "}
                          {getBookingDay(schedule.dayId).date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock3
                            size={10}
                            className="text-(--accent-primary)"
                          />
                          {schedule.time}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[9px] font-semibold text-(--text-muted)">
                        Not scheduled yet
                      </p>
                    )}
                    <p className="shrink-0 text-[11px] font-bold text-(--brand-gold)">
                      {service.priceLabel}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          onClick={onBack}
          className="secondary-button w-full rounded-xl py-2 text-[9px] font-medium"
        >
          BACK
        </button>
      </div>

      {/* ================= DESKTOP ================= */}
      {/*
        Full-screen 2-column layout:
        LEFT  → vertical split (banner on top, selected services below)
        RIGHT → review therapists / schedule / seat
      */}
      <div className="hidden lg:grid lg:h-[calc(100vh-140px)] lg:min-h-[680px] lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[440px_minmax(0,1fr)]">
        {/* LEFT COLUMN */}
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

              <div className=" inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary) px-3 py-1.5 text-[11px] font-semibold text-white">
              <Star
                size={12}
                className="fill-(--brand-gold) text-(--brand-gold)"
              />
              4.8 (120+)
            </div>
            </div>
            

            <div className="absolute top-3 right-3 flex items-center gap-2">
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
                      ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} · review details`
                      : "No services selected yet"}
                  </p>
                </div>
              </div>
              {hasSelection && (
                <p className="text-[22px] font-bold text-(--brand-gold)">
                  ${subtotal}
                </p>
              )}
            </div>

            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3.5 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
              {hasSelection ? (
                selectedServices.map((service) => {
                  const assignedId = serviceStaff[service.id];
                  const assigned = assignedId ? getStaff(assignedId) : null;
                  const schedule = serviceSchedules[service.id];
                  const scheduled = isServiceScheduleComplete(schedule);

                  return (
                    <article
                      key={service.id}
                      className="rounded-2xl border border-(--border) bg-(--bg-secondary) p-2.5"
                    >
                      <div className="flex items-center gap-3">
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
                          <p className="mt-1 text-[15px] font-bold text-(--brand-gold)">
                            {service.priceLabel}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveService(service.id)}
                          aria-label={`Remove ${service.name}`}
                          className="
                            flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                            border border-(--border) bg-(--bg-card) text-(--text-muted)
                            transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary)
                          "
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>
                      </div>

                      <div className="mt-2.5 space-y-1 border-t border-(--border) pt-2.5 text-[12px]">
                        <div className="flex items-center gap-1.5 text-(--text-secondary)">
                          <UserRound
                            size={12}
                            className="text-(--accent-primary)"
                          />
                          <span className="truncate">
                            {assigned?.name ?? "No therapist"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-(--text-secondary)">
                          <CalendarDays
                            size={12}
                            className="text-(--accent-primary)"
                          />
                          <span className="truncate">
                            {scheduled
                              ? `${getBookingDay(schedule.dayId).weekday}, ${getBookingDay(schedule.dayId).date} · ${schedule.time}`
                              : "Not scheduled"}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })
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
                onClick={handleContinue}
                className="
                  primary-button flex h-12 w-full items-center justify-center gap-2
                  rounded-xl text-[14px] font-semibold text-white
                  transition-opacity hover:opacity-90
                "
              >
                Continue to Payment
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

        {/* RIGHT COLUMN — review & edit */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card)">
          <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-5 py-4">
            <div>
              <h2 className="text-[20px] font-semibold text-(--text-primary)">
                Review Booking Details
              </h2>
              <p className="mt-0.5 text-[13px] text-(--text-muted)">
                Confirm therapists and schedule before payment
              </p>
            </div>
            {/* Seat selection removed
            <p
              className={`text-[13px] font-semibold ${
                seatConfirmed ? "text-(--success)" : "text-(--text-muted)"
              }`}
            >
              {seatConfirmed ? "Seat confirmed" : "Seat pending"}
            </p>
            */}
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-(--bg-secondary) p-4 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
            {/* Therapists */}
            <article className="overflow-hidden rounded-[18px] border border-(--border) bg-(--bg-card)">
              <div className="flex items-center justify-between border-b border-(--border) px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--accent-primary)/10">
                    <UserRound size={16} className="text-(--accent-primary)" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-(--text-primary)">
                      Selected Therapists
                    </h3>
                    <p className="text-[12px] text-(--text-muted)">
                      One therapist per service
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTherapistModal(true)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--accent-secondary) transition-opacity hover:opacity-80"
                >
                  <Pencil size={13} />
                  Change
                </button>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2">
                {selectedServices.map((service) => {
                  const assignedId = serviceStaff[service.id];
                  const assigned = assignedId
                    ? getStaff(assignedId)
                    : getStaff(primaryStaffId);

                  return (
                    <div
                      key={service.id}
                      className="flex items-center gap-3 rounded-2xl border border-(--border) bg-(--bg-secondary) p-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={assigned.image}
                          alt={assigned.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-(--text-muted)">
                          {service.name}
                        </p>
                        <p className="truncate text-[15px] font-semibold text-(--text-primary)">
                          {assigned.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1 text-[12px] text-(--text-secondary)">
                          <Star
                            size={11}
                            className="fill-(--brand-gold) text-(--brand-gold)"
                          />
                          {assigned.rating} · {assigned.experience}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* Schedule */}
            <article className="overflow-hidden rounded-[18px] border border-(--border) bg-(--bg-card)">
              <div className="flex items-center justify-between border-b border-(--border) px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--accent-primary)/10">
                    <CalendarDays
                      size={16}
                      className="text-(--accent-primary)"
                    />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-(--text-primary)">
                      Date &amp; Time
                    </h3>
                    <p className="text-[12px] text-(--text-muted)">
                      Schedule for each service
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDateTimeModal(true)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--accent-secondary) transition-opacity hover:opacity-80"
                >
                  <Pencil size={13} />
                  Change
                </button>
              </div>

              <div className="space-y-2.5 p-4">
                {selectedServices.map((service) => {
                  const schedule = serviceSchedules[service.id];
                  const scheduled = isServiceScheduleComplete(schedule);

                  return (
                    <div
                      key={service.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-(--border) bg-(--bg-secondary) px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-(--text-primary)">
                          {service.name}
                        </p>
                        <p className="mt-0.5 text-[12px] text-(--text-muted)">
                          {service.duration}
                        </p>
                      </div>
                      {scheduled ? (
                        <div className="shrink-0 text-right">
                          <p className="flex items-center justify-end gap-1.5 text-[13px] font-semibold text-(--text-primary)">
                            <CalendarDays
                              size={13}
                              className="text-(--accent-primary)"
                            />
                            {getBookingDay(schedule.dayId).weekday},{" "}
                            {getBookingDay(schedule.dayId).date}
                          </p>
                          <p className="mt-1 flex items-center justify-end gap-1.5 text-[13px] font-semibold text-(--text-primary)">
                            <Clock3
                              size={13}
                              className="text-(--accent-primary)"
                            />
                            {schedule.time}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[13px] font-medium text-(--text-muted)">
                          Not scheduled
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>

            {/* Seat selection removed
            <article className="overflow-hidden rounded-[18px] border border-(--border) bg-(--bg-card)">
              <div className="flex items-center justify-between border-b border-(--border) px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--accent-primary)/10">
                    <Armchair size={16} className="text-(--accent-primary)" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-(--text-primary)">
                      Selected Seat
                    </h3>
                    <p className="text-[12px] text-(--text-muted)">
                      Your room position for this visit
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSeatModal(true)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-(--accent-secondary) transition-opacity hover:opacity-80"
                >
                  <Pencil size={13} />
                  Change
                </button>
              </div>

              <div className="flex items-center gap-4 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-(--border) bg-(--bg-secondary)">
                  <Armchair size={28} className="text-(--accent-primary)" />
                </div>
                <div>
                  <p className="text-[22px] font-bold text-(--text-primary)">
                    Seat {selectedSeat.label}
                  </p>
                  <p
                    className={`mt-1 text-[13px] font-semibold ${
                      seatConfirmed ? "text-(--success)" : "text-(--text-muted)"
                    }`}
                  >
                    {seatConfirmed ? "Confirmed" : "Not confirmed yet"}
                  </p>
                </div>
              </div>
            </article>
            */}
          </div>
        </section>
      </div>

      {modals}
    </>
  );
}
