import {
  Armchair,
  type LucideIcon,
  Flower2,
  HandHeart,
  LayoutGrid,
  MapPin,
  PenTool,
  Pointer,
  Scissors,
} from "lucide-react";

export interface ServiceCategoryTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface ServiceCategoryStore {
  id: string;
  categoryId: string;
  name: string;
  services: string[];
  address: string;
  rating: number;
  reviews: number;
  status: string;
  opensAt: string;
  closesAt: string;
  image: string;
  heroImage: string;
  isVerified?: boolean;
  chatIntro: string;
  providerReply: string;
  providerReplyTime: string;
  userFollowUp: string;
  userFollowUpTime: string;
  providerAvailability: string;
  providerAvailabilityTime: string;
}

export interface StoreConversation {
  storeId: string;
  lastMessagePreview: string;
  lastMessageFrom: "user" | "store";
  lastMessageTime: string;
  unreadCount: number;
}

export interface ServiceCategoryConversation extends ServiceCategoryStore {
  lastMessagePreview: string;
  lastMessageFrom: "user" | "store";
  lastMessageTime: string;
  unreadCount: number;
}

export const serviceCategoryTabs: ServiceCategoryTab[] = [
  { id: "barber", label: "Barber", icon: Scissors },
  { id: "salon", label: "Salon", icon: Armchair },
  { id: "spa", label: "Spa", icon: Flower2 },
  { id: "massage", label: "Massage", icon: HandHeart },
  { id: "tattoo", label: "Tattoo", icon: PenTool },
  { id: "nails", label: "Nails", icon: Pointer },
  { id: "more", label: "More", icon: LayoutGrid },
];

export const serviceCategoryFilterOptions = {
  suburbs: ["All Suburbs", "Indore", "Bhopal", "Delhi", "Mumbai", "Bangalore"],
  languages: ["All", "English", "Hindi", "Vietnamese", "Thai"],
  price: ["Any Price", "$0 - $20", "$50 - $100", "$100 - $150", "$150 & above"],
  nationalities: ["All", "Aussie", "Vietnamese", "Chinese", "Thai", "Filipino", "Japanese", "Mix"],
} as const;

export type ServiceCategoryFilterId = keyof typeof serviceCategoryFilterOptions;

export const serviceCategoryFilters: {
  id: ServiceCategoryFilterId;
  label: string;
  value: string;
}[] = [
  { id: "suburbs", label: "Suburbs", value: "All Suburbs" },
  { id: "languages", label: "Languages", value: "All" },
  { id: "price", label: "Price", value: "Any Price" },
  { id: "nationalities", label: "Nationalities", value: "All" },
];

export const serviceCategoryConversations: StoreConversation[] = [
  {
    storeId: "groom-glow-barbers",
    lastMessagePreview:
      "Hi! I'm interested in a haircut and beard trim. What are your prices?",
    lastMessageFrom: "user",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
  },
  {
    storeId: "fade-studio",
    lastMessagePreview: "Yes! We have availability this weekend.",
    lastMessageFrom: "store",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
  },
  {
    storeId: "luxe-touch-salon",
    lastMessagePreview: "Do you have any bridal makeup packages?",
    lastMessageFrom: "user",
    lastMessageTime: "2 Days Ago",
    unreadCount: 1,
  },
  {
    storeId: "blissful-spa-retreat",
    lastMessagePreview:
      "We have a signature facial + massage package available.",
    lastMessageFrom: "store",
    lastMessageTime: "3 Days Ago",
    unreadCount: 0,
  },
  {
    storeId: "inked-tattoo-studio",
    lastMessagePreview: "Can I see some custom tattoo designs before booking?",
    lastMessageFrom: "user",
    lastMessageTime: "5 Days Ago",
    unreadCount: 0,
  },
  {
    storeId: "nail-artistry-studio",
    lastMessagePreview: "Do you have availability for gel nails this Friday?",
    lastMessageFrom: "user",
    lastMessageTime: "1 Week Ago",
    unreadCount: 0,
  },
];

