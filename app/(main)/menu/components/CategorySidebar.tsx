"use client";

import Image from "next/image";

import { MenuCategory } from "../menu.data";

interface CategorySidebarProps {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  selectedCounts?: Record<string, number>;
  largeText?: boolean;
}

export function CategorySidebar({
  categories,
  activeId,
  onSelect,
  selectedCounts,
  largeText = false,
}: CategorySidebarProps) {
  const imageClass = largeText ? "h-14 w-14" : "h-11 w-11";

  return (
    <aside
      className="
        flex w-[88px] shrink-0 flex-col
        border-r border-(--border)
        bg-(--bg-primary)
        py-2 overflow-y-auto
      "
    >
      <nav className="flex flex-col gap-1.5 px-1.5">
        {categories.map((category) => {
          const { id, label, image, icon: Icon } = category;
          const active = id === activeId;
          const count = selectedCounts?.[id] ?? 0;
          const showBadge = count > 0;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-current={active ? "true" : undefined}
              className={`
                relative flex flex-col items-center rounded-xl px-1 pb-1.5 pt-1.5 text-center
                shadow-[0_2px_8px_rgba(70,24,70,0.08)] transition-colors
                ${
                  active
                    ? "primary-button text-white"
                    : "border border-(--border) bg-(--bg-card) text-(--accent-primary) hover:border-(--accent-primary)"
                }
              `}
            >
              <span
                className={`
                  relative ${imageClass} shrink-0 overflow-hidden rounded-xl
                  bg-[#f6efe6] shadow-[inset_0_0_0_1px_rgba(70,24,70,0.08)]
                `}
              >
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes={largeText ? "56px" : "44px"}
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    <Icon
                      size={largeText ? 18 : 16}
                      strokeWidth={1.5}
                      className={
                        active ? "text-(--brand-gold)" : "text-(--text-primary)"
                      }
                    />
                  </span>
                )}
              </span>

              <span
                title={label}
                className={`
                  mt-1 min-w-0 w-full overflow-hidden px-0.5 font-semibold
                  leading-[1.15] break-words line-clamp-3
                  ${largeText ? "text-[9px]" : "text-[8px]"}
                  ${active ? "text-white" : "text-(--accent-primary)"}
                `}
              >
                {label}
              </span>

              {showBadge ? (
                <span
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--brand-gold) text-[9px] font-bold text-white"
                  aria-label={`${count} selected`}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
