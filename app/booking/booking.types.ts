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
  image: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
}

export interface BookingState {
  serviceId: string;
  staffId: string;
  selectedDate: number;
  selectedTime: string;
  paymentMethod: string;
  promoCode: string;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
}
