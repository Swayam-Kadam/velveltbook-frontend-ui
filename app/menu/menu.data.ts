import {
  Flower2,
  Gift,
  Hand,
  HandMetal,
  Leaf,
  Palette,
  Plus,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface MenuCategory {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface MenuService {
  id: string;
  categoryId: string;
  title: string;
  price: string;
  duration: string;
  image: string;
}

export const SERVICES_PER_PAGE = 6;

export const menuCategories: MenuCategory[] = [
  { id: "massage", label: "Massage Therapy", icon: Hand },
  { id: "nails", label: "Nail Care", icon: HandMetal },
  { id: "facials", label: "Facials & Skincare", icon: Flower2 },
  { id: "hair", label: "Hair Services", icon: Scissors },
  { id: "makeup", label: "Makeup & Brows", icon: Palette },
  { id: "waxing", label: "Waxing & Body Care", icon: Sparkles },
  { id: "pamper", label: "Pamper Packages", icon: Gift },
  { id: "wellness", label: "Wellness", icon: Leaf },
  { id: "addons", label: "Add-ons", icon: Plus },
];

export const allMenuServices: MenuService[] = [
  // Massage Therapy
  {
    id: "m1",
    categoryId: "massage",
    title: "Swedish Massage",
    price: "$99",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "m2",
    categoryId: "massage",
    title: "Deep Tissue Massage",
    price: "$119",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
  },
  {
    id: "m3",
    categoryId: "massage",
    title: "Hot Stone Massage",
    price: "$129",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
  },
  {
    id: "m4",
    categoryId: "massage",
    title: "Prenatal Massage",
    price: "$109",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "m5",
    categoryId: "massage",
    title: "Aromatherapy Massage",
    price: "$99",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
  },
  {
    id: "m6",
    categoryId: "massage",
    title: "Couples Massage",
    price: "$189",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "m7",
    categoryId: "massage",
    title: "Lymphatic Drainage",
    price: "$99",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "m8",
    categoryId: "massage",
    title: "Reflexology",
    price: "$79",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
  },
  {
    id: "m9",
    categoryId: "massage",
    title: "Indian Head Massage",
    price: "$69",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  // Nail Care
  {
    id: "n1",
    categoryId: "nails",
    title: "Classic Manicure",
    price: "$45",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "n2",
    categoryId: "nails",
    title: "Gel Manicure",
    price: "$65",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727da125ecd?w=400&h=300&fit=crop",
  },
  {
    id: "n3",
    categoryId: "nails",
    title: "Classic Pedicure",
    price: "$55",
    duration: "50 min",
    image:
      "https://images.unsplash.com/photo-1519014816541-b641691e944f?w=400&h=300&fit=crop",
  },
  {
    id: "n4",
    categoryId: "nails",
    title: "Spa Pedicure",
    price: "$75",
    duration: "70 min",
    image:
      "https://images.unsplash.com/photo-1607779097047-632e65717349?w=400&h=300&fit=crop",
  },
  {
    id: "n5",
    categoryId: "nails",
    title: "Acrylic Full Set",
    price: "$85",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
  },
  {
    id: "n6",
    categoryId: "nails",
    title: "Nail Art Design",
    price: "$35",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727da125ecd?w=400&h=300&fit=crop",
  },
  {
    id: "n7",
    categoryId: "nails",
    title: "Paraffin Treatment",
    price: "$25",
    duration: "20 min",
    image:
      "https://images.unsplash.com/photo-1519014816541-b641691e944f?w=400&h=300&fit=crop",
  },
  // Facials & Skincare
  {
    id: "f1",
    categoryId: "facials",
    title: "Classic Facial",
    price: "$89",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
  },
  {
    id: "f2",
    categoryId: "facials",
    title: "Hydrating Facial",
    price: "$99",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc2360?w=400&h=300&fit=crop",
  },
  {
    id: "f3",
    categoryId: "facials",
    title: "Anti-Aging Facial",
    price: "$129",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
  },
  {
    id: "f4",
    categoryId: "facials",
    title: "Acne Treatment",
    price: "$109",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc2360?w=400&h=300&fit=crop",
  },
  {
    id: "f5",
    categoryId: "facials",
    title: "Microdermabrasion",
    price: "$119",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
  },
  {
    id: "f6",
    categoryId: "facials",
    title: "LED Light Therapy",
    price: "$79",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc2360?w=400&h=300&fit=crop",
  },
  {
    id: "f7",
    categoryId: "facials",
    title: "Gold Facial",
    price: "$149",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
  },
  // Hair Services
  {
    id: "h1",
    categoryId: "hair",
    title: "Haircut & Style",
    price: "$65",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  },
  {
    id: "h2",
    categoryId: "hair",
    title: "Blow Dry",
    price: "$45",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
  },
  {
    id: "h3",
    categoryId: "hair",
    title: "Full Color",
    price: "$149",
    duration: "120 min",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  },
  {
    id: "h4",
    categoryId: "hair",
    title: "Highlights",
    price: "$179",
    duration: "150 min",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
  },
  {
    id: "h5",
    categoryId: "hair",
    title: "Keratin Treatment",
    price: "$199",
    duration: "120 min",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  },
  {
    id: "h6",
    categoryId: "hair",
    title: "Scalp Treatment",
    price: "$55",
    duration: "40 min",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
  },
  {
    id: "h7",
    categoryId: "hair",
    title: "Bridal Updo",
    price: "$120",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  },
  // Makeup & Brows
  {
    id: "mk1",
    categoryId: "makeup",
    title: "Event Makeup",
    price: "$95",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
  },
  {
    id: "mk2",
    categoryId: "makeup",
    title: "Bridal Makeup",
    price: "$180",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
  },
  {
    id: "mk3",
    categoryId: "makeup",
    title: "Brow Shaping",
    price: "$35",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
  },
  {
    id: "mk4",
    categoryId: "makeup",
    title: "Brow Tint",
    price: "$25",
    duration: "20 min",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
  },
  {
    id: "mk5",
    categoryId: "makeup",
    title: "Lash Extensions",
    price: "$120",
    duration: "120 min",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
  },
  {
    id: "mk6",
    categoryId: "makeup",
    title: "Lash Lift & Tint",
    price: "$85",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
  },
  // Waxing & Body Care
  {
    id: "w1",
    categoryId: "waxing",
    title: "Full Leg Wax",
    price: "$65",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1515377901643-3387a6ef5f2b?w=400&h=300&fit=crop",
  },
  {
    id: "w2",
    categoryId: "waxing",
    title: "Brazilian Wax",
    price: "$55",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1515377901643-3387a6ef5f2b?w=400&h=300&fit=crop",
  },
  {
    id: "w3",
    categoryId: "waxing",
    title: "Underarm Wax",
    price: "$25",
    duration: "15 min",
    image:
      "https://images.unsplash.com/photo-1515377901643-3387a6ef5f2b?w=400&h=300&fit=crop",
  },
  {
    id: "w4",
    categoryId: "waxing",
    title: "Full Arm Wax",
    price: "$45",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1515377901643-3387a6ef5f2b?w=400&h=300&fit=crop",
  },
  {
    id: "w5",
    categoryId: "waxing",
    title: "Back Wax",
    price: "$50",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1515377901643-3387a6ef5f2b?w=400&h=300&fit=crop",
  },
  {
    id: "w6",
    categoryId: "waxing",
    title: "Body Scrub",
    price: "$89",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "w7",
    categoryId: "waxing",
    title: "Body Wrap",
    price: "$99",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  // Pamper Packages
  {
    id: "p1",
    categoryId: "pamper",
    title: "Relax & Renew",
    price: "$199",
    duration: "120 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "p2",
    categoryId: "pamper",
    title: "Spa Day Escape",
    price: "$299",
    duration: "180 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "p3",
    categoryId: "pamper",
    title: "Couples Retreat",
    price: "$349",
    duration: "150 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "p4",
    categoryId: "pamper",
    title: "Bridal Bliss",
    price: "$399",
    duration: "240 min",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
  },
  {
    id: "p5",
    categoryId: "pamper",
    title: "Ultimate Glow",
    price: "$249",
    duration: "150 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
  },
  {
    id: "p6",
    categoryId: "pamper",
    title: "Mother & Daughter",
    price: "$279",
    duration: "120 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  // Wellness
  {
    id: "wl1",
    categoryId: "wellness",
    title: "Yoga Session",
    price: "$45",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  },
  {
    id: "wl2",
    categoryId: "wellness",
    title: "Meditation Class",
    price: "$35",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
  },
  {
    id: "wl3",
    categoryId: "wellness",
    title: "Sauna Session",
    price: "$40",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "wl4",
    categoryId: "wellness",
    title: "Stretch Therapy",
    price: "$75",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  },
  {
    id: "wl5",
    categoryId: "wellness",
    title: "Breathwork Session",
    price: "$55",
    duration: "50 min",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
  },
  {
    id: "wl6",
    categoryId: "wellness",
    title: "Nutrition Consult",
    price: "$65",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  },
  // Add-ons
  {
    id: "a1",
    categoryId: "addons",
    title: "Scalp Massage Add-on",
    price: "$20",
    duration: "15 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "a2",
    categoryId: "addons",
    title: "Hot Towel Treatment",
    price: "$15",
    duration: "10 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "a3",
    categoryId: "addons",
    title: "Aromatherapy Upgrade",
    price: "$18",
    duration: "10 min",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
  },
  {
    id: "a4",
    categoryId: "addons",
    title: "Extended Massage",
    price: "$35",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "a5",
    categoryId: "addons",
    title: "Eye Treatment",
    price: "$25",
    duration: "20 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
  },
  {
    id: "a6",
    categoryId: "addons",
    title: "Hand & Foot Mask",
    price: "$22",
    duration: "20 min",
    image:
      "https://images.unsplash.com/photo-1519014816541-b641691e944f?w=400&h=300&fit=crop",
  },
];

/** @deprecated Use allMenuServices — kept for backward compatibility */
export const massageServices: MenuService[] = allMenuServices.filter(
  (s) => s.categoryId === "massage",
);

export function getServicesByCategory(categoryId: string): MenuService[] {
  return allMenuServices.filter((s) => s.categoryId === categoryId);
}

export function getMenuService(id: string): MenuService | undefined {
  return allMenuServices.find((s) => s.id === id);
}

export function getTotalPages(
  count: number,
  perPage = SERVICES_PER_PAGE,
): number {
  return Math.max(1, Math.ceil(count / perPage));
}

export function paginateServices(
  services: MenuService[],
  page: number,
  perPage = SERVICES_PER_PAGE,
): MenuService[] {
  const start = (page - 1) * perPage;
  return services.slice(start, start + perPage);
}
