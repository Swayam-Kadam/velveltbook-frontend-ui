import { ExpertProfile } from "./expert.types";

const defaultReviews = [
  {
    id: "r1",
    name: "Sarah M.",
    rating: 5.0,
    text: "Absolutely amazing experience! Georgina really understood exactly what I wanted.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "r2",
    name: "Emily R.",
    rating: 4.8,
    text: "Professional, friendly, and incredibly talented. My hair has never looked better!",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
];

export const experts: Record<string, ExpertProfile> = {
  e1: {
    id: "e1",
    name: "Georgina Kate",
    title: "Certified Hairdresser",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 119,
    experience: "10 Years Experience",
    description:
      "With over 10 years of professional experience, Georgina specializes in precision haircuts, advanced styling, and personalized hair care. She is passionate about creating looks that enhance natural beauty while maintaining hair health. Known for her attention to detail and warm personality, Georgina ensures every client leaves feeling confident and refreshed.",
    tags: [
      "Hair Cut",
      "Free Styling",
      "Blow Dry",
      "Hair Spa",
      "Coloring",
      "Keratin",
    ],
    certificationTitle: "Certified in Hair Cutting & Styling",
    certificationItems: [
      "Advanced Hair Design Diploma",
      "Professional Salon Training Certified",
    ],
    reviewsList: defaultReviews,
    hobbies: [
      { id: "h1", label: "Creative Styling", icon: "palette" },
      { id: "h2", label: "Fashion Photography", icon: "camera" },
      { id: "h3", label: "Traveling", icon: "plane" },
      { id: "h4", label: "Hair Trends Research", icon: "search" },
      { id: "h5", label: "Creating Hair Tutorials", icon: "video" },
    ],
  },
  e2: {
    id: "e2",
    name: "Sophia Brown",
    title: "Senior Nail Technician",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 112,
    experience: "7 Years Experience",
    description:
      "Sophia brings seven years of nail artistry expertise, specializing in gel manicures, nail art, and restorative nail care. Her meticulous approach and creative designs have earned her a loyal client base.",
    tags: ["Manicure", "Pedicure", "Nail Art", "Gel Polish", "Acrylic", "Spa"],
    certificationTitle: "Certified Nail Technician",
    certificationItems: [
      "Advanced Nail Art Certification",
      "Professional Manicure Diploma",
    ],
    reviewsList: defaultReviews,
    hobbies: [
      { id: "h1", label: "Creative Styling", icon: "palette" },
      { id: "h2", label: "Fashion Photography", icon: "camera" },
      { id: "h3", label: "Traveling", icon: "plane" },
      { id: "h4", label: "Nail Trends Research", icon: "search" },
      { id: "h5", label: "Creating Tutorials", icon: "video" },
    ],
  },
  e3: {
    id: "e3",
    name: "Olivia Martinez",
    title: "Expert Manicurist",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 76,
    experience: "5 Years Experience",
    description:
      "Olivia is a skilled manicurist known for elegant, long-lasting nail finishes and a calming salon experience. She focuses on precision, hygiene, and personalized care for every client.",
    tags: ["Manicure", "French Tips", "Blow Dry", "Spa", "Coloring", "Care"],
    certificationTitle: "Certified Manicure Specialist",
    certificationItems: [
      "Professional Manicure Certificate",
      "Salon Hygiene & Safety Certified",
    ],
    reviewsList: defaultReviews,
    hobbies: [
      { id: "h1", label: "Creative Styling", icon: "palette" },
      { id: "h2", label: "Fashion Photography", icon: "camera" },
      { id: "h3", label: "Traveling", icon: "plane" },
      { id: "h4", label: "Beauty Research", icon: "search" },
      { id: "h5", label: "Creating Tutorials", icon: "video" },
    ],
  },
};

export function getExpert(id: string): ExpertProfile {
  return experts[id] ?? experts.e1;
}
