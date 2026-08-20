"use client";

import { useEffect, useRef, useState, type TransitionEvent } from "react";
import { ArrowUpRightIcon } from "../shared/icons";
import { solutions } from "./content";

const GAP = 20;

export function SolutionsSection() {
  const n = solutions.length;
  const slides = [solutions[n - 1], ...solutions, solutions[0]];
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [tx, setTx] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const card = vp.querySelector("article");
    if (!card) return;

    const apply = () => {
      const cardW = card.offsetWidth;
      if (cardW < 8) return;
      const next = vp.clientWidth / 2 - pos * (cardW + GAP) - cardW / 2;
      setTx((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [pos]);

  function goTo(next: number) {
    if (next === active && pos >= 1 && pos <= n) return;
    let delta = next - active;
    if (delta > n / 2) delta -= n;
    if (delta < -n / 2) delta += n;
    setAnimate(true);
    setActive(next);
    setPos((p) => p + delta);
  }

  function onTrackEnd(e: TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    if (pos === 0) {
      setAnimate(false);
      setPos(n);
    } else if (pos === n + 1) {
      setAnimate(false);
      setPos(1);
    }
  }

  return (
    <section className="overflow-hidden bg-[#EEEEEE] py-16 text-[#000000] md:py-20">
      <div className="px-5 md:px-10">
        <div className="tl-page relative">
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[#000000]/15" />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-px bg-[#000000]/15" />
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-0">
            <h2 className="border-l border-[#000000]/15 pl-6 text-[36px] leading-[1.14] tracking-[-0.02em] md:text-[48px] md:leading-[54.72px] md:tracking-[-0.96px]">
              Built for every video workflow.
            </h2>
            <p className="max-w-[420px] border-l border-[#000000]/15 pl-6 text-[16px] leading-6 tracking-[0.16px]">
              Video intelligence for teams in media, sports, advertising, government, security, and more.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-1 px-5 md:mt-14" role="tablist" aria-label="Industries">
        {solutions.map((tab, i) => {
          const on = i === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => goTo(i)}
              className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-[14px] leading-6 tracking-[0.16px] transition-colors duration-200 ${
                on ? "bg-[#000000] text-[#EEEEEE]" : "text-[#000000]/40 hover:text-[#000000]"
              }`}
            >
              {tab.title}
            </button>
          );
        })}
      </div>

      <div ref={viewportRef} className="relative mt-10 w-full overflow-hidden md:mt-12">
        <div
          className="tl-solutions-track flex items-stretch"
          style={{
            gap: GAP,
            ["--sol-tx" as string]: `${tx}px`,
            transition: animate ? undefined : "none",
          }}
          onTransitionEnd={onTrackEnd}
        >
          {slides.map((card, i) => {
            const real = i === 0 ? n - 1 : i === n + 1 ? 0 : i - 1;
            const on = i === pos;
            return (
              <article
                key={`${card.id}-${i}`}
                className={`relative h-[400px] w-[86vw] shrink-0 overflow-hidden rounded-[40px] md:h-[520px] md:w-[72vw] md:rounded-[72px] lg:h-[560px] lg:w-[min(1040px,72vw)] lg:rounded-[80px] ${
                  on ? "opacity-100" : "opacity-80"
                }`}
                style={{ transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                {on ? null : (
                  <button
                    type="button"
                    aria-label={`Show ${card.title}`}
                    onClick={() => goTo(real)}
                    className="absolute inset-0 z-[1] cursor-pointer"
                  />
                )}
                <img src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
                <div className="pointer-events-none relative z-[2] flex h-full max-w-[440px] flex-col justify-center p-7 text-[#EEEEEE] md:p-12 lg:p-14">
                  <h3 className="text-[28px] leading-9 tracking-[-0.02em] md:text-[36px] md:leading-[42px]">{card.title}</h3>
                  <p className="mt-4 text-[16px] leading-6 tracking-[0.16px]">{card.body}</p>
                  <a
                    href={card.href}
                    className="pointer-events-auto relative mt-6 inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] leading-6"
                  >
                    Learn more
                    <span className="inline-flex size-6 items-center justify-center rounded-md border border-white/70">
                      <ArrowUpRightIcon className="size-3" />
                    </span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
