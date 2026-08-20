"use client";

import { useEffect, useRef } from "react";
import { ASSET } from "./content";

const WAVE = `${ASSET}/videos/funnel-wave.mp4`;
const PARTICLES = `${ASSET}/videos/funnel-particles.mp4`;
const WAVE_POSTER = `${ASSET}/videos/funnel-wave.jpg`;
const PARTICLES_POSTER = `${ASSET}/videos/funnel-particles.jpg`;
const GROUND = "#241833";

function playVideo(node: HTMLVideoElement, reduceMotion: boolean) {
  node.muted = true;
  node.defaultMuted = true;
  node.playsInline = true;
  if (reduceMotion) {
    node.pause();
    return;
  }
  void node.play().catch(() => undefined);
}

type Pt = { x: number; y: number };

function displace(a: Pt, b: Pt, depth: number, jag: number, out: Pt[]) {
  if (depth <= 0) {
    out.push(b);
    return;
  }
  const mx = (a.x + b.x) / 2 + (Math.random() - 0.5) * jag;
  const my = (a.y + b.y) / 2 + (Math.random() - 0.5) * jag;
  const mid = { x: mx, y: my };
  displace(a, mid, depth - 1, jag * 0.52, out);
  displace(mid, b, depth - 1, jag * 0.52, out);
}

function boltPath(origin: Pt, angle: number, length: number): Pt[] {
  const end = {
    x: origin.x + Math.cos(angle) * length,
    y: origin.y + Math.sin(angle) * length,
  };
  const pts: Pt[] = [origin];
  displace(origin, end, 5, length * 0.18, pts);
  return pts;
}

function strokeBolt(ctx: CanvasRenderingContext2D, pts: Pt[], width: number, color: string) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
}

type Step = {
  n: string;
  label: string;
  title: string;
  line: string;
  left: string;
  top: string;
  invert?: boolean;
};

const STEPS: Step[] = [
  { n: "01", label: "BRIEF", title: "Brief it.", line: "Describe the ad like a teammate.", left: "59%", top: "32%" },
  { n: "02", label: "REVIEW", title: "Review it.", line: "Audience, keywords, and creative.", left: "77%", top: "28%" },
  { n: "03", label: "APPROVE", title: "Approve it.", line: "Nothing ships until you say so.", left: "59%", top: "64%", invert: true },
  { n: "04", label: "IMPROVE", title: "Improve it.", line: "Agents tune what's already live.", left: "77%", top: "70%", invert: true },
];

const STEP_DEPTH = [0.8, 1.2, 0.7, 1.25];

