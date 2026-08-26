import type { ReactNode } from "react";
import { CardIcon, ClockIcon, LockIcon, PauseCircleIcon } from "../shared/icons";
import { SiteButton } from "../shared/SiteButton";
import { HeroMosaic } from "./HeroMosaic";

function TrustItem({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex size-4 shrink-0 items-center justify-center text-[#d3a7d9]" aria-hidden>
        {icon}
      </span>
      <span>{label}</span>
    </span>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative -mt-[76px] flex min-h-[calc(100dvh+76px)] flex-col justify-center pt-[100px] pb-4 text-[#EEEEEE] min-[768px]:pt-[108px] min-[768px]:pb-6"
    >
      <HeroMosaic />
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 min-[768px]:px-10">
        <div className="relative w-full max-w-[640px]">
          <div className="mb-5 inline-flex max-w-full items-center gap-2 text-[12px] uppercase tracking-[0.14em]">
            <span className="font-mono text-[13px] leading-none text-[#d3a7d9]" aria-hidden>
              {"</>"}
            </span>
            <span className="tl-preview-text font-semibold">
              Multi-agent AI for performance marketing
            </span>
          </div>
          <h1 className="text-[26px] leading-[1.14] tracking-[-0.03em] min-[480px]:text-[32px] min-[768px]:text-[38px] min-[768px]:leading-[1.14] min-[768px]:tracking-[-0.03em]">
            Your campaigns, built by AI.
            <br />
            Launched by <span className="tl-hero-grad">you.</span>
          </h1>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-[1.65] tracking-[0.01em] text-[#ded0f2]/72">
            Right now you get two options. Build every campaign by hand — audience, keywords, structure, creative, a week gone per client. Or hand it to an AI that spends your budget while you&apos;re asleep and shows you the damage after.
          </p>
          <div className="mt-5 flex max-w-[420px] items-center gap-2.5">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#d3a7d9]/55 text-[#d3a7d9]"
              aria-hidden
            >
              <LockIcon className="size-3.5" />
            </span>
            <p className="text-[14px] leading-[1.45] tracking-[0.01em]">
              <span className="text-[#eeeeee]/88">Every campaign is </span>
              <span className="font-semibold text-[#bf8080]">built paused.</span>
              <span className="mt-0.5 block text-[13px] text-[#ded0f2]/70">
                Nothing spends until you say so.
              </span>
            </p>
          </div>
          <div className="mt-8 inline-flex max-w-full flex-col gap-4">
            <div className="tl-hero-ctas">
              <SiteButton href="#" variant="primary" size="s" theme="dark">
                Try for Free
              </SiteButton>
              <SiteButton href="#" size="s" theme="dark" orbit>
                Talk to us first
              </SiteButton>
            </div>
            <div className="flex flex-nowrap items-center gap-x-3 text-[12px] leading-[1.4] text-[#eeeeee]/72 max-[640px]:flex-wrap max-[640px]:gap-y-2">
              <TrustItem icon={<ClockIcon className="size-3.5" />} label="14 days free" />
              <span className="size-1 shrink-0 rounded-full bg-[#eeeeee]/28" aria-hidden />
              <TrustItem icon={<CardIcon className="size-3.5" />} label="No credit card" />
              <span className="size-1 shrink-0 rounded-full bg-[#eeeeee]/28" aria-hidden />
              <TrustItem icon={<PauseCircleIcon className="size-3.5" />} label="We set you up within 1–2 business days" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
