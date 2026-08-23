"use client";

import { useMemo, useState } from "react";
import { ShoppingBag, ShoppingBasket, ShoppingCart, X } from "lucide-react";

import { CategorySidebar } from "@/menu/components/CategorySidebar";
import { MenuProductCard } from "@/menu/components/MenuProductCard";
import {
  getProductsByCategory,
  menuCategories,
} from "@/menu/menu.data";

interface ProductAddMoreModalProps {
  selectedProductIds: string[];
  onToggleProduct: (id: string) => void;
  onClose: () => void;
}

export function ProductAddMoreModal({
  selectedProductIds,
  onToggleProduct,
  onClose,
}: ProductAddMoreModalProps) {
  const [activeCategory, setActiveCategory] = useState(
    menuCategories[0]?.id ?? "massage",
  );

  const categoryProducts = useMemo(
    () => getProductsByCategory(activeCategory),
    [activeCategory],
  );

  const selectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const category of menuCategories) {
      const products = getProductsByCategory(category.id);
      counts[category.id] = products.filter((product) =>
        selectedProductIds.includes(product.id),
      ).length;
    }
    return counts;
  }, [selectedProductIds]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="
          flex h-[70dvh] w-full max-w-3xl flex-col overflow-hidden
          rounded-2xl bg-(--bg-primary) shadow-(--shadow-glow)
        "
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-more-products-title"
      >
        <div className="flex items-center justify-between gap-2 border-b border-(--border) px-3 py-3 lg:px-5 lg:py-4">
          <div>
            <h3
              id="add-more-products-title"
              className="text-sm font-bold text-(--text-primary) lg:text-[18px]"
            >
              Add products
            </h3>
            <p className="mt-0.5 text-[10px] text-(--text-muted) lg:text-[12px]">
              Browse categories and tap to add or remove
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex h-8 w-8 items-center justify-center rounded-full
              border border-(--border) text-(--text-muted)
              transition-colors hover:text-(--text-primary)
            "
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <CategorySidebar
            categories={menuCategories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
            selectedCounts={selectedCounts}
            largeText
          />

          <div className="min-w-0 flex-1 overflow-y-auto p-3 lg:p-4">
            <p className="mb-2 text-[11px] font-semibold text-(--text-secondary) lg:text-[13px]">
              {menuCategories.find((c) => c.id === activeCategory)?.label ??
                "Products"}
            </p>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 lg:gap-3">
                {categoryProducts.map((product) => (
                  <MenuProductCard
                    key={product.id}
                    product={product}
                    selected={selectedProductIds.includes(product.id)}
                    onSelect={() => onToggleProduct(product.id)}
                    largeText
                  />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-(--text-muted)">
                No products in this category.
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-(--border) px-3 py-3 lg:px-5 flex items-center gap-3">
  <div className="flex items-center justify-center relative flex-shrink-0 bg-(--text-primary) p-0.5 rounded-[6px]">
    <ShoppingCart size={24} className="text-white" />
    {selectedProductIds.length > 0 && (
      <span className="absolute -top-1 -right-2 text-[10px] font-semibold text-black bg-(--brand-gold) rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1.5">
        {selectedProductIds.length}
      </span>
    )}
  </div>
  
  <button
    type="button"
    onClick={onClose}
    className="primary-button flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-white lg:py-3.5 lg:text-[15px]"
  >
    Done
  </button>
</div>
      </div>
    </div>
  );
}
