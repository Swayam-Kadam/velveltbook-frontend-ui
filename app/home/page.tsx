import { SearchBar } from "@/components/header/SearchBar";
import { ExpertProviders } from "./components/expert-providers/ExpertProviders";
import { HeroSlider } from "./components/hero-slider/HeroSlider";
import { TrendingNearby } from "./components/trending-nearby/TrendingNearby";

export default function Home() {
    return (
        <main className="space-y-3 px-2 pb-20">
            <SearchBar />
            <HeroSlider />
            <TrendingNearby />
            <ExpertProviders />
        </main>
    );
}