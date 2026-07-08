import { ExpertProfileScreen } from "../components/ExpertProfileScreen";
import { experts, getExpert } from "../expert.data";

interface ExpertPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Object.keys(experts).map((id) => ({ id }));
}

export default async function ExpertPage({ params }: ExpertPageProps) {
  const { id } = await params;
  const expert = getExpert(id);

  return (
    <main>
      <ExpertProfileScreen expert={expert} />
    </main>
  );
}
