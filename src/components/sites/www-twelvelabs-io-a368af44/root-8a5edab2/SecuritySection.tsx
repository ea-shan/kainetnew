import { SiteButton } from "../shared/SiteButton";
import { ASSET } from "./content";

export function SecuritySection() {
  return (
    <section
      className="relative overflow-hidden px-5 py-24 text-[#000000] min-[768px]:px-10"
      style={{
        background:
          "radial-gradient(ellipse 72% 90% at 6% 12%, rgba(230, 190, 198, 0.88) 0%, transparent 60%), radial-gradient(ellipse 62% 80% at 20% 100%, rgba(127, 123, 193, 0.62) 0%, transparent 56%), radial-gradient(ellipse 42% 55% at 48% 94%, rgba(206, 207, 247, 0.55) 0%, transparent 64%), #EEEEEE",
      }}
    >
      <div className="tl-page relative grid items-center gap-12 min-[900px]:grid-cols-[1.2fr_0.9fr] min-[900px]:gap-x-16">
        <div className="relative mx-auto w-full max-w-[720px] min-[900px]:mx-0">
          <img
            src={`${ASSET}/images/solutions-visual.png`}
            alt="Secure by design"
            width={1507}
            height={1306}
            className="h-auto w-full object-contain"
          />
        </div>
        <div className="border-l border-[#000000]/15 pl-8 min-[900px]:pl-12">
          <h2 className="max-w-[520px] text-[36px] leading-[1.14] tracking-[-0.02em] min-[768px]:text-[48px] min-[768px]:leading-[54.72px] min-[768px]:tracking-[-0.96px]">
            Secure by design
          </h2>
          <p className="mt-6 max-w-[420px] text-[16px] leading-6 tracking-[0.16px]">
            SOC 2 Type II certified. Encrypted data handling. The entire intelligence stack deploys where you want.
          </p>
          <div className="mt-8">
            <SiteButton href="https://www.twelvelabs.io/security" theme="light">
              Learn more
            </SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}
