import { ExtendedOrganizationProfile } from "../components/ExtendedOrganizationProfile";
import {
  extendedOrganizations,
  getExtendedOrganization,
} from "../organization.data";
import { getOrganizationSuggestions } from "@/data/catalog/organizations/organization-suggestions";

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
  const suggestions = getOrganizationSuggestions(id);

  return (
    <main>
      <ExtendedOrganizationProfile
        organization={organization}
        suggestions={suggestions}
      />
    </main>
  );
}
