export interface ExpertReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface ExpertHobby {
  id: string;
  label: string;
  icon: string;
}

export interface ExpertProfile {
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
  reviewsList: ExpertReview[];
  hobbies: ExpertHobby[];
}
