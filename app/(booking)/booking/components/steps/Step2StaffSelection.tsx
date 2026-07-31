"use client";

import Image from "next/image";
import Swal from "sweetalert2";
import {
  ArrowRightIcon,
  BadgeCheck,
  ChevronRight,
  Clock3,
  MapPin,
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
import { BookingSelectedServicesPanel } from "../BookingSelectedServicesPanel";
import {
  bookingLocation,
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
  const hasSelection = selectedServices.length > 0;
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

  const renderStaffAccordion = () => (
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
  );

  const renderScheduleAccordion = () => (
    <ServiceScheduleAccordion
      selectedServiceIds={selectedServiceIds}
      schedules={serviceSchedules}
      onSelectDay={onSelectServiceDay}
      onSelectTime={onSelectServiceTime}
      onRemoveService={
        onRemoveService ? handleRemoveService : () => undefined
      }
    />
  );

  const renderSeatSection = () => (
    <SelectSeat
      seats={bookingSeats}
      selectedSeatId={selectedSeatId}
      seatConfirmed={seatConfirmed}
      onSelectSeat={onSelectSeat}
      onConfirmSeat={onConfirmSeat}
    />
  );

  return (
    <>
      {/* ================= MOBILE (unchanged) ================= */}
      <div className="space-y-4 lg:hidden">
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

        {renderStaffAccordion()}
        {renderScheduleAccordion()}
        {renderSeatSection()}

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

      {/* ================= DESKTOP ================= */}
      {/*
        Full-screen 2-column layout:
        LEFT  → vertical split (banner on top, selected services below)
        RIGHT → staff / schedule / seat selection
      */}
      <div className="hidden lg:grid lg:h-[calc(100vh-140px)] lg:min-h-[680px] lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[440px_minmax(0,1fr)]">
        {/* LEFT COLUMN */}
        <aside className="flex min-h-0 flex-col gap-4">
          {/* Top: Banner */}
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
              <TimingsDropdown
                summary={org.availability}
                buttonClassName="primary-button flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
              />
            </div>

            <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-(--accent-primary) px-3 py-1.5 text-[11px] font-semibold text-white">
              <Star
                size={12}
                className="fill-(--brand-gold) text-(--brand-gold)"
              />
              4.8 (120+)
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

          {/* Bottom: Selected services */}
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
                      ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} · ${staffSummary}`
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
                  const staffId = serviceStaff[service.id];
                  const staff = staffId ? getStaff(staffId) : null;

                  return (
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
                          <UserRound size={12} className="text-(--accent-primary)" />
                          <span className="truncate">
                            {staff ? staff.name : "Pick therapist"}
                          </span>
                        </div>
                        <p className="mt-1 text-[15px] font-bold text-(--brand-gold)">
                          {service.priceLabel}
                        </p>
                      </div>

                      {onRemoveService && (
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
                      )}
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
                  <p className="mt-1 text-[12px] text-(--text-muted)">
                    Go back to add services first
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

        {/* RIGHT COLUMN — staff, schedule, seat */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-(--border) bg-(--bg-card)">
          <div className="flex shrink-0 items-center justify-between border-b border-(--border) px-5 py-4">
            <div>
              <h2 className="text-[20px] font-semibold text-(--text-primary)">
                Staff & Schedule
              </h2>
              <p className="mt-0.5 text-[13px] text-(--text-muted)">
                Assign therapists, set times, then confirm your seat
              </p>
            </div>
            <div className="text-right text-[13px] font-semibold text-(--text-secondary)">
              <p>
                {pendingStaffServices.length === 0
                  ? "Therapists set"
                  : `${pendingStaffServices.length} therapist pending`}
              </p>
              <p className="mt-0.5 text-(--text-muted)">
                {pendingScheduleServices.length === 0
                  ? "Schedule set"
                  : `${pendingScheduleServices.length} schedule pending`}
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-(--bg-secondary) p-4 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
            {renderStaffAccordion()}
            {renderScheduleAccordion()}
            {renderSeatSection()}
          </div>
        </section>
      </div>
    </>
  );
}
