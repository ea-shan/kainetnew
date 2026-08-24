import { SiteButton } from "../shared/SiteButton";
import { HeroMosaic } from "./HeroMosaic";

export function HeroSection() {
  return (
    <section
      className="relative -mt-[76px] flex min-h-[calc(100dvh+76px)] flex-col justify-center pt-[100px] pb-16 text-[#EEEEEE] min-[768px]:pt-[108px] min-[768px]:pb-24"
    >
      <HeroMosaic />
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 min-[768px]:px-10">
        <div className="relative w-full max-w-[640px]">
          <div className="mb-4 inline-flex max-w-full items-center gap-2 text-[12px] tracking-[0.08em]">
            <span className="font-mono text-[13px] leading-none text-[#cecff7]" aria-hidden>
              {"</>"}
            </span>
            <span className="tl-preview-text font-semibold">Multi-agent AI for performance marketing</span>
          </div>
          <h1 className="text-[26px] leading-[1.16] tracking-[-0.02em] min-[480px]:text-[30px] min-[768px]:text-[44px] min-[768px]:leading-[62.72px] min-[768px]:tracking-[-1.12px]">
            Your campaigns, built by AI.
            Launched by you.
          </h1>
          <p className="mt-5 max-w-[640px] text-[16px] leading-6 tracking-[0.16px]">
          Right now you get two options. Build every campaign by hand — audience, keywords, structure, creative, a week gone per client. Or hand it to an AI that spends your budget while you're asleep and shows you the damage after.
          </p>
          <p className="mt-5 max-w-[640px] text-[16px] leading-6 tracking-[0.16px]">
          Every campaign is built paused. Nothing spends until you say so.
          </p>
          <div className="mt-8 flex flex-wrap items-start gap-3">
            <div className="flex w-full max-w-[260px] flex-col [&_a]:w-full [&_span]:w-full">
              <SiteButton href="#" variant="primary" theme="dark">
              Try for Free
              </SiteButton>
              <p className="mt-2 text-[12px] italic leading-[1.4] tracking-[0.02em] text-[#EEEEEE]/55">
              14 days free. No credit card. We set you up within 1–2 business days — your 14 days start when you get in, not when you ask.
              </p>
            </div>
            <SiteButton href="#" theme="dark" orbit>
            Talk to us first
            </SiteButton>
          </div>
          <p className="mt-5 max-w-[640px] text-[16px] leading-6 tracking-[0.16px]">
          A real campaign, built from a one-line brief. Still paused.
          </p>
        </div>
      </div>
    </section>
  );
}
