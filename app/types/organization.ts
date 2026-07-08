export interface OrganizationService {
  id: string;
  name: string;
  duration: string;
  price: string;
  image: string;
}

export interface OrganizationExpert {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  online: boolean;
}

export interface Organization {
  id: string;
  name: string;
  image: string;
  categories: string[];
  location: string;
  rating: number;
  reviews: number;
  status: string;
  closesAt: string;
  services: OrganizationService[];
  experts: OrganizationExpert[];
}

export interface ExtendedService {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  duration?: string;
  categoryId?: string;
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
