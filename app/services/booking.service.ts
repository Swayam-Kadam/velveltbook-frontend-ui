import { EXPERT_BOOKING_TIME_SLOTS } from "@/data/shared/time-slots";
import { getExpertProfile } from "@/services/experts.service";
import type { BookingData, BookingDay, DayAvailabilityStatus } from "@/types/booking";
import type { ServiceItem } from "@/types/expert";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const BOOKING_MONTHS_AHEAD = 6;

const DEFAULT_LOCATION = "South Yarra, 3141 VIC";

function buildScheduleDays(from = new Date()): BookingDay[] {
  const startOfToday = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate(),
  );
  const end = new Date(from.getFullYear(), from.getMonth() + BOOKING_MONTHS_AHEAD, 0);

  const days: BookingDay[] = [];
  for (
    const cursor = new Date(startOfToday);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const monthLabel = MONTHS[cursor.getMonth()];
    const dayOfMonth = cursor.getDate();
    const isToday = cursor.getTime() === startOfToday.getTime();
    const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`;
    days.push({
      id: iso,
      iso,
      weekday: isToday ? "Today" : WEEKDAYS[cursor.getDay()],
      date: `${monthLabel} ${dayOfMonth}`,
    });
  }
  return days;
}

function hashString(value: string): number {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getDayAvailabilityStatus(
  expertId: string,
  serviceId: string,
  iso: string,
): DayAvailabilityStatus {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "closed";

  if (date.getDay() === 0) return "closed";

  const hash = hashString(`${expertId}:${serviceId}:${iso}`);
  if (hash % 19 === 0) return "closed";
  if (hash % 13 === 0) return "full";
  if (hash % 7 === 0 || hash % 11 === 0) return "limited";
  return "available";
}

export function isDaySelectable(status: DayAvailabilityStatus): boolean {
  return status === "available" || status === "limited";
}

export function getAvailableTimeSlots(
  expertId: string,
  serviceId: string,
  iso: string,
): string[] {
  const status = getDayAvailabilityStatus(expertId, serviceId, iso);
  if (status === "closed" || status === "full") return [];

  const hash = hashString(`${expertId}:${serviceId}:${iso}:slots`);
  const slots = EXPERT_BOOKING_TIME_SLOTS.filter((_, index) => (hash + index) % 4 !== 0);

  if (status === "limited") {
    return slots.slice(0, Math.max(2, (hash % 3) + 2));
  }

  return [...slots];
}

export const DEFAULT_TIME_SLOTS = [...EXPERT_BOOKING_TIME_SLOTS];

export async function getBookingDataForExpert(
  expertId: string | undefined,
  serviceIds: string[] | undefined,
): Promise<BookingData | null> {
  if (!expertId) return null;

  const profile = await getExpertProfile(expertId);
  if (!profile) return null;

  const allServices: ServiceItem[] = profile.serviceCategories.flatMap(
    (category) => category.services,
  );

  const requested = serviceIds?.filter(Boolean) ?? [];
  const requestedSet = new Set(requested);

  const selectedServices = requested
    .map((id) => allServices.find((service) => service.id === id))
    .filter((service): service is ServiceItem => Boolean(service));

  if (selectedServices.length === 0) return null;

  const primaryServices = profile.serviceCategories[0]?.services ?? [];
  const primaryIds = new Set(primaryServices.map((service) => service.id));
  const suggestedServices = [
    ...primaryServices.filter((service) => !requestedSet.has(service.id)),
    ...allServices.filter(
      (service) =>
        !requestedSet.has(service.id) && !primaryIds.has(service.id),
    ),
  ].slice(0, 8);

  const days = buildScheduleDays();
  const times = [...EXPERT_BOOKING_TIME_SLOTS];

  return {
    currency: profile.currency,
    expert: {
      id: profile.id,
      name: profile.name,
      image: profile.image,
      coverImage: profile.coverImage,
      specialty: profile.specialty,
      verified: profile.verified,
      rating: profile.rating,
      reviews: profile.reviews,
      distance: profile.distance,
      language: profile.languages[0] ?? "English",
      about: profile.about,
      availableToday: profile.availableToday,
      expertLocation: DEFAULT_LOCATION,
      nationality: profile.nationality,
      languages: profile.languages,
      experienceSummary: profile.experienceSummary,
      specialization: profile.specialization,
    },
    selectedServices,
    suggestedServices,
    days,
    times,
    defaultDayId: days[0]?.id ?? "",
    defaultTime: times.includes("11:00 AM") ? "11:00 AM" : (times[0] ?? ""),
  };
}
