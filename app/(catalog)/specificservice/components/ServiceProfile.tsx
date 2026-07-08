"use client";

import { useState } from "react";

import { ServiceDetail } from "../service.types";
import { OrganizationBanner } from "./OrganizationBanner";
import { SeeMoreExpertsButton } from "./SeeMoreExpertsButton";
import { SelectExpertsSection } from "./SelectExpertsSection";
import { ServiceBottomBookingBar } from "./ServiceBottomBookingBar";
import { ServiceInfoSection } from "./ServiceInfoSection";
import { SuggestedServicesSection } from "./SuggestedServicesSection";

interface ServiceProfileProps {
  service: ServiceDetail;
}

export function ServiceProfile({ service }: ServiceProfileProps) {
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(
    service.experts[0]?.id ?? null,
  );

  return (
    <div className="relative pb-[100px]">
      <div className="space-y-4 px-2 pt-2">
        <OrganizationBanner />
        <ServiceInfoSection service={service} />
        <SelectExpertsSection
          experts={service.experts}
          selectedExpertId={selectedExpertId}
          onSelectExpert={setSelectedExpertId}
        />
        <SeeMoreExpertsButton />
      </div>

      <ServiceBottomBookingBar price={service.price} />

      <div className="px-2">
        <SuggestedServicesSection
          services={service.suggestedServices}
          currentServiceId={service.id}
        />
      </div>
    </div>
  );
}
