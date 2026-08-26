"use client";

import { useState } from "react";
import { IconsaxOutline, LockIcon } from "../shared/icons";
import { ASSET, getStartedTabs } from "./content";
import { OrchestrationScene } from "./OrchestrationScene";

const ORCH_IMG = `${ASSET}/images/ai-orchestration.jpg`;

const AGENTS = [
  { id: "audience-research", n: "01", icon: "search-status", tone: "orchid" },
  { id: "campaign-strategy", n: "02", icon: "hierarchy", tone: "orchid" },
  { id: "creative-assets", n: "03", icon: "gallery", tone: "rose" },
  { id: "campaign-execution", n: "04", icon: "export", tone: "apricot" },
  { id: "performance-analysis", n: "05", icon: "status-up", tone: "apricot" },
  { id: "optimization", n: "06", icon: "setting-4", tone: "apricot" },
] as const;

const TONE: Record<(typeof AGENTS)[number]["tone"], string> = {
  orchid: "text-[#d3a7d9] [--agent:#d3a7d9]",
  rose: "text-[#bf8080] [--agent:#bf8080]",
  apricot: "text-[#f2af5c] [--agent:#f2af5c]",
};

function titleOf(raw: string) {
  return raw.replace(/^\d+\.\s*/, "");
}

export function GetStartedSection() {
  const [active, setActive] = useState(getStartedTabs[0].id);
  const current = getStartedTabs.find((t) => t.id === active) ?? getStartedTabs[0];

  return (
    <section className="tl-get-started px-5 pt-2 pb-16 text-[#EEEEEE] md:px-10 md:pt-4 md:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="tl-page relative h-full">
          <span className="tl-get-started-rail absolute inset-y-0 left-0 w-px bg-white/12" />
          <span className="tl-get-started-rail absolute inset-y-0 right-0 w-px bg-white/12" />
        </div>
      </div>

      <div className="tl-page relative z-10 pb-8 text-left md:pb-10">
        <div className="mx-auto grid w-full grid-cols-1 items-center gap-8 border-l border-white/15 pl-6 md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] md:gap-x-12">
          <div>
          <div className="mb-5 inline-flex max-w-full items-center gap-2 text-[12px] uppercase tracking-[0.14em]">
            <span className="font-mono text-[13px] leading-none text-[#d3a7d9]" aria-hidden>
              {"</>"}
            </span>
            <span className="tl-preview-text font-semibold">
            AI campaign orchestration
            </span>
          </div>
            <h2 className="mt-3 text-[32px] leading-[1.12] tracking-[-0.03em] md:text-[44px] md:leading-[1.1] md:tracking-[-0.04em]">
              One brief.{" "}
              <span className="tl-hero-grad">Six specialists.</span>
            </h2>
            <p className="mt-4 max-w-[62ch] text-[14px] italic leading-[1.55] tracking-[0.01em] text-[#ded0f2]/62">
              Take a kitchen renovation. Someone measures the room. Someone draws the layout.
              Someone works out what goes where and what it costs. Someone orders the units.
              Fitters put it in. Someone comes back at the end to check the doors line up.
              Six jobs, and six people who each do one of them properly. Not one person having
              a go at all six. And nobody touches your old kitchen until you&apos;ve seen the
              plans and said yes.
            </p>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.6] tracking-[0.01em] text-[#eeeeee]/82">
              <span className="font-semibold">kAInet</span> works the same way. Six specialist
              agents, one plain-language brief, each doing one part of the job properly. The
              whole campaign gets built in your own Google and Meta accounts — and none of it
              runs until you&apos;ve seen it and said yes.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-[14px] border border-white/12 bg-white/[0.03] px-4 py-3.5 md:mt-10">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center text-[#d3a7d9]" aria-hidden>
              <LockIcon className="size-5" />
            </span>
            <p className="text-[14px] leading-[1.45]">
              <span className="tl-hero-grad block font-medium">You&apos;re always in control.</span>
              <span className="mt-0.5 block text-[#eeeeee]/86">
                Review everything. Approve. Then and only then, we launch.
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="tl-page relative z-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-x-10 lg:gap-x-14">
        <div className="min-w-0">
          <div className="tl-agent-list">
            {getStartedTabs.map((tab, i) => {
              const meta = AGENTS[i] ?? AGENTS[0];
              const isOn = tab.id === active;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className={`tl-agent-row ${TONE[meta.tone]} ${isOn ? "is-on" : ""}`}
                >
                  <span className="tl-agent-n">{meta.n}</span>
                  <span className="tl-agent-ico" aria-hidden>
                    <IconsaxOutline name={meta.icon} className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-[14px] font-medium leading-5 tracking-[0.01em] text-[#eeeeee]">
                      {titleOf(tab.title)}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-[1.4] text-[#ded0f2]/58">
                      {tab.body}
                    </span>
                  </span>
                  <span className="tl-agent-ready">
                    Ready
                    <i />
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-5 px-1 text-[14px] leading-[1.55] text-[#eeeeee]/72">
            That&apos;s what multi-agent AI built for marketers actually means — six
            specialists on one brief, not one model doing an impression of six.
          </p>
        </div>

        <div className="min-w-0">
          <div className="tl-orch">
            <div className="tl-orch-head">
              <p className="tl-preview-text text-[11px] font-semibold uppercase tracking-[0.16em]">
                AI orchestration
              </p>
              <p className="text-[13px] text-[#eeeeee]/88">
                {current.id === "audience-research" ? "Working in parallel" : titleOf(current.title)}
              </p>
            </div>
            <div className="tl-orch-frame">
              {current.id === "audience-research" ? (
                <OrchestrationScene />
              ) : (
                <img
                  key={current.id}
                  src={current.image ?? ORCH_IMG}
                  alt={titleOf(current.title)}
                  width={790}
                  height={715}
                  className="tl-orch-img"
                />
              )}
            </div>
            <div className="tl-orch-bar">
              <OrchStat icon="gallery" label="1 Brief" hint="From you" tone="orchid" />
              <OrchStat icon="people" label="6 Specialists" hint="Working in parallel" tone="rose" />
              <OrchStat icon="export" label="1 Campaign" hint="Built. Paused. Ready." tone="apricot" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrchStat({
  icon,
  label,
  hint,
  tone,
}: {
  icon: string;
  label: string;
  hint: string;
  tone: keyof typeof TONE;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${TONE[tone]}`}>
      <span className="flex size-8 shrink-0 items-center justify-center" aria-hidden>
        <IconsaxOutline name={icon} className="size-4" />
      </span>
      <p className="min-w-0">
        <span className="block text-[13px] font-medium leading-4 text-[#eeeeee]">{label}</span>
        <span className="block text-[11px] leading-4 text-[#ded0f2]/55">{hint}</span>
      </p>
    </div>
  );
}
