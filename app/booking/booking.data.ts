import {
  BookingLocation,
  BookingService,
  BookingStaff,
  PaymentMethod,
} from "./booking.types";

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
      "https://images.unsplash.com/photo-1596178065880-2314bdb1a0b8?w=400&h=300&fit=crop",
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
];

export const bookingStaff: BookingStaff[] = [
  {
    id: "sony",
    name: "Sony",
    experience: "5 Years Experience",
    rating: 4.9,
    reviews: 234,
    specialties: "Specializes in: Swedish, Aromatherapy",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop",
  },
  {
    id: "jesai",
    name: "Jesai",
    experience: "5 Years Experience",
    rating: 4.8,
    reviews: 198,
    specialties: "Specializes in: Deep Tissue, Sports",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
  },
  {
    id: "sami",
    name: "Sami",
    experience: "5 Years Experience",
    rating: 4.7,
    reviews: 176,
    specialties: "Specializes in: Hot Stone, Relaxation",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
  },
  {
    id: "samar",
    name: "Samar",
    experience: "5 Years Experience",
    rating: 4.9,
    reviews: 210,
    specialties: "Specializes in: Couples, Aromatherapy",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop",
  },
];

export const bookingLocation: BookingLocation = {
  name: "Lomi Massage",
  address: "Ascot Vale, Melbourne",
  status: "Open Now",
  image:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=200&fit=crop",
};

export const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

export const paymentMethods: PaymentMethod[] = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "apple", label: "Apple Pay" },
  { id: "google", label: "Google Pay" },
  { id: "paypal", label: "PayPal" },
  { id: "razorpay", label: "Razorpay" },
];

export const TAX_RATE = 0.1;

export function getService(id: string) {
  return bookingServices.find((s) => s.id === id) ?? bookingServices[0];
}

export function getStaff(id: string) {
  return bookingStaff.find((s) => s.id === id) ?? bookingStaff[0];
}

export function calcTotal(subtotal: number) {
  const tax = Math.round(subtotal * TAX_RATE);
  return { subtotal, tax, total: subtotal + tax };
}
