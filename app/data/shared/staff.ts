import type { BookingStaff } from "@/types/booking";

/** Shared demo staff used across booking, organization, and my-bookings flows. */
export const SHARED_STAFF: BookingStaff[] = [
  {
    id: "sony",
    name: "Sony",
    experience: "5 Years Exp",
    rating: 4.9,
    reviews: 234,
    specialties: "Specializes in: Swedish, Aromatherapy",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop",
    gender: "female",
  },
  {
    id: "jesai",
    name: "Jesai",
    experience: "5 Years Exp",
    rating: 4.8,
    reviews: 198,
    specialties: "Specializing, designed",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
    gender: "female",
  },
  {
    id: "sami",
    name: "Sami",
    experience: "5 Years Exp",
    rating: 4.7,
    reviews: 176,
    specialties: "Specializes in: Hot Stone, Relaxation",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
    gender: "female",
  },
  {
    id: "samar",
    name: "Samar",
    experience: "5 Years Exp",
    rating: 4.9,
    reviews: 210,
    specialties: "Specializes in: Couples, Aromatherapy",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&q=80",
    gender: "male",
  },
];
