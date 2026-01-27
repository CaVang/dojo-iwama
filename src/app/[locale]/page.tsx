"use client";

import { useRef } from "react";
import DojoEntrance from "@/components/ui/DojoEntrance";
import PhilosophySection from "@/components/main/PhilosophySection";
import FeaturedTechniquesSection from "@/components/main/FeaturedTechniquesSection";
import DojoNetworkSection from "@/components/main/DojoNetworkSection";
import QuoteSection from "@/components/main/QuoteSection";

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-washi">
      {/* Dojo Entrance Animation */}
      <DojoEntrance />

      {/* Main Content */}
      <div ref={contentRef}>
        {/* Philosophy Section - Riai */}
        <PhilosophySection />

        {/* Featured Techniques */}
        <FeaturedTechniquesSection />

        {/* Dojo Section */}
        <DojoNetworkSection />

        {/* Quote Section */}
        <QuoteSection />
      </div>
    </div>
  );
}
