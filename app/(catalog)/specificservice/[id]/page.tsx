import { ServiceProfile } from "../components/ServiceProfile";
import { getService, services } from "../service.data";

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Object.keys(services).map((id) => ({ id }));
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = getService(id);

  return (
    <main>
      <ServiceProfile service={service} />
    </main>
  );
}
