"use client";

import { CirclePause, ListChecks, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { GlobeIcon } from "../shared/icons";
import { ASSET } from "./content";

const BEATS = [
  {
    icon: "scan" as const,
    tag: "REVIEWING",
    rows: [
      ["Scanned", "Complete", 1],
      ["Held", "2", 0.28],
      ["Clear", "94%", 0.94],
    ],
    fill: 0.68,
    chip: "HELD 2",
    flags: [
      { k: "hold", label: "Held for review", range: "0:08 – 0:14" },
      { k: "ok", label: "Cleared to enter", range: "0:14 – 0:28" },
    ],
    src: `${ASSET}/videos/mosaic/clip-00.mp4`,
  },
  {
    icon: "pause" as const,
    tag: "PAUSED",
    rows: [
      ["Google", "Paused", 0.4],
      ["Meta", "Paused", 0.4],
      ["Spend", "0", 0],
    ],
    fill: 0.42,
    chip: "NOT LIVE",
    flags: [
      { k: "ok", label: "Google campaign written", range: "paused" },
      { k: "ok", label: "Meta campaign written", range: "paused" },
    ],
    src: `${ASSET}/videos/make-up.mp4`,
  },
  {
    icon: "queue" as const,
    tag: "IN QUEUE",
    rows: [
      ["Waiting", "Yes", 1],
      ["Live", "0", 0],
      ["Ready", "2", 0.72],
    ],
    fill: 0.88,
    chip: "YOUR YES",
    flags: [{ k: "hold", label: "Awaiting your yes", range: "held" }],
    src: `${ASSET}/videos/mosaic/clip-07.mp4`,
  },
] as const;

const TOOLS = [
  ["url", "URL"],
  ["budget", "Budget"],
  ["geo", "Geography"],
  ["links", "Sitelinks"],
  ["neg", "Negative Keywords"],
  ["image", "Image"],
] as const;

const EXEC_CSS = `
.tl-pipe-stage{background:#08080d}
.tl-exec{position:absolute;inset:16% 12% 18%;z-index:2;display:flex;flex-direction:column;pointer-events:none}
.tl-exec-media{top:clamp(3.5rem,14% + 4.6rem,28%);right:14%;bottom:clamp(3.75rem,16% + 4.6rem,30%);left:14%;z-index:0}
.tl-exec-ask{padding:0;justify-content:center}
.tl-exec-card{display:flex;flex-direction:column;gap:10px;width:100%;padding:14px 16px 12px;border:1px solid color-mix(in srgb,#fff 55%,transparent);border-radius:22px;background:#fff;box-shadow:0 0 0 1px color-mix(in srgb,var(--kai-lavender) 28%,transparent),0 18px 36px color-mix(in srgb,#08080d 28%,transparent)}
.tl-exec-top{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 4px 2px}
.tl-exec-wells{display:flex;flex:1;align-items:center;gap:6px;min-width:0}
.tl-exec-well{display:grid;place-items:center;width:28px;height:28px;border:1px solid color-mix(in srgb,var(--kai-dark-surface) 12%,transparent);border-radius:50%;background:color-mix(in srgb,var(--kai-lavender) 16%,#fff);color:var(--kai-dark-surface);opacity:0.22;transform:scale(0.86)}
.tl-exec-well svg{width:13px;height:13px}
.tl-exec-well.on{opacity:1;transform:scale(1);border-color:color-mix(in srgb,var(--kai-purple) 35%,transparent);background:color-mix(in srgb,var(--kai-yellow) 22%,#fff);box-shadow:0 0 0 3px color-mix(in srgb,var(--kai-yellow) 18%,transparent)}
.tl-exec-send{display:grid;place-items:center;width:32px;height:32px;flex:none;border:0;border-radius:50%;background:var(--kai-dark-surface);color:#fff}
.tl-exec-send svg{width:14px;height:14px}
.tl-exec-send.go{animation:tl-exec-go 0.7s cubic-bezier(0.16,1,0.3,1)}
.tl-exec-rule{height:1px;background:color-mix(in srgb,var(--kai-dark-surface) 10%,transparent)}
.tl-exec-tools{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 12px;margin:0;padding:2px 2px 0;list-style:none}
.tl-exec-tools li{display:flex;align-items:center;gap:6px;min-width:0;color:color-mix(in srgb,var(--kai-dark-surface) 55%,transparent);font-size:11px;font-weight:500;letter-spacing:0.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tl-exec-tools li svg{width:12px;height:12px;flex:none}
.tl-exec-tools li.on{color:var(--kai-dark-surface)}
.tl-exec-tools li.on svg{color:var(--kai-purple)}
.tl-exec-frame{position:relative;flex:1;min-height:0;overflow:hidden;border-radius:18px;box-shadow:0 0 0 1.5px color-mix(in srgb,var(--kai-lavender) 78%,#fff),0 0 16px 3px color-mix(in srgb,var(--kai-lavender) 28%,transparent)}
.tl-exec-frame video{display:block;width:100%;height:100%;object-fit:cover}
.tl-exec-tag{position:absolute;top:10px;left:10px;display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:999px;background:color-mix(in srgb,var(--kai-dark-surface) 72%,transparent);color:var(--kai-white);font-size:8px;font-weight:600;letter-spacing:0.08em}
.tl-exec-tag svg{width:10px;height:10px}
.tl-exec-glass{position:absolute;top:10px;right:10px;display:grid;gap:5px;min-width:92px;padding:8px 9px;border-radius:11px;background:color-mix(in srgb,#fff 90%,transparent);color:var(--kai-dark-surface);font-size:8px;line-height:1.15;box-shadow:0 6px 14px color-mix(in srgb,var(--kai-dark-surface) 12%,transparent)}
.tl-exec-glass b{display:flex;justify-content:space-between;gap:8px;font-weight:500}
.tl-exec-glass b em{font-style:normal;font-weight:650;color:var(--kai-purple)}
.tl-exec-meter{height:2px;overflow:hidden;border-radius:99px;background:color-mix(in srgb,var(--kai-dark-surface) 12%,transparent)}
.tl-exec-meter i{display:block;height:100%;border-radius:inherit;background:var(--kai-yellow)}
.tl-exec-chip{position:absolute;left:10px;bottom:44px;display:flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:color-mix(in srgb,#fff 92%,transparent);color:var(--kai-dark-surface);font-size:8px;font-weight:650;letter-spacing:0.06em}
.tl-exec-chip i{width:6px;height:6px;border-radius:50%;background:var(--kai-yellow)}
.tl-exec-bar{position:absolute;right:10px;bottom:8px;left:10px;display:flex;gap:2px;height:4px}
.tl-exec-bar i{flex:1;border-radius:99px;background:color-mix(in srgb,#fff 34%,transparent)}
.tl-exec-bar i.on{background:var(--kai-yellow)}
.tl-exec-scan{position:absolute;right:0;left:0;height:1px;background:color-mix(in srgb,var(--kai-lavender) 80%,#fff);opacity:0.85;animation:tl-exec-scan 2.4s cubic-bezier(0.16,1,0.3,1) infinite}
.tl-exec-flags{position:absolute;right:10px;bottom:16px;left:10px;display:flex;flex-direction:column;gap:4px;margin:0}
.tl-exec-flag{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 8px;border:1px solid color-mix(in srgb,#fff 18%,transparent);border-radius:999px;background:color-mix(in srgb,#fff 92%,transparent);color:var(--kai-dark-surface);font-size:9px;font-weight:500}
.tl-exec-flag i{width:6px;height:6px;flex:none;border-radius:50%;background:var(--kai-yellow)}
.tl-exec-flag i.hold{background:var(--kai-lavender)}
.tl-exec-flag em{flex:none;padding:1px 6px;border:1px solid color-mix(in srgb,var(--kai-dark-surface) 18%,transparent);border-radius:999px;font-style:normal;font-size:8px;letter-spacing:0.02em}
@keyframes tl-exec-scan{from{top:12%}to{top:86%}}
@keyframes tl-exec-go{0%,100%{transform:scale(1)}40%{transform:scale(0.92)}70%{transform:scale(1.08)}}
@media (prefers-reduced-motion:reduce){.tl-exec-scan,.tl-exec-send.go{animation:none}}
`;

function Glyph({ name }: { name: (typeof TOOLS)[number][0] }) {
  if (name === "url") return <GlobeIcon />;
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      {name === "budget" ? (
        <path d="M8 2.2v11.6M10.6 5.1c0-1.2-1.1-2-2.6-2S5.4 4 5.4 5.2c0 2.8 5.2 1.4 5.2 4.4 0 1.3-1.2 2.2-2.6 2.2S5.4 10.8 5.4 9.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      ) : null}
      {name === "geo" ? <path d="M8 14s4-4.1 4-7A4 4 0 1 0 4 7c0 2.9 4 7 4 7z" fill="none" stroke="currentColor" strokeWidth="1.3" /> : null}
      {name === "links" ? <path d="M6 3.2v9.6M10 3.2v9.6M3.4 6.2h9.2M3.4 9.8h9.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /> : null}
      {name === "neg" ? <path d="M3.4 4.4h9.2M3.4 8h9.2M3.4 11.6h6.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /> : null}
      {name === "image" ? (
        <>
          <rect x="2.6" y="3.6" width="10.8" height="8.8" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3.4 11.2l2.6-2.6 2 2 2.2-2.8 2.4 3.4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </>
      ) : null}
    </svg>
  );
}

function Compose({ armed, sent }: { armed: number; sent: boolean }) {
  return (
    <div className="tl-exec tl-exec-ask">
      <div className="tl-exec-card">
        <div className="tl-exec-top">
          <div className="tl-exec-wells">
            {TOOLS.map(([id], i) => (
              <span key={id} className={i < armed ? "tl-exec-well on" : "tl-exec-well"}>
                <Glyph name={id} />
              </span>
            ))}
          </div>
          <span className={sent ? "tl-exec-send go" : "tl-exec-send"}>
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className="tl-exec-rule" />
        <ul className="tl-exec-tools">
          {TOOLS.map(([id, label], i) => (
            <li key={id} className={i < armed ? "on" : undefined}>
              <Glyph name={id} />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Review({ beat }: { beat: number }) {
  const b = BEATS[beat];
  const Icon = b.icon === "scan" ? ShieldCheck : b.icon === "pause" ? CirclePause : ListChecks;
  const lit = Math.round(b.fill * 8);

  return (
    <div className="tl-exec tl-exec-media">
      <div className="tl-exec-frame">
        <video key={b.src} src={b.src} muted loop playsInline autoPlay />
        {b.icon === "scan" ? <i className="tl-exec-scan" /> : null}
        <span className="tl-exec-tag">
          <Icon strokeWidth={1.75} aria-hidden />
          {b.tag}
        </span>
        <div className="tl-exec-glass">
          {b.rows.map(([k, v, w]) => (
            <span key={k}>
              <b>
                {k}
                <em>{v}</em>
              </b>
              <span className="tl-exec-meter">
                <i style={{ width: `${Math.round(w * 100)}%` }} />
              </span>
            </span>
          ))}
        </div>
        <span className="tl-exec-chip">
          <i />
          {b.chip}
        </span>
        <span className="tl-exec-bar">
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} className={i < lit ? "on" : undefined} />
          ))}
        </span>
        <div className="tl-exec-flags">
          {b.flags.map((f) => (
            <span key={f.label} className="tl-exec-flag">
              <i className={f.k === "hold" ? "hold" : undefined} />
              {f.label}
              <em>{f.range}</em>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Host({ reduce }: { reduce: boolean }) {
  const [step, setStep] = useState(0);
  const [armed, setArmed] = useState(reduce ? TOOLS.length : 0);
  const compose = step === 0;

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setStep((n) => (n + 1) % (BEATS.length + 1)), 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (!compose) {
      setArmed(TOOLS.length);
      return;
    }
    if (reduce) {
      setArmed(TOOLS.length);
      return;
    }
    setArmed(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setArmed(Math.min(n, TOOLS.length));
      if (n >= TOOLS.length) window.clearInterval(id);
    }, 280);
    return () => window.clearInterval(id);
  }, [compose, reduce]);

  return (
    <div className="tl-pipe-stage" aria-hidden>
      <style>{EXEC_CSS}</style>
      {compose ? <Compose armed={armed} sent={armed >= TOOLS.length} /> : <Review beat={step - 1} />}
    </div>
  );
}

const NOTES = [
  {
    k: "speed",
    label: "COMPLIANCE REVIEW",
    body: "Every asset checked before it can enter the account.",
  },
  {
    k: "scale",
    label: "CAMPAIGN SETUP",
    body: "Built in your own Google and Meta accounts, left paused.",
  },
  {
    k: "prop",
    label: "LAUNCH QUEUE",
    body: "Nothing goes live until you have seen it and said yes.",
  },
] as const;

export function ExecutionScene() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="tl-pipe tl-embed">
      <Host reduce={reduce} />
      <p className="tl-pipe-title">Campaign Execution Agent</p>
      {NOTES.map((n) => (
        <p key={n.k} className={`tl-pipe-note tl-pipe-note-${n.k}`}>
          <span>{n.label}</span>
          {n.body}
        </p>
      ))}
    </div>
  );
}
