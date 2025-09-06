import { Navbar } from '@/components/common/layout/navbar';
import { EmotiveHero } from '@/components/feature/landing/emotive-hero';
import { EnhancedFooter } from '@/components/feature/landing/enhanced-footer';
import { FaqAccordion } from '@/components/feature/landing/faq-accordion';
import { GlassmorphicCTA } from '@/components/feature/landing/glassmorphic-cta';
import { MasonryGallery } from '@/components/feature/landing/masonry-gallery';
import { MatchmakingVisualizer } from '@/components/feature/landing/matchmaking-visualizer';
import { PricingPlans } from '@/components/feature/landing/pricing-plans';
import { PurposeManifesto } from '@/components/feature/landing/purpose-manifesto';
import { SplitTestimonials } from '@/components/feature/landing/split-testimonials';
import { ValuesGrid } from '@/components/feature/landing/values-grid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}

      <Navbar />
      <EmotiveHero />
      <PurposeManifesto />
      <ValuesGrid />
      <MasonryGallery />
      <MatchmakingVisualizer />
      <SplitTestimonials />
      <PricingPlans />
      <GlassmorphicCTA />
      <FaqAccordion />
      <EnhancedFooter />
    </div>
  );
}
