import { ServiceDetail } from "../service.types";
import { SeeMoreExpertsButton } from "./SeeMoreExpertsButton";
import { SelectExpertsSection } from "./SelectExpertsSection";
import { ServiceBottomBookingBar } from "./ServiceBottomBookingBar";
import { ServiceInfoSection } from "./ServiceInfoSection";

interface ServiceProfileProps {
  service: ServiceDetail;
}

export function ServiceProfile({ service }: ServiceProfileProps) {
  return (
    <div className="relative pb-[100px]">
      <div className="space-y-4 px-2 pt-2">
        <ServiceInfoSection service={service} />
        <SelectExpertsSection experts={service.experts} />
        <SeeMoreExpertsButton />
      </div>

      <ServiceBottomBookingBar price={service.price} />
    </div>
  );
}
