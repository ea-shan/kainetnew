import { ASSET, BLOG_CARDS, RESEARCH } from "./content";
import { ScrambleText } from "../shared/ScrambleText";

export function ResearchSection() {
  return (
    <section
      id="research"
      data-nav-theme="dark"
      className="bg-[#1e1e1e] px-10 py-[112px] text-[#f5f7f2]"
    >
      <div className="mx-auto w-[min(1345px,100%)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[520px]">
            <h2 className="text-[31.68px] leading-[39.6px] tracking-[-0.5px]">{RESEARCH.title}</h2>
            <p className="mt-4 text-[16px] leading-[22.4px] font-light text-[#8b8b8b]">{RESEARCH.body}</p>
          </div>
          <a
            href="https://tastelabs.com/blog"
            className="taste-mono text-[13px] tracking-[-0.1px]"
          >
            <ScrambleText text={RESEARCH.cta} />
          </a>
        </div>

        <div className="mt-12 grid gap-6 min-[768px]:grid-cols-3">
          {BLOG_CARDS.map((card) => (
            <a key={card.title} href={card.href} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                <img
                  src={card.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <img
                  src={`${ASSET}/images/diamond.svg`}
                  alt=""
                  className="absolute right-4 bottom-4 h-8 w-8"
                />
              </div>
              <h3 className="mt-5 text-[22.4px] leading-7 tracking-[-0.25px]">{card.title}</h3>
              <p className="mt-2 text-[16px] leading-[22.4px] font-light text-[#8b8b8b]">{card.excerpt}</p>
              <span className="taste-mono mt-3 inline-block text-[13px]">
                <ScrambleText text="Explore" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
