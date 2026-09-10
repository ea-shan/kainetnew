"use client";

import { createRoot, extend, useFrame, useThree } from "@react-three/fiber";
import { AlignLeft, CirclePlay, Image as ImageIcon, Sparkle, Volume2 } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

type Phase = { beat: number; u: number };

extend(THREE as never);

const KAI = {
  dark: 0x08080d,
  yellow: 0xf4c05f,
  lavender: 0xd9b3e2,
  purple: 0x9a5ca3,
  pink: 0xd5a6c8,
  gPurple: 0x7f7bc1,
  gLav: 0xcac1cd,
  gPink: 0xd5a6c8,
  white: 0xffffff,
} as const;

const VIEW = 1.48;
const BEAT = 5.6;
const CYCLE = BEAT * 3;
const TONES = [KAI.yellow, KAI.gPurple, KAI.lavender, KAI.gPink, KAI.purple, KAI.gLav] as const;

const CELLS: [number, number, number][] = [
  [-0.42, 0.46, KAI.yellow],
  [0.28, 0.38, KAI.gPurple],
  [-0.08, 0.08, KAI.lavender],
  [0.36, -0.06, KAI.white],
  [0.52, -0.32, KAI.gPink],
  [-0.36, -0.28, KAI.purple],
  [0.12, 0.52, KAI.gLav],
  [0.02, -0.48, KAI.pink],
  [-0.22, 0.28, KAI.yellow],
  [0.44, 0.14, KAI.lavender],
];

const HUD = `
.tl-search .tl-pipe-stage{background:#08080d}
.tl-search .tl-pipe-stage canvas{z-index:0}
.tl-search .tl-pipe-stage::before{content:"";position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,color-mix(in srgb,var(--kai-white) 26%,transparent) .7px,transparent .85px);background-size:15px 15px;opacity:.32}
.tl-search-hud{position:absolute;inset:36% 12% 36% 14%;z-index:1;pointer-events:none;display:flex;align-items:center;justify-content:center}
@keyframes tl-sh-scrub{0%{transform:translateX(-18px)}100%{transform:translateX(18px)}}
@keyframes tl-sh-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.tl-sh-knob{animation:tl-sh-scrub 5.6s linear infinite}
.tl-sh{display:flex;flex-direction:column;align-items:center;width:min(100%,18.5rem);gap:0}
.tl-sh-row{display:flex;align-items:center;gap:6px;width:100%;justify-content:center}
.tl-sh-play,.tl-sh-spark{width:22px;height:22px;border:1px solid color-mix(in srgb,var(--kai-white) 82%,transparent);border-radius:999px;display:grid;place-items:center;color:color-mix(in srgb,var(--kai-white) 92%,transparent);flex:none}
.tl-sh-play svg,.tl-sh-spark svg,.tl-sh-icon svg,.tl-sh-node svg{width:12px;height:12px;stroke-width:1.6}
.tl-sh-bar{height:22px;border:1px solid color-mix(in srgb,var(--kai-white) 78%,transparent);border-radius:999px;flex:1;min-width:0}
.tl-sh-knob{width:30px;height:24px;border-radius:9px;background:var(--kai-yellow);flex:none}
.tl-sh-stem{width:1px;height:8px;background:color-mix(in srgb,var(--kai-white) 42%,transparent)}
.tl-sh-clock{padding:3px 10px;border:1px solid color-mix(in srgb,var(--kai-white) 78%,transparent);border-radius:999px;color:var(--kai-yellow);font-size:10px;font-weight:500;letter-spacing:0.08em;font-variant-numeric:tabular-nums}
.tl-sh-query{display:flex;align-items:center;gap:6px;border:1px solid color-mix(in srgb,var(--kai-white) 82%,transparent);border-radius:999px;padding:5px 12px 5px 6px;color:color-mix(in srgb,var(--kai-white) 92%,transparent);font-size:10.5px;font-weight:450;letter-spacing:0.01em;white-space:nowrap}
.tl-sh-media{width:min(100%,9.2rem);height:58px;border:1px solid color-mix(in srgb,var(--kai-white) 82%,transparent);border-radius:18px;display:grid;place-items:center;color:color-mix(in srgb,var(--kai-white) 92%,transparent)}
.tl-sh-media svg{width:18px;height:18px;stroke-width:1.5}
.tl-sh-split{display:grid;grid-template-columns:auto 10px minmax(0,7.8rem);gap:3px;width:100%;max-width:17.5rem;align-items:center}
.tl-sh-pills{display:flex;flex-direction:column;gap:5px}
.tl-sh-pill{display:flex;align-items:center;gap:5px;height:22px;padding:0 8px;border:1px solid color-mix(in srgb,var(--kai-white) 80%,transparent);border-radius:999px;color:color-mix(in srgb,var(--kai-white) 92%,transparent);font-size:10px;font-weight:500;letter-spacing:0.04em;background:#08080d}
.tl-sh-icon{display:grid;place-items:center;flex:none}
.tl-sh-fork{position:relative;height:78px}
.tl-sh-fork i{position:absolute;background:color-mix(in srgb,var(--kai-white) 70%,transparent)}
.tl-sh-fork .v{left:0;top:10px;bottom:10px;width:1px}
.tl-sh-fork .a,.tl-sh-fork .b,.tl-sh-fork .c,.tl-sh-fork .d{left:0;width:7px;height:1px}
.tl-sh-fork .a{top:10px}.tl-sh-fork .b{top:34px}.tl-sh-fork .c{top:58px}.tl-sh-fork .d{bottom:10px}
.tl-sh-fork .h{left:0;top:50%;width:100%;height:1px}
.tl-sh-plate{position:relative;aspect-ratio:1;width:100%;max-width:7.8rem;margin-left:auto;border:1px solid color-mix(in srgb,var(--kai-white) 82%,transparent);border-radius:22px;background-color:#08080d;background-image:linear-gradient(color-mix(in srgb,var(--kai-white) 28%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--kai-white) 28%,transparent) 1px,transparent 1px);background-size:12px 12px}
.tl-sh-node{position:absolute;width:22px;height:22px;border:1px solid color-mix(in srgb,var(--kai-white) 72%,transparent);border-radius:8px;display:grid;place-items:center;color:color-mix(in srgb,var(--kai-white) 90%,transparent);background:color-mix(in srgb,var(--kai-dark) 72%,transparent);animation:tl-sh-float 3.1s ease-in-out infinite}
.tl-sh-node-y{border-color:color-mix(in srgb,var(--kai-yellow) 80%,transparent);color:var(--kai-yellow)}
.tl-sh-node-l{border-color:color-mix(in srgb,var(--kai-lavender) 80%,transparent);color:var(--kai-lavender)}
.tl-sh-node-p{border-color:color-mix(in srgb,var(--kai-purple) 75%,transparent);color:var(--kai-purple)}
.tl-sh-dot{position:absolute;width:4px;height:4px;border-radius:1px;background:color-mix(in srgb,var(--kai-white) 58%,transparent)}
@media (prefers-reduced-motion:reduce){.tl-sh-knob,.tl-sh-node{animation:none}}
`;

