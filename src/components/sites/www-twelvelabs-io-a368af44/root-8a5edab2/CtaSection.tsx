import { SiteButton } from "../shared/SiteButton";
import { HeroMosaic } from "./HeroMosaic";

export function CtaSection() {
  return (
    <section className="bg-[#0c0a10] px-5 py-8 text-[var(--kai-white)] min-[768px]:px-10 min-[768px]:py-10">
      <div className="tl-page tl-cta-plate relative flex min-h-[min(42rem,82dvh)] items-center justify-center overflow-hidden rounded-[28px] px-6 py-20 min-[768px]:min-h-[min(48rem,86dvh)] min-[768px]:rounded-[36px] min-[768px]:px-12 min-[768px]:py-24 min-[1100px]:px-16">
        <HeroMosaic fill />
        <div className="tl-cta-glow" aria-hidden />
        <div className="tl-cta-veil" aria-hidden />
        <div className="tl-cta-copy">
          <h2 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.035em] min-[768px]:text-[50px] min-[768px]:leading-[1.06]">
            Ready to brief the agents?
          </h2>
          <p className="tl-cta-lede">
            Every campaign is built paused. Nothing spends until you say so.
          </p>
          <div className="tl-cta-actions">
            <SiteButton href="#" variant="primary" size="s" theme="dark">
              Try for Free
            </SiteButton>
            <SiteButton href="#" size="s" theme="dark" orbit>
              Talk to us first
            </SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}
