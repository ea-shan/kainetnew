import { CHALLENGE } from "./content";

export function ChallengeSection() {
  return (
    <section data-nav-theme="dark" className="relative flex flex-col items-center bg-[#1e1e1e] px-10 pb-28 pt-8">
      <h2 className="max-w-[560px] text-center text-[28.8px] leading-9 tracking-[-0.5px] text-[#f5f7f2] md:text-[31.68px] md:leading-[39.6px]">
        {CHALLENGE.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
    </section>
  );
}
