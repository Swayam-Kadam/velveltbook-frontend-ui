import type {
  NationalityOption,
  NationalityProvider,
} from "@/types/home";

export const nationalityOptions: NationalityOption[] = [
  {
    id: "aussie",
    label: "Aussie",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "vietnamese",
    label: "Vietnamese",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "chinese",
    label: "Chinese",
    image:
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "thai",
    label: "Thai",
    image:
      "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "indian",
    label: "Indian",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "korean",
    label: "Korean",
    image:
      "https://images.unsplash.com/photo-1548115184-bc6544d06d55?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "japanese",
    label: "Japanese",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "philippines",
    label: "Philippines",
    image:
      "https://images.unsplash.com/photo-1518509562904-8b397e3ad871?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "mix",
    label: "Mix",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "indonesian",
    label: "Indonesian",
    image:
      "https://images.unsplash.com/photo-1555899434-94d5a1e296c0?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "malaysian",
    label: "Malaysian",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "more",
    label: "More",
    image:
      "https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=240&h=240&q=80",
  },
];

const desktopServices = [
  { label: "Hair Spa", price: "$80", image: "/massage.webp" },
  { label: "Deep Tissue", price: "$20", image: "/massage.webp" },
  { label: "Flexible", price: "$10", image: "/massage.webp" },
  { label: "Aromatherapy", price: "$25", image: "/massage.webp" },
];

export const nationalityProviders: NationalityProvider[] = [
  {
    id: "nat-1",
    name: "Aussie Wellness House",
    image: "/body spa bg.jpg",
    avatar: "/massage.webp",
    service: "Remedial Massage",
    availability: "9AM - 6PM",
    distance: "0.7km away",
    organizationId: "org-nat-1",
    category: "massage",
    nationality: "aussie",
    rating: 4.8,
    reviews: "132+",
    description:
      "Local Australian wellness studio focused on remedial and sports massage.",
    desktopService: "Remedial Massage",
    desktopServices,
  },
  {
    id: "nat-2",
    name: "Saigon Harmony Spa",
    image: "/massage.webp",
    avatar: "/body spa bg.jpg",
    service: "Vietnamese Massage",
    availability: "10AM - 8PM",
    distance: "1.2km away",
    organizationId: "org-nat-2",
    category: "spa",
    nationality: "vietnamese",
    rating: 4.7,
    reviews: "101+",
    description:
      "Authentic Vietnamese massage and herbal treatments in a calm studio.",
    desktopService: "Vietnamese Massage",
    desktopServices,
  },
  {
    id: "nat-3",
    name: "Lotus Chinese Therapy",
    image: "/salon bg.jpg",
    avatar: "/profile.jpeg",
    service: "Tui Na Massage",
    availability: "9AM - 7PM",
    distance: "1.0km away",
    organizationId: "org-nat-3",
    category: "massage",
    nationality: "chinese",
    rating: 4.9,
    reviews: "188+",
    description:
      "Traditional Chinese Tui Na and acupressure with experienced therapists.",
    desktopService: "Tui Na Massage",
    desktopServices,
  },
  {
    id: "nat-4",
    name: "Bangkok Thai House",
    image: "/spa-header.png",
    avatar: "/massage.webp",
    service: "Thai Massage",
    availability: "9AM - 9PM",
    distance: "0.9km away",
    organizationId: "org-nat-4",
    category: "massage",
    nationality: "thai",
    rating: 4.8,
    reviews: "214+",
    description:
      "Traditional Thai stretching massage and oil treatments from Thai specialists.",
    desktopService: "Thai Massage",
    desktopServices,
  },
  {
    id: "nat-5",
    name: "Ayurveda Indian Spa",
    image: "/body spa bg.jpg",
    avatar: "/spa-header.png",
    service: "Indian Head Massage",
    availability: "10AM - 6PM",
    distance: "1.5km away",
    organizationId: "org-nat-5",
    category: "spa",
    nationality: "indian",
    rating: 4.7,
    reviews: "96+",
    description:
      "Ayurvedic head, face, and body treatments guided by Indian therapists.",
    desktopService: "Indian Head Massage",
    desktopServices,
  },
  {
    id: "nat-6",
    name: "Seoul Skin Studio",
    image: "/salon bg.jpg",
    avatar: "/profile.jpeg",
    service: "Korean Facial",
    availability: "10AM - 7PM",
    distance: "0.6km away",
    organizationId: "org-nat-6",
    category: "makeup",
    nationality: "korean",
    rating: 4.9,
    reviews: "163+",
    description:
      "Korean glass-skin facials and K-beauty treatments in a modern studio.",
    desktopService: "Korean Facial",
    desktopServices,
  },
  {
    id: "nat-7",
    name: "Kyoto Calm Salon",
    image: "/massage.webp",
    avatar: "/barber.jpg",
    service: "Shiatsu Massage",
    availability: "9AM - 6PM",
    distance: "1.3km away",
    organizationId: "org-nat-7",
    category: "massage",
    nationality: "japanese",
    rating: 4.8,
    reviews: "141+",
    description:
      "Japanese shiatsu and scaled-back spa rituals in a quiet retreat.",
    desktopService: "Shiatsu Massage",
    desktopServices,
  },
  {
    id: "nat-8",
    name: "Manila Glow Lounge",
    image: "/spa-header.png",
    avatar: "/massage.webp",
    service: "Hilot Massage",
    availability: "11AM - 8PM",
    distance: "1.8km away",
    organizationId: "org-nat-8",
    category: "spa",
    nationality: "philippines",
    rating: 4.6,
    reviews: "87+",
    description:
      "Filipino hilot massage and relaxing spa rituals from Palawan-inspired care.",
    desktopService: "Hilot Massage",
    desktopServices,
  },
  {
    id: "nat-9",
    name: "Blend Collective Spa",
    image: "/salon bg.jpg",
    avatar: "/profile.jpeg",
    service: "Signature Mix Massage",
    availability: "10AM - 8PM",
    distance: "1.1km away",
    organizationId: "org-nat-9",
    category: "massage",
    nationality: "mix",
    rating: 4.8,
    reviews: "119+",
    description:
      "A blended studio with therapists from mixed cultural backgrounds.",
    desktopService: "Signature Mix Massage",
    desktopServices,
  },
  {
    id: "nat-10",
    name: "Bali Indah Retreat",
    image: "/body spa bg.jpg",
    avatar: "/massage.webp",
    service: "Indonesian Massage",
    availability: "9AM - 7PM",
    distance: "1.6km away",
    organizationId: "org-nat-10",
    category: "spa",
    nationality: "indonesian",
    rating: 4.7,
    reviews: "94+",
    description:
      "Indonesian oil massage and Balinese rituals in a warm retreat setting.",
    desktopService: "Indonesian Massage",
    desktopServices,
  },
  {
    id: "nat-11",
    name: "Penang Heritage Spa",
    image: "/spa-header.png",
    avatar: "/body spa bg.jpg",
    service: "Malaysian Massage",
    availability: "10AM - 6PM",
    distance: "2.0km away",
    organizationId: "org-nat-11",
    category: "spa",
    nationality: "malaysian",
    rating: 4.6,
    reviews: "78+",
    description:
      "Malaysian heritage massage and herbal treatments inspired by Penang.",
    desktopService: "Malaysian Massage",
    desktopServices,
  },
];
