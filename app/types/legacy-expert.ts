export interface LegacyExpertReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface LegacyExpertHobby {
  id: string;
  label: string;
  icon: string;
}

/** Legacy expert profile shape used by specificexpert/ routes. */
export interface LegacyExpertProfile {
  id: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  experience: string;
  description: string;
  tags: string[];
  certificationTitle: string;
  certificationItems: string[];
  reviewsList: LegacyExpertReview[];
  hobbies: LegacyExpertHobby[];
}
