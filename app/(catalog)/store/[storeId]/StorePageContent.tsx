import Hero from "./components/hero/Hero";
import MenuSidebar from "./components/menu/MenuSidebar";
import Products from "./components/products/Products";
import ProductsSidebar from "./components/products/ProductsSidebar";
import Reviews from "./components/reviews/Reviews";
import Services from "./components/services/Services";
import Staff from "./components/staff/Staff";
import SuggestionsSidebar from "./components/suggestions/SuggestionsSidebar";
import type { StorePageData } from "./components/types";

interface Props {
  data: StorePageData;
}

export default function StorePageContent({ data }: Props) {
  const { store, services, staff, products, reviews, menu, suggestions } = data;

  return (
    <main className="min-h-screen bg-(--bg-primary) pb-24 lg:pb-8">
      <div className="mx-auto max-w-[1600px] px-4 py-5 lg:px-8 lg:py-6">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)_300px] xl:gap-6">
          <SuggestionsSidebar
            meta={suggestions.meta}
            items={suggestions.items}
          />

          <div className="order-1 space-y-6 xl:order-none xl:space-y-8">
            <Hero store={store} />
            <Services meta={services.meta} items={services.items} />
            <Staff meta={staff.meta} items={staff.items} />
            <Products meta={products.meta} items={products.items} />
            <Reviews meta={reviews.meta} items={reviews.items} />
          </div>

          <aside className="order-3 xl:order-none">
            <div className="space-y-5 xl:sticky xl:top-24">
              <MenuSidebar meta={menu.meta} items={menu.items} />
              <ProductsSidebar
                meta={products.meta}
                items={products.items}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
