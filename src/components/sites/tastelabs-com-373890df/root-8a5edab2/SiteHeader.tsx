"use client";

import { useEffect, useState } from "react";
import { ASSET, HERO, NAV_LINKS } from "./content";
import { ScrambleText } from "../shared/ScrambleText";
import { TasteButton } from "../shared/TasteButton";
import { BracketCloseIcon, BracketOpenIcon } from "../shared/icons";

export function SiteHeader() {
  const [light, setLight] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setLight(hit.target.getAttribute("data-nav-theme") === "light");
      },
      { rootMargin: "-70px 0px -70% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] flex h-[70px] items-center px-8 transition-colors duration-300 ${
        light ? "bg-[#f5f7f2] text-[#1e1e1e]" : "bg-[#1e1e1e] text-[#f5f7f2]"
      }`}
    >
      <div className="relative mx-auto flex w-full items-center">
        <nav className="hidden items-center gap-6 min-[900px]:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="taste-mono text-[13px] leading-[22.4px] tracking-[-0.1px]">
              <ScrambleText text={link.label} />
            </a>
          ))}
        </nav>

        <a href="/clone-website" className="absolute left-1/2 z-[3] -translate-x-1/2">
          <img
            src={`${ASSET}/images/${light ? "logo-black.svg" : "logo.svg"}`}
            alt="Taste"
            width={112}
            height={20}
            className="h-5 w-[112px]"
          />
        </a>

        <div className="ml-auto hidden min-[900px]:block">
          <TasteButton href="#team" dark={light}>
            {HERO.cta}
          </TasteButton>
        </div>
      </div>

      <button
        type="button"
        className="taste-mono ml-auto flex items-center gap-2 text-[13px] min-[900px]:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <BracketOpenIcon />
        <ScrambleText text={open ? "Close menu" : "Open menu"} />
        <BracketCloseIcon />
      </button>

      {open ? (
        <div
          className={`absolute inset-x-0 top-full flex flex-col gap-5 px-8 py-8 min-[900px]:hidden ${
            light ? "bg-[#f5f7f2]" : "bg-[#1e1e1e]"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="taste-mono text-[16px]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <TasteButton href="#team" dark={light}>
            {HERO.cta}
          </TasteButton>
        </div>
      ) : null}
    </header>
  );
}
