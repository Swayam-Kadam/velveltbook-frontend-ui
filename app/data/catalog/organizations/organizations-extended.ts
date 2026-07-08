import { massageServices } from "@/data/catalog/menu/services";
import type { ExtendedOrganization, ExtendedService } from "@/types/organization";

function toExtendedService(
  service: { id: string; title: string; price: string; duration: string; image: string },
  categoryId: string,
): ExtendedService {
  return {
    id: service.id,
    name: service.title,
    description: "Premium treatment crafted for comfort.",
    price: service.price,
    duration: service.duration,
    image: service.image,
    categoryId,
  };
}

const massageExtendedServices: ExtendedService[] = [
  ...massageServices.map((s) => toExtendedService(s, "massage")),
  {
    id: "m10",
    name: "Sports Massage",
    description: "Premium treatment crafted for comfort.",
    price: "$119",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    categoryId: "massage",
  },
  {
    id: "m11",
    name: "Thai Massage",
    description: "Premium treatment crafted for comfort.",
    price: "$109",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
    categoryId: "massage",
  },
  {
    id: "m12",
    name: "Shiatsu Massage",
    description: "Premium treatment crafted for comfort.",
    price: "$99",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
    categoryId: "massage",
  },
  {
    id: "m13",
    name: "Chair Massage",
    description: "Premium treatment crafted for comfort.",
    price: "$49",
    duration: "20 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    categoryId: "massage",
  },
  {
    id: "m14",
    name: "Cupping Therapy",
    description: "Premium treatment crafted for comfort.",
    price: "$89",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
    categoryId: "massage",
  },
  {
    id: "m15",
    name: "Relaxation Massage",
    description: "Premium treatment crafted for comfort.",
    price: "$89",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    categoryId: "massage",
  },
];

const nailServices: ExtendedService[] = [
  {
    id: "n1",
    name: "Classic Manicure",
    description: "Premium treatment crafted for comfort.",
    price: "$45",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
    categoryId: "nails",
  },
  {
    id: "n2",
    name: "Gel Polish",
    description: "Premium treatment crafted for comfort.",
    price: "$55",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop",
    categoryId: "nails",
  },
  {
    id: "n3",
    name: "Spa Pedicure",
    description: "Premium treatment crafted for comfort.",
    price: "$65",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1519415517518-0f38f02f3180?w=400&h=300&fit=crop",
    categoryId: "nails",
  },
  {
    id: "n4",
    name: "Acrylic Full Set",
    description: "Premium treatment crafted for comfort.",
    price: "$75",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
    categoryId: "nails",
  },
  {
    id: "n5",
    name: "French Manicure",
    description: "Premium treatment crafted for comfort.",
    price: "$50",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop",
    categoryId: "nails",
  },
  {
    id: "n6",
    name: "Nail Art Design",
    description: "Premium treatment crafted for comfort.",
    price: "$70",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1519415517518-0f38f02f3180?w=400&h=300&fit=crop",
    categoryId: "nails",
  },
  {
    id: "n7",
    name: "Paraffin Treatment",
    description: "Premium treatment crafted for comfort.",
    price: "$40",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
    categoryId: "nails",
  },
  {
    id: "n8",
    name: "Dip Powder Nails",
    description: "Premium treatment crafted for comfort.",
    price: "$60",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop",
    categoryId: "nails",
  },
  {
    id: "n9",
    name: "Express Mani-Pedi",
    description: "Premium treatment crafted for comfort.",
    price: "$85",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1519415517518-0f38f02f3180?w=400&h=300&fit=crop",
    categoryId: "nails",
  },
];

const facialServices: ExtendedService[] = [
  {
    id: "f1",
    name: "Hydrating Facial",
    description: "Premium treatment crafted for comfort.",
    price: "$89",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    categoryId: "facials",
  },
  {
    id: "f2",
    name: "Anti-Aging Facial",
    description: "Premium treatment crafted for comfort.",
    price: "$119",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=300&fit=crop",
    categoryId: "facials",
  },
  {
    id: "f3",
    name: "Deep Cleansing Facial",
    description: "Premium treatment crafted for comfort.",
    price: "$95",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    categoryId: "facials",
  },
  {
    id: "f4",
    name: "Brightening Facial",
    description: "Premium treatment crafted for comfort.",
    price: "$99",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=300&fit=crop",
    categoryId: "facials",
  },
  {
    id: "f5",
    name: "Acne Treatment Facial",
    description: "Premium treatment crafted for comfort.",
    price: "$109",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    categoryId: "facials",
  },
  {
    id: "f6",
    name: "Collagen Boost Facial",
    description: "Premium treatment crafted for comfort.",
    price: "$129",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=300&fit=crop",
    categoryId: "facials",
  },
  {
    id: "f7",
    name: "Oxygen Facial",
    description: "Premium treatment crafted for comfort.",
    price: "$115",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    categoryId: "facials",
  },
  {
    id: "f8",
    name: "Microdermabrasion",
    description: "Premium treatment crafted for comfort.",
    price: "$105",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=300&fit=crop",
    categoryId: "facials",
  },
  {
    id: "f9",
    name: "LED Light Therapy",
    description: "Premium treatment crafted for comfort.",
    price: "$79",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    categoryId: "facials",
  },
];

