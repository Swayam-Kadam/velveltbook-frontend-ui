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
  title: string;
  price: string;
  duration: string;
  image: string;
}

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

export const massageServices: MenuService[] = [
  {
    id: "1",
    title: "Swedish Massage",
    price: "$99",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Deep Tissue Massage",
    price: "$119",
    duration: "75 min",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    title: "Hot Stone Massage",
    price: "$129",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    title: "Prenatal Massage",
    price: "$109",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    title: "Aromatherapy Massage",
    price: "$99",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    title: "Couples Massage",
    price: "$189",
    duration: "90 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "7",
    title: "Lymphatic Drainage",
    price: "$99",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
  {
    id: "8",
    title: "Reflexology / Foot Massage",
    price: "$79",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
  },
  {
    id: "9",
    title: "Indian Head Massage",
    price: "$69",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
  },
];
