"use client";

import { MenuCategory } from "../menu.data";

interface CategorySidebarProps {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function CategorySidebar({
  categories,
  activeId,
  onSelect,
}: CategorySidebarProps) {
  return (
    <aside
      className="
        flex w-[88px] shrink-0 flex-col
        border-r border-[var(--border)]
        bg-[var(--bg-primary)]
        py-2
      "
    >
      <nav className="flex flex-col gap-0.5 px-1.5">
        {categories.map(({ id, label, icon: Icon }) => {
          const active = id === activeId;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`
                flex flex-col items-center gap-1 rounded-xl px-1 py-2.5
                transition-all duration-300
                ${
                  active
                    ? "primary-button text-white shadow-[var(--shadow-glow)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                }
              `}
            >
              <Icon
                size={16}
                strokeWidth={1.5}
                className={
                  active
                    ? "text-[var(--brand-gold)]"
                    : "text-[var(--text-muted)]"
                }
              />

              <span
                className={`
                  text-center text-[8px] leading-tight font-medium
                  ${active ? "text-white" : "text-[var(--text-secondary)]"}
                `}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
