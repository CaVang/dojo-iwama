"use client";

import { useRef } from "react";
import DojoEntrance from "@/components/ui/DojoEntrance";
import AgeGroupsSection from "@/components/main/AgeGroupsSection";
import CorePillarsSection from "@/components/main/CorePillarsSection";
import PhilosophySection from "@/components/main/PhilosophySection";
import FeaturedTechniquesSection from "@/components/main/FeaturedTechniquesSection";
import DojoNetworkSection from "@/components/main/DojoNetworkSection";
import UpcomingEventsSection from "@/components/main/UpcomingEventsSection";
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

        {/* Age Groups Section */}
        <AgeGroupsSection />

        {/* Core Pillars / Safety Guarantee */}
        <CorePillarsSection />

        {/* Dojo Section */}
        <DojoNetworkSection />

        {/* Upcoming Events Section */}
        <UpcomingEventsSection />

        {/* Quote Section */}
        <QuoteSection />
      </div>
    </div>
  );
}
