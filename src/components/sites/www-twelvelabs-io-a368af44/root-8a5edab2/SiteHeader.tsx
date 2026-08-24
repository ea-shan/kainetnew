"use client";

import { useState } from "react";
import { ChevronDownIcon, CloseIcon, IconsaxOutline, MenuIcon } from "../shared/icons";
import { LogoMark } from "../shared/SiteButton";
import { navItems } from "./content";
import type { NavChild } from "./types";

function MegaLink({ item }: { item: NavChild }) {
  return (
    <a
      href={item.href}
      className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/8"
    >
      {item.icon ? (
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/8 text-[#cecff7]">
          <IconsaxOutline name={item.icon} className="size-5" />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block text-[14px] leading-5 tracking-[0.16px]">{item.label}</span>
        {item.description ? (
          <span className="mt-0.5 block text-[12px] leading-[1.4] tracking-[0.02em] text-[#EEEEEE]/55">
            {item.description}
          </span>
        ) : null}
      </span>
    </a>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 text-[#EEEEEE]">
      <div className="isolate bg-[rgba(12,11,16,0.82)] backdrop-blur-[18px]">
        <div className="px-5 min-[768px]:px-10">
          <div className="tl-page flex h-[76px] items-center justify-between gap-3 overflow-visible">
            <a href="/" aria-label="kAInet" className="shrink-0">
              <LogoMark wash className="text-[23px] leading-none" />
            </a>

            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 text-[16px] leading-6 tracking-[0.16px] text-[#EEEEEE] min-[1100px]:flex">
              {navItems.map((item) => {
                const mega = item.children && item.children.length > 0;
                const cols = item.children && item.children.length > 3;
                return (
                  <div key={item.label} className="group relative shrink-0">
                    <a
                      href={item.href}
                      className="inline-flex cursor-pointer items-center gap-1 py-2"
                    >
                      {item.label}
                      {mega ? (
                        <ChevronDownIcon className="size-3.5 opacity-80 transition-transform duration-200 group-hover:rotate-180" />
                      ) : null}
                    </a>
                    {mega ? (
                      <div className="invisible absolute top-full left-0 z-20 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                        <div
                          className={`rounded-2xl border border-white/10 bg-[#0c0b10]/95 p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.45)] backdrop-blur-xl ${
                            cols ? "grid w-[min(92vw,680px)] grid-cols-2 gap-1" : "flex w-[320px] flex-col"
                          }`}
                        >
                          {item.children?.map((child) => (
                            <MegaLink key={child.label} item={child} />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2.5">
              <a
                href="https://auth.twelvelabs.io/u/login"
                className="tl-header-cta tl-header-cta-solid inline-flex min-h-11 cursor-pointer"
              >
                <span>Try for Free</span>
              </a>
              <a
                href="https://www.twelvelabs.io/contact"
                className="tl-header-cta tl-header-cta-outline hidden min-h-11 cursor-pointer min-[480px]:inline-flex"
              >
                <span>Log in</span>
              </a>
              <button
                type="button"
                className="inline-flex size-11 min-h-11 cursor-pointer items-center justify-center text-[#EEEEEE] min-[1100px]:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <CloseIcon className="size-7" /> : <MenuIcon className="size-7" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <div className="max-h-[calc(100dvh-76px)] w-full overflow-y-auto bg-[#0c0b10] px-5 pb-6 min-[1100px]:hidden">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-white/10">
              <a href={item.href} className="flex min-h-11 items-center py-3 text-[#EEEEEE]">
                {item.label}
              </a>
              {item.children?.map((child) => (
                <MegaLink key={child.label} item={child} />
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </header>
  );
}
