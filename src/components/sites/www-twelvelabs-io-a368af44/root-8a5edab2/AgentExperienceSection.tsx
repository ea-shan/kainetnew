"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ChevronDownIcon, SparkleIcon } from "../shared/icons";
import { ASSET } from "./content";

type Beat = "prompt" | "think" | "write" | "reply" | "ads";

const BEATS: { id: Beat; ms: number }[] = [
  { id: "prompt", ms: 1800 },
  { id: "think", ms: 2600 },
  { id: "write", ms: 2400 },
  { id: "reply", ms: 3000 },
  { id: "ads", ms: 7200 },
];

const LOOP = BEATS.reduce((sum, beat) => sum + beat.ms, 0);

const LEAD: Record<Beat, string> = {
  prompt: "Ask your accounts from the brief you already wrote.",
  think: "Audience Research Agent is reading live demand.",
  write: "Creative Assets Agent is drafting the ads.",
  reply: "Two paused ads, written against Manchester search.",
  ads: "Nothing spends until you say so.",
};

const ADS = [
  {
    src: `${ASSET}/images/ai-orchestration.jpg`,
    platform: "Google Search",
    headline: "Kitchen renovation quotes, Manchester",
    desc: "Units, labour, and a start date — built paused in your account.",
    cta: "Get a quote",
  },
  {
    src: `${ASSET}/images/cta-hub-operator.jpg`,
    platform: "Meta Ads",
    headline: "Your kitchen, planned before you call",
    desc: "Home improvers 8km out. One continuous take. No studio light.",
    cta: "See the plan",
  },
] as const;

export function beatAt(ms: number): Beat {
  let t = ((ms % LOOP) + LOOP) % LOOP;
  for (const beat of BEATS) {
    if (t < beat.ms) return beat.id;
    t -= beat.ms;
  }
  return "prompt";
}

if (process.env.NODE_ENV !== "production") {
  console.assert(beatAt(0) === "prompt");
  console.assert(beatAt(1799) === "prompt");
  console.assert(beatAt(1800) === "think");
  console.assert(beatAt(4400) === "write");
  console.assert(beatAt(6800) === "reply");
  console.assert(beatAt(9800) === "ads");
  console.assert(beatAt(17000) === "prompt");
}

function lockedBeat(): Beat | null {
  const q = new URLSearchParams(window.location.search).get("beat");
  return q === "prompt" || q === "think" || q === "write" || q === "reply" || q === "ads" ? q : null;
}

export function AgentExperienceSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState<Beat>("prompt");
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduce) {
      setBeat("ads");
      return;
    }
    const pin = lockedBeat();
    if (pin) {
      setBeat(pin);
      return;
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = beatAt(now - started);
      setBeat((prev) => (prev === next ? prev : next));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduce) return;
    const onMove = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      stage.style.setProperty("--px", `${((event.clientX - box.left) / box.width) * 2 - 1}`);
      stage.style.setProperty("--py", `${((event.clientY - box.top) / box.height) * 2 - 1}`);
    };
    const onLeave = () => {
      stage.style.setProperty("--px", "0");
      stage.style.setProperty("--py", "0");
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  const live = reduce ? "ads" : beat;
  const showField = live !== "prompt";
  const thinking = live === "think" || live === "write";

  return (
    <section className="tl-agent" data-state={live} aria-labelledby="tl-agent-title">
      <h2 id="tl-agent-title" className="sr-only">
        kAlnet campaign intelligence
      </h2>
      <div ref={stageRef} className="tl-agent-stage">
        <DustField />
        <div className="tl-agent-dots" aria-hidden />

        <p className="tl-agent-lead" aria-live="polite">
          <span key={live} className="tl-agent-lead-line">
            {LEAD[live]}
          </span>
        </p>

        <aside className={`tl-agent-field tl-agent-field-l${showField ? " is-on" : ""}`} aria-hidden={!showField}>
          <p className="tl-agent-kicker">Structure</p>
          <ul>
            <li>Research 0–12s</li>
            <li>Strategy 12–40s</li>
            <li>Creative 40–70s</li>
            <li>Launch, paused</li>
          </ul>
          <p className="tl-agent-kicker">Connected</p>
          <p className="tl-agent-ok">
            <i />
            Google Ads · live
          </p>
          <p className="tl-agent-ok">
            <i />
            Meta Ads · live
          </p>
        </aside>

        <aside className={`tl-agent-field tl-agent-field-r${showField ? " is-on" : ""}`} aria-hidden={!showField}>
          <p className="tl-agent-kicker tl-agent-live">
            {live === "think" ? "Reading accounts" : live === "write" ? "Writing ads" : "Done"}
          </p>
          <ul>
            <li>Demand + bid landscape</li>
            <li>Home improvers 35–54</li>
            <li className={live === "ads" || live === "reply" ? "tl-agent-ok" : undefined}>
              {live === "ads" || live === "reply" ? "Ads ready, paused" : "Drafting…"}
            </li>
          </ul>
        </aside>

        <article className="tl-agent-card">
          <header className="tl-agent-card-bar">
            <p>
              kAlnet
              <ChevronDownIcon className="size-3.5" />
            </p>
            <span>Share</span>
          </header>
          <div className="tl-agent-thread">
            <p className="tl-agent-ask">Build a kitchen renovation campaign for Manchester.</p>

            {thinking ? (
              <p className="tl-agent-think">
                <span className="tl-agent-pulse" aria-hidden />
                {live === "think"
                  ? "Audience Research Agent is reading Manchester search and Meta demand…"
                  : "Creative Assets Agent is writing two paused ads from that brief…"}
              </p>
            ) : null}

            {live === "reply" || live === "ads" ? (
              <p className="tl-agent-say">
                Two ads are in your accounts, paused. Search covers quote intent; Meta covers homeowners already looking. Review, edit, then launch.
              </p>
            ) : null}

            {live === "ads" ? (
              <div className="tl-agent-ads">
                {ADS.map((ad) => (
                  <figure key={ad.headline} className="tl-agent-ad">
                    <img src={ad.src} alt="" />
                    <figcaption>
                      <em>{ad.platform}</em>
                      <strong>{ad.headline}</strong>
                      <span>{ad.desc}</span>
                      <b>{ad.cta}</b>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
          <div className="tl-agent-reply">
            <span>+</span>
            <p>Reply to kAlnet</p>
            <em>Research 1.0</em>
            <button type="button" aria-label="Send">
              ↑
            </button>
          </div>
        </article>

        <span className={`tl-agent-spark${thinking ? " is-on" : ""}`} aria-hidden>
          <SparkleIcon />
        </span>
      </div>
    </section>
  );
}

function DustField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
    camera.position.z = 4;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const count = 70;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xf4c05f,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let live = false;
    let frame = 0;
    const clock = new THREE.Clock();
    const draw = () => {
      if (!live) return;
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.018;
      points.position.x = Math.sin(t * 0.12) * 0.08;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    };

    const size = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 8 || h < 8) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    size();

    const io = new IntersectionObserver(
      ([entry]) => {
        live = entry.isIntersecting;
        if (live) {
          clock.start();
          frame = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    const ro = new ResizeObserver(size);
    ro.observe(el);

    return () => {
      live = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className="tl-agent-dust" aria-hidden />;
}
