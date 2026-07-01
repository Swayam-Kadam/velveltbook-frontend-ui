import Image from "next/image";

import type { Product } from "../types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative h-[72px] w-full overflow-hidden sm:h-[76px]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 1024px) 40vw, 120px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-0.5 p-1.5 sm:p-2">
        <h3 className="line-clamp-2 text-[10px] font-semibold leading-snug text-(--text-primary) sm:text-[11px]">
          {product.title}
        </h3>
        <span className="text-[11px] font-bold text-(--text-primary) sm:text-xs">
          {product.price}
        </span>
      </div>
    </article>
  );
}
