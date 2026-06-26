import { ExpertProfile } from "../expert.types";
import { ExpertActionButtons } from "./ExpertActionButtons";
import {
  CertificationCard,
  DescriptionCard,
  HobbiesCard,
  TagsCard,
} from "./ExpertContentCards";
import { ExpertHeroSection } from "./ExpertHeroSection";
import { ExpertTopNav } from "./ExpertTopNav";
import { ReviewsSection } from "./ReviewsSection";

interface ExpertProfileScreenProps {
  expert: ExpertProfile;
}

export function ExpertProfileScreen({ expert }: ExpertProfileScreenProps) {
  return (
    <div className="pb-24">
      <div className="space-y-3 px-2 pt-2">
        <ExpertTopNav />
        <ExpertHeroSection expert={expert} />
        <ExpertActionButtons expertId={expert.id} />
        {/* <DescriptionCard description={expert.description} /> */}
        <TagsCard tags={expert.tags} />
        <ReviewsSection
          reviews={expert.reviewsList}
          totalReviews={expert.reviews}
        />
        <CertificationCard
          title={expert.certificationTitle}
          items={expert.certificationItems}
        />
        <HobbiesCard hobbies={expert.hobbies} />
      </div>
    </div>
  );
}
