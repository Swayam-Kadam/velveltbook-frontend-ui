import Image from "next/image";

import type { Product } from "../types";

interface Props {
  product: Product;
}

export default function SidebarProductCard({ product }: Props) {
  return (
    <article className="group flex items-center gap-3 rounded-[var(--radius-sm)] border border-(--border) bg-(--bg-secondary) p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="48px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <h3 className="min-w-0 flex-1 truncate text-xs font-semibold text-(--text-primary) lg:text-sm">
        {product.title}
      </h3>

      <span className="shrink-0 text-sm font-bold text-(--text-primary) lg:text-base">
        {product.price}
      </span>
    </article>
  );
}
