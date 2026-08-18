"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckIcon, SearchIcon, SparkleIcon, WarningIcon } from "../shared/icons";
import { ASSET } from "./content";

const CLIP = (n: number) => `${ASSET}/videos/mosaic/clip-${String(n).padStart(2, "0")}.mp4`;

function Layer({ on, className, children }: { on: boolean; className?: string; children: ReactNode }) {
  return <div className={`tl-layer ${on ? "is-on" : ""} ${className ?? ""}`}>{children}</div>;
}

function LazyVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    void el.play().catch(() => undefined);
  }, [src]);
  return <video ref={ref} src={src} muted loop playsInline preload="metadata" className={className} />;
}

function useReveal(activeId: string, count: number) {
  const root = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2, rootMargin: "80px" });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) {
      setStep(0);
      return;
    }
    setStep(1);
    const ids = Array.from({ length: count - 1 }, (_, i) => window.setTimeout(() => setStep(i + 2), (i + 1) * 380));
    return () => ids.forEach(clearTimeout);
  }, [inView, activeId, count]);

  return { root, step, inView };
}

function Glass({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/70 bg-white/75 shadow-[0_10px_30px_rgba(29,28,27,0.1)] backdrop-blur-md ${className ?? ""}`}>
      {children}
    </div>
  );
}

function SearchScene({ step }: { step: number }) {
  return (
    <>
      <LazyVideo src={CLIP(8)} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/70 to-transparent" />
      <Layer on={step >= 2} className="absolute left-4 top-4 right-8">
        <div className="flex max-w-[440px] items-center gap-2 rounded-full border border-[#E8E6E6] bg-white px-3 py-2 shadow-[0_8px_24px_rgba(29,28,27,0.08)]">
          <span className="inline-flex size-7 items-center justify-center rounded-md border border-[#1D1C1B]/20">
            <SearchIcon className="size-3.5 text-[#1D1C1B]" />
          </span>
          <p className="truncate text-[13px] leading-5 text-[#1D1C1B]">
            Find all highlights within the Patriots game where player 87 scores
          </p>
        </div>
      </Layer>
      <Layer on={step >= 3} className="absolute right-4 top-[38%] max-w-[260px]">
        <Glass className="p-3 text-[12px] leading-5 text-[#1D1C1B]">
          6 scoring highlights featuring Player #87 were identified across the Patriots game, extracted from a 2.5-hour broadcast and captured using 3–10 cameras.
        </Glass>
      </Layer>
      <Layer on={step >= 4} className="absolute bottom-24 left-4">
        <Glass className="px-3 py-2 text-[12px] text-[#1D1C1B]">
          Searched 2.5 hours in 0.5 seconds
          <span className="mt-1 block h-0.5 w-full bg-[#C6FF3D]" />
        </Glass>
      </Layer>
      <Layer on={step >= 5} className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2">
        {[3, 4, 5].map((n, i) => (
          <div key={n} className="relative overflow-hidden rounded-xl">
            <LazyVideo src={CLIP(n)} className="h-16 w-full object-cover" />
            <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] text-white">
              {i === 0 ? "Medium" : "Low"}
            </span>
            <span className="absolute inset-x-2 bottom-1.5 h-1 rounded-full bg-white/40">
              <span className="block h-full w-1/3 rounded-full bg-[#C6FF3D]" />
            </span>
          </div>
        ))}
      </Layer>
    </>
  );
}

function SegmentScene({ step }: { step: number }) {
  const chapters = [
    ["OPENING", "00:00:00 – 00:20:59"],
    ["RISING ACTION", "00:21:00 – 01:00:05"],
    ["MIDPOINT", "01:00:06 – 01:30:25"],
    ["ENDING", "01:32:26 – 02:00:00"],
  ];
  return (
    <>
      <LazyVideo src={CLIP(10)} className="absolute inset-0 h-[68%] w-full object-cover" />
      <Layer on={step >= 2} className="absolute left-1/2 top-4 w-[min(420px,90%)] -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_8px_24px_rgba(29,28,27,0.08)]">
          <SparkleIcon className="size-4 text-[#1D1C1B]" />
          <p className="text-[13px] text-[#1D1C1B]">Segment the film into chapters and give timestamps for ads</p>
        </div>
      </Layer>
      <Layer on={step >= 3} className="absolute right-4 top-20 w-[220px]">
        <Glass className="space-y-1.5 p-3 text-[12px] text-[#1D1C1B]">
          <p className="flex items-center justify-between">Video analysis <span className="inline-flex items-center gap-1 font-medium">Complete <CheckIcon className="size-3" /></span></p>
          <p className="flex items-center justify-between">Generating report <span className="inline-flex items-center gap-1 font-medium">Complete <CheckIcon className="size-3" /></span></p>
          <p>Creating editable timeline</p>
          <span className="mt-1 block h-1 rounded-full bg-[#C6FF3D]" />
        </Glass>
      </Layer>
      <Layer on={step >= 4} className="absolute inset-x-6 top-[52%]">
        <div className="relative h-2 rounded-full bg-black/15">
          <span className="absolute left-[12%] h-full w-[10%] rounded-full bg-[#C6FF3D]" />
          <span className="absolute left-[42%] h-full w-[8%] rounded-full bg-[#C6FF3D]" />
          <span className="absolute left-[70%] h-full w-[9%] rounded-full bg-[#C6FF3D]" />
        </div>
        <div className="mt-1 flex justify-between text-[10px] font-medium text-[#1D1C1B]">
          <span>AD</span><span>AD</span><span>AD</span>
        </div>
      </Layer>
      <Layer on={step >= 5} className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2 min-[500px]:grid-cols-4">
        {chapters.map(([label, time]) => (
          <div key={label} className="rounded-xl bg-white p-2 shadow-[0_6px_16px_rgba(29,28,27,0.08)]">
            <p className="text-[10px] font-medium tracking-[0.04em] text-[#1D1C1B]">{label}</p>
            <p className="mt-1 rounded-full border border-[#1D1C1B]/20 px-2 py-0.5 text-[9px] text-[#1D1C1B]">{time}</p>
          </div>
        ))}
      </Layer>
    </>
  );
}

function ComplianceScene({ step }: { step: number }) {
  const rows = [
    ["BRAND SAFETY VIOLATION", "00:01:20 – 00:02:05"],
    ["AGE-RESTRICTED CONTENT", "00:04:10 – 00:04:40"],
    ["POLICY RISK", "00:07:02 – 00:07:31"],
  ];
  return (
    <>
      <LazyVideo src={CLIP(2)} className="absolute inset-6 top-16 bottom-8 rounded-[28px] object-cover" />
      <Layer on={step >= 2} className="absolute left-4 top-3 right-6">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_8px_24px_rgba(29,28,27,0.08)]">
          <SparkleIcon className="size-4 text-[#1D1C1B]" />
          <p className="text-[13px] text-[#1D1C1B]">Identify and flag all video segments that violate content or platform policies</p>
        </div>
      </Layer>
      <Layer on={step >= 3} className="absolute left-6 top-24 w-[230px]">
        <Glass className="space-y-1.5 p-3 text-[12px] text-[#1D1C1B]">
          <p>Video analysis: <strong>Complete</strong></p>
          <p>Generating report: <strong>Complete</strong></p>
          <p>Detected violations: <strong>3</strong></p>
          <span className="mt-1 block h-1 rounded-full bg-[#C6FF3D]" />
        </Glass>
      </Layer>
      <Layer on={step >= 4} className="absolute bottom-6 right-6 w-[280px]">
        <Glass className="space-y-2 p-3">
          {rows.map(([label, time]) => (
            <div key={label} className="flex items-center gap-2 text-[10px] text-[#1D1C1B]">
              <WarningIcon className="size-3.5 text-[#F97316]" />
              <span className="flex-1 font-medium">{label}</span>
              <span className="rounded-full border border-[#1D1C1B]/25 px-1.5 py-0.5">{time}</span>
            </div>
          ))}
        </Glass>
      </Layer>
    </>
  );
}

function HighlightsScene({ step }: { step: number }) {
  const cells = [
    { clip: 11, label: "HIGHLIGHT 1", time: "00:01:00 – 00:02:10" },
    { clip: 12, label: "HIGHLIGHT 2", time: "00:03:12 – 00:03:48" },
    { clip: 13, label: "HIGHLIGHT 3", time: "00:05:02 – 00:05:40" },
    { clip: 14, label: "HIGHLIGHT 4", time: "00:07:18 – 00:08:01" },
  ];
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <Layer on={step >= 2}>
        <div className="flex items-center gap-2 rounded-full border border-[#E8E6E6] bg-white px-3 py-2 shadow-[0_8px_24px_rgba(29,28,27,0.08)]">
          <SparkleIcon className="size-4 text-[#1D1C1B]" />
          <p className="truncate text-[13px] text-[#1D1C1B]">Find key highlights showing the product to create an engaging social media ad</p>
        </div>
      </Layer>
      <div className="grid flex-1 grid-cols-2 gap-2">
        {cells.map((cell, i) => (
          <Layer key={cell.label} on={step >= i + 3} className="relative min-h-0 overflow-hidden rounded-2xl">
            <LazyVideo src={CLIP(cell.clip)} className="h-full w-full object-cover" />
            <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[9px] text-white">{cell.label}</span>
            <span className="absolute bottom-6 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[9px] text-white">{cell.time}</span>
            <span className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-white/35">
              <span className="block h-full w-2/5 rounded-full bg-[#C6FF3D]" />
            </span>
          </Layer>
        ))}
      </div>
    </div>
  );
}

function InsightsScene({ step }: { step: number }) {
  return (
    <>
      <LazyVideo src={CLIP(7)} className="absolute inset-6 top-16 rounded-[28px] object-cover" />
      <Layer on={step >= 2} className="absolute left-4 top-3 right-6">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[0_8px_24px_rgba(29,28,27,0.08)]">
          <SparkleIcon className="size-4 text-[#1D1C1B]" />
          <p className="text-[13px] text-[#1D1C1B]">Analyze the video and generate performance report of what works and why</p>
        </div>
      </Layer>
      <Layer on={step >= 3} className="absolute left-8 top-24 w-[230px]">
        <Glass className="space-y-1.5 p-3 text-[12px] text-[#1D1C1B]">
          <p className="flex items-center justify-between">Video analysis <span className="inline-flex items-center gap-1">Complete <CheckIcon className="size-3" /></span></p>
          <p className="flex items-center justify-between">Generating report <span className="inline-flex items-center gap-1">Complete <CheckIcon className="size-3" /></span></p>
          <span className="mt-1 block h-1 rounded-full bg-[#C6FF3D]" />
        </Glass>
      </Layer>
      <Layer on={step >= 4} className="absolute bottom-8 right-8">
        <Glass className="px-3 py-2 text-[13px] text-[#1D1C1B]">Performance report</Glass>
      </Layer>
    </>
  );
}

const SCENES = {
  search: SearchScene,
  segment: SegmentScene,
  compliance: ComplianceScene,
  highlights: HighlightsScene,
  insights: InsightsScene,
} as const;

export function WorkflowVisual({ active }: { active: string }) {
  const Scene = SCENES[active as keyof typeof SCENES] ?? SearchScene;
  const { root, step, inView } = useReveal(active, 5);

  return (
    <div ref={root} className="relative h-[360px] w-full overflow-hidden rounded-[24px] bg-[#F7F6F6] md:h-[480px] lg:h-[530px]">
      {inView ? <Scene step={step} /> : <div className="h-full" />}
    </div>
  );
}
