import { Organization } from "../organization.types";
import { BottomBookingBar } from "./BottomBookingBar";
import { ChooseOptionSection } from "./ChooseOptionSection";
import { OrganizationActions } from "./OrganizationActions";
import { OrganizationHeader } from "./OrganizationHeader";
import { PopularServicesSection } from "./PopularServicesSection";
import { TopExpertsSection } from "./TopExpertsSection";

interface OrganizationProfileProps {
  organization: Organization;
}

export function OrganizationProfile({ organization }: OrganizationProfileProps) {
  return (
    <div className="relative pb-[100px]">
      <div className="space-y-4 px-2 pt-2">
        <OrganizationHeader organization={organization} />
        <OrganizationActions />
        <ChooseOptionSection />
        <PopularServicesSection services={organization.services} />
        <TopExpertsSection experts={organization.experts} />
      </div>

      <BottomBookingBar />
    </div>
  );
}