function HeroSteps() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = [...layer.querySelectorAll<HTMLElement>("[data-step]")];
    const max = 38;
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      mx = ((e.clientX / window.innerWidth) * 2 - 1) * max;
      my = ((e.clientY / window.innerHeight) * 2 - 1) * max;
    };

    const tick = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      for (let i = 0; i < nodes.length; i++) {
        const d = STEP_DEPTH[i] ?? 1;
        nodes[i].style.transform = `translate3d(${cx * d}px, ${cy * d}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layerRef} className="absolute inset-0">
      {STEPS.map((s, i) => (
        <div
          key={s.n}
          className="tl-step absolute hidden min-[1100px]:block"
          style={{ left: s.left, top: s.top, animationDelay: `${0.35 + i * 0.14}s` }}
        >
          <div data-step className="will-change-transform">
          <div className="-translate-x-1/2 -translate-y-1/2">
            <div className={s.invert ? "tl-wave-ride-inv" : "tl-wave-ride"} style={{ animationDelay: `${i * 0.42}s` }}>
              <div className="relative flex min-w-[196px] flex-col items-center bg-[#241833]/80 px-5 py-3.5 text-center">
                <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-white/70" />
                <span className="absolute top-0 right-0 h-3 w-3 border-t border-r border-white/70" />
                <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/70" />
                <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/70" />
                <span className="font-mono text-[10px] tracking-[0.22em] text-white/45">
                  {s.n} {s.label}
                </span>
                <span className="mt-1.5 font-mono text-[13px] leading-none tracking-[0.16em] text-white uppercase">
                  {s.title}
                </span>
                <span className="mt-1.5 max-w-[180px] text-center font-mono text-[10px] leading-snug tracking-[0.04em] text-white/40 uppercase">
                  {s.line}
                </span>
              </div>
            </div>
          </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroLightning() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let nextAt = performance.now() + 380;

    type Flash = { paths: Pt[][]; born: number; life: number };
    let flashes: Flash[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (now: number) => {
      const origin = { x: width * 0.5, y: height * 0.48 };
      const dirs = [-1.55, -1.2, -0.35, 0.15, 1.35, 1.62, 2.95, 3.4];
      const count = Math.random() > 0.45 ? 3 : 2;
      const paths: Pt[][] = [];
      for (let i = 0; i < count; i++) {
        const angle = dirs[Math.floor(Math.random() * dirs.length)] + (Math.random() - 0.5) * 0.22;
        const length = height * (0.16 + Math.random() * 0.22);
        const main = boltPath(origin, angle, length);
        paths.push(main);
        if (main.length > 6 && Math.random() > 0.35) {
          const fork = main[Math.floor(main.length * (0.35 + Math.random() * 0.3))];
          paths.push(boltPath(fork, angle + (Math.random() > 0.5 ? 0.7 : -0.7), length * 0.38));
        }
      }
      flashes.push({ paths, born: now, life: 220 + Math.random() * 120 });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      if (now >= nextAt) {
        spawn(now);
        if (Math.random() > 0.55) spawn(now);
        nextAt = now + 1100 + Math.random() * 1700;
      }
      flashes = flashes.filter((flash) => now - flash.born < flash.life);
      for (const flash of flashes) {
        const age = Math.max(0, (now - flash.born) / flash.life);
        const alpha = Math.max(0, age < 0.12 ? age / 0.12 : 1 - (age - 0.12) / 0.88);
        const flicker = 0.72 + Math.random() * 0.28;
        const a = alpha * flicker;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.shadowColor = "rgba(206,207,247,0.85)";
        ctx.shadowBlur = 18;
        for (const path of flash.paths) {
          strokeBolt(ctx, path, 7.5, `rgba(127,123,193,${0.22 * a})`);
          strokeBolt(ctx, path, 3.2, `rgba(206,207,247,${0.45 * a})`);
          strokeBolt(ctx, path, 1.15, `rgba(255,255,255,${0.95 * a})`);
        }
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 mix-blend-screen" />;
}

export function HeroMosaic() {
  const waveRef = useRef<HTMLVideoElement>(null);
  const burstRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = [waveRef.current, burstRef.current].filter((n): n is HTMLVideoElement => Boolean(n));
    const bound = nodes.map((node) => {
      const play = () => playVideo(node, reduceMotion);
      // re-arm when the media becomes ready again; browsers drop decoders after stalls
      const events = ["loadeddata", "canplay", "stalled"] as const;
      events.forEach((event) => node.addEventListener(event, play));
      play();
      return () => events.forEach((event) => node.removeEventListener(event, play));
    });
    const resume = () => nodes.forEach((node) => playVideo(node, reduceMotion));
    document.addEventListener("visibilitychange", resume);
    return () => {
      document.removeEventListener("visibilitychange", resume);
      bound.forEach((unbind) => unbind());
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: GROUND }} aria-hidden>
      {/* `isolate` keeps the screen-blended layers blending against this element's own
          gradient. Without it they blend against whatever backdrop root the compositor
          hands them, and any backdrop-filter on the page washes the hero out to white. */}
      <div
        className="absolute inset-0 isolate"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 48%, rgba(127,123,193,0.28) 0%, rgba(36,24,51,0.35) 48%, #241833 80%)",
        }}
      >
        {/* particles L→gap; wave gap→R — small dark split at the axis */}
        <div className="absolute inset-y-0 left-0 w-[calc(50%-14px)]">
          <video
            ref={waveRef}
            src={PARTICLES}
            poster={PARTICLES_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-right mix-blend-screen [mask-image:linear-gradient(90deg,#000_86%,transparent)] [filter:brightness(1.15)_contrast(1.08)]"
          />
        </div>
        <div className="absolute inset-y-0 right-0 w-[calc(50%-14px)]">
          <video
            ref={burstRef}
            src={WAVE}
            poster={WAVE_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-left mix-blend-screen [mask-image:linear-gradient(270deg,#000_86%,transparent)] [filter:brightness(1.7)_contrast(1.15)]"
          />
        </div>

        <HeroLightning />
      </div>

      <HeroSteps />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(36,24,51,0.6)_0%,rgba(36,24,51,0.34)_18%,rgba(36,24,51,0.1)_32%,transparent_44%)]" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#241833]/80 to-transparent" />
      <div className="absolute top-[11%] bottom-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-white/40" />
    </div>
  );
}
