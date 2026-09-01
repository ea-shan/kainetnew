import { CtaSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/CtaSection";
import { GetStartedSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/GetStartedSection";
import { HeroSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/HeroSection";
import { SecuritySection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/SecuritySection";
import { SiteFooter } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/SiteFooter";
import { SiteHeader } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/SiteHeader";
import { SolutionsSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/SolutionsSection";
import { TrustedBySection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/TrustedBySection";
import { AgentExperienceSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/AgentExperienceSection";
import { VideoIntelligenceModels } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/VideoIntelligenceModels";
import { WorkflowsSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/WorkflowsSection";

export default function Home() {
  return (
    <div className="tl-site">
      <SiteHeader />
      <main>
        <div className="tl-hero-band">
          <HeroSection />
          <GetStartedSection />
        </div>
        <WorkflowsSection />
        <AgentExperienceSection />
        <VideoIntelligenceModels />
        <TrustedBySection />
        <SolutionsSection />
        <SecuritySection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
