import { HomeExpert, HomeService } from "./help.types";

export const homeServices: HomeService[] = [
  {
    id: "manicure",
    name: "Manicure",
    price: "$80",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=300&fit=crop",
  },
  {
    id: "haircut",
    name: "Haircut",
    price: "$60",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop",
  },
  {
    id: "facial",
    name: "Facial",
    price: "$90",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd955edae04?w=300&h=300&fit=crop",
  },
  {
    id: "hair-color",
    name: "Hair Color",
    price: "$120",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop",
  },
];

export const maleExperts: HomeExpert[] = [
  {
    id: "m1",
    name: "Rahul Sharma",
    profession: "Hair Stylist",
    rating: 4.8,
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    gender: "male",
  },
  {
    id: "m2",
    name: "Amit Verma",
    profession: "Massage Therapist",
    rating: 4.7,
    reviews: 95,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    gender: "male",
  },
  {
    id: "m3",
    name: "Vikram Singh",
    profession: "Grooming Expert",
    rating: 4.6,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    gender: "male",
  },
];

export const femaleExperts: HomeExpert[] = [
  {
    id: "f1",
    name: "Priya Mehta",
    profession: "Hair Stylist",
    rating: 4.9,
    reviews: 155,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    gender: "female",
  },
  {
    id: "f2",
    name: "Neha Kapoor",
    profession: "Beautician",
    rating: 4.8,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    gender: "female",
  },
  {
    id: "f3",
    name: "Sneha Iyer",
    profession: "Makeup Artist",
    rating: 4.7,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    gender: "female",
  },
];
