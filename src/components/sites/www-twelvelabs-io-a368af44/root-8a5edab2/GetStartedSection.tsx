"use client";

import { useState } from "react";
import { LockIcon } from "../shared/icons";
import { SiteButton } from "../shared/SiteButton";
import { getStartedTabs } from "./content";
import { GetStartedBackground } from "./GetStartedBackground";
import { OrchestrationScene } from "./OrchestrationScene";
import { StrategyScene } from "./StrategyScene";

export function GetStartedSection() {
  const [active, setActive] = useState(getStartedTabs[0].id);
  const current = getStartedTabs.find((t) => t.id === active) ?? getStartedTabs[0];

  return (
    <section className="tl-get-started px-5 pt-16 pb-16 text-[var(--kai-white)] md:px-10 md:pt-24 md:pb-20">
      <GetStartedBackground />

      <div className="tl-page relative z-10 pb-8 text-left md:pb-10">
        <div className="min-w-0 border-l border-white/15 pl-6">
          <div className="mb-5 inline-flex max-w-full items-center gap-2 text-[12px] uppercase tracking-[0.14em]">
            <span className="font-mono text-[13px] leading-none text-[var(--kai-lavender)]" aria-hidden>
              {"</>"}
            </span>
            <span className="tl-preview-text font-semibold">AI campaign orchestration</span>
          </div>
          <h2 className="mt-3 text-[32px] leading-[1.12] tracking-[-0.03em] md:text-[44px] md:leading-[1.1] md:tracking-[-0.04em]">
            One brief. <span className="tl-hero-grad">Six specialists.</span>
          </h2>
          <p className="tl-gs-lede mt-4 text-[14px] italic leading-[1.55] tracking-[0.01em] text-[var(--kai-white)]/82">
            Take a kitchen renovation. Someone measures the room. Someone draws the layout.
            Someone works out what goes where and what it costs. Someone orders the units.
            Fitters put it in. Someone comes back at the end to check the doors line up.
            Six jobs, and six people who each do one of them properly. Not one person having
            a go at all six. And nobody touches your old kitchen until you&apos;ve seen the
            plans and said yes.
          </p>
          <p className="tl-gs-lede mt-4 text-[15px] leading-[1.6] tracking-[0.01em] text-[var(--kai-white)]/82">
          <span className="tl-hero-grad font-semibold">kAInet</span> works the same way. Six specialist
            agents, one plain-language brief, each doing one part of the job properly. The
            whole campaign gets built in your own Google and Meta accounts — and none of it
            runs until you&apos;ve seen it and said yes.
          </p>
        </div>
        {/* <div className="min-w-0 border-l border-white/15">
          <div className="flex w-fit items-start gap-3 rounded-[14px] border border-white/12 bg-white/[0.03] px-4 py-3.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center text-[var(--kai-lavender)]" aria-hidden>
              <LockIcon className="size-5" />
            </span>
            <p className="text-[14px] leading-[1.45]">
              <span className="tl-hero-grad block font-medium">You&apos;re always in control.</span>
              <span className="mt-0.5 block text-[var(--kai-white)]/86">
                Review everything. Approve. Then and only then, we launch.
              </span>
            </p>
          </div>
        </div> */}
      </div>

      <div className="tl-page relative z-10 grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
        <div className="min-w-0 border-l border-white/15 pl-6">
          {getStartedTabs.map((tab) => {
            const isOn = tab.id === active;
            return (
              <div
                key={tab.id}
                className={
                  isOn
                    ? "rounded-[20px] bg-white/10 px-5 py-5 opacity-100"
                    : "rounded-[20px] px-5 py-3.5 opacity-40"
                }
              >
                <button
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className="block w-full cursor-pointer text-left transition-opacity duration-200"
                >
                  <h3 className="text-[20px] leading-7 tracking-[0.1px]">{tab.title}</h3>
                </button>
                {isOn && tab.body ? (
                  <div className="mt-4">
                    <p className="text-[16px] leading-6 tracking-[0.16px] text-[var(--kai-white)]/80">{tab.body}</p>
                    {tab.href ? (
                      <div className="mt-6">
                        <SiteButton href={tab.href} size="s" theme="dark">
                          Learn more
                        </SiteButton>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
          <p className="mt-5 text-[16px] leading-6 tracking-[0.16px] text-[var(--kai-white)]/80">
            That&apos;s what multi-agent AI built for marketers actually means — six specialists on
            one brief, not one model doing an impression of six.
          </p>
        </div>

        <div className="min-w-0 border-l border-white/15 pl-6">
          <div className="tl-gs-visual">
            {current.id === "audience-research" ? (
              <OrchestrationScene />
            ) : current.id === "campaign-strategy" ? (
              <StrategyScene />
            ) : (
              <img
                key={current.id}
                src={current.image}
                alt={current.title}
                width={790}
                height={715}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
