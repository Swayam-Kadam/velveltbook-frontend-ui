export interface HomeService {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface HomeExpert {
  id: string;
  name: string;
  profession: string;
  rating: number;
  reviews: number;
  image: string;
  gender: "male" | "female";
}
