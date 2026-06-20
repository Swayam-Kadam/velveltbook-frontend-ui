import { ArrowRight } from "lucide-react";

import { ExpertProviderCard } from "./ExpertProviderCard";
import { expertProviders } from "./expert-providers.data";

export function ExpertProviders() {
    return (
        <section className="pb-3">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h2 className="text-xs font-medium text-[var(--text-primary)]">
                        Expert Providers
                    </h2>

                    <p className="text-[8px] text-[var(--text-muted)]">
                        Top rated experts in your area
                    </p>
                </div>

                <button className="flex items-center gap-1 text-[8px] text-[var(--accent-secondary)]">
                    <span>View All</span>
                    <ArrowRight size={10} />
                </button>
            </div>

            <div
                className="
          flex gap-3 overflow-x-auto pb-2
          snap-x snap-mandatory
          scrollbar-hide
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
            >
                {expertProviders.map((provider) => (
                    <div
                        key={provider.id}
                        className="min-w-[280px] flex-shrink-0 snap-start"
                    >
                        <ExpertProviderCard provider={provider} />
                    </div>
                ))}
            </div>
        </section>
    );
}