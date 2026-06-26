export interface ExtendedService {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface ExtendedStaff {
  id: string;
  name: string;
  experience: string;
  image: string;
}

export interface ExtendedReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
}

export interface ExtendedOrganization {
  id: string;
  name: string;
  status: string;
  thumbnail: string;
  heroImages: string[];
  availability: string;
  services: ExtendedService[];
  staff: ExtendedStaff[];
  reviews: ExtendedReview[];
}
