import { notFound } from "next/navigation";

import {
  ServiceCategoryPageContent,
} from "./ServiceCategoryPageContent";
import { serviceCategoryTabs } from "../service-category.data";

interface ServiceCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export function generateStaticParams() {
  return serviceCategoryTabs.map((category) => ({
    category: category.id,
  }));
}

export default async function ServiceCategoryPage({
  params,
}: ServiceCategoryPageProps) {
  const { category } = await params;
  const isValidCategory = serviceCategoryTabs.some((item) => item.id === category);

  if (!isValidCategory) {
    notFound();
  }

  return <ServiceCategoryPageContent key={category} categoryId={category} />;
}
