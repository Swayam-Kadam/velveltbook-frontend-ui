import type { Metadata } from "next";

import { MyServicesPageContent } from "./MyServicesPageContent";

export const metadata: Metadata = {
  title: "My Services | VelvetBook",
  description: "Review your selected wellness and beauty services.",
};

export default function MyServicesPage() {
  return <MyServicesPageContent />;
}
