import { ASSET, HERO } from "./content";
import { TasteButton } from "../shared/TasteButton";

export function HeroSection() {
  return (
    <section data-nav-theme="dark" className="relative overflow-hidden bg-[#1e1e1e]">
      <div className="relative min-h-[100dvh] overflow-hidden">
        <video
          className="absolute inset-0 hidden h-full w-full object-cover md:block"
          src={`${ASSET}/videos/hero-loop-desktop.webm`}
          autoPlay
          muted
          loop
          playsInline
        />
        <video
          className="absolute inset-0 h-full w-full object-cover md:hidden"
          src={`${ASSET}/videos/hero-loop-mobile.webm`}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <p className="taste-mono mb-2 text-[11px] leading-5 tracking-[-0.1px] text-[#f5f7f2]/70">
              &lt;.00 SELC.&gt;
            </p>
            <img
              src={`${ASSET}/images/diamond.svg`}
              alt=""
              className="h-[220px] w-auto opacity-90 md:h-[300px] lg:h-[340px]"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-10 pb-28 pt-16 text-center">
        <h1 className="max-w-[420px] text-[28.8px] leading-9 tracking-[-0.5px] text-[#f5f7f2] md:text-[31.68px] md:leading-[39.6px]">
          {HERO.line1}
          <br />
          {HERO.line2}
        </h1>
        <TasteButton href="#team" className="mt-8">
          {HERO.cta}
        </TasteButton>
      </div>
    </section>
  );
}
