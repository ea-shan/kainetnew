import { CAROUSEL, CHALLENGE } from "./content";
import { panelTransform } from "./carousel";

export function ChallengeSection() {
  const count = CAROUSEL.length;
  const radius = 420;

  return (
    <section data-nav-theme="dark" className="relative flex min-h-[855px] flex-col items-center justify-center overflow-hidden bg-[#1e1e1e] py-16">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1400px]">
        <div className="taste-carousel relative h-[360px] w-[220px]">
          {CAROUSEL.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 overflow-hidden rounded-[10px] shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
              style={{ transform: panelTransform(i, count, radius) }}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <h2 className="relative z-10 max-w-[560px] px-10 text-center text-[31.68px] leading-[39.6px] tracking-[-0.5px] text-[#f5f7f2]">
        {CHALLENGE.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
    </section>
  );
}