const hairServices: ExtendedService[] = [
  {
    id: "h1",
    name: "Haircut & Style",
    description: "Premium treatment crafted for comfort.",
    price: "$65",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    categoryId: "hair",
  },
  {
    id: "h2",
    name: "Blowout",
    description: "Premium treatment crafted for comfort.",
    price: "$45",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    categoryId: "hair",
  },
  {
    id: "h3",
    name: "Balayage Highlights",
    description: "Premium treatment crafted for comfort.",
    price: "$189",
    duration: "3 hrs",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    categoryId: "hair",
  },
  {
    id: "h4",
    name: "Keratin Treatment",
    description: "Premium treatment crafted for comfort.",
    price: "$249",
    duration: "2 hrs",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    categoryId: "hair",
  },
  {
    id: "h5",
    name: "Root Touch-Up",
    description: "Premium treatment crafted for comfort.",
    price: "$85",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    categoryId: "hair",
  },
  {
    id: "h6",
    name: "Deep Conditioning",
    description: "Premium treatment crafted for comfort.",
    price: "$55",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    categoryId: "hair",
  },
  {
    id: "h7",
    name: "Bridal Updo",
    description: "Premium treatment crafted for comfort.",
    price: "$120",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    categoryId: "hair",
  },
  {
    id: "h8",
    name: "Scalp Treatment",
    description: "Premium treatment crafted for comfort.",
    price: "$69",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
    categoryId: "hair",
  },
  {
    id: "h9",
    name: "Kids Haircut",
    description: "Premium treatment crafted for comfort.",
    price: "$35",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    categoryId: "hair",
  },
];

function createCategoryServices(
  categoryId: string,
  items: Array<{
    id: string;
    name: string;
    price: string;
    duration: string;
    image: string;
  }>,
): ExtendedService[] {
  return items.map((item) => ({
    ...item,
    description: "Premium treatment crafted for comfort.",
    categoryId,
  }));
}

