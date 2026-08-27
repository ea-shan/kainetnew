"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowUpRightIcon, ChevronDownIcon, SparkleIcon } from "../shared/icons";
import { ASSET } from "./content";

type Beat = "chat" | "integration" | "empty" | "analysis" | "code";

const BEATS: { id: Beat; ms: number }[] = [
  { id: "chat", ms: 5200 },
  { id: "integration", ms: 4200 },
  { id: "empty", ms: 3800 },
  { id: "analysis", ms: 8000 },
  { id: "code", ms: 4200 },
];

const LOOP = BEATS.reduce((sum, beat) => sum + beat.ms, 0);

export function beatAt(ms: number): Beat {
  let t = ((ms % LOOP) + LOOP) % LOOP;
  for (const beat of BEATS) {
    if (t < beat.ms) return beat.id;
    t -= beat.ms;
  }
  return "chat";
}

if (process.env.NODE_ENV !== "production") {
  console.assert(beatAt(0) === "chat");
  console.assert(beatAt(5199) === "chat");
  console.assert(beatAt(5200) === "integration");
  console.assert(beatAt(9400) === "empty");
  console.assert(beatAt(13200) === "analysis");
  console.assert(beatAt(21200) === "code");
  console.assert(beatAt(25400) === "chat");
}

const CLIPS = [
  { src: `${ASSET}/images/ai-orchestration.jpg`, title: "Home improvers 35–54", meta: "Search + YouTube" },
  { src: `${ASSET}/images/cta-hub-operator.jpg`, title: "Local trades, 8km", meta: "Meta Advantage+" },
  { src: `${ASSET}/images/girl_cta.webp`, title: "Renovation intent", meta: "In-market, high bid" },
] as const;

function lockedBeat(): Beat | null {
  const q = new URLSearchParams(window.location.search).get("beat");
  return q === "chat" || q === "integration" || q === "empty" || q === "analysis" || q === "code" ? q : null;
}

export function AgentExperienceSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState<Beat>("chat");
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduce) return;
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

  const showResults = beat === "chat" || beat === "analysis";
  const showField = beat === "chat" || beat === "analysis";
  const deep = beat === "analysis";

  return (
    <section className="tl-agent" data-state={reduce ? "chat" : beat} aria-labelledby="tl-agent-title">
      <h2 id="tl-agent-title" className="sr-only">
        kAlnet campaign intelligence
      </h2>
      <div ref={stageRef} className="tl-agent-stage">
        <DustField />
        <div className="tl-agent-dots" aria-hidden />

        <aside className={`tl-agent-field tl-agent-field-l${showField ? " is-on" : ""}`} aria-hidden={!showField}>
          <p className="tl-agent-kicker">{deep ? "Library" : "Structure"}</p>
          <ul>
            {deep ? (
              <>
                <li>Kitchen / NW England</li>
                <li>In-market, 35–54</li>
                <li>Held 68% past 0:03</li>
              </>
            ) : (
              <>
                <li>Research 0–12s</li>
                <li>Strategy 12–40s</li>
                <li>Creative 40–70s</li>
                <li>Launch, paused</li>
              </>
            )}
          </ul>
          <p className="tl-agent-kicker">Hook reel</p>
          <div className="tl-agent-thumb">
            <img src={`${ASSET}/videos/funnel-wave.jpg`} alt="" />
            <div>
              <p>Campaign_kitchen_v3</p>
              <p>47.2k views · 68% hold</p>
            </div>
          </div>
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
          <p className="tl-agent-kicker tl-agent-live">{deep ? "Reading the library" : "Reading accounts"}</p>
          <ul>
            <li>Demand + bid landscape</li>
            <li>Summarising segments</li>
            <li className="tl-agent-ok">Done</li>
          </ul>
          <div className="tl-agent-strip">
            {CLIPS.map((clip) => (
              <img key={clip.title} src={clip.src} alt="" />
            ))}
            <img src={`${ASSET}/videos/funnel-wave.jpg`} alt="" />
          </div>
          <p className="tl-agent-kicker">Next campaign</p>
          <p>Drive quote requests from homeowners already searching.</p>
          <p>One continuous take. Handheld. 15–30s. No studio light.</p>
        </aside>

        <aside className={`tl-agent-field tl-agent-field-bl${showField ? " is-on" : ""}`} aria-hidden={!showField}>
          <p>01:12 · North-West creatives</p>
          <p>Vibe: handheld, warm tungsten</p>
          <p>02:41 · Trade press stills</p>
          <p>Vibe: proof, quote-led</p>
        </aside>

        <aside className={`tl-agent-field tl-agent-field-b${showField ? " is-on" : ""}`} aria-hidden={!showField}>
          <p>Sentiment across the first 2:30</p>
          <svg viewBox="0 0 320 48" className="tl-agent-graph">
            <path d="M4 30 C40 10, 70 38, 110 22 S180 8, 220 28 280 14, 316 20" />
          </svg>
        </aside>

        <article className={`tl-agent-card${beat === "integration" ? " is-away" : ""}`}>
          {beat === "code" ? <CodeFace /> : <ChatFace showResults={showResults} />}
        </article>

        <div className={`tl-agent-integ${beat === "integration" ? " is-on" : ""}`} aria-hidden={beat !== "integration"}>
          <p className="tl-agent-pill">Integration</p>
          <p className="tl-agent-display">Ask your accounts from the brief you already wrote.</p>
          <p className="tl-agent-sub">
            Connect Google and Meta, then ask for demand, structure, or creative inside kAlnet. Nothing spends until you say so.
          </p>
          <p className="tl-agent-url">
            https://api.kainet.ai/v1/brief
            <CopyMark />
          </p>
        </div>

        {beat === "code" ? (
          <div className="tl-agent-code-copy">
            <p className="tl-agent-pill">API</p>
            <p className="tl-agent-display">Bring kAlnet into your own stack.</p>
            <div className="tl-agent-ctas">
              <a href="#" className="tl-agent-cta tl-agent-cta-fill">
                Get an API key
                <ArrowUpRightIcon className="size-3.5" />
              </a>
              <a href="#" className="tl-agent-cta">
                Reference
                <ArrowUpRightIcon className="size-3.5" />
              </a>
            </div>
          </div>
        ) : null}

        <span className={`tl-agent-spark${beat === "integration" ? " is-off" : ""}`} aria-hidden>
          <SparkleIcon />
        </span>
      </div>
    </section>
  );
}

