import Image from "next/image";

import type { MenuItem } from "../types";

interface Props {
  item: MenuItem;
}

export default function MenuCard({ item }: Props) {
  return (
    <article className="group flex items-center gap-3 rounded-[var(--radius-sm)] border border-(--border) bg-(--bg-secondary) p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="56px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-xs font-semibold text-(--text-primary) lg:text-sm">
          {item.title}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-(--text-secondary) lg:text-[11px]">
          {item.description}
        </p>
      </div>

      <span className="shrink-0 text-sm font-bold text-(--text-primary) lg:text-base">
        {item.price}
      </span>
    </article>
  );
}