export const serviceCategoryStores: ServiceCategoryStore[] = [
  {
    id: "groom-glow-barbers",
    categoryId: "barber",
    name: "Groom & Glow Barbers",
    services: ["Haircut", "Beard", "Styling"],
    address: "123 Collins St, Melbourne VIC 3000",
    rating: 4.8,
    reviews: 324,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "9 PM",
    image:
      "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=1400&h=500&fit=crop",
    isVerified: true,
    chatIntro: "Hi! I'm interested in a haircut and beard styling. What are your prices?",
    providerReply:
      "Hello Emma! Thanks for reaching out. Our haircut starts from $45 and beard styling from $25. Combo packages are also available. Let me know if you'd like to book an appointment?",
    providerReplyTime: "10:31 AM",
    userFollowUp: "That sounds good. Do you have any availability this weekend?",
    userFollowUpTime: "10:33 AM",
    providerAvailability:
      "Yes! We have slots on Saturday and Sunday. Would you like me to share the available times?",
    providerAvailabilityTime: "10:34 AM",
  },
  {
    id: "fade-studio",
    categoryId: "barber",
    name: "The Fade Studio",
    services: ["Haircut", "Fade", "Beard", "Shave"],
    address: "45 Bourke St, Melbourne VIC 3000",
    rating: 4.7,
    reviews: 215,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "8 PM",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1400&h=500&fit=crop",
    isVerified: true,
    chatIntro: "Hi, do you have a barber available for a skin fade this evening?",
    providerReply: "The Fade Studio: Yes! We have availability this weekend.",
    providerReplyTime: "Yesterday",
    userFollowUp: "Perfect. Could you also include a beard trim?",
    userFollowUpTime: "Yesterday",
    providerAvailability:
      "Absolutely, we can include a beard trim in the same booking.",
    providerAvailabilityTime: "Yesterday",
  },
  {
    id: "kingsman-barbershop",
    categoryId: "barber",
    name: "Kingsman Barbershop",
    services: ["Haircut", "Beard", "Styling"],
    address: "78 Chapel St, Windsor VIC 3181",
    rating: 4.6,
    reviews: 189,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "9 PM",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1400&h=500&fit=crop",
    isVerified: true,
    chatIntro: "Do you offer haircut and styling packages?",
    providerReply: "Yes, we do. We can tailor a grooming package for you.",
    providerReplyTime: "2 Days Ago",
    userFollowUp: "Can you share what is included?",
    userFollowUpTime: "2 Days Ago",
    providerAvailability:
      "Sure, it includes haircut, wash, styling, and optional beard touch-up.",
    providerAvailabilityTime: "2 Days Ago",
  },
  {
    id: "urban-edge-barbers",
    categoryId: "barber",
    name: "Urban Edge Barbers",
    services: ["Haircut", "Fade", "Styling"],
    address: "91 Smith St, Fitzroy VIC 3065",
    rating: 4.5,
    reviews: 143,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "8 PM",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=1400&h=500&fit=crop",
    isVerified: true,
    chatIntro: "Can I book a fade and quick styling session tomorrow?",
    providerReply: "Yes, we can fit you in tomorrow afternoon.",
    providerReplyTime: "3 Days Ago",
    userFollowUp: "Great, can you hold a slot after 4 PM?",
    userFollowUpTime: "3 Days Ago",
    providerAvailability:
      "Yes, we can reserve a late afternoon slot for you.",
    providerAvailabilityTime: "3 Days Ago",
  },
  {
    id: "velvet-salon",
    categoryId: "salon",
    name: "Velvet Signature Salon",
    services: ["Hair", "Color", "Blow Dry"],
    address: "22 Little Collins St, Melbourne VIC 3000",
    rating: 4.9,
    reviews: 280,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "7 PM",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&h=500&fit=crop",
    isVerified: true,
    chatIntro: "Hi! I need a wash, blow dry, and trim for this weekend.",
    providerReply: "We'd love to help. We have a few stylist slots available.",
    providerReplyTime: "11:05 AM",
    userFollowUp: "Can you suggest the best time for Sunday?",
    userFollowUpTime: "11:08 AM",
    providerAvailability:
      "Sunday morning is our calmest time. I can send the available slots.",
    providerAvailabilityTime: "11:10 AM",
  },
  {
    id: "luxe-touch-salon",
    categoryId: "salon",
    name: "Luxe Touch Salon",
    services: ["Hair", "Skin", "Makeup"],
    address: "18 Flinders Ln, Melbourne VIC 3000",
    rating: 4.8,
    reviews: 306,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "8 PM",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&h=500&fit=crop",
    isVerified: true,
    chatIntro: "Do you have any bridal makeup packages?",
    providerReply: "Yes, we offer bridal glow and bridal luxury packages.",
    providerReplyTime: "2 Days Ago",
    userFollowUp: "Can you send the inclusions and pricing?",
    userFollowUpTime: "2 Days Ago",
    providerAvailability:
      "Absolutely, I can share both package options and available dates.",
    providerAvailabilityTime: "2 Days Ago",
  },
  {
    id: "blissful-spa-retreat",
    categoryId: "spa",
    name: "Blissful Spa Retreat",
    services: ["Massage", "Facial", "Spa"],
    address: "5 Riverside Quay, Southbank VIC 3006",
    rating: 4.9,
    reviews: 412,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "10 PM",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1400&h=500&fit=crop",
    isVerified: true,
    chatIntro: "Hi, I’m looking for a relaxing spa package for Saturday.",
    providerReply: "We have a signature facial + massage package available.",
    providerReplyTime: "9:45 AM",
    userFollowUp: "That sounds lovely. Is there a couples option too?",
    userFollowUpTime: "9:47 AM",
    providerAvailability:
      "Yes, our couples suite is available on Saturday afternoon.",
    providerAvailabilityTime: "9:50 AM",
  },
  {
    id: "serenity-springs",
    categoryId: "spa",
    name: "Serenity Springs Spa",
    services: ["Steam", "Facial", "Relaxation"],
    address: "10 Bay St, Port Melbourne VIC 3207",
    rating: 4.7,
    reviews: 197,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "9 PM",
    image:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1400&h=500&fit=crop",
    chatIntro: "Could you share your spa day package options?",
    providerReply: "Certainly. We have half-day and full-day spa rituals.",
    providerReplyTime: "Yesterday",
    userFollowUp: "Is the steam room included in both?",
    userFollowUpTime: "Yesterday",
    providerAvailability:
      "Yes, steam access is included in both package tiers.",
    providerAvailabilityTime: "Yesterday",
  },
  {
    id: "deep-relief-studio",
    categoryId: "massage",
    name: "Deep Relief Studio",
    services: ["Deep Tissue", "Relaxation", "Sports"],
    address: "52 Lygon St, Carlton VIC 3053",
    rating: 4.8,
    reviews: 241,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "9 PM",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&h=500&fit=crop",
    chatIntro: "I need a 60-minute deep tissue massage. Do you have tonight?",
    providerReply: "Yes, we have one therapist available at 7:30 PM tonight.",
    providerReplyTime: "10:15 AM",
    userFollowUp: "Great, can I reserve that slot?",
    userFollowUpTime: "10:16 AM",
    providerAvailability:
      "Absolutely. I can hold it for 15 minutes while you confirm.",
    providerAvailabilityTime: "10:17 AM",
  },
  {
    id: "inked-tattoo-studio",
    categoryId: "tattoo",
    name: "Inked Tattoo Studio",
    services: ["Tattoo", "Piercing", "Removal"],
    address: "11 Brunswick St, Fitzroy VIC 3065",
    rating: 4.7,
    reviews: 156,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "8 PM",
    image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1542727365-19732a80dcfd?w=1400&h=500&fit=crop",
    chatIntro: "Can I see some wrist tattoo designs before booking?",
    providerReply: "Yes, we can send you a few fine-line and floral concepts.",
    providerReplyTime: "5 Days Ago",
    userFollowUp: "Perfect. I’d like something minimal and elegant.",
    userFollowUpTime: "5 Days Ago",
    providerAvailability:
      "That style suits our artist Mia well. I can show available consult slots.",
    providerAvailabilityTime: "5 Days Ago",
  },
  {
    id: "nail-artistry-studio",
    categoryId: "nails",
    name: "Nail Artistry Studio",
    services: ["Nails", "Gel", "Nail Art"],
    address: "73 Chapel St, Prahran VIC 3181",
    rating: 4.8,
    reviews: 221,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "7 PM",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1400&h=500&fit=crop",
    chatIntro: "Do you have availability for gel nails this Friday?",
    providerReply: "Absolutely! What kind of nail art are you looking for?",
    providerReplyTime: "1 Week Ago",
    userFollowUp: "A clean nude base with subtle chrome details.",
    userFollowUpTime: "1 Week Ago",
    providerAvailability:
      "Lovely choice. We can fit that into a 75-minute appointment.",
    providerAvailabilityTime: "1 Week Ago",
  },
  {
    id: "wellness-collective",
    categoryId: "more",
    name: "Wellness Collective",
    services: ["Brows", "Skincare", "Consulting"],
    address: "8 Toorak Rd, South Yarra VIC 3141",
    rating: 4.6,
    reviews: 138,
    status: "Open",
    opensAt: "8 AM",
    closesAt: "6 PM",
    image:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=600&fit=crop",
    heroImage:
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=1400&h=500&fit=crop",
    chatIntro: "I’m exploring brow and skin consultation options.",
    providerReply: "We can start with a combined consultation this week.",
    providerReplyTime: "4 Days Ago",
    userFollowUp: "Sounds good. Can I learn more about the treatment plan?",
    userFollowUpTime: "4 Days Ago",
    providerAvailability:
      "Yes, we’ll walk you through it and recommend the right package.",
    providerAvailabilityTime: "4 Days Ago",
  },
];

