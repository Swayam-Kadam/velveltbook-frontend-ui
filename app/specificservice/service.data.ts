import { ServiceDetail } from "./service.types";

const manicureExperts = [
  {
    id: "e1",
    name: "Georgina Kate",
    specialty: "Certified Nail Artist",
    rating: 4.9,
    reviews: 89,
    experience: "10 Years Exp",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    online: true,
  },
  {
    id: "e2",
    name: "Sophia Brown",
    specialty: "Senior Nail Technician",
    rating: 4.8,
    reviews: 112,
    experience: "7 Years Exp",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    online: true,
  },
  {
    id: "e3",
    name: "Olivia Martinez",
    specialty: "Expert Manicurist",
    rating: 4.9,
    reviews: 76,
    experience: "5 Years Exp",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    online: true,
  },
];

export const services: Record<string, ServiceDetail> = {
  s1: {
    id: "s1",
    name: "Haircut & Style",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=520&fit=crop",
    rating: 4.7,
    reviews: 203,
    duration: "45 mins",
    description:
      "A precision haircut and styling session tailored to your look, finished with premium products for a polished, salon-quality result.",
    price: "$60",
    experts: manicureExperts.map((expert) => ({
      ...expert,
      specialty: "Senior Hair Stylist",
    })),
  },
  s2: {
    id: "s2",
    name: "Manicure",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=520&fit=crop",
    rating: 4.8,
    reviews: 119,
    duration: "45 mins",
    description:
      "A professional manicure to keep your nails healthy, elegant, and perfectly polished with premium care.",
    price: "$80",
    experts: manicureExperts,
  },
  s3: {
    id: "s3",
    name: "Facial",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd955edae04?w=400&h=520&fit=crop",
    rating: 4.9,
    reviews: 156,
    duration: "60 mins",
    description:
      "A rejuvenating facial treatment designed to cleanse, hydrate, and restore your skin's natural glow with expert care.",
    price: "$80",
    experts: manicureExperts.map((expert) => ({
      ...expert,
      specialty: "Skincare Specialist",
    })),
  },
};

export function getService(id: string): ServiceDetail {
  return services[id] ?? services.s2;
}
