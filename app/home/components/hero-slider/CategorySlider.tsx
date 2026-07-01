"use client";

import { categories } from "./categories";

export function CategorySlider() {
    return (
        <div className="scrollbar-none flex justify-between gap-2 overflow-x-auto py-2 px-1 lg:grid lg:grid-cols-8 lg:gap-2.5 lg:overflow-visible lg:px-0 lg:py-5">
            {categories.map((category) => {
                const Icon = category.icon;

                return (
                    <button
                        key={category.label}
                        className={`
                            group shrink-0 flex-col items-center gap-1
                            lg:h-[88px] lg:w-full lg:justify-center lg:gap-2
                            lg:rounded-[8px] lg:border lg:border-(--border)
                            lg:bg-(--bg-card) lg:p-4 lg:shadow-(--shadow-card)
                            lg:transition-all lg:duration-300
                            lg:hover:-translate-y-[1px] lg:hover:border-(--brand-gold)
                            ${category.desktopOnly ? "hidden lg:flex" : "flex"}
                        `}
                    >
                        <div
                            className={`
      relative flex h-[38px] w-[38px] items-center justify-center
      rounded-full border backdrop-blur-xl
      transition-all duration-300 ease-out
      lg:h-9 lg:w-9 lg:rounded-none lg:border-0 lg:bg-transparent
      lg:shadow-none lg:backdrop-blur-none
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
        h-4 w-4 lg:h-7 lg:w-7
        transition-all duration-300
        ${category.active
                                        ? "text-(--category-icon-active) drop-shadow-[0_0_8px_color-mix(in_srgb,var(--accent-glow)_55%,transparent)] lg:text-(--accent-primary)"
                                        : "text-(--text-primary)/85 group-hover:text-(--text-primary)"
                                    }
      `}
                            />
                        </div>

                        <span
                            className={`
      text-[10px] transition-colors duration-300 lg:text-[13px] lg:font-medium
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
