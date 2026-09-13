"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  bookingLocation,
  calcServicesTotal,
  formatServiceSchedule,
  getSelectedServices,
  getStaff,
  isServiceScheduleComplete,
  isServiceStaffAssigned,
} from "../booking.data";
import type {
  ServiceSchedules,
  ServiceStaffAssignments,
} from "../booking.types";

interface OrganizationBannerInfo {
  name: string;
  banner: string;
  availability: string;
  status: string;
  thumbnail?: string;
  address?: string;
}

interface BookingSelectedServicesPanelProps {
  selectedServiceIds: string[];
  organization?: OrganizationBannerInfo;
  organizationId?: string;
  title?: string;
  serviceStaff?: ServiceStaffAssignments;
  serviceSchedules?: ServiceSchedules;
  packageName?: string;
  onRemoveService?: (id: string) => void;
  showOrganizationBanner?: boolean;
  /** Controlled active service (sync with Staff & Schedule tabs). */
  activeServiceId?: string;
  onActiveServiceChange?: (serviceId: string) => void;
}

export function BookingSelectedServicesPanel({
  selectedServiceIds,
  organization,
  organizationId,
  title = "Selected Services",
  serviceStaff = {},
  serviceSchedules = {},
  packageName,
  onRemoveService,
  showOrganizationBanner = true,
  activeServiceId: controlledActiveServiceId,
  onActiveServiceChange,
}: BookingSelectedServicesPanelProps) {
  const isPackageFlow = Boolean(packageName);
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const { subtotal } = calcServicesTotal(selectedServiceIds, organizationId);
  const hasSelection = selectedServices.length > 0;
  const [uncontrolledActiveServiceId, setUncontrolledActiveServiceId] =
    useState(selectedServices[0]?.id ?? "");
  const isActiveControlled = controlledActiveServiceId !== undefined;
  const activeServiceId = isActiveControlled
    ? controlledActiveServiceId
    : uncontrolledActiveServiceId;
  const lastLocalActiveRef = useRef(activeServiceId);
  const setActiveServiceId = (serviceId: string) => {
    lastLocalActiveRef.current = serviceId;
    if (!isActiveControlled) {
      setUncontrolledActiveServiceId(serviceId);
    }
    onActiveServiceChange?.(serviceId);
  };
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    if (selectedServices.length === 0) {
      if (!isActiveControlled) setUncontrolledActiveServiceId("");
      return;
    }
    if (!selectedServices.some((service) => service.id === activeServiceId)) {
      const nextId = selectedServices[0]?.id ?? "";
      if (!isActiveControlled) setUncontrolledActiveServiceId(nextId);
      onActiveServiceChange?.(nextId);
    }
  }, [
    selectedServices,
    activeServiceId,
    isActiveControlled,
    onActiveServiceChange,
  ]);

  useEffect(() => {
    if (!highlightId) return;
    const timer = window.setTimeout(() => setHighlightId(null), 900);
    return () => window.clearTimeout(timer);
  }, [highlightId]);

  useEffect(() => {
    const container = cardsScrollRef.current;
    if (!container) return;

    const syncActiveFromScroll = () => {
      if (isProgrammaticScroll.current) return;

      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      let closestId = activeServiceId;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const service of selectedServices) {
        const card = cardRefs.current[service.id];
        if (!card) continue;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - centerX);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = service.id;
        }
      }

      if (closestId && closestId !== activeServiceId) {
        setActiveServiceId(closestId);
        const tab = tabsScrollRef.current?.querySelector<HTMLElement>(
          `[data-service-tab="${closestId}"]`,
        );
        tab?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    };

    container.addEventListener("scroll", syncActiveFromScroll, {
      passive: true,
    });
    return () => container.removeEventListener("scroll", syncActiveFromScroll);
  }, [activeServiceId, selectedServices]);

  const scrollTabs = (direction: "left" | "right") => {
    tabsScrollRef.current?.scrollBy({
      left: direction === "left" ? -120 : 120,
      behavior: "smooth",
    });
  };

  const scrollCards = (direction: "left" | "right") => {
    const container = cardsScrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const goToService = (serviceId: string) => {
    const exists = selectedServices.some((service) => service.id === serviceId);
    if (!exists) return;

    setActiveServiceId(serviceId);
    setHighlightId(serviceId);
    isProgrammaticScroll.current = true;

    const tab = tabsScrollRef.current?.querySelector<HTMLElement>(
      `[data-service-tab="${serviceId}"]`,
    );
    tab?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    cardRefs.current[serviceId]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 450);
  };

  useEffect(() => {
    if (!isActiveControlled || !controlledActiveServiceId) return;
    if (!selectedServiceIds.includes(controlledActiveServiceId)) return;
    if (controlledActiveServiceId === lastLocalActiveRef.current) return;

    lastLocalActiveRef.current = controlledActiveServiceId;
    setHighlightId(controlledActiveServiceId);
    isProgrammaticScroll.current = true;

    const tab = tabsScrollRef.current?.querySelector<HTMLElement>(
      `[data-service-tab="${controlledActiveServiceId}"]`,
    );
    tab?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    cardRefs.current[controlledActiveServiceId]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    const timer = window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 450);
    return () => window.clearTimeout(timer);
  }, [controlledActiveServiceId, isActiveControlled, selectedServiceIds]);

  const org = organization ?? {
    name: bookingLocation.name,
    banner: bookingLocation.banner,
    availability: bookingLocation.availability,
    status: bookingLocation.status,
  };

  return (
    <>
      {showOrganizationBanner && (
        <section className="feature-card overflow-hidden rounded-xl">
          <div className="relative h-[130px] w-full">
            <Image
              src={org.banner}
              alt={org.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />

            <div className="absolute right-2 top-2">
              <div className="primary-button rounded-full px-3 py-1 text-[8px] font-medium text-white">
                {org.availability}
              </div>
            </div>

            <div className="absolute bottom-2 left-2.5 right-2.5">
              <p className="truncate text-[14px] font-bold text-white">
                {org.name}
              </p>
              <p className="text-[9px] font-semibold text-(--success)">
                {org.status}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="feature-card overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-(--border) px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="primary-button flex h-7 w-7 items-center justify-center rounded-full">
              <ShoppingBag size={13} strokeWidth={2} className="text-white" />
            </span>
            <div>
              <p className="text-[11px] font-bold text-(--text-primary)">
                {title}
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
          <div className="p-3">
            {isPackageFlow ? (
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-xl primary-button px-3 py-2 text-[10px] font-semibold text-white">
                <Check size={11} strokeWidth={2.5} />
                {packageName}
              </div>
            ) : (
              <div className="relative mb-2 px-5">
                {selectedServices.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollTabs("left")}
                      aria-label="Scroll service tabs left"
                      className="
                        absolute left-0 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2
                        items-center justify-center rounded-full border border-(--border)
                        bg-(--bg-card) text-(--text-primary)
                      "
                    >
                      <ChevronLeft size={13} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollTabs("right")}
                      aria-label="Scroll service tabs right"
                      className="
                        absolute right-0 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2
                        items-center justify-center rounded-full border border-(--border)
                        bg-(--bg-card) text-(--text-primary)
                      "
                    >
                      <ChevronRight size={13} strokeWidth={2.5} />
                    </button>
                  </>
                )}

                <div
                  ref={tabsScrollRef}
                  className="scrollbar-none flex gap-1 overflow-x-auto scroll-smooth ml-2 mr-2"
                  role="tablist"
                  aria-label="Selected services"
                >
                  {selectedServices.map((service, index) => {
                    const ready =
                      isServiceStaffAssigned(serviceStaff, service.id) &&
                      isServiceScheduleComplete(serviceSchedules[service.id]);
                    const active = service.id === activeServiceId;

                    return (
                      <button
                        key={service.id}
                        type="button"
                        role="tab"
                        data-service-tab={service.id}
                        aria-selected={active}
                        onClick={() => goToService(service.id)}
                        className={`
                          flex items-center shrink-0 rounded-xl border px-2.5 py-1.5
                          text-[9px] font-semibold transition-all duration-200
                          ${
                            active
                              ? "primary-button border-transparent text-white"
                              : "border-(--border) bg-(--bg-card) text-(--text-primary)"
                          }
                        `}
                      >
                      {!ready ?
                      <span
                        className={` left-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${
                          ready ? "bg-(--success)" : "bg-(--danger)"
                        }`}
                      /> :
                        ready ? <Check size={12} strokeWidth={2.5} className="text-white bg-(--success) rounded-full p-0.5" /> : null 
                      }
                      <span className="inline-flex items-center gap-1 pl-2">
                       
                        Service - {index + 1}
                      </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="relative">
              {selectedServices.length > 3 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollCards("left")}
                    aria-label="Scroll services left"
                    className="
                      absolute -left-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2
                      items-center justify-center rounded-full border border-(--border)
                      bg-(--bg-card) text-(--text-primary) shadow-[var(--shadow-card)]
                    "
                  >
                    <ChevronLeft size={13} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCards("right")}
                    aria-label="Scroll services right"
                    className="
                      absolute -right-1 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2
                      items-center justify-center rounded-full border border-(--border)
                      bg-(--bg-card) text-(--text-primary) shadow-[var(--shadow-card)]
                    "
                  >
                    <ChevronRight size={13} strokeWidth={2.5} />
                  </button>
                </>
              )}

              <div
                ref={cardsScrollRef}
                className="
                  scrollbar-none flex snap-x snap-mandatory gap-1
                  overflow-x-auto  px-0.5 py-0.5
                "
              >
                {selectedServices.map((service) => {
                  const assignedStaffId = serviceStaff[service.id];
                  const assignedStaff = assignedStaffId
                    ? getStaff(assignedStaffId)
                    : null;
                  const schedule = serviceSchedules[service.id];
                  const scheduled = isServiceScheduleComplete(schedule);
                  const ready =
                    isServiceStaffAssigned(serviceStaff, service.id) &&
                    scheduled;
                  const isActive = service.id === activeServiceId;
                  const isHighlighted = highlightId === service.id;

                  return (
                    <article
                      key={service.id}
                      ref={(node) => {
                        cardRefs.current[service.id] = node;
                      }}
                      onClick={() => goToService(service.id)}
                      className={`
                        w-[calc((100%-0.5rem)/3)] shrink-0 snap-start
                        cursor-pointer overflow-hidden rounded-sm border
                        bg-[color-mix(in_srgb,var(--accent-primary)_4%,transparent)]
                        transition-all duration-300
                        ${
                          isHighlighted || isActive
                            ? "border-(--accent-primary) shadow-[0_0_0_2px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)] scale-[1.02]"
                            : "border-(--border)"
                        }
                      `}
                    >
                      <div className="relative aspect-square w-full">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                        {onRemoveService && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onRemoveService(service.id);
                            }}
                            aria-label={`Remove ${service.name}`}
                            className="
                              absolute right-0.5 top-0.5 flex h-4 w-4 items-center
                              justify-center rounded-full border border-(--border)
                              bg-(--bg-card)/95 text-(--text-muted)
                              transition-colors hover:border-(--accent-primary)
                              hover:text-(--accent-primary)
                            "
                          >
                            <X size={8} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-0.5 pt-1.5">
                        <p className="line-clamp-3 min-h-10.5 px-1.5 text-[11px] font-bold leading-tight text-(--text-primary)">
                          {service.name}
                        </p>
                        <div className="flex items-center gap-0.5 px-1.5 text-[10px] font-semibold text-(--text-primary)">
                          <Clock3 size={6} />
                          <span className="truncate">{service.duration}</span>
                        </div>
                        <p className="px-1.5 text-[12px] font-bold text-(--brand-gold)">
                          {service.priceLabel}
                        </p>
                        <p className="truncate bg-(--text-primary) px-1 text-center text-[9px] font-bold text-white">
                          {isPackageFlow
                            ? "packages"
                            : (assignedStaff?.name ?? "Staff")}
                        </p>
                        <p className="truncate bg-(--text-primary) px-1 text-center text-[9px] font-bold text-white">
                          {scheduled
                            ? formatServiceSchedule(schedule)
                            : "Date & time"}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <p className="px-3 py-4 text-center text-[9px] font-medium text-(--text-muted)">
            No services selected yet
          </p>
        )}
      </section>
    </>
  );
}
