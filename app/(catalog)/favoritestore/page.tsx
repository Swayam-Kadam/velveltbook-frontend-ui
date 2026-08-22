import type { Metadata } from "next";

import { FavoriteStoresPageContent } from "./FavoriteStoresPageContent";

export const metadata: Metadata = {
  title: "Favourite Stores | VelvetBook",
  description: "View your saved favourite wellness and beauty stores.",
};

export default function FavoriteStoresPage() {
  return <FavoriteStoresPageContent />;
}
