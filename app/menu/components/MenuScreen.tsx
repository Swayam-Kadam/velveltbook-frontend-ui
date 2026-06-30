"use client";

import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/Button";
import { CategorySidebar } from "./CategorySidebar";
import { ExpertSelection, ExpertType } from "./ExpertSelection";
import { ServiceCard } from "./ServiceCard";
import {
  massageServices,
  menuCategories,
} from "../menu.data";
import { SearchBar } from "@/components/header/SearchBar";

export function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState("massage");
  const [expertType, setExpertType] = useState<ExpertType>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(1);
  const totalPages = 2;

  return (
    <div className="relative flex min-h-[calc(100dvh-220px)] flex-col">
      <SearchBar />
      <div className="flex flex-1 overflow-hidden">
        <CategorySidebar
          categories={menuCategories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-(--bg-secondary)">
          <div className="flex-1 overflow-y-auto scrollbar-none">
            <div className="px-2 pt-3">
              <div className="mb-3 flex items-center justify-between">
                <h1 className="text-xs font-medium text-(--text-primary)">
                  Popular Massage Services
                </h1>

                <button
                  type="button"
                  className="
                    flex items-center gap-0.5 text-[8px]
                    text-(--brand-gold) transition-opacity duration-200
                    hover:opacity-80
                  "
                >
                  <span>View All</span>
                  <ArrowRight size={10} strokeWidth={2} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {massageServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    selected={selectedServiceId === service.id}
                    onSelect={(s) => setSelectedServiceId(s.id)}
                  />
                ))}
              </div>
              
              <div className="mt-3 flex items-center justify-end gap-2 pr-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                  className="
                    flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px]
                    font-semibold text-(--text-primary) transition-colors
                    duration-200 hover:bg-(--bg-primary)
                    disabled:cursor-not-allowed disabled:opacity-40
                    disabled:hover:bg-transparent
                  "
                >
                  <ChevronLeft size={14} strokeWidth={2.5} />
                  Back
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        aria-label={`Go to page ${p}`}
                        aria-current={page === p ? "page" : undefined}
                        className={`
                          flex h-6 w-6 items-center justify-center rounded-md
                          text-[11px] font-bold transition-colors duration-200
                          ${
                            page === p
                              ? "bg-(--text-primary) text-white"
                              : "text-(--text-primary) hover:bg-(--bg-primary)"
                          }
                        `}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                  className="
                    flex items-center gap-0.5 rounded-md px-2 py-1 text-[11px]
                    font-semibold text-(--text-primary) transition-colors
                    duration-200 hover:bg-(--bg-primary)
                    disabled:cursor-not-allowed disabled:opacity-40
                    disabled:hover:bg-transparent
                  "
                >
                  Next
                  <ChevronRight size={14} strokeWidth={2.5} />
                </button>
              </div>
             
            </div>

            <ExpertSelection
              selected={expertType}
              onSelect={setExpertType}
              serviceSelected={selectedServiceId !== null}
            />
          </div>
        </div>
      </div>

      
    </div>
  );
}
