"use client";

import { useState } from "react";

import { ChooseExpertSection } from "./ChooseExpertSection";
import { ChooseServiceSection } from "./ChooseServiceSection";
import { ContinueBookingBar } from "./ContinueBookingBar";
import { HelpTabNav } from "./HelpTabNav";
import { HelpTopNav } from "./HelpTopNav";
import { TrustFeatures } from "./TrustFeatures";

export function CallExpertScreen() {
  const [selectedServiceId, setSelectedServiceId] = useState("manicure");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative pb-[110px]">
      <div className="space-y-4 px-2 pt-2">
        <HelpTopNav />
        <HelpTabNav />
        <ChooseServiceSection
          selectedServiceId={selectedServiceId}
          onSelectService={setSelectedServiceId}
        />
        <ChooseExpertSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <TrustFeatures />
      </div>

      <ContinueBookingBar />
    </div>
  );
}
