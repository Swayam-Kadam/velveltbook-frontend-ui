import Image from "next/image";

import { MenuServiceItem } from "../message.types";
import { Grid2X2Plus } from "lucide-react";

interface MenuSectionProps {
  items: MenuServiceItem[];
}

export function MenuSection({ items }: MenuSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-md font-bold text-(--text-primary)">Menu</h2>

      <div className="flex mx-auto w-full gap-2 overflow-x-auto pb-1 scrollbar-none">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
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
              <div className="p-1.5 text-center">
                <p className="text-[10px] h-7 font-bold text-(--text-primary)">
                  {item.name}
                </p>
                <p className="text-[10px] font-bold text-(--brand-gold)">
                  {item.price}
                </p>
              </div>
            </div>
          </button>
        ))}

<button
            // key={item.id}
            type="button"
            className="w-[72px] shrink-0 text-left border border-(--brand-gold) rounded-xl"
          >
           <div className="h-[72px] flex flex-col items-center justify-center">
            <Grid2X2Plus size={30} strokeWidth={2.5} />
            <p className="text-[14px] font-medium text-(--text-primary)">More</p>
           </div>
          </button>
      </div>
    </section>
  );
}
