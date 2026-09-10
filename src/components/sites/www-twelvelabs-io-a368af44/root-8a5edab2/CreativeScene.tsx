"use client";

import { createRoot, extend, useFrame, useThree } from "@react-three/fiber";
import { CirclePlay } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ASSET } from "./content";

extend(THREE as never);

const KAI = {
  dark: 0x08080d,
  yellow: 0xf4c05f,
  lavender: 0xd9b3e2,
  purple: 0x9a5ca3,
  pink: 0xd5a6c8,
  white: 0xffffff,
} as const;
const TONES = [KAI.yellow, KAI.pink, KAI.lavender, KAI.yellow, KAI.purple, KAI.lavender] as const;
const N = 18;
const VIEW = 1.62;

const MEDIA = [
  { k: "image" as const, src: `${ASSET}/images/ai-orchestration.jpg`, stamp: "0:00 – 0:12" },
  { k: "video" as const, src: `${ASSET}/videos/mosaic/clip-00.mp4`, stamp: "0:28 – 0:42" },
  { k: "image" as const, src: `${ASSET}/images/HOxj8HlO2OZ5zG747yPiJuucbXI.webp`, stamp: "1:04 – 1:18" },
  { k: "video" as const, src: `${ASSET}/videos/mosaic/clip-03.mp4`, stamp: "2:08 – 2:50" },
  { k: "image" as const, src: `${ASSET}/images/cta-hub-operator.jpg`, stamp: "0:12 – 0:24" },
  { k: "video" as const, src: `${ASSET}/videos/mosaic/clip-07.mp4`, stamp: "0:36 – 0:51" },
  { k: "image" as const, src: `${ASSET}/images/girl_cta.webp`, stamp: "1:22 – 1:40" },
  { k: "video" as const, src: `${ASSET}/videos/make-up.mp4`, stamp: "3:05 – 3:19" },
];

type ClipUi = {
  x: number;
  y: number;
  o: number;
  s: number;
  src: string;
  video: boolean;
  stamp: string;
};

const CLIP: ClipUi = { x: 0, y: 0, o: 0, s: 0.42, src: "", video: false, stamp: "" };

const CLIP_CSS = `
.tl-clip{position:absolute;left:0;top:0;z-index:2;display:flex;flex-direction:column;align-items:center;width:max-content;pointer-events:none;opacity:0;transform-origin:center 72%;will-change:transform,opacity}
.tl-clip-spine{width:1px;height:14px;background:color-mix(in srgb,var(--kai-white) 78%,transparent)}
.tl-clip-badge{display:flex;align-items:center;gap:5px;padding:3px 10px 3px 5px;border:1px solid var(--kai-dark-surface);border-radius:999px;background:#fff;color:var(--kai-dark-surface);font-size:11px;font-weight:500;letter-spacing:0.01em;line-height:1;white-space:nowrap}
.tl-clip-badge svg{width:14px;height:14px;flex:none}
.tl-clip-media{width:172px;height:78px;overflow:hidden;border-radius:999px;box-shadow:0 0 0 1.5px color-mix(in srgb,var(--kai-lavender) 82%,#fff),0 0 20px 5px color-mix(in srgb,var(--kai-lavender) 42%,transparent),0 0 34px 10px color-mix(in srgb,var(--kai-purple) 18%,transparent)}
.tl-clip-media img,.tl-clip-media video{display:block;width:100%;height:100%;object-fit:cover}
`;

function rail(y: number, z: number) {
  return new THREE.CatmullRomCurve3(
    [-2.8, -1.5, -0.2, 1.1, 2.5].map((x) => new THREE.Vector3(x, y + x * 0.18, z - x * 0.52)),
    false,
    "catmullrom",
    0.28,
  );
}

