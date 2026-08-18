import { CtaSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/CtaSection";
import { GetStartedSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/GetStartedSection";
import { HeroSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/HeroSection";
import { KpisSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/KpisSection";
import { ModelsSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/ModelsSection";
import { SecuritySection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/SecuritySection";
import { SiteFooter } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/SiteFooter";
import { SiteHeader } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/SiteHeader";
import { SolutionsSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/SolutionsSection";
import { TestimonialsSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/TestimonialsSection";
import { TrustedBySection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/TrustedBySection";
import { WorkflowsSection } from "@/components/sites/www-twelvelabs-io-a368af44/root-8a5edab2/WorkflowsSection";

export default function Home() {
  return (
    <div className="tl-site">
      <SiteHeader />
      <main>
        <HeroSection />
        <GetStartedSection />
        <WorkflowsSection />
        <KpisSection />
        <TrustedBySection />
        <SolutionsSection />
        <SecuritySection />
        <ModelsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
