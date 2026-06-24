import Image from "next/image";

import { MenuServiceItem } from "../message.types";
import { LayoutGrid, Plus } from "lucide-react";

interface MenuSectionProps {
  items: MenuServiceItem[];
  onAddService?: (item: MenuServiceItem) => void;
  canAddService?: boolean;
}

export function MenuSection({
  items,
  onAddService,
  canAddService = true,
}: MenuSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-md font-bold text-(--text-primary)">Menu</h2>

      <div className="flex mx-auto w-full gap-2 overflow-x-auto pb-1 scrollbar-none">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[72px] shrink-0 text-left"
          >
            <div className="feature-card relative overflow-hidden rounded-xl">
              <div className="relative h-[72px] w-[72px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </div>
              <div className="p-1.5 text-left">
                <p className="text-[10px] h-7 font-bold text-(--text-primary)">
                  {item.name}
                </p>
                <p className="text-[10px] font-bold text-(--brand-gold)">
                  {item.price}
                </p>
              </div>
              <button
                type="button"
                disabled={!canAddService}
                onClick={() => onAddService?.(item)}
                className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center
                      rounded-full border border-(--border) bg-(--surface)
                      text-(--accent-primary) shadow-sm font-bold
                      disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={10} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="w-[72px] shrink-0 text-left border border-(--brand-gold) rounded-xl"
        >
          <div className="h-[72px] flex flex-col items-center justify-center">
            <LayoutGrid size={30} strokeWidth={1.5} className="text-(--text-primary) font-bold" />
            <p className="text-[14px] font-medium text-(--text-primary)">More</p>
          </div>
        </button>
      </div>
    </section>
  );
}