function FitCam() {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera;
  const size = useThree((s) => s.size);

  useLayoutEffect(() => {
    (camera as THREE.OrthographicCamera & { manual?: boolean }).manual = true;
    const aspect = size.width / Math.max(size.height, 1);
    camera.left = -VIEW * aspect;
    camera.right = VIEW * aspect;
    camera.top = VIEW;
    camera.bottom = -VIEW;
    camera.near = 0.1;
    camera.far = 40;
    camera.position.set(0.04, 0.06, 3.6);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

function GridField({ phase }: { phase: MutableRefObject<Phase> }) {
  const group = useRef<THREE.Group>(null);
  const dots = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const n = 11;

  useLayoutEffect(() => {
    const inst = dots.current;
    if (!inst) return;
    let i = 0;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        dummy.position.set(-0.65 + x * 0.13, -0.65 + y * 0.13, 0.01);
        dummy.scale.setScalar((x + y * 3) % 5 === 0 ? 1.4 : 0.65);
        dummy.updateMatrix();
        inst.setMatrixAt(i++, dummy.matrix);
      }
    }
    inst.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(() => {
    if (!group.current) return;
    group.current.visible = phase.current.beat === 1;
    group.current.position.set(0.42, 0.02, 0);
    group.current.scale.setScalar(0.72);
  });

  return (
    <group ref={group}>
      <instancedMesh ref={dots} args={[undefined, undefined, n * n]}>
        <boxGeometry args={[0.028, 0.028, 0.016]} />
        <meshBasicMaterial color={KAI.white} transparent opacity={0.55} depthWrite={false} />
      </instancedMesh>
      <Accents phase={phase} />
      <Sweep phase={phase} />
    </group>
  );
}

function Accents({ phase }: { phase: MutableRefObject<Phase> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const from = useMemo(() => CELLS.map((c) => new THREE.Vector3(c[0], c[1], 0.03)), []);

  useLayoutEffect(() => {
    const inst = mesh.current;
    if (!inst) return;
    CELLS.forEach((c, i) => {
      color.setHex(c[2]);
      inst.setColorAt(i, color);
    });
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  }, [color]);

  useFrame(() => {
    const inst = mesh.current;
    if (!inst) return;
    const { beat, u } = phase.current;
    for (let i = 0; i < CELLS.length; i++) {
      const src = from[i];
      dummy.position.copy(src).setY(src.y + Math.sin((u + i) * Math.PI * 2) * 0.03);
      dummy.scale.setScalar(beat === 1 ? 1 : 0.001);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, CELLS.length]}>
      <boxGeometry args={[0.09, 0.09, 0.028]} />
      <meshBasicMaterial transparent opacity={0.88} depthWrite={false} />
    </instancedMesh>
  );
}

function Sweep({ phase }: { phase: MutableRefObject<Phase> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const n = 18;

  useLayoutEffect(() => {
    const inst = mesh.current;
    if (!inst) return;
    for (let i = 0; i < n; i++) {
      color.setHex(TONES[i % TONES.length]);
      inst.setColorAt(i, color);
    }
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  }, [color]);

  useFrame(() => {
    const inst = mesh.current;
    if (!inst) return;
    const { beat, u } = phase.current;
    for (let i = 0; i < n; i++) {
      const a = (i / n + u * 0.28) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.04);
      dummy.scale.setScalar(beat === 1 ? 0.55 + (i % 3) * 0.12 : 0.001);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, n]}>
      <boxGeometry args={[0.03, 0.03, 0.018]} />
      <meshBasicMaterial transparent opacity={0.5} depthWrite={false} />
    </instancedMesh>
  );
}

function Stage({ reduce, born }: { reduce: boolean; born: number }) {
  const phase = useRef({ beat: 0, u: 0.55 });

  useFrame(() => {
    const t = reduce ? 0 : ((performance.now() - born) / 1000) % CYCLE;
    phase.current.u = reduce ? 0.55 : (t % BEAT) / BEAT;
    phase.current.beat = reduce ? 0 : Math.floor(t / BEAT);
  });

  return (
    <>
      <FitCam />
      <color attach="background" args={["#08080d"]} />
      <GridField phase={phase} />
    </>
  );
}

function Hud({ beat }: { beat: number }) {
  if (beat === 1) {
    return (
      <div className="tl-search-hud" data-beat="1">
        <div className="tl-sh-split">
          <div className="tl-sh-pills">
            <span className="tl-sh-pill">
              <span className="tl-sh-icon">
                <Volume2 />
              </span>
              ROAS
            </span>
            <span className="tl-sh-pill">
              <span className="tl-sh-icon">
                <CirclePlay />
              </span>
              CPA
            </span>
            <span className="tl-sh-pill">
              <span className="tl-sh-icon">
                <ImageIcon />
              </span>
              CTR
            </span>
            <span className="tl-sh-pill">
              <span className="tl-sh-icon">
                <AlignLeft />
              </span>
              FREQ
            </span>
          </div>
          <span className="tl-sh-fork" aria-hidden>
            <i className="v" />
            <i className="a" />
            <i className="b" />
            <i className="c" />
            <i className="d" />
            <i className="h" />
          </span>
          <div className="tl-sh-plate">
            <i className="tl-sh-dot" style={{ left: "18%", top: "14%" }} />
            <i className="tl-sh-dot" style={{ left: "72%", top: "10%" }} />
            <i className="tl-sh-dot" style={{ left: "88%", top: "28%" }} />
            <i className="tl-sh-dot" style={{ left: "12%", top: "48%" }} />
            <i className="tl-sh-dot" style={{ left: "44%", top: "36%" }} />
            <i className="tl-sh-dot" style={{ left: "90%", top: "62%" }} />
            <i className="tl-sh-dot" style={{ left: "28%", top: "78%" }} />
            <i className="tl-sh-dot" style={{ left: "58%", top: "88%" }} />
            <i className="tl-sh-dot" style={{ left: "80%", top: "80%" }} />
            <span className="tl-sh-node tl-sh-node-y" style={{ left: "48%", top: "12%" }}>
              <CirclePlay />
            </span>
            <span className="tl-sh-node tl-sh-node-l" style={{ left: "74%", top: "34%", animationDelay: ".45s" }}>
              <Volume2 />
            </span>
            <span className="tl-sh-node" style={{ left: "34%", top: "48%", animationDelay: ".9s" }}>
              <AlignLeft />
            </span>
            <span className="tl-sh-node tl-sh-node-p" style={{ left: "62%", top: "68%", animationDelay: "1.3s" }}>
              <ImageIcon />
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (beat === 2) {
    return (
      <div className="tl-search-hud" data-beat="2">
        <div className="tl-sh">
          <p className="tl-sh-query">
            <Sparkle />
            Name the risk before spend moves
          </p>
          <i className="tl-sh-stem" />
          <div className="tl-sh-media">
            <CirclePlay />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tl-search-hud" data-beat="0">
      <div className="tl-sh">
        <div className="tl-sh-row">
          <span className="tl-sh-play">
            <CirclePlay />
          </span>
          <i className="tl-sh-bar" />
          <i className="tl-sh-knob" />
          <i className="tl-sh-bar" />
        </div>
        <i className="tl-sh-stem" />
        <span className="tl-sh-spark">
          <Sparkle />
        </span>
        <i className="tl-sh-stem" />
        <span className="tl-sh-clock">0:18–0:42</span>
        </div>
      </div>
    );
  }

function Host({ reduce }: { reduce: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(0);
  const born = useRef(performance.now());

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      const t = ((performance.now() - born.current) / 1000) % CYCLE;
      setBeat(Math.floor(t / BEAT));
    }, 200);
    return () => window.clearInterval(id);
  }, [reduce]);

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;

    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.background = "#08080d";
    el.appendChild(canvas);

    const root = createRoot(canvas);
    let dead = false;
    let ready = false;
    let chain = Promise.resolve();

    const apply = (w: number, h: number) => {
      chain = chain.then(async () => {
        if (dead || w < 1 || h < 1) return;
        if (!ready) {
          await root.configure({
            gl: (props) => {
              const renderer = new THREE.WebGLRenderer({
                ...props,
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
              });
              renderer.setClearColor(KAI.dark, 1);
              renderer.outputColorSpace = THREE.SRGBColorSpace;
              return renderer;
            },
            orthographic: true,
            flat: true,
            dpr: [1, 2],
            camera: { position: [0.04, 0.06, 3.6], near: 0.1, far: 40 },
            size: { width: w, height: h, top: 0, left: 0 },
            onCreated: ({ camera }) => {
              const cam = camera as THREE.OrthographicCamera & { manual?: boolean };
              cam.manual = true;
              const aspect = w / Math.max(h, 1);
              cam.left = -VIEW * aspect;
              cam.right = VIEW * aspect;
              cam.top = VIEW;
              cam.bottom = -VIEW;
              cam.position.set(0.04, 0.06, 3.6);
              cam.lookAt(0, 0, 0);
              cam.updateProjectionMatrix();
            },
          });
          if (dead) return;
          root.render(<Stage reduce={reduce} born={born.current} />);
          ready = true;
          return;
        }
        await root.configure({ size: { width: w, height: h, top: 0, left: 0 } });
      });
    };

    const fit = () => apply(el.clientWidth, el.clientHeight);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    return () => {
      dead = true;
      ro.disconnect();
      root.unmount();
      canvas.remove();
    };
  }, [reduce]);

  return (
    <div ref={host} className="tl-pipe-stage" aria-hidden>
      <style>{HUD}</style>
      <Hud beat={beat} />
    </div>
  );
}

const NOTES = [
  {
    k: "speed",
    label: "LIVE ANALYSIS",
    body: "What's working and what's burning budget, scored on the same clock.",
  },
  {
    k: "scale",
    label: "10 DIMENSIONS",
    body: "Ten performance reads. Not a weekly dump.",
  },
  {
    k: "prop",
    label: "RISK CLASSIFICATION",
    body: "Conservative, Moderate, or Aggressive — named before anyone moves spend.",
  },
] as const;

export function SearchScene() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="tl-pipe tl-search">
      <Host reduce={reduce} />
      <p className="tl-pipe-title">Performance Analysis Agent</p>
      {NOTES.map((n) => (
        <p key={n.k} className={`tl-pipe-note tl-pipe-note-${n.k}`}>
          <span>{n.label}</span>
          {n.body}
        </p>
      ))}
    </div>
  );
}
