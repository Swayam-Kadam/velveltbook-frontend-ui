import { Organization } from "./organization.types";

const defaultServices = [
  {
    id: "s1",
    name: "Haircut & Style",
    duration: "45 mins",
    price: "$60",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
  },
  {
    id: "s2",
    name: "Manicure",
    duration: "30 mins",
    price: "$35",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop",
  },
  {
    id: "s3",
    name: "Facial",
    duration: "60 mins",
    price: "$80",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd955edae04?w=200&h=200&fit=crop",
  },
];

const defaultExperts = [
  {
    id: "e1",
    name: "Georgina Kate",
    specialty: "Senior Hair Stylist",
    rating: 4.9,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    online: true,
  },
  {
    id: "e2",
    name: "Sophia Brown",
    specialty: "Nail Specialist",
    rating: 4.8,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    online: true,
  },
  {
    id: "e3",
    name: "Olivia Martinez",
    specialty: "Skincare Expert",
    rating: 4.7,
    reviews: 52,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    online: false,
  },
];

export const organizations: Record<string, Organization> = {
  "store-1": {
    id: "store-1",
    name: "Glamour Salon",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
    categories: ["Hair", "Nails", "Skin"],
    location: "123 Beauty Street, New York, NY",
    rating: 4.8,
    reviews: 324,
    status: "Open",
    closesAt: "9 PM",
    services: defaultServices,
    experts: defaultExperts,
  },
  "store-2": {
    id: "store-2",
    name: "Urban Massage Studio",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop",
    categories: ["Massage", "Spa", "Wellness"],
    location: "Mumbai, India",
    rating: 4.7,
    reviews: 218,
    status: "Open",
    closesAt: "7 PM",
    services: defaultServices,
    experts: defaultExperts,
  },
  "store-3": {
    id: "store-3",
    name: "Glow Beauty Salon",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
    categories: ["Hair", "Makeup", "Skin"],
    location: "Indore, India",
    rating: 4.9,
    reviews: 412,
    status: "Open",
    closesAt: "5 PM",
    services: defaultServices,
    experts: defaultExperts,
  },
  "org-trending-2": {
    id: "org-trending-2",
    name: "Lori Massage Parlour",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=400&fit=crop",
    categories: ["Massage", "Spa", "Wellness"],
    location: "1.2km away",
    rating: 4.6,
    reviews: 156,
    status: "Open",
    closesAt: "5 PM",
    services: defaultServices,
    experts: defaultExperts,
  },
  "org-expert-1": {
    id: "org-expert-1",
    name: "Aroma Therapy Bliss",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop",
    categories: ["Aromatherapy", "Spa", "Massage"],
    location: "0.8km away",
    rating: 4.9,
    reviews: 124,
    status: "Open",
    closesAt: "8 PM",
    services: defaultServices,
    experts: defaultExperts,
  },
  "org-expert-2": {
    id: "org-expert-2",
    name: "The Zen Retreat",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop",
    categories: ["Wellness", "Spa", "Massage"],
    location: "2.4km away",
    rating: 4.7,
    reviews: 89,
    status: "Open",
    closesAt: "9 PM",
    services: defaultServices,
    experts: defaultExperts,
  },
};

export function getOrganization(id: string): Organization {
  return organizations[id] ?? organizations["store-1"];
}
