import {
  allMenuServices,
  getMenuService,
  type MenuService,
} from "@/data/catalog/menu/services";
import { PAYMENT_METHODS } from "@/data/shared/payment-methods";
import { SHARED_STAFF } from "@/data/shared/staff";
import { STUDIO_BOOKING_TIME_SLOTS } from "@/data/shared/time-slots";
import type {
  BookingDay,
  BookingLocation,
  BookingSeat,
  BookingService,
  BookingStaff,
  PaymentMethod,
  ServiceSchedule,
  ServiceSchedules,
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

export function buildBookingDays(from = new Date(2026, 4, 20)): BookingDay[] {
  const startOfToday = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate(),
  );
  const end = new Date(
    from.getFullYear(),
    from.getMonth() + BOOKING_MONTHS_AHEAD,
    0,
  );

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

export const bookingDays = buildBookingDays();

export function getBookingDay(id: string) {
  return bookingDays.find((d) => d.id === id) ?? bookingDays[0];
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

export function getSelectedServices(ids: string[]) {
  return ids
    .map((id) => getMenuService(id))
    .filter((service): service is MenuService => service !== undefined)
    .map(menuServiceToBookingService);
}

export function calcServicesTotal(ids: string[]) {
  const subtotal = getSelectedServices(ids).reduce((sum, s) => sum + s.price, 0);
  return calcTotal(subtotal);
}

export const DEFAULT_SCHEDULE_DAY_ID = "2026-05-22";
export const DEFAULT_SCHEDULE_TIME = "11:00 AM";

export function createDefaultServiceSchedule(): ServiceSchedule {
  return {
    dayId: DEFAULT_SCHEDULE_DAY_ID,
    time: DEFAULT_SCHEDULE_TIME,
    isSet: false,
  };
}

export function syncServiceSchedules(
  current: ServiceSchedules,
  serviceIds: string[],
): ServiceSchedules {
  const next: ServiceSchedules = {};
  for (const id of serviceIds) {
    next[id] = current[id] ?? createDefaultServiceSchedule();
  }
  return next;
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
