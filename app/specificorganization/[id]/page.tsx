import { OrganizationProfile } from "../components/OrganizationProfile";
import { getOrganization, organizations } from "../organization.data";

interface OrganizationPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Object.keys(organizations).map((id) => ({ id }));
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { id } = await params;
  const organization = getOrganization(id);

  return (
    <main>
      <OrganizationProfile organization={organization} />
    </main>
  );
}
