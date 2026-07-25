export interface BookingService {
  id: string;
  name: string;
  duration: string;
  price: number;
  priceLabel: string;
  description: string;
  image: string;
}

export interface BookingStaff {
  id: string;
  name: string;
  experience: string;
  rating: number;
  reviews: number;
  specialties: string;
  image: string;
  gender: "male" | "female";
}

export interface BookingLocation {
  name: string;
  address: string;
  status: string;
  availability: string;
  image: string;
  banner: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
}

export interface BookingDay {
  id: string;
  iso: string;
  weekday: string;
  date: string;
}

export interface BookingSeat {
  id: string;
  label: string;
  status: "available" | "unavailable";
}

export interface ServiceSchedule {
  dayId: string;
  time: string;
  isSet: boolean;
}

export type ServiceSchedules = Record<string, ServiceSchedule>;

/** Maps each selected service id to a staff id. */
export type ServiceStaffAssignments = Record<string, string>;

export interface BookingState {
  serviceId: string;
  staffId: string;
  selectedDayId: string;
  selectedTime: string;
  paymentMethod: string;
  promoCode: string;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
}

export interface LocationSuggestion {
  id: string;
  label: string;
  suburb: string;
}

export type DayAvailabilityStatus =
  | "available"
  | "limited"
  | "full"
  | "closed";

export interface BookingExpertSummary {
  id: string;
  name: string;
  image: string;
  coverImage: string;
  specialty: string;
  verified: boolean;
  rating: number;
  reviews: number;
  distance: string;
  language: string;
  about: string;
  availableToday: boolean;
  expertLocation: string;
  nationality: string;
  languages: string[];
  experienceSummary: string;
  specialization: string;
}

export interface BookingServiceItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  image: string;
}

export interface BookingData {
  currency: string;
  expert: BookingExpertSummary;
  selectedServices: BookingServiceItem[];
  suggestedServices: BookingServiceItem[];
  days: BookingDay[];
  times: string[];
  defaultDayId: string;
  defaultTime: string;
}
