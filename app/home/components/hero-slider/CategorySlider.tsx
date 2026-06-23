"use client";

import { categories } from "./categories";

export function CategorySlider() {
    return (
        <div className="scrollbar-none flex justify-between gap-2 overflow-x-auto py-2 px-1">
            {categories.map((category) => {
                const Icon = category.icon;

                return (
                    <button
                        key={category.label}
                        className="group flex shrink-0 flex-col items-center gap-1"
                    >
                        <div
                            className={`
      relative flex h-[38px] w-[38px] items-center justify-center
      rounded-full border backdrop-blur-xl
      transition-all duration-300 ease-out
      ${category.active
                                    ? `
            border-(--brand-gold)
            bg-(--category-active-bg)
            shadow-(--category-shadow-active)
          `
                                    : `
            border-(--brand-gold)
            bg-(--category-bg)
            hover:border-(--category-hover-border)
            hover:bg-(--category-hover-bg)
            hover:shadow-(--category-shadow-hover)
            hover:-translate-y-[1px]
          `
                                }
    `}
                        >
                            <Icon
                                size={16}
                                strokeWidth={1.2}
                                className={`
        transition-all duration-300
        ${category.active
                                        ? "text-(--category-icon-active) drop-shadow-[0_0_8px_color-mix(in_srgb,var(--accent-glow)_55%,transparent)]"
                                        : "text-(--text-primary)/85 group-hover:text-(--text-primary)"
                                    }
      `}
                            />
                        </div>

                        <span
                            className={`
      text-[10px] transition-colors duration-300
      ${category.active
                                    ? "text-(--text-primary)"
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