function nextVisible(matrices: THREE.Matrix4[], prev: number) {
  const p = new THREE.Vector3();
  const hits: number[] = [];
  for (let i = 0; i < N; i++) {
    p.setFromMatrixPosition(matrices[i]);
    if (i !== prev && Math.abs(p.x) < 1.05 && Math.abs(p.y) < 0.85) hits.push(i);
  }
  return hits[Math.floor(Math.random() * hits.length)] ?? (prev + 3) % N;
}

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
    camera.position.set(2.4, 2.8, 3.1);
    camera.lookAt(0.05, 0.04, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

function Flow({
  reduce,
  matrices,
  cube,
  media,
}: {
  reduce: boolean;
  matrices: THREE.Matrix4[];
  cube: number;
  media: number;
}) {
  const glass = useRef<THREE.InstancedMesh>(null);
  const rim = useRef<THREE.InstancedMesh>(null);
  const grid = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const rails = useMemo(() => [rail(0.38, 0.22), rail(0.0, -0.06), rail(-0.38, -0.34)], []);
  const seed = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => ({
        rail: i % 3,
        t: (i / N) * 0.9,
        len: 0.72 + (i % 5) * 0.22,
        thick: 0.82 + (i % 3) * 0.1,
      })),
    [],
  );
  useLayoutEffect(() => {
    const g = glass.current;
    const r = rim.current;
    if (!g || !r) return;
    const color = new THREE.Color();
    const wash = new THREE.Color();
    seed.forEach((_, i) => {
      color.setHex(TONES[i % TONES.length]);
      r.setColorAt(i, color);
      wash.copy(color).lerp(new THREE.Color(0xffffff), 0.55);
      g.setColorAt(i, wash);
    });
    if (r.instanceColor) r.instanceColor.needsUpdate = true;
    if (g.instanceColor) g.instanceColor.needsUpdate = true;
  }, [seed]);

  const paths = useMemo(
    () =>
      rails.map((curve) => {
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
        const mat = new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.22 });
        return new THREE.Line(geo, mat);
      }),
    [rails],
  );

  useEffect(
    () => () => {
      paths.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
    },
    [paths],
  );

  useFrame((state) => {
    const t = reduce ? 0 : state.clock.elapsedTime;
    const g = glass.current;
    const r = rim.current;
    const w = grid.current;
    if (!g || !r || !w) return;
    seed.forEach((s, i) => {
      const u = ((s.t + t * 0.026) % 1 + 1) % 1;
      const curve = rails[s.rail];
      const p = curve.getPointAt(u);
      curve.getTangentAt(u, tangent);
      dummy.position.copy(p);
      look.copy(p).add(tangent);
      dummy.lookAt(look);
      dummy.rotateY(Math.PI / 2);
      dummy.scale.set(s.len, s.thick, s.thick);
      dummy.updateMatrix();
      g.setMatrixAt(i, dummy.matrix);
      w.setMatrixAt(i, dummy.matrix);
      matrices[i].copy(dummy.matrix);
      dummy.scale.set(s.len * 1.055, s.thick * 1.14, s.thick * 1.1);
      dummy.updateMatrix();
      r.setMatrixAt(i, dummy.matrix);
    });
    g.instanceMatrix.needsUpdate = true;
    r.instanceMatrix.needsUpdate = true;
    w.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {paths.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
      <instancedMesh ref={rim} args={[undefined, undefined, N]} frustumCulled={false} renderOrder={0}>
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshBasicMaterial transparent opacity={0.55} depthWrite={false} side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={glass} args={[undefined, undefined, N]} frustumCulled={false} renderOrder={1}>
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshBasicMaterial transparent opacity={0.2} depthWrite={false} side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={grid} args={[undefined, undefined, N]} frustumCulled={false} renderOrder={2}>
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshBasicMaterial wireframe transparent opacity={0.5} depthWrite={false} color={KAI.white} />
      </instancedMesh>
      <Pop matrices={matrices} cube={cube} media={media} reduce={reduce} />
    </>
  );
}

function Pop({
  matrices,
  cube,
  media,
  reduce,
}: {
  matrices: THREE.Matrix4[];
  cube: number;
  media: number;
  reduce: boolean;
}) {
  const born = useRef(0);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const scl = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector3(), []);
  const item = MEDIA[media];

  useLayoutEffect(() => {
    born.current = performance.now();
  }, [cube, media]);

  useFrame(({ camera, size }) => {
    matrices[cube].decompose(pos, quat, scl);
    ndc.copy(pos).project(camera);
    const age = reduce ? 0.5 : (performance.now() - born.current) / 1000;
    const pop =
      age < 0.28 ? 1 - (1 - age / 0.28) ** 3 : age > 2.15 ? Math.max(0, 1 - (age - 2.15) / 0.4) : 1;
    CLIP.x = (ndc.x * 0.5 + 0.5) * size.width;
    CLIP.y = (-ndc.y * 0.5 + 0.5) * size.height;
    CLIP.o = pop;
    CLIP.s = 0.42 + pop * 0.58;
    CLIP.src = item.src;
    CLIP.video = item.k === "video";
    CLIP.stamp = item.stamp;
  });

  return null;
}

