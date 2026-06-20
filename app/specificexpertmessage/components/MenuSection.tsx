import Image from "next/image";
import { ChevronRight } from "lucide-react";

import { MenuServiceItem } from "../message.types";

interface MenuSectionProps {
  items: MenuServiceItem[];
}

export function MenuSection({ items }: MenuSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-[var(--text-primary)]">Menu</h2>

      <div className="space-y-0">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`
              flex w-full items-center gap-3 py-2.5 text-left
              ${index < items.length - 1 ? "border-b border-[var(--border)]" : ""}
            `}
          >
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>

            <span className="min-w-0 flex-1 text-[10px] font-medium text-[var(--text-primary)]">
              {item.name}
            </span>

            <span className="text-[10px] font-semibold text-[var(--text-primary)]">
              {item.price}
            </span>

            <ChevronRight size={14} className="shrink-0 text-[var(--brand-gold)]" />
          </button>
        ))}
      </div>
    </section>
  );
}
