import { HorseIcon, PegasusIcon } from "../shared/icons";
import { SiteButton } from "../shared/SiteButton";
import { models } from "./content";

const icons = {
  Marengo: HorseIcon,
  Pegasus: PegasusIcon,
};

export function ModelsSection() {
  return (
    <section className="bg-[#0C0C0C] px-5 py-20 text-[#F4F3F3] md:px-10">
      <div className="tl-page grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
        <h2 className="border-l border-white/15 pl-6 text-[36px] leading-[1.14] tracking-[-0.02em] md:text-[48px] md:leading-[54.72px] md:tracking-[-0.96px]">
          Video-native perception, reasoning, and orchestration
        </h2>
        <div className="max-w-[520px] border-l border-white/15 pl-6">
          <p className="text-[16px] leading-6 tracking-[0.16px] text-[#F4F3F3]/80">
            LLMs made text computable. Twelve Labs does the same for video, image, and audio enabling discovery to analysis to action.
          </p>
          <div className="mt-6">
            <SiteButton href="https://www.twelvelabs.io/models" theme="dark">
              Learn more
            </SiteButton>
          </div>
        </div>
      </div>

      <div className="tl-page mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
        {models.map((model) => {
          const Icon = icons[model.name as keyof typeof icons] ?? HorseIcon;
          return (
            <article
              key={model.name}
              className="flex flex-col overflow-hidden rounded-[40px] bg-[#161616] px-8 py-12 md:rounded-[80px] md:px-16 md:py-16 lg:rounded-[100px] lg:px-20 lg:py-20"
            >
              <div className="flex items-center gap-3">
                <Icon className="size-9 text-[#F4F3F3]" />
                <h3 className="text-[28px] leading-9 tracking-[-0.02em]">{model.name}</h3>
              </div>
              <p className="mt-5 max-w-[65ch] text-[16px] leading-6 tracking-[0.16px]">
                <span className="font-[family-name:var(--font-milling-bold)] font-bold">{model.kind}</span> {model.body}
              </p>
              <div className="mt-6">
                <SiteButton href={model.href} size="s" theme="dark">
                  Learn more
                </SiteButton>
              </div>
              <div className="mx-auto mt-10 w-full max-w-[590px]">
                <img
                  src={model.image}
                  alt={model.name}
                  width={590}
                  height={530}
                  className="h-[360px] w-full object-contain md:h-[480px] lg:h-[530px]"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
