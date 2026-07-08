"use client";

import type { ComponentType } from "react";
import {
  Flower2,
  HandHeart,
  LayoutGrid,
  Palette,
  Pointer,
  Scissors,
  Sparkles,
  Waves,
} from "lucide-react";
import { DEAL_CATEGORIES } from "../deals.data";
import type { DealCategory } from "../deals.types";

const categoryIcons: Record<DealCategory, ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  all: LayoutGrid,
  hair: Scissors,
  massage: HandHeart,
  facial: Sparkles,
  nails: Pointer,
  spa: Flower2,
  barber: Waves,
  makeup: Palette,
  more: LayoutGrid,
};

interface DealsCategorySliderProps {
  active: DealCategory;
  onChange: (category: DealCategory) => void;
}

export function DealsCategorySlider({ active, onChange }: DealsCategorySliderProps) {
  return (
    <div className="scrollbar-none flex gap-3 overflow-x-auto px-1 py-2">
      {DEAL_CATEGORIES.map((category) => {
        const Icon = categoryIcons[category.id];
        const isActive = active === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className="group flex shrink-0 flex-col items-center gap-1"
          >
            <div
              className={`
                relative flex h-[38px] w-[38px] items-center justify-center
                rounded-full border backdrop-blur-xl
                transition-all duration-300
                ${isActive
                  ? "border-(--brand-gold) bg-(--category-active-bg) shadow-(--category-shadow-active)"
                  : "border-(--brand-gold) bg-(--category-bg) hover:border-(--category-hover-border) hover:bg-(--category-hover-bg)"
                }
              `}
            >
              <Icon
                size={16}
                strokeWidth={1.2}
                className={`
                  h-4 w-4 transition-all duration-300
                  ${isActive
                    ? "text-(--category-icon-active)"
                    : "text-(--text-primary)/85 group-hover:text-(--text-primary)"
                  }
                `}
              />
            </div>
            <span
              className={`
                text-[10px] transition-colors duration-300
                ${isActive
                  ? "font-medium text-(--text-primary)"
                  : "text-(--text-secondary) group-hover:text-(--text-primary)"
                }
              `}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
