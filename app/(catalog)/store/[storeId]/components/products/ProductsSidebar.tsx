import type { Product, SectionData } from "../types";
import { SidebarFooter, SidebarHeader } from "../shared/Badge";
import SidebarProductCard from "./SidebarProductCard";

const VISIBLE_PRODUCTS = 4;

interface Props {
  meta: SectionData<Product>["meta"];
  items: SectionData<Product>["items"];
}

export default function ProductsSidebar({ meta, items }: Props) {
  const visibleItems = items.slice(0, VISIBLE_PRODUCTS);
  const footerLabel = meta.footerLabel ?? meta.viewAllLabel;

  return (
    <div className="rounded-[var(--radius-lg)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)] lg:p-5">
      <SidebarHeader title={meta.title} />

      <div className="space-y-3">
        {visibleItems.map((product) => (
          <SidebarProductCard key={product.id} product={product} />
        ))}
      </div>

      <SidebarFooter label={footerLabel} href={meta.viewAllHref} />
    </div>
  );
}
