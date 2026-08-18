import { ASSET, HERO } from "./content";
import { TasteButton } from "../shared/TasteButton";

export function HeroSection() {
  return (
    <section data-nav-theme="dark" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#1e1e1e]">
      <video
        className="absolute inset-0 hidden h-full w-full object-cover min-[768px]:block"
        src={`${ASSET}/videos/hero-loop-desktop.webm`}
        autoPlay
        muted
        loop
        playsInline
      />
      <video
        className="absolute inset-0 h-full w-full object-cover min-[768px]:hidden"
        src={`${ASSET}/videos/hero-loop-mobile.webm`}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="relative z-10 flex h-full flex-col items-center px-10 pt-[22vh] text-center">
        <h1 className="max-w-[420px] text-[31.68px] leading-[39.6px] tracking-[-0.5px] text-[#f5f7f2]">
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
