"use client";

import { useState } from "react";
import { ChevronDownIcon, CloseIcon, GlobeIcon, MenuIcon } from "../shared/icons";
import { LogoMark } from "../shared/SiteButton";
import { navItems } from "./content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 text-[#EEEEEE]">
      <div className="bg-[rgba(0,0,0,0.42)] backdrop-blur-[10px]">
        {/* <div className="px-5 pt-2 pb-1.5 min-[768px]:px-10">
          <a
            href="https://www.twelvelabs.io/blog"
            className="tl-banner relative mx-auto flex min-h-[39px] w-full max-w-[1600px] items-center justify-center overflow-hidden rounded-full px-3 py-2 text-center text-[12px] leading-[18px] tracking-[-0.28px] text-[#000000] min-[768px]:h-[39px] min-[768px]:py-0 min-[768px]:text-[14px] min-[768px]:leading-[23.24px]"
            style={{ background: "linear-gradient(90deg, #CECFF7 0%, #D8BCEB 48%, #E6BEC6 100%)" }}
          >
            <span className="relative z-10">
              <span className="font-[family-name:var(--font-milling-bold)] font-bold">kAInet</span>{" "}
              is building the taste layer for video intelligence.{" "}
              <span className="font-[family-name:var(--font-milling-bold)] font-bold underline decoration-transparent underline-offset-2 hover:decoration-[#000000]">
                Read more
              </span>
            </span>
          </a>
        </div> */}

        <div className="px-5 min-[768px]:px-10">
          <div className="tl-page flex h-[76px] items-center justify-between gap-3 overflow-visible">
          <a href="/" aria-label="kAInet" className="shrink-0">
            <LogoMark wash className="text-[30px] leading-none" />
          </a>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 text-[16px] leading-6 tracking-[0.16px] text-[#EEEEEE] min-[1100px]:flex">
            {navItems.map((item) => (
              <div key={item.label} className="group relative shrink-0">
                <a href={item.href} className="inline-flex cursor-pointer items-center gap-1 py-2">
                  {item.label}
                  {item.children && item.children.length > 1 ? <ChevronDownIcon className="size-3.5 opacity-80" /> : null}
                </a>
                {item.children && item.children.length > 1 ? (
                  <div className="invisible absolute left-0 top-full z-20 min-w-[220px] rounded-2xl bg-[#000000] p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block cursor-pointer rounded-lg px-3 py-2 text-[14px] text-[#EEEEEE] hover:bg-white/10"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              aria-label="Select language"
              className="hidden cursor-pointer items-center text-[#EEEEEE] min-[640px]:inline-flex"
            >
              <GlobeIcon className="size-[18px]" />
            </button>
            <a
              href="https://auth.twelvelabs.io/u/login"
              className="tl-header-cta-solid inline-flex h-11 min-h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-[#EEEEEE] px-4 text-[14px] leading-none tracking-[0.16px]"
              style={{ color: "#000000", backgroundColor: "#EEEEEE" }}
            >
              Playground
            </a>
            <a
              href="https://www.twelvelabs.io/contact"
              className="tl-header-cta-outline hidden h-11 min-h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-4 text-[14px] leading-none tracking-[0.16px] min-[480px]:inline-flex"
              style={{ color: "#EEEEEE", boxShadow: "inset 0 0 0 1px #EEEEEE" }}
            >
              Talk to Sales
            </a>
            <button
              type="button"
              className="cursor-pointer text-[#EEEEEE] min-[1100px]:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon className="size-7" /> : <MenuIcon className="size-7" />}
            </button>
          </div>
          </div>
        </div>
      </div>

      {open ? (
        <div className="w-full bg-[#000000] px-5 pb-6 min-[1100px]:hidden">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="block border-b border-white/10 py-3 text-[#EEEEEE]">
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
}
