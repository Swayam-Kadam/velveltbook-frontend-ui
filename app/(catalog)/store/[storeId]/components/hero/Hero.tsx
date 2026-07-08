import type { Store } from "../types";
import { getStoreHero } from "../lib/getStoreHero";
import HeroActions from "./HeroActions";
import HeroBadges from "./HeroBadges";
import HeroImage from "./HeroImage";
import HeroInfo from "./HeroInfo";
import "./hero.css";

interface Props {
  store: Store;
}

export default function Hero({ store }: Props) {
  const hero = getStoreHero(store);

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-(--border) shadow-[var(--shadow-card)]">
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr]">
        <div className="relative h-[200px] sm:h-[260px] lg:h-auto lg:min-h-[280px]">
          <HeroImage store={store} />

          <div className="absolute left-4 top-4 z-10">
            <HeroBadges hero={hero} />
          </div>
        </div>

        <div className="store-hero-panel flex flex-col justify-center gap-2 p-5 sm:p-4">
          <HeroInfo hero={hero} />
          <HeroActions hero={hero} />
        </div>
      </div>
    </section>
  );
}