export function getServiceCategoryTab(id: string) {
  return (
    serviceCategoryTabs.find((category) => category.id === id) ??
    serviceCategoryTabs[0]
  );
}

export function getServiceCategoryStores(id: string) {
  return serviceCategoryStores.filter((store) => store.categoryId === id);
}

export function getServiceCategoryConversations(): ServiceCategoryConversation[] {
  return serviceCategoryConversations.flatMap((conversation) => {
    const store = serviceCategoryStores.find(
      (item) => item.id === conversation.storeId,
    );

    if (!store) return [];

    return [
      {
        ...store,
        lastMessagePreview: conversation.lastMessagePreview,
        lastMessageFrom: conversation.lastMessageFrom,
        lastMessageTime: conversation.lastMessageTime,
        unreadCount: conversation.unreadCount,
      },
    ];
  });
}

export function getServiceCategoryUnreadCount() {
  return serviceCategoryConversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0,
  );
}

export function getServiceCategoryStoreById(id: string) {
  return serviceCategoryStores.find((store) => store.id === id);
}

export function formatStoreMeta(store: ServiceCategoryStore) {
  return `${store.rating.toFixed(1)} (${store.reviews} Reviews)`;
}

function formatStoreHour(time: string) {
  return time.toLowerCase().replace(/\s/g, "");
}

export function formatStoreStatus(store: ServiceCategoryStore) {
  return `${formatStoreHour(store.opensAt)}-${formatStoreHour(store.closesAt)}`;
}

export const storeMetaIcon = MapPin;
