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

export const categories = [
  { label: "Barber", icon: Scissors, active: true },
  { label: "Salon", icon: Armchair },
  { label: "Spa", icon: Flower2 },
  { label: "Massage", icon: HandHeart },
  { label: "Tattoo", icon: PenTool },
  { label: "Nails", icon: Pointer },
  { label: "Makeup", icon: WandSparkles, desktopOnly: true },
  { label: "More", icon: LayoutGrid },
];
