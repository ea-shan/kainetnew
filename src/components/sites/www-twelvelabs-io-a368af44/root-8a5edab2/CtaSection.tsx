import { SiteButton } from "../shared/SiteButton";
import { ASSET } from "./content";

export function CtaSection() {
  return (
    <section className="bg-[#EEEEEE] px-5 py-16 text-[#EEEEEE] min-[768px]:px-10">
      <div className="tl-page relative min-h-[560px] overflow-hidden rounded-[48px] min-[900px]:min-h-[640px] min-[900px]:rounded-[64px]">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={`${ASSET}/images/cta-still.png`}
          src={`${ASSET}/videos/horse-cta.mp4`}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/25" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#D8BCEB]/40 via-[#7F7BC1]/12 to-transparent" />
        <div className="relative flex min-h-[560px] flex-col items-center justify-center px-6 text-center min-[900px]:min-h-[640px]">
          <h2 className="max-w-[720px] text-[36px] leading-[1.14] tracking-[-0.02em] min-[768px]:text-[48px] min-[768px]:leading-[54.72px] min-[768px]:tracking-[-0.96px]">
            Ready to see what your archive actually knows?
          </h2>
          <p className="mt-5 text-[16px] leading-6 tracking-[0.16px]">
            Try it out in Playground, or talk to our Sales team.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SiteButton href="https://playground.twelvelabs.io" variant="primary" theme="dark">
              Start Building
            </SiteButton>
            <SiteButton href="https://www.twelvelabs.io/contact" theme="dark">
              Talk to Sales
            </SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}