function ClipPop() {
  const wrap = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState({ src: MEDIA[0].src, video: MEDIA[0].k === "video", stamp: MEDIA[0].stamp });

  useEffect(() => {
    let raf = 0;
    let last = "";
    const tick = () => {
      const el = wrap.current;
      if (el) {
        el.style.opacity = String(CLIP.o);
        el.style.transform = `translate(${CLIP.x}px, ${CLIP.y}px) translate(-50%, -58%) scale(${CLIP.s})`;
      }
      if (CLIP.src && CLIP.src !== last) {
        last = CLIP.src;
        setCard({ src: CLIP.src, video: CLIP.video, stamp: CLIP.stamp });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrap} className="tl-clip">
      <span className="tl-clip-spine" />
      <span className="tl-clip-badge">
        <CirclePlay strokeWidth={1.75} aria-hidden />
        {card.stamp}
      </span>
      <span className="tl-clip-spine" />
      <span className="tl-clip-media">
        {card.video ? (
          <video key={card.src} src={card.src} muted loop playsInline autoPlay />
        ) : (
          <img key={card.src} src={card.src} alt="" />
        )}
      </span>
    </div>
  );
}

function Stage({ reduce }: { reduce: boolean }) {
  const matrices = useMemo(() => Array.from({ length: N }, () => new THREE.Matrix4()), []);
  const [cube, setCube] = useState(10);
  const [media, setMedia] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const tick = () => {
      setCube((c) => nextVisible(matrices, c));
      setMedia((m) => (m + 1) % MEDIA.length);
    };
    const kick = window.setTimeout(() => setCube((c) => nextVisible(matrices, c)), 180);
    const id = window.setInterval(tick, 2550);
    return () => {
      window.clearTimeout(kick);
      window.clearInterval(id);
    };
  }, [matrices, reduce]);

  return (
    <>
      <FitCam />
      <Flow reduce={reduce} matrices={matrices} cube={cube} media={media} />
    </>
  );
}

function Host({ reduce }: { reduce: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;

    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
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
            camera: { position: [2.4, 2.8, 3.1], near: 0.1, far: 40 },
            size: { width: w, height: h, top: 0, left: 0 },
            onCreated: ({ camera }) => {
              const cam = camera as THREE.OrthographicCamera & { manual?: boolean };
              cam.manual = true;
              const aspect = w / Math.max(h, 1);
              cam.left = -VIEW * aspect;
              cam.right = VIEW * aspect;
              cam.top = VIEW;
              cam.bottom = -VIEW;
              cam.position.set(2.4, 2.8, 3.1);
              cam.lookAt(0.05, 0.04, 0);
              cam.updateProjectionMatrix();
            },
          });
          if (dead) return;
          root.render(<Stage reduce={reduce} />);
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
      <style>{CLIP_CSS}</style>
      <ClipPop />
    </div>
  );
}

const NOTES = [
  {
    k: "speed",
    label: "CREATIVE DIRECTOR",
    body: "Sets the brief. Image Generation and kAIcreative work from the same desk.",
  },
  {
    k: "mid",
    label: "AD COPYWRITER",
    body: "Headlines and descriptions written per ad group, not one line for all.",
  },
  {
    k: "scale",
    label: "KAICREATIVE",
    body: "Image Generation sits with the copy, not pasted in later.",
  },
  {
    k: "prop",
    label: "4 COPY SPECIALISTS",
    body: "Four writers, one brief. Each ad group gets its own voice.",
  },
] as const;

export function CreativeScene() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="tl-pipe tl-gen">
      <Host reduce={reduce} />
      <p className="tl-pipe-title">Creative Assets Agent</p>
      {NOTES.map((n) => (
        <p key={n.k} className={`tl-pipe-note tl-pipe-note-${n.k}`}>
          <span>{n.label}</span>
          {n.body}
        </p>
      ))}
    </div>
  );
}
