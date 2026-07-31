import type { ExpertType } from "@/menu/components/ExpertSelection";

export interface BookingEntryParams {
  serviceIds: string[];
  expertType: ExpertType;
  organizationId?: string;
  staffId?: string;
  /** Per-service staff map encoded in the URL as staffMap=svc:staff,... */
  staffAssignments?: Record<string, string>;
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

export function buildBookingUrl({
  serviceIds,
  expertType,
  organizationId,
  staffId,
  staffAssignments,
  step = 2,
}: BookingEntryParams) {
  const params = new URLSearchParams();
  params.set("services", serviceIds.join(","));
  params.set("expert", expertType);
  params.set("step", String(step));
  if (organizationId) params.set("org", organizationId);
  if (staffId) params.set("staff", staffId);

  const encodedAssignments = staffAssignments
    ? encodeStaffAssignments(staffAssignments)
    : "";
  if (encodedAssignments) params.set("staffMap", encodedAssignments);

  return `/booking?${params.toString()}`;
}

export function parseBookingSearchParams(searchParams: URLSearchParams) {
  const services = searchParams.get("services");
  const expert = searchParams.get("expert");
  const step = searchParams.get("step");
  const org = searchParams.get("org");
  const staff = searchParams.get("staff");
  const staffMap = searchParams.get("staffMap");

  return {
    serviceIds: services ? services.split(",").filter(Boolean) : [],
    expertType:
      expert === "male" || expert === "female" ? expert : ("" as ExpertType),
    step: step ? Number(step) : 1,
    organizationId: org ?? undefined,
    staffId: staff ?? undefined,
    staffAssignments: parseStaffAssignments(staffMap),
  };
}
