import { ChallengeSection } from "@/components/sites/tastelabs-com-373890df/root-8a5edab2/ChallengeSection";
import { HeroSection } from "@/components/sites/tastelabs-com-373890df/root-8a5edab2/HeroSection";
import { MissionSection } from "@/components/sites/tastelabs-com-373890df/root-8a5edab2/MissionSection";
import { ProductSection } from "@/components/sites/tastelabs-com-373890df/root-8a5edab2/ProductSection";
import { ResearchSection } from "@/components/sites/tastelabs-com-373890df/root-8a5edab2/ResearchSection";
import { SiteHeader } from "@/components/sites/tastelabs-com-373890df/root-8a5edab2/SiteHeader";
import { SwipeFooter } from "@/components/sites/tastelabs-com-373890df/root-8a5edab2/SwipeFooter";
import { TeamSection } from "@/components/sites/tastelabs-com-373890df/root-8a5edab2/TeamSection";

export default function TasteHome() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ChallengeSection />
        <MissionSection />
        <ProductSection />
        <TeamSection />
        <ResearchSection />
      </main>
      <SwipeFooter />
    </>
  );
}
