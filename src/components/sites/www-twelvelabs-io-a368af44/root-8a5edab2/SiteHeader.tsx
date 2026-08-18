"use client";

import { useState } from "react";
import { ChevronDownIcon, CloseIcon, GlobeIcon, MenuIcon } from "../shared/icons";
import { LogoMark } from "../shared/SiteButton";
import { ASSET, navItems } from "./content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 text-[#F4F3F3]">
      <div className="bg-[rgba(12,12,12,0.42)] backdrop-blur-[10px]">
        <div className="px-5 pt-2 pb-1.5 min-[768px]:px-10">
          <a
            href="https://www.twelvelabs.io/blog"
            className="tl-banner relative mx-auto flex min-h-[39px] w-full max-w-[1600px] items-center justify-center overflow-hidden rounded-full px-3 py-2 text-center text-[12px] leading-[18px] tracking-[-0.28px] text-[#1D1C1B] min-[768px]:h-[39px] min-[768px]:py-0 min-[768px]:text-[14px] min-[768px]:leading-[23.24px]"
          >
            <img
              src={`${ASSET}/images/series-b-banner.png`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="relative z-10">
              🎉 <span className="font-[family-name:var(--font-milling-bold)] font-bold">TwelveLabs Raises $100M Series B</span>{" "}
              to build the future of video superintelligence.{" "}
              <span className="font-[family-name:var(--font-milling-bold)] font-bold underline decoration-transparent underline-offset-2 hover:decoration-[#1D1C1B]">
                Read more
              </span>
            </span>
          </a>
        </div>

        <div className="px-5 min-[768px]:px-10">
          <div className="tl-page flex h-[76px] items-center justify-between gap-3 overflow-visible">
          <a href="/" aria-label="TwelveLabs" className="shrink-0 brightness-0 invert">
            <LogoMark />
          </a>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 text-[16px] leading-6 tracking-[0.16px] text-[#F4F3F3] min-[1100px]:flex">
            {navItems.map((item) => (
              <div key={item.label} className="group relative shrink-0">
                <a href={item.href} className="inline-flex cursor-pointer items-center gap-1 py-2">
                  {item.label}
                  {item.children && item.children.length > 1 ? <ChevronDownIcon className="size-3.5 opacity-80" /> : null}
                </a>
                {item.children && item.children.length > 1 ? (
                  <div className="invisible absolute left-0 top-full z-20 min-w-[220px] rounded-2xl bg-[#1D1C1B] p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block cursor-pointer rounded-lg px-3 py-2 text-[14px] text-[#F4F3F3] hover:bg-white/10"
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
              className="hidden cursor-pointer items-center text-[#F4F3F3] min-[640px]:inline-flex"
            >
              <GlobeIcon className="size-[18px]" />
            </button>
            <a
              href="https://auth.twelvelabs.io/u/login"
              className="tl-header-cta-solid inline-flex h-11 min-h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-[#F4F3F3] px-4 text-[14px] leading-none tracking-[0.16px]"
              style={{ color: "#1D1C1B", backgroundColor: "#F4F3F3" }}
            >
              Playground
            </a>
            <a
              href="https://www.twelvelabs.io/contact"
              className="tl-header-cta-outline hidden h-11 min-h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-4 text-[14px] leading-none tracking-[0.16px] min-[480px]:inline-flex"
              style={{ color: "#F4F3F3", boxShadow: "inset 0 0 0 1px #F4F3F3" }}
            >
              Talk to Sales
            </a>
            <button
              type="button"
              className="cursor-pointer text-[#F4F3F3] min-[1100px]:hidden"
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
        <div className="w-full bg-[#0C0C0C] px-5 pb-6 min-[1100px]:hidden">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="block border-b border-white/10 py-3 text-[#F4F3F3]">
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
}
