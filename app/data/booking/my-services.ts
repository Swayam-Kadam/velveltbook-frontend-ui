export interface MyServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  image: string;
  quantity: number;
  staffName: string;
  staffImage: string;
  staffOnline?: boolean;
  monthLabel: string;
  dateLabel: string;
  weekdayLabel: string;
  timeLabel: string;
  yearLabel: string;
}

export interface MyServiceStore {
  id: string;
  name: string;
  banner: string;
  thumbnail: string;
  address: string;
  tagline: string;
  bookingType: string;
  isVerified: boolean;
}

export interface MyServiceOrderSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}

export interface MyServicePricing {
  serviceItemCount: number;
  serviceTotal: number;
  discount: number;
  platformFee: number;
  total: number;
  velvetPoints: number;
}

export interface MyServiceSession {
  id: string;
  store: MyServiceStore;
  services: MyServiceItem[];
  pricing: MyServicePricing;
  orderSummary: MyServiceOrderSummary;
}

export const activeMyServiceSession: MyServiceSession = {
  id: "session-1",
  store: {
    id: "glamour-salon",
    name: "Glamour Salon",
    banner:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=500&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
    address: "Ascot Vale, Melbourne",
    tagline: "Beauty • Wellness • Lifestyle",
    bookingType: "Visit Salon",
    isVerified: true,
  },
  services: [
    {
      id: "svc-prenatal",
      name: "Prenatal Massage",
      description: "60 min • Relaxing & Safe",
      price: 109,
      priceLabel: "$109.00",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      quantity: 1,
      staffName: "Priya",
      staffImage:
        "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop",
      staffOnline: true,
      monthLabel: "AUG",
      dateLabel: "29",
      weekdayLabel: "Sat",
      timeLabel: "01:30 PM",
      yearLabel: "August 2026",
    },
    {
      id: "svc-aroma",
      name: "Aromatherapy Massage",
      description: "60 min • Calming blend",
      price: 99,
      priceLabel: "$99.00",
      image:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
      quantity: 1,
      staffName: "Priya",
      staffImage:
        "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&h=200&fit=crop",
      staffOnline: true,
      monthLabel: "AUG",
      dateLabel: "29",
      weekdayLabel: "Sat",
      timeLabel: "03:00 PM",
      yearLabel: "August 2026",
    },
    {
      id: "svc-hot-stone",
      name: "Hot Stone Massage",
      description: "90 min • Deep relaxation",
      price: 129,
      priceLabel: "$129.00",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
      quantity: 1,
      staffName: "Sony",
      staffImage:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
      monthLabel: "AUG",
      dateLabel: "30",
      weekdayLabel: "Sun",
      timeLabel: "11:00 AM",
      yearLabel: "August 2026",
    },
  ],
  pricing: {
    serviceItemCount: 3,
    serviceTotal: 337,
    discount: 33.7,
    platformFee: 4.95,
    total: 174,
    velvetPoints: 30,
  },
  orderSummary: {
    itemCount: 5,
    subtotal: 183,
    discount: 15,
    shippingFee: 6,
    total: 174,
  },
};
