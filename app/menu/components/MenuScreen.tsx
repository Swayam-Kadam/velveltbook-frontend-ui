"use client";

import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";

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
  const [expertType, setExpertType] = useState<ExpertType>("male");

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
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>

            <ExpertSelection
              selected={expertType}
              onSelect={setExpertType}
            />
          </div>
        </div>
      </div>

      
    </div>
  );
}
