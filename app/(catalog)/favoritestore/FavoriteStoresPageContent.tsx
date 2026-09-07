"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import { TrendingNearbyCard } from "@/home/components/trending-nearby/TrendingNearbyCard";
import {
  FAVORITE_STORES_EVENT,
  getFavoriteStores,
  type FavoriteStore,
} from "@/lib/favorite-stores";
import { FavoriteStoresSuggestionsRow } from "./FavoriteStoresSuggestionsRow";
import { FavoriteStoresSuggestionsSidebar } from "./FavoriteStoresSuggestionsSidebar";

/** Hide bottom suggestions when leftover space is smaller than this. */
const MIN_BOTTOM_SUGGESTIONS_HEIGHT = 132;

export function FavoriteStoresPageContent() {
  const router = useRouter();
  const [stores, setStores] = useState<FavoriteStore[]>([]);
  const [ready, setReady] = useState(false);
  const [showBottomSuggestions, setShowBottomSuggestions] = useState(true);

  const leftColumnRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setStores(getFavoriteStores());

    sync();
    setReady(true);
    window.addEventListener(FAVORITE_STORES_EVENT, sync);
    return () => window.removeEventListener(FAVORITE_STORES_EVENT, sync);
  }, []);

  useEffect(() => {
    const column = leftColumnRef.current;
    const favorites = favoritesRef.current;
    if (!column || !favorites) return;

    const update = () => {
      const remaining =
        column.clientHeight - favorites.offsetHeight - 12; /* gap */
      setShowBottomSuggestions(remaining >= MIN_BOTTOM_SUGGESTIONS_HEIGHT);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(column);
    observer.observe(favorites);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [ready, stores.length]);

  const excludeStoreIds = stores.map((store) => store.id);

  return (
    <main className="min-h-screen bg-(--bg-primary) px-3 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-4 lg:pb-4">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col pt-2 lg:h-[calc(100vh-2rem)] lg:pt-4">
        <div className="mb-4 shrink-0 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-(--border) bg-(--bg-card) text-(--text-primary) shadow-(--shadow-card)"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <h1 className="text-[18px] font-semibold text-(--text-primary) lg:text-[24px]">
              Favourite Stores
            </h1>
            <p className="text-[11px] text-(--text-muted) lg:text-[13px]">
              Stores you saved from Trending Nearby
            </p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:items-stretch lg:gap-5 xl:gap-6">
          <div
            ref={leftColumnRef}
            className="
              flex min-h-0 min-w-0 flex-1 flex-col gap-3
              max-lg:min-h-[calc(100vh-8rem)]
              lg:h-[calc(100vh-7rem)] lg:overflow-hidden
            "
          >
            <div
              ref={favoritesRef}
              className={`
                min-w-0
                ${
                  showBottomSuggestions
                    ? "shrink-0"
                    : "min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-(--accent-primary)/30 scrollbar-track-transparent"
                }
              `}
            >
              {!ready ? (
                <p className="py-10 text-center text-sm text-(--text-muted)">
                  Loading favourites...
                </p>
              ) : stores.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {stores.map((store) => (
                    <TrendingNearbyCard
                      key={store.id}
                      item={store}
                      variant="favorite"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]">
                    <Heart size={28} className="text-(--accent-primary)" />
                  </div>
                  <p className="text-sm font-medium text-(--text-primary)">
                    No favourite stores yet
                  </p>
                  <p className="mt-1 max-w-sm text-[12px] text-(--text-muted)">
                    Tap the bookmark on a store card to save it here.
                  </p>
                  <Link
                    href="/home"
                    className="primary-button mt-5 rounded-full px-6 py-2.5 text-[12px] font-semibold text-white"
                  >
                    Browse Stores
                  </Link>
                </div>
              )}
            </div>

            {showBottomSuggestions && (
              <FavoriteStoresSuggestionsRow
                excludeStoreIds={excludeStoreIds}
                className="min-h-0 flex-1"
              />
            )}
          </div>

          <FavoriteStoresSuggestionsSidebar excludeStoreIds={excludeStoreIds} />
        </div>
      </div>
    </main>
  );
}
