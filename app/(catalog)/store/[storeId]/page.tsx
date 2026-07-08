import { notFound } from "next/navigation";

import StorePageContent from "./StorePageContent";
import { getAllStoreIds } from "./components/lib/getStore";
import { getStorePageData } from "./components/lib/storeApi";

interface PageProps {
  params: Promise<{ storeId: string }>;
}

export function generateStaticParams() {
  return getAllStoreIds().map((storeId) => ({ storeId }));
}

export default async function StorePage({ params }: PageProps) {
  const { storeId } = await params;
  const pageData = await getStorePageData(storeId);

  if (!pageData) {
    notFound();
  }

  return <StorePageContent data={pageData} />;
}
