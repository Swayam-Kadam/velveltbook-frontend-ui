"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

import { MenuCategory } from "@/menu/menu.data";

const AUTO_SLIDE_MS = 3000;

interface CategoryTabBarProps {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  selectedCounts?: Record<string, number>;
}

export function CategoryTabBar({
  categories,
  activeId,
  onSelect,
  selectedCounts = {},
}: CategoryTabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isVisibleRef = useRef(false);
  const userInteractedRef = useRef(false);
  const demoCompleteRef = useRef(false);

  const activeIndex = categories.findIndex((c) => c.id === activeId);

  const pauseAutoSlide = useCallback(() => {
    userInteractedRef.current = true;
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      pauseAutoSlide();
      onSelect(id);
    },
    [onSelect, pauseAutoSlide],
  );

  useEffect(() => {
    tabRefs.current[activeId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (categories.length <= 1) return;

    const interval = setInterval(() => {
      if (
        userInteractedRef.current ||
        demoCompleteRef.current ||
        !isVisibleRef.current
      ) {
        return;
      }

      const currentIndex = categories.findIndex((c) => c.id === activeId);

      if (currentIndex >= categories.length - 1) {
        demoCompleteRef.current = true;
        return;
      }

      onSelect(categories[currentIndex + 1].id);
    }, AUTO_SLIDE_MS);

    return () => clearInterval(interval);
  }, [activeId, categories, onSelect]);

  const goNext = () => {
    pauseAutoSlide();
    const nextIndex =
      activeIndex >= categories.length - 1 ? 0 : activeIndex + 1;
    onSelect(categories[nextIndex].id);
  };

  return (
    <div ref={containerRef} className="flex items-center gap-1">
      <div className="flex flex-1 gap-1 overflow-x-auto scrollbar-none pt-2">
        {categories.map(({ id, label, icon: Icon }) => {
          const active = id === activeId;
          const selectedCount = selectedCounts[id] ?? 0;

          return (
            <div key={id} className="relative shrink-0">
              <button
                ref={(el) => {
                  tabRefs.current[id] = el;
                }}
                type="button"
                onClick={() => handleSelect(id)}
                className={`
                  flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5
                  transition-all duration-300
                  ${
                    active
                      ? "primary-button text-white shadow-(--shadow-glow)"
                      : "text-(--text-secondary) hover:bg-(--bg-card-hover)"
                  }
                `}
              >
                <Icon
                  size={14}
                  strokeWidth={1.5}
                  className={
                    active ? "text-(--brand-gold)" : "text-(--text-primary)"
                  }
                />
                <span
                  className={`
                    max-w-[52px] text-center text-[7px] leading-tight font-bold
                    ${active ? "text-white" : "text-(--text-primary)"}
                  `}
                >
                  {label}
                </span>
              </button>

              {selectedCount > 0 && (
                <span
                  className="
                    absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center
                    justify-center rounded-full bg-(--brand-gold) px-0.5
                    text-[6px] font-bold leading-none text-white
                  "
                >
                  {selectedCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Next category"
        onClick={goNext}
        className="
          primary-button flex h-7 w-7 shrink-0 items-center justify-center
          rounded-full text-white transition-opacity duration-200
        "
      >
        <ChevronRight size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
