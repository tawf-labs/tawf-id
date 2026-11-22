import { HeroSection } from "../landing/HeroSection";
import { StatsSection } from "../landing/StatsSection";
import { FeaturesSection } from "../landing/FeaturesSection";
import { CtaSection } from "../landing/CtaSection";

export function Landing() {
  return (
    <div data-landing className="bg-stone text-ink">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
