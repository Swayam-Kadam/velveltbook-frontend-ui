"use client";

import { categories } from "./categories";

export function CategorySlider() {
    return (
        <div className="scrollbar-none flex justify-between gap-2 overflow-x-auto py-2">
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
            border-[var(--category-active-border)]
            bg-[var(--category-active-bg)]
            shadow-[var(--category-shadow-active)]
          `
                                    : `
            border-[var(--border)]
            bg-[var(--category-bg)]
            hover:border-[var(--category-hover-border)]
            hover:bg-[var(--category-hover-bg)]
            hover:shadow-[var(--category-shadow-hover)]
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
                                        ? "text-[var(--category-icon-active)] drop-shadow-[0_0_8px_color-mix(in_srgb,var(--accent-glow)_55%,transparent)]"
                                        : "text-[var(--text-primary)]/85 group-hover:text-[var(--text-primary)]"
                                    }
      `}
                            />
                        </div>

                        <span
                            className={`
      text-[10px] transition-colors duration-300
      ${category.active
                                    ? "text-[var(--text-primary)]"
                                    : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
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
