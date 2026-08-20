import { partnerLogos } from "./content";

export function TrustedBySection() {
  const logos = [...partnerLogos, ...partnerLogos];
  return (
    <section className="overflow-hidden bg-[#EEEEEE] py-16 text-[#000000]">
      <p className="mb-8 text-center text-[12px] tracking-[0.18em] text-[#000000]/50">TRUSTED BY</p>
      <div className="relative">
        <div className="tl-marquee flex w-max items-center gap-14 px-8">
          {logos.map((src, i) => (
            <img key={`${src}-${i}`} src={src} alt="" className="h-7 w-auto opacity-80" />
          ))}
        </div>
      </div>
    </section>
  );
}
