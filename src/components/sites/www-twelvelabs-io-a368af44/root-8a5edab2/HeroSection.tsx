import { SiteButton } from "../shared/SiteButton";
import { ASSET } from "./content";
import { HeroMosaic } from "./HeroMosaic";

export function HeroSection() {
  return (
    <section className="relative -mt-[131px] min-h-[100svh] overflow-hidden bg-[#0C0C0C] pt-[188px] text-[#F4F3F3] min-[1100px]:min-h-[920px]">
      <HeroMosaic />
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 min-[768px]:px-10 min-[1100px]:flex min-[1100px]:min-h-[620px] min-[1100px]:items-end min-[1100px]:pb-28">
        <div className="max-w-[640px] pt-4 min-[768px]:pt-8 min-[1100px]:pt-0">
          <h1 className="text-[40px] leading-[1.16] tracking-[-0.02em] min-[768px]:text-[56px] min-[768px]:leading-[62.72px] min-[768px]:tracking-[-1.12px]">
            See the unseen. Know the unknowable.
          </h1>
          <p className="mt-5 max-w-[640px] text-[16px] leading-6 tracking-[0.16px]">
            Your video contains every insight, every event, every decision that mattered. Extracting it has been impossible. Until now.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <SiteButton href="https://playground.twelvelabs.io" variant="primary" theme="dark">
              Try on Playground
            </SiteButton>
            <SiteButton href="https://www.twelvelabs.io/contact" theme="dark">
              Talk to Sales
            </SiteButton>
          </div>
        </div>
      </div>

      <a
        href="https://www.twelvelabs.io/jockey"
        className="relative z-10 mx-auto mb-12 block w-[min(360px,calc(100%-40px))] cursor-pointer rounded-[20px] border border-white/10 p-6 min-[1100px]:absolute min-[1100px]:right-[max(40px,calc((100%-1600px)/2))] min-[1100px]:bottom-16 min-[1100px]:mb-0"
        style={{
          background: "rgba(65, 64, 62, 0.6)",
          backdropFilter: "blur(4px)",
          boxShadow: "inset 8px 8px 15px 7px rgba(72,72,72,0.6), inset -8px -8px 15px 0 rgba(84,84,84,0.6)",
        }}
      >
        <img
          src={`${ASSET}/images/jockey-ui.png`}
          alt="Jockey AI interface summarizing insights across an advertising archive"
          className="w-full rounded-[12px]"
        />
        <div className="tl-preview-ring mt-3 inline-flex rounded-full p-px">
          <span className="rounded-full bg-[#0C0C0C] px-3 py-1 text-[11px] tracking-[0.12em]">
            <span className="tl-preview-text">RESEARCH PREVIEW</span>
          </span>
        </div>
        <p className="mt-2.5 text-[16px] leading-6 tracking-[0.1px] min-[768px]:text-[20px] min-[768px]:leading-7">
          Meet Jockey, the first video intelligence AI agent
        </p>
      </a>
    </section>
  );
}
