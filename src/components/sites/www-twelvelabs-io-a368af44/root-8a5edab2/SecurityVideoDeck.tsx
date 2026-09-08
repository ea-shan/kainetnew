"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";

const VID = "/sites/www-twelvelabs-io-a368af44/root-8a5edab2/videos";

type Clip = {
  id: "glasses" | "ordinary" | "makeup";
  src: string;
  detect: string;
  box: { top: string; left: string; width: string; height: string };
};

const CLIPS: Clip[] = [
  {
    id: "makeup",
    src: `${VID}/make-up.mp4`,
    detect: "MAKE UP - 95%",
    box: { top: "48%", left: "30%", width: "40%", height: "28%" },
  },
  {
    id: "glasses",
    src: `${VID}/glasses.mp4`,
    detect: "GLASSES - 95%",
    box: { top: "22%", left: "22%", width: "56%", height: "38%" },
  },
  {
    id: "ordinary",
    src: `${VID}/the-ordinary.mp4`,
    detect: "THE ORDINARY - 95%",
    box: { top: "46%", left: "34%", width: "32%", height: "34%" },
  },
];

const NOTES = [
  {
    k: "log",
    tag: "The change log",
    note: "Every action kAInet takes in your account, timestamped and attributable.",
  },
  {
    k: "today",
    tag: "What it does today",
    note: "Google and Meta campaigns, built and optimized end to end, with a human approving every launch.",
  },
] as const;

const STEP_MS = 5500;

export function SecurityVideoDeck() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % CLIPS.length), STEP_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const order = useMemo(
    () => [0, 1, 2].map((i) => CLIPS[(i + step) % CLIPS.length]),
    [step],
  );

  return (
    <LayoutGroup>
      <div className="tl-secure-stage">
        <div className="tl-secure-glass" aria-hidden />
        <div className="tl-secure-fx" aria-hidden>
          <div className="tl-secure-lock">
            <span className="tl-secure-lock-plate">
              <LockMark />
            </span>
            <i className="tl-secure-lock-stem" />
          </div>
          <Barcode className="tl-secure-barcode tl-secure-barcode-log" />
          <span className="tl-secure-num tl-secure-num-log">14:22:08</span>
          <Barcode className="tl-secure-barcode tl-secure-barcode-today" />
          <span className="tl-secure-num tl-secure-num-today">441</span>
          <GoogleMark />
          <MetaMark />
        </div>
        <div className="tl-secure-deck" data-security-deck>
          {order.map((clip, i) => {
            const center = i === 1;
            return (
              <motion.article
                key={clip.id}
                layout={!reduce}
                layoutId={clip.id}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                className={`tl-secure-card ${center ? "is-center" : "is-side"}`}
              >
                <div className="tl-secure-frame">
                  <video src={clip.src} autoPlay muted loop playsInline preload="metadata" aria-hidden />
                  {center ? (
                    <span className="tl-secure-detect" style={clip.box} key={`${clip.id}-${step}`}>
                      <em>{clip.detect}</em>
                    </span>
                  ) : null}
                </div>
              </motion.article>
            );
          })}
        </div>
        {NOTES.map((n) => (
          <p key={n.k} className={`tl-secure-note tl-secure-note-${n.k}`}>
            <span>{n.tag}</span>
            {n.note}
          </p>
        ))}
      </div>
    </LayoutGroup>
  );
}

const BARS = [1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 1, 1, 3, 1, 2, 1] as const;

function Barcode({ className }: { className: string }) {
  let x = 0;
  const rects = BARS.map((w, i) => {
    const node = <rect key={i} x={x} y="0" width={w} height="22" />;
    x += w + 1;
    return node;
  });
  return (
    <svg className={className} viewBox="0 0 64 22" fill="currentColor" aria-hidden>
      {rects}
    </svg>
  );
}

function LockMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="7" y="11" width="10" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.2 11V8.4a2.8 2.8 0 0 1 5.6 0V11" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="15.1" r="1.05" fill="currentColor" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg className="tl-secure-brand tl-secure-brand-google" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.8-2.5 1.2-4.1 1.2-3.2 0-5.8-2.1-6.8-5H1.2v3.2C3.3 21.3 7.3 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.5H1.2C.4 8.2 0 10.1 0 12s.4 3.8 1.2 5.5l4-3.2z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4C18 1.1 15.2 0 12 0 7.3 0 3.3 2.7 1.2 6.5l4 3.2C6.2 6.8 8.8 4.8 12 4.8z"
      />
    </svg>
  );
}

function MetaMark() {
  return (
    <svg className="tl-secure-brand tl-secure-brand-meta" viewBox="0 0 36 16" fill="none" aria-hidden>
      <path
        d="M8.2 14.6c-2.4 0-4.2-2.2-4.2-5.2C4 5.8 6.1 2 9.6 2c1.6 0 2.7.7 3.6 2L16 9.4C16.7 8 17.7 6.6 19 5.4 20.2 4.3 21.6 3.6 23.2 3.6c3.4 0 5.6 3.2 5.6 7.2 0 3.4-2 5.8-4.8 5.8-1.6 0-2.8-.8-3.8-2.2L17.2 8.8c-.8 1.5-1.7 3-3 4.2-1.2 1.1-2.5 1.6-4 1.6Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}