function ChatFace({ showResults }: { showResults: boolean }) {
  return (
    <>
      <header className="tl-agent-card-bar">
        <p>
          kAlnet
          <ChevronDownIcon className="size-3.5" />
        </p>
        <span>Share</span>
      </header>
      <div className="tl-agent-thread">
        <p className="tl-agent-ask">Build a kitchen renovation campaign for Manchester.</p>
        {showResults ? (
          <>
            <p className="tl-agent-say">
              Audience Research Agent found three segments worth the spend. Keep any you want in the brief.
            </p>
            <div className="tl-agent-clips">
              {CLIPS.slice(0, 2).map((clip) => (
                <figure key={clip.title}>
                  <img src={clip.src} alt="" />
                  <figcaption>
                    <strong>{clip.title}</strong>
                    <span>{clip.meta}</span>
                  </figcaption>
                </figure>
              ))}
              <button type="button" className="tl-agent-next" aria-label="More segments">
                <ChevronDownIcon className="size-3.5 -rotate-90" />
              </button>
            </div>
            <div className="tl-agent-tools">
              <ToolIcons />
              <SparkleIcon className="tl-agent-mark" />
            </div>
          </>
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
    </>
  );
}

function CodeFace() {
  return (
    <>
      <header className="tl-agent-card-bar">
        <p>kAlnet</p>
        <span>Copy</span>
      </header>
      <pre className="tl-agent-pre">
        <span className="c-p">from</span> kainet <span className="c-p">import</span> Client{"\n\n"}
        client = Client(key=<span className="c-y">&quot;kn_live_…&quot;</span>){"\n"}
        brief = client.briefs.create({"\n"}
        {"  "}query=<span className="c-y">&quot;kitchen renovation, Manchester&quot;</span>,{"\n"}
        {"  "}accounts=[<span className="c-y">&quot;google&quot;</span>, <span className="c-y">&quot;meta&quot;</span>],{"\n"}
        {"  "}paused=<span className="c-l">True</span>,{"\n"}
        ){"\n"}
        print(brief.segments)
      </pre>
    </>
  );
}

function ToolIcons() {
  return (
    <span className="tl-agent-ico" aria-hidden>
      <svg viewBox="0 0 16 16"><path d="M4 8.2l2.4 2.4L12 5" /></svg>
      <svg viewBox="0 0 16 16"><path d="M4 5h8M4 8h8M4 11h5" /></svg>
      <svg viewBox="0 0 16 16"><path d="M4 4h8v8H4z" /></svg>
      <svg viewBox="0 0 16 16"><path d="M8 3v10M5 6l3-3 3 3" /></svg>
    </span>
  );
}

function CopyMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <rect x="5" y="5" width="8" height="8" rx="1.2" />
      <rect x="3" y="3" width="8" height="8" rx="1.2" />
    </svg>
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
