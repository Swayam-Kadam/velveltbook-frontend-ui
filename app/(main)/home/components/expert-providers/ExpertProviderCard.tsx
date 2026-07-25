import { TrendingNearbyCard } from "../trending-nearby/TrendingNearbyCard";
import type { ExpertProvider } from "./expert-providers.types";

interface ExpertProviderCardProps {
  provider: ExpertProvider;
}

export function ExpertProviderCard({ provider }: ExpertProviderCardProps) {
  return <TrendingNearbyCard item={provider} />;
}
