"use client";

import { FormEvent, useState } from "react";
import { PRODUCT_CARDS, PRODUCT_HEAD } from "./content";
import { ScrambleText } from "../shared/ScrambleText";

function ContactCard({ title, body }: { title: string; body: string }) {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setStatus(typeof email === "string" && email.includes("@") ? "ok" : "err");
  }

  return (
    <div className="flex min-h-[280px] flex-1 flex-col justify-between border border-white/15 p-8">
      <div>
        <h3 className="text-[31.68px] leading-[39.6px] tracking-[-0.5px] text-[#f5f7f2]">{title}</h3>
        <p className="mt-4 max-w-[420px] text-[16px] leading-[22.4px] font-light text-[#8b8b8b]">{body}</p>
      </div>
      <form onSubmit={onSubmit} className="mt-10 flex flex-wrap items-center gap-3">
        <input
          name="email"
          type="email"
          required
          placeholder="your@mail.com"
          className="taste-mono h-[38px] min-w-[200px] flex-1 border-b border-[#8b8b8b] bg-transparent text-[13px] text-[#f5f7f2] outline-none placeholder:text-[#8b8b8b]"
        />
        <button
          type="submit"
          className="taste-mono inline-flex h-[38px] items-center rounded-[7px] border border-[#f5f7f2] px-7 text-[13px] tracking-[-0.48px] text-[#f5f7f2]"
        >
          <ScrambleText text="Get in touch" />
        </button>
      </form>
      {status === "ok" ? (
        <p className="mt-3 text-[15.75px] font-medium text-[#0ba954]">Success! We’ll be in touch soon.</p>
      ) : null}
      {status === "err" ? (
        <p className="mt-3 text-[15.75px] font-medium text-[#ff4c24]">Something went wrong while submitting.</p>
      ) : null}
    </div>
  );
}

export function ProductSection() {
  return (
    <section
      id="product"
      data-nav-theme="dark"
      className="flex min-h-[958px] items-center bg-[#1e1e1e] px-10 py-[112px]"
    >
      <div className="mx-auto w-[min(1345px,100%)]">
        <p className="taste-mono text-[16px] leading-[22.4px] font-light text-white">{PRODUCT_HEAD}</p>
        <div className="mt-10 grid gap-0 min-[900px]:grid-cols-2">
          {PRODUCT_CARDS.map((card) => (
            <ContactCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
