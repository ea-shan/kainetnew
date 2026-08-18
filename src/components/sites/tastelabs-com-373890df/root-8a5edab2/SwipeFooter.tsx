"use client";

import { useState } from "react";
import { ASSET, FOOTER } from "./content";
import { ScrambleText } from "../shared/ScrambleText";

export function SwipeFooter() {
  const [loved, setLoved] = useState(4);
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(FOOTER.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <footer data-nav-theme="light" className="bg-[#f5f7f2] text-[#1e1e1e]">
      <div className="px-10 pt-16 pb-8">
        <p className="taste-mono text-center text-[13px] tracking-[-0.1px] text-[#8b8b8b]">{FOOTER.caption}</p>
        <h2 className="taste-trial mt-3 text-center text-[42px] leading-none tracking-[-1px] min-[768px]:text-[64px]">
          {FOOTER.title}
        </h2>
        <p className="mt-3 text-center text-[16px] font-light">{FOOTER.subtitle}</p>
        <div className="taste-mono mx-auto mt-6 flex max-w-[420px] items-center justify-between text-[13px]">
          <button type="button" onClick={() => setLoved((n) => n + 1)}>
            {FOOTER.love}
          </button>
          <span>{String(loved).padStart(2, "0")}</span>
          <button type="button" onClick={() => setLoved((n) => Math.max(0, n - 1))}>
            {FOOTER.hate}
          </button>
        </div>
        <p className="taste-mono mt-2 text-center text-[12px] text-[#8b8b8b]">drag to begin</p>
      </div>

      <div className="grid gap-10 px-10 pb-16 min-[900px]:grid-cols-[1fr_1.2fr]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 text-[16px] font-light">
          <div>
            <div className="taste-mono text-[13px] text-[#8b8b8b]">{FOOTER.connect}</div>
            {FOOTER.links.map((l) => (
              <a key={l.href} href={l.href} className="mt-2 block">
                <ScrambleText text={l.label} />
              </a>
            ))}
          </div>
          <div>
            <div className="taste-mono text-[13px] text-[#8b8b8b]">{FOOTER.getInTouch}</div>
            <a href="#team" className="mt-2 block">
              <ScrambleText text={FOOTER.careers} />
            </a>
            <button type="button" onClick={copyEmail} className="mt-2 block text-left" aria-label="Copy email to clipboard">
              {copied ? "Copied to clipboard!" : FOOTER.email}
            </button>
          </div>
          <div>
            <div className="taste-mono text-[13px] text-[#8b8b8b]">{FOOTER.locationLabel}</div>
            <p className="mt-2">{FOOTER.location}</p>
          </div>
          <div>
            <div className="taste-mono text-[13px] text-[#8b8b8b]">{FOOTER.community}</div>
            <a href="https://tastelabs.com/" className="mt-2 block">
              <ScrambleText text={FOOTER.makers} />
            </a>
          </div>
        </div>
        <img
          src={`${ASSET}/images/footer-room.png`}
          alt="Colorful abstract room with yellow chairs, brown table, and a large purple face on the back wall."
          className="h-full max-h-[360px] w-full object-cover"
        />
      </div>
    </footer>
  );
}
