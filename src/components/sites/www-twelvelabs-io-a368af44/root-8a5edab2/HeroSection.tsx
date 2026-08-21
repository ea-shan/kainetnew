import { SiteButton } from "../shared/SiteButton";
import { GROUND, GROUND_GLOW, HeroMosaic } from "./HeroMosaic";

export function HeroSection() {
  return (
    <section
      className="relative -mt-[131px] flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-[120px] pb-12 text-[#EEEEEE] min-[768px]:pt-[132px] min-[1100px]:pb-14"
      style={{ backgroundColor: GROUND, backgroundImage: GROUND_GLOW }}
    >
      <HeroMosaic />
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 min-[768px]:px-10">
        <div className="relative max-w-[640px] pt-4 min-[768px]:pt-8 min-[1100px]:pt-0">
          {/* plain scrim, not backdrop-blur: backdrop-filter breaks the mosaic's blend layers */}
          <div
            className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 86% 78% at 22% 48%, rgba(8,7,10,0.94) 0%, rgba(8,7,10,0.78) 46%, rgba(8,7,10,0.28) 72%, transparent 100%)",
            }}
          />
          <div className="mb-4 inline-flex items-center gap-2 text-[12px] tracking-[0.08em]">
            <span className="font-mono text-[13px] leading-none text-[#cecff7]" aria-hidden>
              {"</>"}
            </span>
            <span className="tl-preview-text font-semibold">Multi-agent AI for performance marketing</span>
          </div>
          <h1 className="text-[40px] leading-[1.16] tracking-[-0.02em] min-[768px]:text-[56px] min-[768px]:leading-[62.72px] min-[768px]:tracking-[-1.12px]">
          Your campaigns, built by AI.
          Launched by you.
          </h1>
          <p className="mt-5 max-w-[640px] text-[16px] leading-6 tracking-[0.16px]">
          Built for performance marketers and agency teams who need results
          <br />
          they can defend to a client, or a CFO.
            </p>
          <div className="absolute top-full left-0 z-10 mt-8 flex flex-wrap items-start gap-3">
            <div className="flex flex-col">
              <SiteButton href="https://playground.twelvelabs.io" variant="primary" theme="dark">
                Request early access
              </SiteButton>
              <p className="mt-2 max-w-[260px] text-[12px] leading-[1.4] tracking-[0.02em] text-[#EEEEEE]/55">
                Get in within minutes - 14 days, full access, no credit card.
              </p>
            </div>
            <SiteButton href="https://www.twelvelabs.io/contact" theme="dark">
              See it in action
            </SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}
