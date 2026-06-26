import { SearchBar } from "@/components/header/SearchBar";
import { ExtendedOrganization } from "../organization.types";
import { HeroBanner } from "./HeroBanner";
import { QuickActions } from "./QuickActions";
import { ReviewsSection } from "./ReviewsSection";
import { SalonInfoCard } from "./SalonInfoCard";
import { ServicesSection } from "./ServicesSection";
import { StaffSection } from "./StaffSection";

interface ExtendedOrganizationProfileProps {
  organization: ExtendedOrganization;
}

export function ExtendedOrganizationProfile({
  organization,
}: ExtendedOrganizationProfileProps) {
  return (
    <div className="space-y-4 px-2 pb-24 pt-2">
      <SearchBar />
      <HeroBanner
        images={organization.heroImages}
        availability={organization.availability}
        salonName={organization.name}
        organization={organization}
      />
      <ServicesSection services={organization.services} />
      <StaffSection staff={organization.staff} />
      <ReviewsSection reviews={organization.reviews} />
    </div>
  );
}
