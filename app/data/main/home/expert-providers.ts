import type {
  ExpertLocationOption,
  ExpertProvider,
} from "@/types/home";

/** Melbourne / Australia location photos (Unsplash). */
export const expertLocations: ExpertLocationOption[] = [
  {
    id: "ascot-vale",
    label: "Ascot Vale",
    image:
      "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "moonee-ponds",
    label: "Moonee Ponds",
    image:
      "https://images.unsplash.com/photo-1545044846-351bbc08178a?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "cbd",
    label: "CBD",
    image:
      "https://images.unsplash.com/photo-1742643635715-00c577862b56?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "box-hill",
    label: "Box Hill",
    image:
      "https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "south-yarra",
    label: "South Yarra",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc210790?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "richmond",
    label: "Richmond",
    image:
      "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "carlton",
    label: "Carlton",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "st-kilda",
    label: "St Kilda",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=240&h=240&q=80",
  },
  {
    id: "footscray",
    label: "Footscray",
    image:
      "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=240&h=240&q=80&sat=-20",
  },
  {
    id: "docklands",
    label: "Docklands",
    image:
      "https://images.unsplash.com/photo-1545044846-351bbc08178a?auto=format&fit=crop&w=240&h=240&q=80&sat=-10",
  },
  {
    id: "more",
    label: "More",
    image:
      "https://images.unsplash.com/photo-1742643635715-00c577862b56?auto=format&fit=crop&w=240&h=240&q=80&sat=-15",
  },
];

const desktopServices = [
  { label: "Hair Spa", price: "$80", image: "/massage.webp" },
  { label: "Deep Tissue", price: "$20", image: "/massage.webp" },
  { label: "Flexible", price: "$10", image: "/massage.webp" },
  { label: "Aromatherapy", price: "$25", image: "/massage.webp" },
];

export const expertProviders: ExpertProvider[] = [
  {
    id: "expert-1",
    name: "Ascot Vale Wellness",
    image: "/body spa bg.jpg",
    avatar: "/massage.webp",
    service: "Swedish Massage",
    availability: "9AM - 6PM",
    distance: "0.8km away",
    organizationId: "org-expert-1",
    category: "massage",
    location: "ascot-vale",
    rating: 4.9,
    reviews: "124+",
    description:
      "Premium wellness centre in Ascot Vale offering therapeutic massages and holistic treatments.",
    desktopService: "Swedish Massage",
    desktopServices,
  },
  {
    id: "expert-2",
    name: "Moonee Ponds Spa",
    image: "/massage.webp",
    avatar: "/body spa bg.jpg",
    service: "Deep Tissue Massage",
    availability: "9AM - 5PM",
    distance: "1.1km away",
    organizationId: "org-expert-2",
    category: "spa",
    location: "moonee-ponds",
    rating: 4.8,
    reviews: "98+",
    description:
      "Relaxed spa experience in Moonee Ponds with expert therapists and calming treatments.",
    desktopService: "Deep Tissue Massage",
    desktopServices,
  },
  {
    id: "expert-3",
    name: "CBD Glow Studio",
    image: "/salon bg.jpg",
    avatar: "/profile.jpeg",
    service: "Bridal Makeup",
    availability: "10AM - 7PM",
    distance: "0.5km away",
    organizationId: "org-expert-3",
    category: "makeup",
    location: "cbd",
    rating: 4.7,
    reviews: "210+",
    description:
      "City-centre beauty studio delivering bridal, event, and everyday makeup looks.",
    desktopService: "Bridal Makeup",
    desktopServices,
  },
  {
    id: "expert-4",
    name: "Box Hill Barber Co.",
    image: "/barber.jpg",
    avatar: "/profile.jpeg",
    service: "Premium Barber Cut",
    availability: "9AM - 6PM",
    distance: "1.4km away",
    organizationId: "org-expert-4",
    category: "barber",
    location: "box-hill",
    rating: 4.8,
    reviews: "156+",
    description:
      "Sharp cuts and classic grooming in Box Hill with experienced barbers.",
    desktopService: "Premium Barber Cut",
    desktopServices,
  },
  {
    id: "expert-5",
    name: "South Yarra Nails",
    image: "/spa-header.png",
    avatar: "/massage.webp",
    service: "Gel Manicure",
    availability: "9AM - 6PM",
    distance: "1.2km away",
    organizationId: "org-expert-5",
    category: "nails",
    location: "south-yarra",
    rating: 4.6,
    reviews: "88+",
    description:
      "Boutique nail lounge in South Yarra for gel, art, and spa pedicures.",
    desktopService: "Gel Manicure",
    desktopServices,
  },
  {
    id: "expert-6",
    name: "Richmond Retreat",
    image: "/body spa bg.jpg",
    avatar: "/spa-header.png",
    service: "Aromatherapy",
    availability: "8AM - 8PM",
    distance: "1.6km away",
    organizationId: "org-expert-6",
    category: "spa",
    location: "richmond",
    rating: 4.9,
    reviews: "142+",
    description:
      "Quiet Richmond spa focused on aromatherapy and restorative body treatments.",
    desktopService: "Aromatherapy",
    desktopServices,
  },
  {
    id: "expert-7",
    name: "Carlton Salon House",
    image: "/salon bg.jpg",
    avatar: "/barber.jpg",
    service: "Hair Colour & Cut",
    availability: "9AM - 7PM",
    distance: "0.9km away",
    organizationId: "org-expert-7",
    category: "salon",
    location: "carlton",
    rating: 4.7,
    reviews: "175+",
    description:
      "Carlton salon for colour, cuts, and styling with a modern boutique feel.",
    desktopService: "Hair Colour & Cut",
    desktopServices,
  },
  {
    id: "expert-8",
    name: "St Kilda Ink",
    image: "/barber.jpg",
    avatar: "/profile.jpeg",
    service: "Custom Tattoo",
    availability: "11AM - 8PM",
    distance: "2.1km away",
    organizationId: "org-expert-8",
    category: "tattoo",
    location: "st-kilda",
    rating: 4.8,
    reviews: "201+",
    description:
      "St Kilda tattoo studio specialising in custom fine-line and traditional work.",
    desktopService: "Custom Tattoo",
    desktopServices,
  },
];
