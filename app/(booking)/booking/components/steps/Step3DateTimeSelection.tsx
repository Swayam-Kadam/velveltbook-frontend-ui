"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Pencil,
  ShoppingBag,
  Star,
  UserRound,
  X,
} from "lucide-react";

import { CategorySidebar } from "@/menu/components/CategorySidebar";
import type { ExpertType } from "@/menu/components/ExpertSelection";
import { ServiceCard } from "@/menu/components/ServiceCard";
import {
  allMenuServices,
  getServicesByCategory,
  menuCategories,
} from "@/menu/menu.data";
import { TimingsDropdown } from "@/components/TimingsDropdown";
import {
  BookingOrganizationBanner,
  type BookingOrganizationBannerInfo,
} from "../BookingOrganizationBanner";
import {
  bookingLocation,
  buildBookingDays,
  calcServicesTotal,
  createDefaultServiceSchedule,
  getAvailableTimeSlots,
  getBookingDay,
  getOrganizationStaff,
  getPrimaryStaffId,
  getSelectedServices,
  getStaff,
  isServiceScheduleComplete,
  timeSlots,
} from "../../booking.data";
import type {
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../../booking.types";
import { filterTimesByPeriod, getTimePeriod } from "../../lib/scheduleUtils";
import { BookingMonthCalendar } from "./BookingMonthCalendar";
import { BookingPreviewCards } from "../BookingPreviewCards";

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
  onReplaceService?: (oldServiceId: string, newServiceId: string) => void;
}

const swalDefaults = {
  confirmButtonText: "Okay",
  confirmButtonColor: "#b8860b",
  background: "#1a1a1a",
  color: "#ffffff",
  allowOutsideClick: false,
  allowEscapeKey: false,
} as const;

