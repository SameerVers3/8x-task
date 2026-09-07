"use client";

import { AppShell } from "./components/app-shell";
import { HeroSection } from "./sections/hero";
import { FeatureShowcase } from "./sections/feature-showcase";
import { GalleryMasonry } from "./sections/gallery-masonry";
import { VideoGallery } from "./sections/video-gallery";
import { AlternatingFeatures } from "./sections/alternating-features";
import { ModelGrid } from "./sections/model-grid";
import { PricingSection } from "./sections/pricing-section";
import { FaqSection } from "./sections/faq";
import { CtaBanner } from "./sections/cta-banner";

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col">
        <HeroSection />
        <FeatureShowcase />
        <GalleryMasonry />
        <VideoGallery />
        <AlternatingFeatures />
        <ModelGrid />
        <PricingSection />
        <FaqSection />
        <CtaBanner />
      </div>
    </AppShell>
  );
}
