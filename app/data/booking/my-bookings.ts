export type BookingTab = "upcoming" | "completed" | "history";
export type HistorySubTab = "completed" | "cancelled" | "refund";
export interface BookingOrganization {
  id: string;
  name: string;
  banner: string;
  thumbnail: string;
  status: string;
}

export interface Booking {
  id: string;
  service: string;
  therapist: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  organization: BookingOrganization;
  duration?: string;
  receiptNumber?: string;
  subtotal?: string;
  tax?: string;
  paymentMethod?: string;
  paidAt?: string;
}

export const organizations: Record<string, BookingOrganization> = {
  "lomi-melbourne": {
    id: "lomi-melbourne",
    name: "Lomi Massage, Melbourne",
    banner:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=400&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=200&fit=crop",
    status: "Open now",
  },
  "glamour-salon": {
    id: "glamour-salon",
    name: "Glamour Salon",
    banner:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
    status: "Open now",
  },
};

export interface SuggestedService {
  id: string;
  title: string;
  price: string;
  duration: string;
  image: string;
}

export const tabs: { id: BookingTab; label: string }[] = [
  { id: "upcoming", label: "Ongoing" },
  { id: "completed", label: "Receipt" },
  { id: "history", label: "History" },
];

export const historySubTabs: { id: HistorySubTab; label: string }[] = [
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "refund", label: "Refund" },
];

export const bookingData: Record<Exclude<BookingTab, "history">, Booking[]> = {
  upcoming: [
    {
      id: "u1",
      service: "Swedish Massage",
      therapist: "Sony",
      date: "May 22, 2026",
      time: "11:00 AM",
      location: "Lomi Massage, Melbourne",
      price: "$88",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
    {
      id: "u2",
      service: "Aromatherapy Massage",
      therapist: "Samar",
      date: "May 28, 2026",
      time: "02:00 PM",
      location: "Glamour Salon, Sydney",
      price: "$99",
      image:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
      organization: organizations["glamour-salon"],
    },
  ],
  completed: [
    {
      id: "c1",
      service: "Hot Stone Massage",
      therapist: "Sami",
      date: "Apr 12, 2026",
      time: "10:00 AM",
      location: "Lomi Massage, Melbourne",
      price: "$129",
      duration: "90 min",
      receiptNumber: "RCP-2026-0412",
      subtotal: "$117.27",
      tax: "$11.73",
      paymentMethod: "Visa •••• 4242",
      paidAt: "Apr 12, 2026 · 10:45 AM",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
    {
      id: "c2",
      service: "Deep Tissue Massage",
      therapist: "Jesai",
      date: "Mar 30, 2026",
      time: "04:00 PM",
      location: "Lomi Massage, Melbourne",
      price: "$119",
      duration: "75 min",
      receiptNumber: "RCP-2026-0330",
      subtotal: "$108.18",
      tax: "$10.82",
      paymentMethod: "Mastercard •••• 8910",
      paidAt: "Mar 30, 2026 · 04:12 PM",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
  ],
};

export const historyBookingData: Record<HistorySubTab, Booking[]> = {
  completed: [
    {
      id: "hc1",
      service: "Hot Stone Massage",
      therapist: "Sami",
      date: "Apr 12, 2026",
      time: "10:00 AM",
      location: "Lomi Massage, Melbourne",
      price: "$129",
      duration: "90 min",
      receiptNumber: "RCP-2026-0412",
      subtotal: "$117.27",
      tax: "$11.73",
      paymentMethod: "Visa •••• 4242",
      paidAt: "Apr 12, 2026 · 10:45 AM",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
    {
      id: "hc2",
      service: "Deep Tissue Massage",
      therapist: "Jesai",
      date: "Mar 30, 2026",
      time: "04:00 PM",
      location: "Lomi Massage, Melbourne",
      price: "$119",
      duration: "75 min",
      receiptNumber: "RCP-2026-0330",
      subtotal: "$108.18",
      tax: "$10.82",
      paymentMethod: "Mastercard •••• 8910",
      paidAt: "Mar 30, 2026 · 04:12 PM",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
  ],
  cancelled: [
    {
      id: "x1",
      service: "Couples Massage",
      therapist: "Samar",
      date: "Apr 02, 2026",
      time: "01:00 PM",
      location: "Lomi Massage, Melbourne",
      price: "$189",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
    {
      id: "x2",
      service: "Swedish Massage",
      therapist: "Sony",
      date: "Mar 15, 2026",
      time: "09:30 AM",
      location: "Glamour Salon, Sydney",
      price: "$88",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      organization: organizations["glamour-salon"],
    },
  ],
  refund: [
    {
      id: "r1",
      service: "Prenatal Massage",
      therapist: "Jesai",
      date: "Feb 18, 2026",
      time: "03:00 PM",
      location: "Lomi Massage, Melbourne",
      price: "$109",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
    {
      id: "r2",
      service: "Aromatherapy Massage",
      therapist: "Sami",
      date: "Jan 28, 2026",
      time: "11:30 AM",
      location: "Lomi Massage, Melbourne",
      price: "$99",
      image:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
      organization: organizations["lomi-melbourne"],
    },
  ],
};

export const suggestedServicesByTab: Record<BookingTab, SuggestedService[]> = {
  upcoming: [
    {
      id: "s-u1",
      title: "Hot Stone Massage",
      price: "$129",
      duration: "90 min",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
    },
    {
      id: "s-u2",
      title: "Indian Head Massage",
      price: "$69",
      duration: "30 min",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    },
    {
      id: "s-u3",
      title: "Reflexology",
      price: "$79",
      duration: "45 min",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
    },
  ],
  completed: [
    {
      id: "s-c1",
      title: "Couples Massage",
      price: "$189",
      duration: "90 min",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    },
    {
      id: "s-c2",
      title: "Lymphatic Drainage",
      price: "$99",
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    },
    {
      id: "s-c3",
      title: "Aromatherapy Massage",
      price: "$99",
      duration: "60 min",
      image:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
    },
  ],
  history: [
    {
      id: "s-h1",
      title: "Hot Stone Massage",
      price: "$129",
      duration: "90 min",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
    },
    {
      id: "s-h2",
      title: "Couples Massage",
      price: "$189",
      duration: "90 min",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    },
    {
      id: "s-h3",
      title: "Reflexology",
      price: "$79",
      duration: "45 min",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
    },
  ],
};