function ChangeServiceMenuModal({
  selectedServiceIds,
  currentServiceId,
  onPick,
  onClose,
}: {
  selectedServiceIds: string[];
  currentServiceId: string;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState(() => {
    return (
      allMenuServices.find((service) => service.id === currentServiceId)
        ?.categoryId ??
      menuCategories[0]?.id ??
      "massage"
    );
  });

  const categoryServices = useMemo(
    () => getServicesByCategory(activeCategory),
    [activeCategory],
  );

  const selectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const id of selectedServiceIds) {
      const menuService = allMenuServices.find((service) => service.id === id);
      if (menuService) {
        counts[menuService.categoryId] =
          (counts[menuService.categoryId] ?? 0) + 1;
      }
    }
    return counts;
  }, [selectedServiceIds]);

  const activeCategoryLabel =
    menuCategories.find((category) => category.id === activeCategory)?.label ??
    "Services";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex h-[70dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between gap-2 border-b border-(--border) px-3 py-3">
          <div>
            <h3 className="text-sm font-bold text-(--text-primary)">
              Change Service
            </h3>
            <p className="mt-0.5 text-[10px] text-(--text-muted)">
              Browse categories and tap a service
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <CategorySidebar
            categories={menuCategories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
            selectedCounts={selectedCounts}
          />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
            <div className="flex-1 overflow-y-auto px-2 pt-3 pb-3 scrollbar-thin scrollbar-thumb-(--accent-primary) scrollbar-track-(--bg-secondary)">
              <div className="mb-3">
                <h4 className="text-xs font-medium text-(--text-primary)">
                  Select a Service
                </h4>
                <p className="text-[8px] text-(--text-muted)">
                  {activeCategoryLabel} · {categoryServices.length} available
                </p>
              </div>

              {categoryServices.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {categoryServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedServiceIds.includes(service.id)}
                      onSelect={() => onPick(service.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-[10px] text-(--text-muted)">
                  No services in this category yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3TimeSlotPicker({
  activeDayId,
  activeTime,
  onSelectTime,
}: {
  activeDayId: string;
  activeTime: string;
  onSelectTime: (time: string) => void;
}) {
  const [timePeriod, setTimePeriod] = useState<"AM" | "PM">(() =>
    getTimePeriod(activeTime || "9:00 AM"),
  );

  const availableTimes = useMemo(
    () => getAvailableTimeSlots(activeDayId, timeSlots),
    [activeDayId],
  );
  const filteredTimes = useMemo(
    () => filterTimesByPeriod(availableTimes, timePeriod),
    [availableTimes, timePeriod],
  );

  useEffect(() => {
    if (activeTime) setTimePeriod(getTimePeriod(activeTime));
  }, [activeTime]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-(--text-secondary)">
          Select Time
        </p>
        <div className="flex items-center gap-0.5 rounded-lg border border-(--border) p-0.5">
          {(["AM", "PM"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setTimePeriod(period)}
              className={`
                rounded-md px-2 py-0.5 text-[10px] font-semibold
                ${
                  timePeriod === period
                    ? "primary-button text-white"
                    : "text-(--text-secondary)"
                }
              `}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-0.5">
        {filteredTimes.map((time) => {
          const active = time === activeTime;
          const match = time.match(/^(.+?)\s+(AM|PM)$/i);
          const clock = match?.[1] ?? time;
          const period = match?.[2] ?? getTimePeriod(time);

          return (
            <button
              key={time}
              type="button"
              onClick={() => onSelectTime(time)}
              className={`
                flex h-10 w-[4.6rem] shrink-0 flex-col items-center justify-center
                rounded-lg border text-center font-medium tabular-nums
                ${
                  active
                    ? "primary-button border-transparent text-white"
                    : "border-(--border) bg-(--bg-card) text-(--text-primary)"
                }
              `}
            >
              <span className="text-[10px]">{clock}</span>
              <span className="text-[8px] font-semibold">{period}</span>
            </button>
          );
        })}
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
  onReplaceService,
}: Step3DateTimeSelectionProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showTherapistModal, setShowTherapistModal] = useState(false);

  const primaryStaffId = getPrimaryStaffId(serviceStaff, selectedServiceIds);
  const staff = getStaff(primaryStaffId);
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const bookingDays = useMemo(() => buildBookingDays(new Date()), []);
  const therapists = useMemo(() => {
    let list = getOrganizationStaff(organizationId);
    if (expertType === "male" || expertType === "female") {
      list = list.filter((member) => member.gender === expertType);
    }
    return list.length > 0 ? list : getOrganizationStaff(organizationId);
  }, [expertType, organizationId]);
  const { subtotal } = calcServicesTotal(selectedServiceIds, organizationId);
  const hasSelection = selectedServices.length > 0;
  const [activePreviewServiceId, setActivePreviewServiceId] = useState<
    string | null
  >(selectedServiceIds[0] ?? null);

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

  useEffect(() => {
    if (selectedServices.length === 0) {
      setActivePreviewServiceId(null);
      return;
    }

    setActivePreviewServiceId((current) =>
      current && selectedServices.some((service) => service.id === current)
        ? current
        : selectedServices[0].id,
    );
  }, [selectedServices]);

  const activePreviewSchedule =
    activePreviewServiceId != null
      ? (serviceSchedules[activePreviewServiceId] ??
        createDefaultServiceSchedule())
      : createDefaultServiceSchedule();

  const handleReplaceService = (newServiceId: string) => {
    if (!activePreviewServiceId) {
      setShowServiceModal(false);
      return;
    }

    if (newServiceId === activePreviewServiceId) {
      setShowServiceModal(false);
      return;
    }

    if (selectedServiceIds.includes(newServiceId)) {
      setActivePreviewServiceId(newServiceId);
      setShowServiceModal(false);
      return;
    }

    onReplaceService?.(activePreviewServiceId, newServiceId);
    setActivePreviewServiceId(newServiceId);
    setShowServiceModal(false);
  };

  const handlePickStaff = (staffId: string) => {
    if (!activePreviewServiceId) return;
    onSelectServiceStaff(activePreviewServiceId, staffId);
    setShowTherapistModal(false);
  };

  const modals = (
    <>
      {showServiceModal && activePreviewServiceId && (
        <ChangeServiceMenuModal
          selectedServiceIds={selectedServiceIds}
          currentServiceId={activePreviewServiceId}
          onPick={handleReplaceService}
          onClose={() => setShowServiceModal(false)}
        />
      )}

      {showTherapistModal && activePreviewServiceId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
          onClick={() => setShowTherapistModal(false)}
          role="presentation"
        >
          <div
            className="flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-(--text-primary)">
                  Change Staff / Therapist
                </h3>
                <p className="mt-0.5 text-[11px] text-(--text-muted)">
                  Choose a therapist for this service
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTherapistModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-3">
              <div className="rounded-xl border border-(--border) bg-(--bg-secondary) p-2">
                <div className="scrollbar-none flex gap-2 overflow-x-auto pb-0.5">
                  {therapists.map((therapist) => {
                    const active =
                      serviceStaff[activePreviewServiceId] === therapist.id;

                    return (
                      <button
                        key={therapist.id}
                        type="button"
                        onClick={() => handlePickStaff(therapist.id)}
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
                            <span className="border-3 border-white primary-button absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full text-white">
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
              </div>
            </div>
          </div>
        </div>
      )}

      {showDateTimeModal && activePreviewServiceId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-3"
          onClick={() => setShowDateTimeModal(false)}
          role="presentation"
        >
          <div
            className="flex max-h-[92dvh] w-[95%] max-w-md flex-col overflow-hidden rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-(--text-primary)">
                  Change Date &amp; Time
                </h3>
                <p className="mt-0.5 text-[11px] text-(--text-muted)">
                  {selectedServices.find(
                    (service) => service.id === activePreviewServiceId,
                  )?.name ?? "Service"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDateTimeModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-(--border)"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              <BookingMonthCalendar
                days={bookingDays}
                activeDayId={activePreviewSchedule.dayId}
                onSelectDay={(dayId) => {
                  onSelectServiceDay(activePreviewServiceId, dayId);
                  const times = getAvailableTimeSlots(dayId, timeSlots);
                  const time = times.includes(activePreviewSchedule.time)
                    ? activePreviewSchedule.time
                    : (times[0] ?? activePreviewSchedule.time);
                  if (time) {
                    onSelectServiceTime(activePreviewServiceId, time);
                  }
                }}
              />
              <Step3TimeSlotPicker
                activeDayId={activePreviewSchedule.dayId}
                activeTime={activePreviewSchedule.time}
                onSelectTime={(time) =>
                  onSelectServiceTime(activePreviewServiceId, time)
                }
              />
            </div>
            <div className="border-t border-(--border) p-3.5">
              <button
                type="button"
                onClick={() => setShowDateTimeModal(false)}
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
            {/* <div className="flex items-center gap-3">
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
            </div> */}
          </div>

          <div className="space-y-2">
            {hasSelection && (
              <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
                {selectedServices.map((service, index) => {
                  const active = activePreviewServiceId === service.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setActivePreviewServiceId(service.id)}
                      className={`
                        shrink-0 rounded-xl border px-3 py-2 text-[10px] font-semibold
                        transition-all duration-200
                        ${
                          active
                            ? "primary-button border-transparent text-white"
                            : "border-(--border) bg-(--bg-card) text-(--text-primary)"
                        }
                      `}
                    >
                      {`Service - ${index + 1}`}
                    </button>
                  );
                })}
              </div>
            )}

            {hasSelection && activePreviewServiceId ? (
              (() => {
                const service =
                  selectedServices.find(
                    (item) => item.id === activePreviewServiceId,
                  ) ?? selectedServices[0];
                const assignedId = serviceStaff[service.id];
                const assigned = assignedId ? getStaff(assignedId) : null;
                const schedule = serviceSchedules[service.id];
                const scheduled = isServiceScheduleComplete(schedule);
                const bookingDay = scheduled
                  ? getBookingDay(schedule.dayId)
                  : null;

                return (
                  <article className="feature-card overflow-hidden rounded-2xl border border-(--border) p-2">
                    <div className="mb-2 flex items-center justify-between gap-2 border-b border-(--border) pb-2">
                      <div className="primary-button inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-semibold text-white">
                        <span className="h-2 w-2 rounded-full bg-(--success)" />
                        {`Service - ${selectedServices.findIndex((item) => item.id === service.id) + 1}`}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsEditMode((current) => !current)}
                          className="flex items-center gap-0.5 rounded-full border border-(--border) px-3 py-1.5 text-[12px] font-bold text-(--accent-secondary)"
                        >
                          {isEditMode ? (
                            "Done"
                          ) : (
                            <>
                              <Pencil size={14} /> Edit
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <BookingPreviewCards
                      serviceName={service.name}
                      serviceImage={service.image}
                      serviceDuration={service.duration}
                      servicePriceLabel={service.priceLabel}
                      staffName={assigned?.name ?? null}
                      staffImage={assigned?.image ?? staff.image}
                      monthLabel={
                        bookingDay
                          ? new Date(
                              `${bookingDay.date}, ${new Date().getFullYear()}`,
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })
                          : "Date & Time"
                      }
                      dateLabel={bookingDay?.date}
                      weekdayLabel={bookingDay?.weekday}
                      timeLabel={scheduled ? schedule.time : undefined}
                      scheduled={scheduled && Boolean(bookingDay)}
                      showChangeButtons={isEditMode}
                      onChangeService={() => setShowServiceModal(true)}
                      onChangeStaff={() => setShowTherapistModal(true)}
                      onChangeDateTime={() => setShowDateTimeModal(true)}
                      totalAmountLabel={service.priceLabel}
                    />
                  </article>
                );
              })()
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) px-4 text-center">
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
