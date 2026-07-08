import { ExtendedOrganizationProfile } from "../components/ExtendedOrganizationProfile";
import {
  extendedOrganizations,
  getExtendedOrganization,
} from "../organization.data";

interface ExtendedOrganizationPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return Object.keys(extendedOrganizations).map((id) => ({ id }));
}

export default async function ExtendedOrganizationPage({
  params,
}: ExtendedOrganizationPageProps) {
  const { id } = await params;
  const organization = getExtendedOrganization(id);

  return (
    <main>
      <ExtendedOrganizationProfile organization={organization} />
    </main>
  );
}
