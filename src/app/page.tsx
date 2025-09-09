import { Navbar } from '@/components/common/layout/navbar';
import { EmotiveHero } from '@/components/feature/landing/emotive-hero';
import { EnhancedFooter } from '@/components/feature/landing/enhanced-footer';
import { Faqs } from '@/components/feature/landing/faq';
import { GlassmorphicCTA } from '@/components/feature/landing/glassmorphic-cta';
import { MasonryGallery } from '@/components/feature/landing/masonry-gallery';
import { PupVisualizer } from '@/components/feature/landing/pup-visualizer';
import { PricingPlans } from '@/components/feature/landing/pricing-plans';
import { PurposeManifesto } from '@/components/feature/landing/purpose-manifesto';
import { SplitTestimonials } from '@/components/feature/landing/split-testimonials';
import { ValuesGrid } from '@/components/feature/landing/values-grid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background ">
      <Navbar />
      <EmotiveHero />
      <PurposeManifesto />
      <div className="flex flex-col gap-24 md:gap-32 mt-24 md:mt-32  bg-background">
        <ValuesGrid />
        <MasonryGallery />
        <PupVisualizer />
        <SplitTestimonials />
        <PricingPlans />
        <GlassmorphicCTA />
        <Faqs />
        <EnhancedFooter />
      </div>
    </div>
  );
}
