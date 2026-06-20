import {
  Armchair,
  Flower2,
  LayoutGrid,
  Hand,
  HandMetal,
  PenTool,
  Scissors,
} from "lucide-react";

export const categories = [
  { label: "Barber", icon: Scissors, active: true },
  { label: "Salon", icon: Armchair },
  { label: "Spa", icon: Flower2 },
  { label: "Massage", icon: Hand },
  { label: "Tattoo", icon: PenTool },
  { label: "Nails", icon: HandMetal },
  { label: "More", icon: LayoutGrid },
];
