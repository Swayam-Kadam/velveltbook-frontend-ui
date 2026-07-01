import { ArrowRight } from "lucide-react";

import { ExpertProviderCard } from "./ExpertProviderCard";
import { expertProviders } from "./expert-providers.data";
import { ExpertProvider } from "./expert-providers.types";

const desktopOnlyProvider: ExpertProvider = {
    id: "desktop-4",
    image: "/profile.jpeg",
    name: "Healing Hands",
    specialist: "Specialist: Neha R.",
    distance: "1.5km",
    rating: 4.7,
    reviews: 76,
    price: "Rs799",
    organizationId: "org-expert-4",
};

export function ExpertProviders() {
    return (
        <section className="pb-3">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h2 className="text-xs font-medium text-(--text-primary) lg:text-[18px]">
                        Expert Providers
                    </h2>

                    <p className="text-[8px] text-(--text-muted) lg:text-[11px]">
                        Top rated experts in your area
                    </p>
                </div>

                <button className="flex items-center gap-1 text-[8px] text-(--accent-secondary) lg:text-[12px]">
                    <span className="lg:hidden">View All</span>
                    <span className="hidden lg:inline">View all</span>
                    <ArrowRight size={10} className="lg:h-4 lg:w-4" />
                </button>
            </div>

            <div
                className="
          flex gap-3 overflow-x-auto pb-2
          snap-x snap-mandatory
          scrollbar-hide
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0
        "
            >
                {expertProviders.map((provider) => (
                    <div
                        key={provider.id}
                        className="min-w-[280px] flex-shrink-0 snap-start lg:min-w-0 lg:flex-shrink lg:snap-none"
                    >
                        <ExpertProviderCard provider={provider} />
                    </div>
                ))}

                <div className="hidden min-w-0 lg:block">
                    <ExpertProviderCard provider={desktopOnlyProvider} />
                </div>
            </div>
        </section>
    );
}
