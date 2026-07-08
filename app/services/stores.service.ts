import stores from "@/data/catalog/stores/stores.json";
import servicesData from "@/data/catalog/stores/services.json";
import staffData from "@/data/catalog/stores/staff.json";
import productsData from "@/data/catalog/stores/products.json";
import reviewsData from "@/data/catalog/stores/reviews.json";
import menuData from "@/data/catalog/stores/menu.json";
import suggestionsData from "@/data/catalog/stores/suggestions.json";
import { simulateFetch } from "@/lib/api/simulate";
import type {
  MenuItem,
  Product,
  Review,
  SectionData,
  SectionMeta,
  Service,
  SidebarMeta,
  StaffMember,
  StaffSectionMeta,
  Store,
  StorePageData,
  Suggestion,
  SuggestionsSectionMeta,
} from "@/types/store";

type StoreDataMap<T> = Record<string, T>;

function getStoreSection<TItem, TMeta = SectionMeta>(
  data: StoreDataMap<SectionData<TItem, TMeta>>,
  storeId: string,
  sectionName: string,
): SectionData<TItem, TMeta> {
  const section = data[storeId];

  if (!section) {
    throw new Error(
      `Missing ${sectionName} data for store "${storeId}". Add an entry in the corresponding JSON file.`,
    );
  }

  return section;
}

export async function getStoreById(id: string): Promise<Store | undefined> {
  return simulateFetch(stores.find((store) => store.id === id));
}

export function getAllStoreIds(): string[] {
  return stores.map((store) => store.id);
}

export async function getStoreServices(
  storeId: string,
): Promise<SectionData<Service>> {
  return simulateFetch(
    getStoreSection<Service>(
      servicesData as StoreDataMap<SectionData<Service>>,
      storeId,
      "services",
    ),
  );
}

export async function getStoreStaff(
  storeId: string,
): Promise<SectionData<StaffMember, StaffSectionMeta>> {
  return simulateFetch(
    getStoreSection<StaffMember, StaffSectionMeta>(
      staffData as StoreDataMap<SectionData<StaffMember, StaffSectionMeta>>,
      storeId,
      "staff",
    ),
  );
}

export async function getStoreProducts(
  storeId: string,
): Promise<SectionData<Product>> {
  return simulateFetch(
    getStoreSection<Product>(
      productsData as StoreDataMap<SectionData<Product>>,
      storeId,
      "products",
    ),
  );
}

export async function getStoreReviews(
  storeId: string,
): Promise<SectionData<Review>> {
  return simulateFetch(
    getStoreSection<Review>(
      reviewsData as StoreDataMap<SectionData<Review>>,
      storeId,
      "reviews",
    ),
  );
}

export async function getStoreMenu(
  storeId: string,
): Promise<SectionData<MenuItem, SidebarMeta>> {
  return simulateFetch(
    getStoreSection<MenuItem, SidebarMeta>(
      menuData as StoreDataMap<SectionData<MenuItem, SidebarMeta>>,
      storeId,
      "menu",
    ),
  );
}

export async function getStoreSuggestions(
  storeId: string,
): Promise<SectionData<Suggestion, SuggestionsSectionMeta>> {
  return simulateFetch(
    getStoreSection<Suggestion, SuggestionsSectionMeta>(
      suggestionsData as StoreDataMap<
        SectionData<Suggestion, SuggestionsSectionMeta>
      >,
      storeId,
      "suggestions",
    ),
  );
}

export async function getStorePageData(
  storeId: string,
): Promise<StorePageData | null> {
  const store = await getStoreById(storeId);

  if (!store) {
    return null;
  }

  const [services, staff, products, reviews, menu, suggestions] =
    await Promise.all([
      getStoreServices(storeId),
      getStoreStaff(storeId),
      getStoreProducts(storeId),
      getStoreReviews(storeId),
      getStoreMenu(storeId),
      getStoreSuggestions(storeId),
    ]);

  return {
    store,
    services,
    staff,
    products,
    reviews,
    menu,
    suggestions,
  };
}