const makeupServices = createCategoryServices("makeup", [
  { id: "mk1", name: "Bridal Makeup", price: "$150", duration: "90 min", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop" },
  { id: "mk2", name: "Evening Glam", price: "$95", duration: "60 min", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop" },
  { id: "mk3", name: "Natural Day Look", price: "$65", duration: "45 min", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop" },
  { id: "mk4", name: "Brow Shaping", price: "$35", duration: "30 min", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop" },
  { id: "mk5", name: "Lash Extensions", price: "$120", duration: "90 min", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop" },
  { id: "mk6", name: "Lash Lift & Tint", price: "$75", duration: "60 min", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop" },
  { id: "mk7", name: "Party Makeup", price: "$85", duration: "60 min", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop" },
  { id: "mk8", name: "Brow Lamination", price: "$55", duration: "45 min", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop" },
  { id: "mk9", name: "Makeup Lesson", price: "$99", duration: "75 min", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop" },
]);

const waxingServices = createCategoryServices("waxing", [
  { id: "wx1", name: "Full Body Wax", price: "$99", duration: "60 min", image: "https://images.unsplash.com/photo-1515377901643-0a6e3cabbb65?w=400&h=300&fit=crop" },
  { id: "wx2", name: "Brazilian Wax", price: "$65", duration: "45 min", image: "https://images.unsplash.com/photo-1515377901643-0a6e3cabbb65?w=400&h=300&fit=crop" },
  { id: "wx3", name: "Leg Wax", price: "$55", duration: "45 min", image: "https://images.unsplash.com/photo-1515377901643-0a6e3cabbb65?w=400&h=300&fit=crop" },
  { id: "wx4", name: "Arm Wax", price: "$40", duration: "30 min", image: "https://images.unsplash.com/photo-1515377901643-0a6e3cabbb65?w=400&h=300&fit=crop" },
  { id: "wx5", name: "Underarm Wax", price: "$25", duration: "15 min", image: "https://images.unsplash.com/photo-1515377901643-0a6e3cabbb65?w=400&h=300&fit=crop" },
  { id: "wx6", name: "Bikini Wax", price: "$45", duration: "30 min", image: "https://images.unsplash.com/photo-1515377901643-0a6e3cabbb65?w=400&h=300&fit=crop" },
  { id: "wx7", name: "Back Wax", price: "$50", duration: "30 min", image: "https://images.unsplash.com/photo-1515377901643-0a6e3cabbb65?w=400&h=300&fit=crop" },
  { id: "wx8", name: "Chest Wax", price: "$45", duration: "30 min", image: "https://images.unsplash.com/photo-1515377901643-0a6e3cabbb65?w=400&h=300&fit=crop" },
  { id: "wx9", name: "Facial Wax", price: "$30", duration: "20 min", image: "https://images.unsplash.com/photo-1515377901643-0a6e3cabbb65?w=400&h=300&fit=crop" },
]);

const pamperServices = createCategoryServices("pamper", [
  { id: "pp1", name: "Spa Day Package", price: "$249", duration: "3 hrs", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
  { id: "pp2", name: "Couples Retreat", price: "$399", duration: "4 hrs", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
  { id: "pp3", name: "Mother & Daughter", price: "$299", duration: "3 hrs", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
  { id: "pp4", name: "Birthday Bliss", price: "$199", duration: "2 hrs", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
  { id: "pp5", name: "Girls Day Out", price: "$349", duration: "4 hrs", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
  { id: "pp6", name: "Luxury Escape", price: "$449", duration: "5 hrs", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
  { id: "pp7", name: "Mini Pamper", price: "$129", duration: "90 min", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
  { id: "pp8", name: "Weekend Wellness", price: "$279", duration: "3 hrs", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
  { id: "pp9", name: "Royal Treatment", price: "$499", duration: "5 hrs", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop" },
]);

const wellnessServices = createCategoryServices("wellness", [
  { id: "wl1", name: "Aromatherapy Session", price: "$79", duration: "45 min", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
  { id: "wl2", name: "Meditation & Breath", price: "$59", duration: "45 min", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
  { id: "wl3", name: "Sound Healing", price: "$89", duration: "60 min", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
  { id: "wl4", name: "Yoga Stretch", price: "$65", duration: "60 min", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
  { id: "wl5", name: "Reiki Healing", price: "$95", duration: "60 min", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
  { id: "wl6", name: "Sauna & Steam", price: "$45", duration: "30 min", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
  { id: "wl7", name: "Detox Wrap", price: "$109", duration: "75 min", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
  { id: "wl8", name: "Energy Balance", price: "$85", duration: "60 min", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
  { id: "wl9", name: "Holistic Consult", price: "$69", duration: "45 min", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
]);

const defaultServices: ExtendedService[] = [
  ...massageExtendedServices,
  ...nailServices,
  ...facialServices,
  ...hairServices,
  ...makeupServices,
  ...waxingServices,
  ...pamperServices,
  ...wellnessServices,
];

const defaultStaff = [
  {
    id: "sony",
    name: "Sony",
    experience: "5 Years Experience",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
  },
  {
    id: "jesai",
    name: "Jesai",
    experience: "5 Years Experience",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
  },
  {
    id: "sami",
    name: "Sami",
    experience: "5 Years Experience",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
  },
  {
    id: "samar",
    name: "Samar",
    experience: "5 Years Experience",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&q=80",
  },
];

export const extendedOrganizations: Record<string, ExtendedOrganization> = {
  "org-trending-2": {
    id: "org-trending-2",
    name: "lori massage parlour",
    status: "Online",
    thumbnail:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=200&fit=crop",
    heroImages: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&h=400&fit=crop",
    ],
    availability: "9AM - 5PM",
    services: defaultServices,
    staff: defaultStaff,
    reviews: [
      {
        id: "rv1",
        name: "Daniel K.",
        rating: 4.2,
        date: "2 days ago",
        text: "Amazing experience. The ambiance was so relaxing and the sessions were pure bliss.",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
    ],
  },
  "store-1": {
    id: "store-1",
    name: "Glamour Salon",
    status: "Online",
    thumbnail:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
    heroImages: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop",
    ],
    availability: "9AM - 6PM",
    services: defaultServices,
    staff: defaultStaff,
    reviews: [
      {
        id: "rv1",
        name: "Daniel K.",
        rating: 4.2,
        date: "2 days ago",
        text: "Amazing experience. The ambiance was so relaxing and the sessions were pure bliss.",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
    ],
  },
};

export function getExtendedOrganization(id: string): ExtendedOrganization {
  return extendedOrganizations[id] ?? extendedOrganizations["org-trending-2"];
}
