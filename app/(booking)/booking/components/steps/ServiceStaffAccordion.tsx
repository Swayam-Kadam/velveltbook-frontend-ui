"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Star, Trash2, UserRound } from "lucide-react";

import type { ExpertType } from "@/menu/components/ExpertSelection";
import {
  countAssignedServiceStaff,
  getOrganizationStaff,
  getSelectedServices,
  getStaff,
  isServiceStaffAssigned,
} from "../../booking.data";
import type { ServiceStaffAssignments } from "../../booking.types";

interface ServiceStaffAccordionProps {
  selectedServiceIds: string[];
  organizationId?: string;
  expertType: ExpertType;
  assignments: ServiceStaffAssignments;
  lockStaffSelection?: boolean;
  onSelectStaff: (serviceId: string, staffId: string) => void;
  onRemoveService: (serviceId: string) => void;
}

export function ServiceStaffAccordion({
  selectedServiceIds,
  organizationId,
  expertType,
  assignments,
  lockStaffSelection = false,
  onSelectStaff,
  onRemoveService,
}: ServiceStaffAccordionProps) {
  const selectedServices = getSelectedServices(
    selectedServiceIds,
    organizationId,
  );
  const assignedCount = countAssignedServiceStaff(
    assignments,
    selectedServiceIds,
  );

  const visibleStaff = useMemo(() => {
    let therapists = getOrganizationStaff(organizationId);

    if (expertType === "male" || expertType === "female") {
      therapists = therapists.filter(
        (therapist) => therapist.gender === expertType,
      );
    }

    if (lockStaffSelection) {
      const lockedIds = new Set(
        selectedServiceIds
          .map((id) => assignments[id])
          .filter((id): id is string => Boolean(id)),
      );
      if (lockedIds.size > 0) {
        therapists = therapists.filter((therapist) =>
          lockedIds.has(therapist.id),
        );
      }
    }

    return therapists;
  }, [
    assignments,
    expertType,
    lockStaffSelection,
    organizationId,
    selectedServiceIds,
  ]);

  const firstPendingId = useMemo(
    () =>
      selectedServiceIds.find(
        (id) => !isServiceStaffAssigned(assignments, id),
      ),
    [assignments, selectedServiceIds],
  );

  const [openServiceId, setOpenServiceId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedServiceIds.length === 0) {
      setOpenServiceId(null);
      return;
    }

    setOpenServiceId((current) => {
      if (current && selectedServiceIds.includes(current)) {
        return current;
      }
      return firstPendingId ?? selectedServiceIds[0] ?? null;
    });
  }, [firstPendingId, selectedServiceIds]);

  const toggleService = (serviceId: string) => {
    setOpenServiceId((current) => (current === serviceId ? null : serviceId));
  };

  const handleRemoveService = (serviceId: string) => {
    onRemoveService(serviceId);
    setOpenServiceId(null);
  };

  const handlePickStaff = (serviceId: string, staffId: string) => {
    if (lockStaffSelection) return;
    onSelectStaff(serviceId, staffId);

    const nextPending = selectedServiceIds.find(
      (id) =>
        id !== serviceId && !isServiceStaffAssigned(assignments, id),
    );
    if (nextPending) {
      setOpenServiceId(nextPending);
    }
  };

  return (
    <section className="feature-card overflow-hidden rounded-xl">
      <div className="border-b border-(--border) px-3 py-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--accent-primary)/10">
              <UserRound size={11} className="text-(--accent-primary)" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-(--text-primary)">
                {lockStaffSelection
                  ? "Selected Therapists"
                  : "Select Therapist"}
              </h3>
              <p className="text-[8px] font-semibold text-(--text-muted)">
                Pick a staff for each service
              </p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-[12px] font-bold text-(--text-primary)">
              {assignedCount} of {selectedServiceIds.length} therapists set
            </h3>
          </div>
        </div>
      </div>

      <div>
        {selectedServices.map((service) => {
          const assignedStaffId = assignments[service.id];
          const assignedStaff = assignedStaffId
            ? getStaff(assignedStaffId)
            : null;
          const isOpen = openServiceId === service.id;
          const isAssigned = isServiceStaffAssigned(assignments, service.id);

          const staffForService = lockStaffSelection
            ? visibleStaff.filter(
                (therapist) =>
                  !assignedStaffId || therapist.id === assignedStaffId,
              )
            : visibleStaff;

          return (
            <div
              key={service.id}
              className="border-b border-(--border) last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleService(service.id)}
                aria-expanded={isOpen}
                className="
                  flex w-full items-center gap-2 px-3 py-2.5 text-left
                  transition-colors hover:bg-(--bg-card-hover)
                "
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-(--text-primary)">
                    {service.name}
                  </p>
                  <p className="text-[8px] font-semibold text-(--text-muted)">
                    {service.duration} · {service.priceLabel}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    {isAssigned && assignedStaff ? (
                      <>
                        <UserRound
                          size={9}
                          className="shrink-0 text-(--accent-primary)"
                        />
                        <span className="truncate text-[8px] font-semibold text-(--text-secondary)">
                          {assignedStaff.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-[8px] font-semibold text-(--text-muted)">
                        Pick staff
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-500"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRemoveService(service.id);
                    }}
                  />
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`text-[7px] font-semibold ${
                      isAssigned ? "text-(--success)" : "text-(--text-muted)"
                    }`}
                  >
                    {isAssigned ? (
                      <span className="flex items-center gap-0.5">
                        <Check size={8} strokeWidth={2.5} />
                        Set
                      </span>
                    ) : (
                      "Pending"
                    )}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-(--text-muted) transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div
                  className="
                    border-t border-(--border)/50 px-3 pb-3 pt-2
                    bg-[color-mix(in_srgb,var(--accent-primary)_4%,transparent)]
                  "
                >
                  <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
                    {staffForService.map((therapist) => {
                      const active = therapist.id === assignedStaffId;

                      return (
                        <button
                          key={therapist.id}
                          type="button"
                          onClick={() =>
                            handlePickStaff(service.id, therapist.id)
                          }
                          disabled={lockStaffSelection}
                          className={`
                            feature-card w-[96px] shrink-0 rounded-xl p-1.5 text-left
                            transition-all duration-200
                            ${lockStaffSelection ? "cursor-default" : ""}
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
