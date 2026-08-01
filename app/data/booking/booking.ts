import {
  allMenuServices,
  getMenuService,
  type MenuService,
} from "@/data/catalog/menu/services";
import { getMenuProduct } from "@/data/catalog/menu/products";
import { getExtendedOrganization } from "@/data/catalog/organizations/organizations-extended";
import { PAYMENT_METHODS } from "@/data/shared/payment-methods";
import { SHARED_STAFF } from "@/data/shared/staff";
import { STUDIO_BOOKING_TIME_SLOTS } from "@/data/shared/time-slots";
import type { ExtendedService } from "@/types/organization";
import type {
  BookingDay,
  BookingLocation,
  BookingSeat,
  BookingService,
  BookingStaff,
  PaymentMethod,
  ServiceSchedule,
  ServiceSchedules,
  ServiceStaffAssignments,
} from "@/types/booking";

export const bookingServices: BookingService[] = [
  {
    id: "swedish",
    name: "Swedish Massage",
    duration: "60 min",
    price: 80,
    priceLabel: "$80",
    description:
      "A relaxing full-body massage using gentle strokes to ease tension and improve circulation.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Massage",
    duration: "75 min",
    price: 99,
    priceLabel: "$99",
    description:
      "Focused pressure techniques to release chronic muscle tension and restore mobility.",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
  },
  {
    id: "aromatherapy",
    name: "Aromatherapy Massage",
    duration: "60 min",
    price: 90,
    priceLabel: "$90",
    description:
      "Essential oils combined with soothing massage for deep relaxation and wellness.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "couples",
    name: "Couples Massage",
    duration: "90 min",
    price: 189,
    priceLabel: "$189",
    description:
      "Side-by-side massage experience for two in a serene, private setting.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "swedish new",
    name: "Swedish Massage new",
    duration: "60 min",
    price: 80,
    priceLabel: "$80",
    description:
      "A relaxing full-body massage using gentle strokes to ease tension and improve circulation.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
];

export const bookingStaff: BookingStaff[] = SHARED_STAFF;

export const bookingLocation: BookingLocation = {
  name: "Lomi Massage",
  address: "Ascot Vale, Melbourne",
  status: "Open Now",
  availability: "9AM - 6PM",
  image:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=200&fit=crop",
  banner:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=400&fit=crop",
};

export const bookingSeats: BookingSeat[] = [
  { id: "a1", label: "A1", status: "available" },
  { id: "a2", label: "A2", status: "available" },
  { id: "a3", label: "A3", status: "available" },
  { id: "a4", label: "A4", status: "available" },
  { id: "a5", label: "A5", status: "unavailable" },
  { id: "a6", label: "A6", status: "available" },
  { id: "a7", label: "A7", status: "unavailable" },
  { id: "a8", label: "A8", status: "available" },
];

export function getDefaultSeatId() {
  return bookingSeats.find((seat) => seat.status === "available")?.id ?? "a1";
}

export function getBookingSeat(id: string) {
  return bookingSeats.find((seat) => seat.id === id) ?? bookingSeats[0];
}

export const timeSlots = [...STUDIO_BOOKING_TIME_SLOTS];

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

const BOOKING_MONTHS_AHEAD = 6;

export function formatBookingDayId(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getTodayBookingDayId(from = new Date()) {
  return formatBookingDayId(from);
}

function parseBookingTimeToMinutes(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (!match) return 0;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function getAvailableTimeSlots(
  dayId: string,
  slots: readonly string[] = timeSlots,
  from = new Date(),
) {
  if (dayId !== getTodayBookingDayId(from)) {
    return [...slots];
  }

  const minimumMinutes = from.getHours() * 60 + from.getMinutes() + 30;

  return slots.filter(
    (slot) => parseBookingTimeToMinutes(slot) >= minimumMinutes,
  );
}

export function getDefaultScheduleTime(
  dayId = getTodayBookingDayId(),
  from = new Date(),
) {
  const available = getAvailableTimeSlots(dayId, timeSlots, from);
  return available[0] ?? timeSlots[0];
}

export function buildBookingDays(from = new Date()): BookingDay[] {
  const startOfToday = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate(),
  );
  const end = new Date(startOfToday);
  end.setMonth(end.getMonth() + BOOKING_MONTHS_AHEAD);

  const days: BookingDay[] = [];
  for (
    const cursor = new Date(startOfToday);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const monthLabel = MONTHS[cursor.getMonth()];
    const dayOfMonth = cursor.getDate();
    const isToday = cursor.getTime() === startOfToday.getTime();
    const iso = formatBookingDayId(cursor);

    days.push({
      id: iso,
      iso,
      weekday: isToday ? "Today" : WEEKDAYS[cursor.getDay()],
      date: `${monthLabel} ${dayOfMonth}`,
    });
  }

  return days;
}

export function getBookingDays(from = new Date()) {
  return buildBookingDays(from);
}

export const bookingDays = getBookingDays();

export function getBookingDay(id: string, from = new Date()) {
  const days = getBookingDays(from);
  return days.find((d) => d.id === id) ?? days[0];
}

export const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

export const paymentMethods: PaymentMethod[] = PAYMENT_METHODS;

export const TAX_RATE = 0.1;

function parseMenuPrice(price: string): number {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

export function menuServiceToBookingService(menu: MenuService): BookingService {
  return {
    id: menu.id,
    name: menu.title,
    duration: menu.duration,
    price: parseMenuPrice(menu.price),
    priceLabel: menu.price,
    description: "",
    image: menu.image,
  };
}

function extendedServiceToBookingService(service: ExtendedService): BookingService {
  return {
    id: service.id,
    name: service.name,
    duration: service.duration ?? "",
    price: parseMenuPrice(service.price),
    priceLabel: service.price,
    description: service.description,
    image: service.image,
  };
}

export function getService(id: string) {
  const menu = getMenuService(id);
  if (menu) return menuServiceToBookingService(menu);
  return menuServiceToBookingService(allMenuServices[0]);
}

export function getStaff(id: string) {
  return bookingStaff.find((s) => s.id === id) ?? bookingStaff[0];
}

export function getStaffByGender(gender: "male" | "female") {
  return bookingStaff.filter((staff) => staff.gender === gender);
}

export function calcTotal(subtotal: number) {
  const tax = Math.round(subtotal * TAX_RATE);
  return { subtotal, tax, total: subtotal + tax };
}

export function getSelectedServices(ids: string[], organizationId?: string) {
  const organization = organizationId
    ? getExtendedOrganization(organizationId)
    : null;

  return ids
    .map((id) => {
      const menuService = getMenuService(id);
      if (menuService) return menuServiceToBookingService(menuService);

      const organizationService = organization?.services.find(
        (service) => service.id === id,
      );
      if (organizationService) {
        return extendedServiceToBookingService(organizationService);
      }

      return undefined;
    })
    .filter((service): service is BookingService => service !== undefined);
}

export function calcServicesTotal(ids: string[], organizationId?: string) {
  const subtotal = getSelectedServices(ids, organizationId).reduce(
    (sum, service) => sum + service.price,
    0,
  );
  return calcTotal(subtotal);
}

export interface BookingProduct {
  id: string;
  name: string;
  quantity: string;
  price: number;
  priceLabel: string;
  image: string;
}

export function getSelectedProducts(ids: string[]): BookingProduct[] {
  return ids
    .map((id) => getMenuProduct(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .map((product) => ({
      id: product.id,
      name: product.title,
      quantity: product.quantity,
      price: parseMenuPrice(product.price),
      priceLabel: product.price.includes(".")
        ? product.price
        : `${product.price}.00`,
      image: product.image,
    }));
}

export function calcProductsTotal(ids: string[]) {
  const subtotal = getSelectedProducts(ids).reduce(
    (sum, product) => sum + product.price,
    0,
  );
  return calcTotal(subtotal);
}

export function getOrganizationStaff(organizationId?: string) {
  if (!organizationId) return bookingStaff;

  const organization = getExtendedOrganization(organizationId);
  const staffIds = new Set(organization.staff.map((member) => member.id));

  return bookingStaff.filter((member) => staffIds.has(member.id));
}

export function createDefaultServiceSchedule(from = new Date()): ServiceSchedule {
  const dayId = getTodayBookingDayId(from);
  return {
    dayId,
    time: getDefaultScheduleTime(dayId, from),
    isSet: false,
  };
}

export function normalizeServiceSchedule(
  schedule: ServiceSchedule,
  from = new Date(),
): ServiceSchedule {
  const days = getBookingDays(from);
  const hasValidDay = days.some((day) => day.id === schedule.dayId);
  const dayId = hasValidDay ? schedule.dayId : getTodayBookingDayId(from);
  const availableTimes = getAvailableTimeSlots(dayId, timeSlots, from);
  const time = availableTimes.includes(schedule.time)
    ? schedule.time
    : getDefaultScheduleTime(dayId, from);

  return {
    ...schedule,
    dayId,
    time,
  };
}

export function syncServiceSchedules(
  current: ServiceSchedules,
  serviceIds: string[],
): ServiceSchedules {
  const next: ServiceSchedules = {};
  for (const id of serviceIds) {
    next[id] = normalizeServiceSchedule(
      current[id] ?? createDefaultServiceSchedule(),
    );
  }
  return next;
}

export function syncServiceStaffAssignments(
  current: ServiceStaffAssignments,
  serviceIds: string[],
  defaultStaffId?: string,
): ServiceStaffAssignments {
  const next: ServiceStaffAssignments = {};
  for (const id of serviceIds) {
    if (current[id]) {
      next[id] = current[id];
    } else if (defaultStaffId) {
      next[id] = defaultStaffId;
    }
  }
  return next;
}

export function isServiceStaffAssigned(
  assignments: ServiceStaffAssignments,
  serviceId: string,
) {
  return Boolean(assignments[serviceId]);
}

export function areAllServiceStaffAssigned(
  assignments: ServiceStaffAssignments,
  serviceIds: string[],
) {
  return serviceIds.every((id) => isServiceStaffAssigned(assignments, id));
}

export function countAssignedServiceStaff(
  assignments: ServiceStaffAssignments,
  serviceIds: string[],
) {
  return serviceIds.filter((id) => isServiceStaffAssigned(assignments, id))
    .length;
}

export function getPrimaryStaffId(
  assignments: ServiceStaffAssignments,
  serviceIds: string[],
  fallback = "sony",
) {
  for (const id of serviceIds) {
    if (assignments[id]) return assignments[id];
  }
  return fallback;
}

export function isServiceScheduleComplete(schedule?: ServiceSchedule) {
  return schedule?.isSet === true;
}

export function areAllServiceSchedulesComplete(
  schedules: ServiceSchedules,
  serviceIds: string[],
) {
  return serviceIds.every((id) => isServiceScheduleComplete(schedules[id]));
}

export function countScheduledServices(
  schedules: ServiceSchedules,
  serviceIds: string[],
) {
  return serviceIds.filter((id) => isServiceScheduleComplete(schedules[id]))
    .length;
}

export function formatServiceSchedule(schedule: ServiceSchedule) {
  const day = getBookingDay(schedule.dayId);
  return `${day.date}, ${schedule.time}`;
}
