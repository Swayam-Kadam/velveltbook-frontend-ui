import {
  Armchair,
  Flower2,
  LayoutGrid,
  HandHeart,
  Pointer,
  PenTool,
  Scissors,
  WandSparkles,
} from "lucide-react";
import type { HomeCategory } from "@/types/home";

export type { HomeCategory };

export interface HomeCategoryItem {
  id: HomeCategory;
  label: string;
  icon: typeof Scissors;
  desktopOnly?: boolean;
}

export const categories: HomeCategoryItem[] = [
  { id: "barber", label: "Barber", icon: Scissors },
  { id: "salon", label: "Salon", icon: Armchair },
  { id: "spa", label: "Spa", icon: Flower2 },
  { id: "massage", label: "Massage", icon: HandHeart },
  { id: "tattoo", label: "Tattoo", icon: PenTool },
  { id: "nails", label: "Nails", icon: Pointer },
  { id: "makeup", label: "Makeup", icon: WandSparkles, desktopOnly: true },
  { id: "more", label: "More", icon: LayoutGrid },
];
