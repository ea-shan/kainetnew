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
        d="M14.2 3.85a8.4 8.4 0 1 0 6 8.05 3.15 3.15 0 0 1-3.2-3.05 3.15 3.15 0 0 1 2.35-3.05 8.3 8.3 0 0 0-5.15-1.95Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9.15" cy="10.2" r="1.05" fill="currentColor" />
      <circle cx="13.85" cy="11.15" r=".85" fill="currentColor" />
      <circle cx="10.55" cy="14.55" r=".75" fill="currentColor" />
      <circle cx="14.7" cy="15.35" r="1" fill="currentColor" />
      <circle cx="8.7" cy="16.85" r=".7" fill="currentColor" />
    </svg>
  );
}
