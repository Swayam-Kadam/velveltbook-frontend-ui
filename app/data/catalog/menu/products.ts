import {
  Droplets,
  Flower2,
  Gift,
  HandMetal,
  Leaf,
  Package,
  Palette,
  Scissors,
  Sparkles,
} from "lucide-react";

import type { MenuCategory } from "./services";

export interface MenuProduct {
  id: string;
  categoryId: string;
  title: string;
  price: string;
  quantity: string;
  image: string;
  /** Optional gallery images shown in the product preview modal. */
  images?: string[];
}

/** Sidebar categories for Product catalog (ids match product.categoryId). */
export const productCategories: MenuCategory[] = [
  { id: "massage", label: "Oils & Lotions", icon: Droplets },
  { id: "nails", label: "Nail Products", icon: HandMetal },
  { id: "facials", label: "Skincare", icon: Flower2 },
  { id: "hair", label: "Hair Care", icon: Scissors },
  { id: "makeup", label: "Beauty Kits", icon: Palette },
  { id: "waxing", label: "Body Care", icon: Sparkles },
  { id: "pamper", label: "Gift Sets", icon: Gift },
  { id: "wellness", label: "Wellness", icon: Leaf },
  { id: "addons", label: "Accessories", icon: Package },
];

export const allMenuProducts: MenuProduct[] = [
  // Massage Therapy
  {
    id: "mp-m1",
    categoryId: "massage",
    title: "Lavender Massage Oil",
    price: "$18",
    quantity: "100ml",
    image: "/massage.webp",
  },
  {
    id: "mp-m2",
    categoryId: "massage",
    title: "Aroma Essential Oil",
    price: "$22",
    quantity: "100ml",
    image: "/body spa bg.jpg",
  },
  {
    id: "mp-m3",
    categoryId: "massage",
    title: "Hot Stone Kit",
    price: "$35",
    quantity: "1 kit",
    image: "/spa-header.png",
  },
  {
    id: "mp-m4",
    categoryId: "massage",
    title: "Relaxation Balm",
    price: "$12",
    quantity: "75g",
    image: "/massage.webp",
  },
  // Nail Care
  {
    id: "mp-n1",
    categoryId: "nails",
    title: "Gel Polish Set",
    price: "$16",
    quantity: "3 pcs",
    image: "/salon bg.jpg",
  },
  {
    id: "mp-n2",
    categoryId: "nails",
    title: "Cuticle Oil",
    price: "$10",
    quantity: "30ml",
    image: "/body spa bg.jpg",
  },
  {
    id: "mp-n3",
    categoryId: "nails",
    title: "Nail Care Kit",
    price: "$24",
    quantity: "1 kit",
    image: "/salon bg.jpg",
  },
  // Facials & Skincare
  {
    id: "mp-f1",
    categoryId: "facials",
    title: "Hydrating Face Serum",
    price: "$28",
    quantity: "50ml",
    image: "/spa-header.png",
  },
  {
    id: "mp-f2",
    categoryId: "facials",
    title: "Clay Face Mask",
    price: "$19",
    quantity: "100g",
    image: "/body spa bg.jpg",
  },
  {
    id: "mp-f3",
    categoryId: "facials",
    title: "Cleansing Foam",
    price: "$15",
    quantity: "120ml",
    image: "/massage.webp",
  },
  // Hair Services
  {
    id: "mp-h1",
    categoryId: "hair",
    title: "Argan Hair Oil",
    price: "$21",
    quantity: "100ml",
    image: "/salon bg.jpg",
  },
  {
    id: "mp-h2",
    categoryId: "hair",
    title: "Repair Shampoo",
    price: "$18",
    quantity: "250ml",
    image: "/barber.jpg",
  },
  {
    id: "mp-h3",
    categoryId: "hair",
    title: "Styling Cream",
    price: "$14",
    quantity: "80g",
    image: "/salon bg.jpg",
  },
  // Makeup & Brows
  {
    id: "mp-mk1",
    categoryId: "makeup",
    title: "Brow Pencil Duo",
    price: "$13",
    quantity: "2 pcs",
    image: "/profile.jpeg",
  },
  {
    id: "mp-mk2",
    categoryId: "makeup",
    title: "Setting Spray",
    price: "$17",
    quantity: "90ml",
    image: "/spa-header.png",
  },
  {
    id: "mp-mk3",
    categoryId: "makeup",
    title: "Lip Tint Pack",
    price: "$20",
    quantity: "3 pcs",
    image: "/salon bg.jpg",
  },
  // Waxing & Body Care
  {
    id: "mp-w1",
    categoryId: "waxing",
    title: "Aftercare Lotion",
    price: "$16",
    quantity: "120ml",
    image: "/body spa bg.jpg",
  },
  {
    id: "mp-w2",
    categoryId: "waxing",
    title: "Body Scrub",
    price: "$22",
    quantity: "180g",
    image: "/massage.webp",
  },
  // Pamper Packages
  {
    id: "mp-p1",
    categoryId: "pamper",
    title: "Spa Gift Box",
    price: "$45",
    quantity: "1 box",
    image: "/spa-header.png",
  },
  {
    id: "mp-p2",
    categoryId: "pamper",
    title: "Candle Set",
    price: "$15",
    quantity: "2 pcs",
    image: "/salon bg.jpg",
  },
  // Wellness
  {
    id: "mp-we1",
    categoryId: "wellness",
    title: "Herbal Tea Blend",
    price: "$10",
    quantity: "20 bags",
    image: "/body spa bg.jpg",
  },
  {
    id: "mp-we2",
    categoryId: "wellness",
    title: "Diffuser Oil Pack",
    price: "$26",
    quantity: "4 pcs",
    image: "/massage.webp",
  },
  // Add-ons
  {
    id: "mp-a1",
    categoryId: "addons",
    title: "Travel Size Kit",
    price: "$12",
    quantity: "1 kit",
    image: "/barber.jpg",
  },
  {
    id: "mp-a2",
    categoryId: "addons",
    title: "Mini Balm Trio",
    price: "$9",
    quantity: "3 pcs",
    image: "/spa-header.png",
  },
];

export function getProductsByCategory(categoryId: string): MenuProduct[] {
  return allMenuProducts.filter((product) => product.categoryId === categoryId);
}

export function getMenuProduct(id: string): MenuProduct | undefined {
  return allMenuProducts.find((product) => product.id === id);
}

export function paginateProducts(
  products: MenuProduct[],
  page: number,
  perPage: number,
): MenuProduct[] {
  const start = (page - 1) * perPage;
  return products.slice(start, start + perPage);
}
