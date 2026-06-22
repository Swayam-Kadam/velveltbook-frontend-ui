import { ExtendedOrganization } from "./organization.types";

const defaultServices = [
  {
    id: "ds1",
    name: "Deep Tissue Massage",
    description: "Premium treatment crafted for comfort.",
    price: "$20",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=300&h=200&fit=crop",
  },
  {
    id: "ds2",
    name: "Flexible Massage",
    description: "Premium treatment crafted for comfort.",
    price: "$20",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop",
  },
  {
    id: "ds3",
    name: "Oil Massage",
    description: "Premium treatment crafted for comfort.",
    price: "$20",
    image:
      "https://images.unsplash.com/photo-1596178065880-2314bdb1a0b8?w=300&h=200&fit=crop",
  },
];

const defaultStaff = [
  {
    id: "st1",
    name: "lori",
    experience: "2+ years Exp.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
  },
  {
    id: "st2",
    name: "Priya",
    experience: "3+ years Exp.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
  },
  {
    id: "st3",
    name: "Anita",
    experience: "4+ years Exp.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
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
