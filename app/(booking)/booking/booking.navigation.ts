import type { ExpertType } from "@/menu/components/ExpertSelection";
import type { ServiceSchedules } from "./booking.types";

export interface BookingEntryParams {
  serviceIds?: string[];
  productIds?: string[];
  expertType?: ExpertType;
  organizationId?: string;
  staffId?: string;
  /** Per-service staff map encoded in the URL as staffMap=svc:staff,... */
  staffAssignments?: Record<string, string>;
  /** Per-service schedules encoded as scheduleMap=svc|dayId|time,... */
  scheduleAssignments?: Record<string, { dayId: string; time: string }>;
  /** Per-product quantities encoded as qtyMap=productId:qty,... */
  productQuantities?: Record<string, number>;
  step?: number;
}

export function encodeStaffAssignments(
  assignments: Record<string, string>,
): string {
  return Object.entries(assignments)
    .filter(([serviceId, staffId]) => serviceId && staffId)
    .map(([serviceId, staffId]) => `${serviceId}:${staffId}`)
    .join(",");
}

export function parseStaffAssignments(
  raw: string | null,
): Record<string, string> {
  if (!raw) return {};

  const assignments: Record<string, string> = {};
  for (const part of raw.split(",")) {
    const [serviceId, staffId] = part.split(":");
    if (serviceId && staffId) {
      assignments[serviceId] = staffId;
    }
  }
  return assignments;
}

export function encodeScheduleAssignments(
  schedules: Record<string, { dayId: string; time: string }>,
): string {
  return Object.entries(schedules)
    .filter(
      ([serviceId, schedule]) => serviceId && schedule.dayId && schedule.time,
    )
    .map(
      ([serviceId, schedule]) =>
        `${serviceId}|${schedule.dayId}|${encodeURIComponent(schedule.time)}`,
    )
    .join(",");
}

export function parseScheduleAssignments(raw: string | null): ServiceSchedules {
  if (!raw) return {};

  const schedules: ServiceSchedules = {};
  for (const part of raw.split(",")) {
    const [serviceId, dayId, encodedTime] = part.split("|");
    if (!serviceId || !dayId || !encodedTime) continue;

    schedules[serviceId] = {
      dayId,
      time: decodeURIComponent(encodedTime),
      isSet: true,
    };
  }
  return schedules;
}

export function encodeProductQuantities(
  quantities: Record<string, number>,
): string {
  return Object.entries(quantities)
    .filter(([productId, qty]) => productId && qty > 0)
    .map(([productId, qty]) => `${productId}:${Math.max(1, Math.floor(qty))}`)
    .join(",");
}

export function parseProductQuantities(
  raw: string | null,
): Record<string, number> {
  if (!raw) return {};

  const quantities: Record<string, number> = {};
  for (const part of raw.split(",")) {
    const [productId, qtyRaw] = part.split(":");
    const qty = Number(qtyRaw);
    if (productId && Number.isFinite(qty) && qty > 0) {
      quantities[productId] = Math.max(1, Math.floor(qty));
    }
  }
  return quantities;
}

export function buildBookingUrl({
  serviceIds = [],
  productIds = [],
  expertType = "",
  organizationId,
  staffId,
  staffAssignments,
  scheduleAssignments,
  productQuantities,
  step = 2,
}: BookingEntryParams) {
  const params = new URLSearchParams();
  if (serviceIds.length > 0) {
    params.set("services", serviceIds.join(","));
  }
  if (productIds.length > 0) {
    params.set("products", productIds.join(","));
  }
  params.set("expert", expertType);
  params.set("step", String(step));
  if (organizationId) params.set("org", organizationId);
  if (staffId) params.set("staff", staffId);

  const encodedAssignments = staffAssignments
    ? encodeStaffAssignments(staffAssignments)
    : "";
  if (encodedAssignments) params.set("staffMap", encodedAssignments);

  const encodedSchedules = scheduleAssignments
    ? encodeScheduleAssignments(scheduleAssignments)
    : "";
  if (encodedSchedules) params.set("scheduleMap", encodedSchedules);

  const encodedQuantities = productQuantities
    ? encodeProductQuantities(productQuantities)
    : "";
  if (encodedQuantities) params.set("qtyMap", encodedQuantities);

  return `/booking?${params.toString()}`;
}

export function parseBookingSearchParams(searchParams: URLSearchParams) {
  const services = searchParams.get("services");
  const products = searchParams.get("products");
  const expert = searchParams.get("expert");
  const step = searchParams.get("step");
  const org = searchParams.get("org");
  const staff = searchParams.get("staff");
  const staffMap = searchParams.get("staffMap");
  const scheduleMap = searchParams.get("scheduleMap");
  const qtyMap = searchParams.get("qtyMap");

  const productIds = products ? products.split(",").filter(Boolean) : [];
  const parsedQuantities = parseProductQuantities(qtyMap);
  const productQuantities = Object.fromEntries(
    productIds.map((id) => [id, parsedQuantities[id] ?? 1]),
  );

  return {
    serviceIds: services ? services.split(",").filter(Boolean) : [],
    productIds,
    expertType:
      expert === "male" || expert === "female" ? expert : ("" as ExpertType),
    step: step ? Number(step) : 1,
    organizationId: org ?? undefined,
    staffId: staff ?? undefined,
    staffAssignments: parseStaffAssignments(staffMap),
    scheduleAssignments: parseScheduleAssignments(scheduleMap),
    productQuantities,
  };
}
