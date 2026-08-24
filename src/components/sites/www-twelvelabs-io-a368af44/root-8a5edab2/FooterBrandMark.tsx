"use client";

import { useCallback, useEffect, useRef } from "react";

function FooterWord({ className, wash }: { className?: string; wash?: boolean }) {
  return (
    <span
      className={`inline-flex font-[family-name:var(--font-milling-bold)] leading-none tracking-[-0.04em] ${wash ? "tl-logo-wash" : ""} ${className ?? ""}`}
    >
      kAInet
    </span>
  );
}

const FOLLOW = 0.16;
const FADE = 0.1;

export function FooterBrandMark({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, v: 0, tv: 0, raf: 0, live: false });

  const tick = useCallback(() => {
    const s = state.current;
    const el = rootRef.current;
    s.x += (s.tx - s.x) * FOLLOW;
    s.y += (s.ty - s.y) * FOLLOW;
    s.v += (s.tv - s.v) * FADE;
    if (el) {
      el.style.setProperty("--mx", `${s.x}px`);
      el.style.setProperty("--my", `${s.y}px`);
      el.style.setProperty("--reveal", s.v.toFixed(3));
    }
    if (s.tv > 0.01 || s.v > 0.012) {
      s.raf = requestAnimationFrame(tick);
      return;
    }
    s.live = false;
    s.v = 0;
    el?.style.setProperty("--reveal", "0");
  }, []);

  const start = useCallback(() => {
    const s = state.current;
    if (s.live) return;
    s.live = true;
    s.raf = requestAnimationFrame(tick);
  }, [tick]);

  const allowed = useCallback(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const finePointer = useCallback(
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    [],
  );

  const point = (el: HTMLDivElement, clientX: number, clientY: number, snap: boolean) => {
    const r = el.getBoundingClientRect();
    const s = state.current;
    s.tx = clientX - r.left;
    s.ty = clientY - r.top;
    if (snap) {
      s.x = s.tx;
      s.y = s.ty;
    }
    s.tv = 1;
    start();
  };

  useEffect(() => () => cancelAnimationFrame(state.current.raf), []);

  return (
    <div
      ref={rootRef}
      className="tl-footer-wordmark relative w-full select-none"
      onPointerEnter={(e) => {
        if (!allowed() || !finePointer()) return;
        point(e.currentTarget, e.clientX, e.clientY, true);
      }}
      onPointerMove={(e) => {
        if (!allowed() || !finePointer()) return;
        point(e.currentTarget, e.clientX, e.clientY, false);
      }}
      onPointerDown={(e) => {
        if (!allowed() || e.pointerType !== "touch") return;
        point(e.currentTarget, e.clientX, e.clientY, true);
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== "touch") return;
        state.current.tv = 0;
        start();
      }}
      onPointerLeave={() => {
        state.current.tv = 0;
        start();
      }}
    >
      <FooterWord className={`tl-footer-wordmark-faded ${className ?? ""}`} />
      <div className="tl-footer-wordmark-reveal" aria-hidden>
        <FooterWord wash className={className} />
      </div>
    </div>
  );
}

export function CookieIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.2 5.15A8.2 8.2 0 1 0 18.9 9.4a2.25 2.25 0 0 1-2.35 1.7 2.3 2.3 0 0 1-2.25-2.4 2.3 2.3 0 0 1 1.55-2.2A8.1 8.1 0 0 0 7.2 5.15Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path
        d="M14.15 8.55 12.4 10.8l1.25 1.55-1.2 2.05"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.1" cy="10.15" r="1.05" fill="currentColor" />
      <circle cx="10.35" cy="14.55" r=".8" fill="currentColor" />
      <circle cx="14.55" cy="14.2" r="1.05" fill="currentColor" />
      <circle cx="11.7" cy="17.15" r=".7" fill="currentColor" />
    </svg>
  );
}
