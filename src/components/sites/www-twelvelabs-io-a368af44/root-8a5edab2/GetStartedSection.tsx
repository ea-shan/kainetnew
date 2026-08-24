"use client";

import { useState } from "react";
import { SiteButton } from "../shared/SiteButton";
import { getStartedTabs } from "./content";

export function GetStartedSection() {
  const [active, setActive] = useState(getStartedTabs[0].id);
  const current = getStartedTabs.find((t) => t.id === active) ?? getStartedTabs[0];

  return (
    <section className="tl-get-started px-5 py-20 text-[#EEEEEE] md:px-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="tl-page relative h-full">
          <span className="tl-get-started-rail absolute inset-y-0 left-0 w-px bg-white/12" />
          <span className="tl-get-started-rail absolute inset-y-0 right-0 w-px bg-white/12" />
        </div>
      </div>

      <div className="tl-page relative z-10 pb-14 text-center">
        <div className="w-full border-l border-white/15 pl-6 mx-auto">
          <h2 className="text-[36px] leading-[1.14] tracking-[-0.02em] md:text-[48px] md:leading-[54.72px] md:tracking-[-0.96px]">
          One brief. Six specialists.
          </h2>
          <p className="mt-2 text-[14px] italic leading-[1.4] tracking-[0.02em] text-[#EEEEEE]/55 mx-auto">
          Take a kitchen renovation. Someone measures the room. Someone draws the layout.
Someone works out what goes where and what it costs. Someone orders the units.
Fitters put it in. Someone comes back at the end to check the doors line up.

Six jobs, and six people who each do one of them properly. Not one person having
a go at all six.

And nobody touches your old kitchen until you've seen the plans and said yes. The
horror story everyone's heard is about the builder who started before that
conversation.
          </p>
          <p className="mt-5 text-[16px] leading-6 tracking-[0.16px] text-[#EEEEEE]/80">
          <span className="font-bold">kAInet</span> works the same way. Six specialist agents, one plain-language brief, each
doing one part of the job properly. The whole campaign gets built in your own
Google and Meta accounts — and none of it runs until you've seen it and said yes.
          </p>

        </div>
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
                    <p className="text-[16px] leading-6 tracking-[0.16px] text-[#EEEEEE]/80">{tab.body}</p>
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
          <p className="mt-5 text-[16px] leading-6 tracking-[0.16px] text-[#EEEEEE]/80">
      That's what multi-agent AI built for marketers actually means — six specialists on
      one brief, not one model doing an impression of six.
          </p>
        </div>
        <div className="min-w-0 border-l border-white/15 pl-6">
          <div className="aspect-[790/715] w-full overflow-hidden rounded-[28px] bg-[#161616] md:rounded-[40px]">
            <img
              src={current.image ?? getStartedTabs[0].image}
              alt={current.title}
              width={790}
              height={715}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
