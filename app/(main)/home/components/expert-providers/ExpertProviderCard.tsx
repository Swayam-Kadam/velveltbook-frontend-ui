import { TrendingNearbyCard } from "../trending-nearby/TrendingNearbyCard";
import type { TrendingNearbyItem } from "../trending-nearby/trending-nearby.types";

interface ExpertProviderCardProps {
  provider: TrendingNearbyItem;
}

export function ExpertProviderCard({ provider }: ExpertProviderCardProps) {
  return <TrendingNearbyCard item={provider} />;
}
