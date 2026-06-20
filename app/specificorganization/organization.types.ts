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
