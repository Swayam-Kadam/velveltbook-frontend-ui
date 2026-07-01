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
