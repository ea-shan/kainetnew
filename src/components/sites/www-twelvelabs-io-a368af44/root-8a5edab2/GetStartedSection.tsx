"use client";

import { useState } from "react";
import { SiteButton } from "../shared/SiteButton";
import { getStartedTabs } from "./content";

export function GetStartedSection() {
  const [active, setActive] = useState(getStartedTabs[0].id);
  const current = getStartedTabs.find((t) => t.id === active) ?? getStartedTabs[0];

  return (
    <section className="relative bg-[#0C0C0C] px-5 py-20 text-[#F4F3F3] md:px-10">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="tl-page relative h-full">
          <span className="absolute inset-y-0 left-0 w-px bg-white/12" />
          <span className="absolute inset-y-0 right-0 w-px bg-white/12" />
        </div>
      </div>

      <div className="tl-page relative grid grid-cols-1 gap-8 pb-14 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
        <h2 className="border-l border-white/15 pl-6 text-[36px] leading-[1.14] tracking-[-0.02em] md:text-[48px] md:leading-[54.72px] md:tracking-[-0.96px]">
          Results in minutes.
        </h2>
        <div className="max-w-[520px] border-l border-white/15 pl-6">
          <p className="text-[16px] leading-6 tracking-[0.16px] text-[#F4F3F3]/80">
            Infrastructure for video intelligence, turning raw video into searchable, AI-ready data at massive scale.
          </p>
          <div className="mt-6">
            <SiteButton href="https://www.twelvelabs.io/developers" theme="dark">
              Developer Hub
            </SiteButton>
          </div>
        </div>
      </div>

      <div className="tl-page relative grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
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
                    <p className="text-[16px] leading-6 tracking-[0.16px] text-[#F4F3F3]/80">{tab.body}</p>
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
