export interface ServiceExpert {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  image: string;
  online: boolean;
}

export interface SuggestedService {
  id: string;
  name: string;
  price: string;
  duration: string;
  image: string;
}

export interface ServiceDetail {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  duration: string;
  description: string;
  price: string;
  experts: ServiceExpert[];
  suggestedServices: SuggestedService[];
}
