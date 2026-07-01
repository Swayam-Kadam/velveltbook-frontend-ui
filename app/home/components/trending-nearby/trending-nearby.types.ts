export interface TrendingNearbyItem {
  id: string;

  name: string;

  image: string;

  avatar: string;

  service: string;

  desktopService?: string;

  rating?: number;

  reviews?: string;

  description?: string;

  desktopServices?: DesktopService[];

  availability: string;

  distance?: string;

  online?: boolean;

  organizationId: string;
}

export interface DesktopService {
  label: string;

  price: string;
  image: string;
}
