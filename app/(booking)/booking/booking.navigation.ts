import type { ExpertType } from "@/menu/components/ExpertSelection";

export interface BookingEntryParams {
  serviceIds: string[];
  expertType: ExpertType;
  organizationId?: string;
  staffId?: string;
  step?: number;
}

export function buildBookingUrl({
  serviceIds,
  expertType,
  organizationId,
  staffId,
  step = 2,
}: BookingEntryParams) {
  const params = new URLSearchParams();
  params.set("services", serviceIds.join(","));
  params.set("expert", expertType);
  params.set("step", String(step));
  if (organizationId) params.set("org", organizationId);
  if (staffId) params.set("staff", staffId);
  return `/booking?${params.toString()}`;
}

export function parseBookingSearchParams(searchParams: URLSearchParams) {
  const services = searchParams.get("services");
  const expert = searchParams.get("expert");
  const step = searchParams.get("step");
  const org = searchParams.get("org");
  const staff = searchParams.get("staff");

  return {
    serviceIds: services ? services.split(",").filter(Boolean) : [],
    expertType: expert === "male" || expert === "female" ? expert : ("" as ExpertType),
    step: step ? Number(step) : 1,
    organizationId: org ?? undefined,
    staffId: staff ?? undefined,
  };
}
