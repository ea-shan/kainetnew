"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMemo, useRef, type ReactNode } from "react";
import { ASSET } from "./content";

const TILE_IMGS = Array.from({ length: 16 }, (_, i) => `${ASSET}/images/vim/${String(i).padStart(2, "0")}.jpg`);

type Pose = { x: number; y: number; z: number; o: number; s: number };
type Semantic = "pink" | "green" | "yellow" | "orange";
type Face = "front" | "back" | "left" | "right" | "top";

type Tile = {
  id: number;
  src: string | null;
  cube: Pose;
  cross: Pose;
  plane: Pose;
  semantic: Pose;
  horizon: Pose;
  semanticColor: Semantic | null;
};

const CLUSTERS: { color: Semantic; label: string; cells: [number, number][] }[] = [
  { color: "pink", label: "A DOG SPRINTS ACROSS SAND", cells: [[-2, 0], [-1, 0], [-2, 1], [-1, 1], [-3, 0]] },
  { color: "green", label: "SURFER CARVES A WAVE AT SUNSET", cells: [[1, 3], [2, 3], [1, 4], [0, 3], [2, 4]] },
  { color: "yellow", label: "TWO CHEFS PLATE A DISH", cells: [[4, 0], [5, 0], [4, 1], [5, -1], [6, 0]] },
  { color: "orange", label: "CROWD CHEERS AS THE GOAL LANDS", cells: [[0, -3], [1, -3], [0, -4], [-1, -3]] },
];

const SEMANTIC_AT = new Map<string, Semantic>();
for (const g of CLUSTERS) for (const [c, r] of g.cells) SEMANTIC_AT.set(`${c},${r}`, g.color);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
}

function sample(p: number, stops: readonly number[], vals: readonly number[]) {
  let i = 0;
  while (i < stops.length - 2 && p > stops[i + 1]) i++;
  const t = (p - stops[i]) / (stops[i + 1] - stops[i] || 1);
  return lerp(vals[i], vals[i + 1], Math.min(1, Math.max(0, t)));
}

function mix(a: Pose, b: Pose, t: number): Pose {
  const e = easeInOutCubic(t);
  return {
    x: lerp(a.x, b.x, e),
    y: lerp(a.y, b.y, e),
    z: lerp(a.z, b.z, e),
    o: lerp(a.o, b.o, e),
    s: lerp(a.s, b.s, e),
  };
}

function poseAt(p: number, tile: Tile): Pose {
  if (p <= 0.08) return tile.cube;
  if (p <= 0.17) return mix(tile.cube, tile.cross, (p - 0.08) / 0.09);
  if (p <= 0.3) return tile.cross;
  if (p <= 0.4) return mix(tile.cross, tile.plane, (p - 0.3) / 0.1);
  if (p <= 0.48) return tile.plane;
  if (p <= 0.62) return mix(tile.plane, tile.semantic, (p - 0.48) / 0.14);
  if (p <= 0.8) return mix(tile.semantic, tile.horizon, (p - 0.62) / 0.18);
  return tile.horizon;
}

function depthScale(z: number, s: number) {
  // CSS perspective already foreshortens; this only nudges depth separation.
  const far = Math.min(1, Math.max(0, -z / 900));
  return s * lerp(1.04, 0.62, far);
}

function cubePos(face: Face, u: number, v: number): Pose {
  const D = 100;
  const S = 50;
  if (face === "front") return { x: u * S, y: v * S, z: D, o: 0.98, s: 0.8 };
  if (face === "back") return { x: u * S, y: v * S, z: -D, o: 0.78, s: 0.8 };
  if (face === "left") return { x: -D, y: v * S, z: u * S, o: 0.9, s: 0.8 };
  if (face === "right") return { x: D, y: v * S, z: u * S, o: 0.92, s: 0.8 };
  return { x: u * S, y: -D, z: v * S, o: 0.88, s: 0.8 };
}

// The box unfolds into a plus: front stays centred, each other face becomes one arm.
function faceToCross(face: Face, u: number, v: number): [number, number] {
  if (face === "front") return [u, v];
  if (face === "back") return [u, v + 5];
  if (face === "left") return [u - 5, v];
  if (face === "right") return [u + 5, v];
  return [u, v - 5];
}

// One shared lattice: CELL matches the grid backdrop, so tiles always sit in cells.
const CELL = 72;

function crossPose(gx: number, gy: number, on: boolean): Pose {
  return { x: gx * CELL, y: gy * CELL, z: 0, o: on ? 0.96 : 0, s: 1 };
}

function planePose(gx: number, gy: number, on: boolean): Pose {
  return { x: gx * CELL, y: gy * CELL, z: 0, o: on ? 0.98 : 0.14, s: 1 };
}

function semanticPose(gx: number, gy: number, on: boolean): Pose {
  return { x: gx * CELL, y: gy * CELL - 120, z: 0, o: on ? 1 : 0.12, s: 1 };
}

function horizonPose(gx: number, gy: number, keep: boolean): Pose {
  return { x: gx * CELL, y: gy * CELL - 420, z: 0, o: keep ? 0.9 : 0.07, s: 1 };
}

// Cancels world scale *and* the perspective foreshortening at a pose's depth, so every label
// pill renders at the same pixel size however far down the floor its cluster sits.
function labelScale(p: number, q: Pose) {
  const s = sample(p, CAM_P, CAM_S);
  const th = (sample(p, CAM_P, CAM_RX) * Math.PI) / 180;
  const zc = s * (q.y * Math.sin(th) + q.z * Math.cos(th)) + sample(p, CAM_P, CAM_Z);
  return Math.max(0.2, (PERSPECTIVE - zc) / PERSPECTIVE) / s;
}

function buildTiles(): Tile[] {
  const tiles: Tile[] = [];
  const taken = new Set<string>();
  let n = 0;

  const push = (src: string | null, gx: number, gy: number, cube: Pose, onCross: boolean, keepH: boolean) => {
    const key = `${Math.round(gx * 2)},${Math.round(gy * 2)}`;
    if (taken.has(key)) return;
    taken.add(key);
    const onPlane = onCross || (gx * 5 + gy * 7) % 4 === 0;
    tiles.push({
      id: n++,
      src,
      cube,
      cross: crossPose(gx, gy, onCross),
      plane: planePose(gx, gy, onPlane),
      semantic: semanticPose(gx, gy, onPlane),
      horizon: horizonPose(gx, gy, keepH),
      semanticColor: SEMANTIC_AT.get(`${Math.round(gx)},${Math.round(gy)}`) ?? null,
    });
  };

  const cells = [-2, -1, 0, 1, 2];
  const faces: Face[] = ["front", "back", "left", "right", "top"];
  faces.forEach((face, fi) => {
    for (const u of cells) {
      for (const v of cells) {
        // Same checkerboard parity on every face, so the holes line up and the box reads hollow.
        if ((u + v) % 2 !== 0) continue;
        const [gx, gy] = faceToCross(face, u, v);
        const photo = (u * 3 + v + fi) % 7 !== 0;
        push(photo ? TILE_IMGS[n % TILE_IMGS.length] : null, gx, gy, cubePos(face, u, v), true, gy > -1 && n % 3 === 0);
      }
    }
  });

  // Everything outside the box only exists once the cross opens into the floor.
  for (let gy = -7; gy <= 7; gy++) {
    for (let gx = -13; gx <= 13; gx++) {
      const inCluster = SEMANTIC_AT.has(`${gx},${gy}`);
      // Outer columns thin out so the floor reaches both viewport edges without blowing the tile budget.
      if (!inCluster && (gx * 5 + gy * 11 + 3) % (Math.abs(gx) > 9 ? 6 : 4) !== 0) continue;
      const photo = inCluster || (gx * 2 + gy + 9) % 3 === 0;
      const hidden: Pose = { x: gx * 12, y: gy * 10, z: -60, o: 0, s: 0.5 };
      push(photo ? TILE_IMGS[Math.abs(gx * 3 + gy) % TILE_IMGS.length] : null, gx, gy, hidden, false, gx % 3 === 0 && gy % 2 === 0);
    }
  }

  return tiles;
}

const TILES = buildTiles();

if (process.env.NODE_ENV !== "production") {
  if (TILES.length < 90 || TILES.length > 150) throw new Error(`vim tiles ${TILES.length}`);
  const colored = TILES.filter((t) => t.semanticColor).length;
  if (colored < 10 || colored > 28) throw new Error(`vim semantic ${colored}`);
  const mid = poseAt(0.55, TILES[0]);
  if (!Number.isFinite(mid.x + mid.y + mid.z + mid.o + mid.s)) throw new Error("vim pose");
}

// Must match `perspective` on .tl-vim-stage.
const PERSPECTIVE = 700;

const CAM_P = [0, 0.08, 0.17, 0.3, 0.4, 0.48, 0.62, 0.78, 0.86, 1];
const CAM_RX = [16, 15, 2, 3, 18, 72, 78, 80, 81, 82];
const CAM_RY = [-26, -20, 0, 0, 0, 0, 0, 0, 0, 0];
const CAM_RZ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const CAM_S = [1, 0.9, 0.39, 0.4, 0.46, 0.62, 0.68, 0.72, 0.76, 0.8];
const CAM_X = [0, 30, 175, 178, 150, 34, 4, -4, -6, -6];
const CAM_Y = [110, 106, 20, 16, 20, 120, 132, 146, 160, 210];
const CAM_Z = [-140, -120, -80, -80, -40, 60, 90, 115, 135, 170];

if (process.env.NODE_ENV !== "production") {
  // Labels must all read at one pixel size, so the compensation has to grow with distance:
  // a far row needs more world scale than a near one. A sign slip inverts this.
  const near = labelScale(0.62, semanticPose(0, 4, true));
  const far = labelScale(0.62, semanticPose(0, -4, true));
  if (!(far > near && near > 0.5 && far < 4)) throw new Error(`vim label scale ${near}/${far}`);
}

export function VideoIntelligenceModels() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const tiles = useMemo(() => TILES, []);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  return (
    <section ref={sectionRef} className={`tl-vim${reduce ? " is-static" : ""}`} aria-labelledby="tl-vim-title">
      <div className="tl-vim-pin">
        <Narrative scroll={scrollYProgress} reduce={!!reduce} />
        <MediaUniverse scroll={scrollYProgress} tiles={tiles} reduce={!!reduce} />
      </div>
    </section>
  );
}

function band(p: number, a0: number, a1: number, b0: number, b1: number) {
  if (p < a0) return 0;
  if (p < a1) return (p - a0) / (a1 - a0);
  if (p < b0) return 1;
  if (p < b1) return 1 - (p - b0) / (b1 - b0);
  return 0;
}

function Narrative({ scroll, reduce }: { scroll: MotionValue<number>; reduce: boolean }) {
  const models = useTransform(scroll, (p) => (p < 0.08 ? 1 : p < 0.14 ? 1 - (p - 0.08) / 0.06 : 0));
  const marengo = useTransform(scroll, (p) => band(p, 0.12, 0.17, 0.34, 0.4));
  const pegasus = useTransform(scroll, (p) => band(p, 0.38, 0.46, 0.74, 0.8));
  const jockey = useTransform(scroll, (p) => band(p, 0.78, 0.84, 0.88, 0.93));
  const production = useTransform(scroll, (p) => band(p, 0.9, 0.95, 1.05, 1.2));

  return (
    <div className="tl-vim-copy">
      <NarrativeBlock
        opacity={models}
        reduce={reduce}
        eyebrow="How it works"
        title={
          <>
            From brief to a campaign
            that&apos;s ready to launch
          </>
        }
        description="Brief to something worth reviewing: about 12 minutes. Long enough for a coffee, short enough to stay on the page."
        position="center"
        headingId="tl-vim-title"
      />
      <NarrativeBlock
        opacity={marengo}
        reduce={reduce}
        eyebrow="Step 1"
        title="Brief it."
        description="Describe what you're advertising like you'd tell a teammate. No ad jargon required."
        position="left"
      />
      <NarrativeBlock
        opacity={pegasus}
        reduce={reduce}
        eyebrow="Step 2"
        title="Review it."
        description="See the audience, keywords, structure, and assets the agents built. Change anything."
        position="left"
      />
      <NarrativeBlock
        opacity={jockey}
        reduce={reduce}
        eyebrow="Step 3"
        title="Approve it."
        description="Nothing goes live until you say so."
        position="left"
      />
      <NarrativeBlock
        opacity={production}
        reduce={reduce}
        eyebrow="Step 4"
        title="Improve it."
        description="Performance Analysis Agent tells you how it's running. Optimization Agent turns that into specific tests. You decide which ones run."
        position="left"
        wide
      />
    </div>
  );
}

function NarrativeBlock({
  opacity,
  reduce,
  eyebrow,
  title,
  description,
  position,
  headingId,
  wide,
}: {
  opacity: MotionValue<number>;
  reduce: boolean;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  position: "left" | "center";
  headingId?: string;
  wide?: boolean;
}) {
  const vis = useTransform(opacity, (v) => (v < 0.04 ? "hidden" : "visible"));
  const y = useTransform(opacity, (v) => (1 - v) * 10);

  return (
    <motion.div
      className={`tl-vim-block is-${position}${wide ? " is-wide" : ""}`}
      style={
        reduce && position !== "center"
          ? { opacity: 0, visibility: "hidden" }
          : reduce
            ? undefined
            : { opacity, visibility: vis, y }
      }
    >
      <p className="inline-flex max-w-full items-center gap-2 text-[12px] uppercase tracking-[0.14em]">
        <span className="font-mono text-[13px] leading-none text-[var(--kai-purple)]" aria-hidden>
          {"</>"}
        </span>
        <span className="tl-preview-text font-semibold">{eyebrow}</span>
      </p>
      <h2 id={headingId} className="tl-vim-h">
        {title}
      </h2>
      {description ? <p className="tl-vim-sub">{description}</p> : null}
    </motion.div>
  );
}

function MediaUniverse({
  scroll,
  tiles,
  reduce,
}: {
  scroll: MotionValue<number>;
  tiles: Tile[];
  reduce: boolean;
}) {
  const rotateX = useTransform(scroll, CAM_P, CAM_RX);
  const rotateY = useTransform(scroll, CAM_P, CAM_RY);
  const rotateZ = useTransform(scroll, CAM_P, CAM_RZ);
  const scale = useTransform(scroll, CAM_P, CAM_S);
  const x = useTransform(scroll, CAM_P, CAM_X);
  const y = useTransform(scroll, CAM_P, CAM_Y);
  const z = useTransform(scroll, CAM_P, CAM_Z);
  const boxOp = useTransform(scroll, (p) => Math.max(0, 0.55 - p * 3.6));
  const gridOp = useTransform(scroll, (p) => Math.min(0.7, Math.max(0, (p - 0.12) * 7)));

  return (
    <div className="tl-vim-stage" aria-hidden>
      <motion.div
        className="tl-vim-world"
        style={reduce ? { rotateX: 16, rotateY: -26, scale: 1.1 } : { rotateX, rotateY, rotateZ, scale, x, y, z }}
      >
        <motion.div className="tl-vim-grid" style={reduce ? { opacity: 0 } : { opacity: gridOp }} />
        <motion.div className="tl-vim-box" style={reduce ? { opacity: 0.3 } : { opacity: boxOp }}>
          <i className="is-front" />
          <i className="is-back" />
          <i className="is-left" />
          <i className="is-right" />
          <i className="is-top" />
          <i className="is-bot" />
        </motion.div>
        {tiles.map((tile) => (
          <MediaTile key={tile.id} tile={tile} scroll={scroll} reduce={reduce} />
        ))}
        {CLUSTERS.map((c) => (
          <ClusterLabel key={c.color} cluster={c} scroll={scroll} reduce={reduce} />
        ))}
      </motion.div>
    </div>
  );
}

function MediaTile({ tile, scroll, reduce }: { tile: Tile; scroll: MotionValue<number>; reduce: boolean }) {
  const transform = useTransform(scroll, (p) => {
    const q = poseAt(p, tile);
    return `translate3d(${q.x}px, ${q.y}px, ${q.z}px) scale(${depthScale(q.z, q.s)})`;
  });
  const opacity = useTransform(scroll, (p) => poseAt(p, tile).o);
  const peak = tile.semanticColor ? 0.5 : 0;
  const wash = useTransform(scroll, [0.52, 0.58, 0.7, 0.78], [0, peak, peak, 0]);
  const rest = tile.cube;

  return (
    <motion.div
      className="tl-vim-tile"
      style={
        reduce
          ? { transform: `translate3d(${rest.x}px, ${rest.y}px, ${rest.z}px) scale(${rest.s})`, opacity: rest.o }
          : { transform, opacity }
      }
    >
      {tile.src ? <img src={tile.src} alt="" /> : null}
      {tile.semanticColor ? (
        <motion.i className={`tl-vim-wash is-${tile.semanticColor}`} style={reduce ? { opacity: 0 } : { opacity: wash }} />
      ) : null}
    </motion.div>
  );
}

function ClusterLabel({
  cluster,
  scroll,
  reduce,
}: {
  cluster: (typeof CLUSTERS)[number];
  scroll: MotionValue<number>;
  reduce: boolean;
}) {
  const [cx, cy] = cluster.cells[0];
  const dummy: Tile = {
    id: -1,
    src: null,
    cube: { x: 0, y: 0, z: 0, o: 0, s: 1 },
    cross: crossPose(cx, cy, true),
    plane: planePose(cx, cy, true),
    semantic: semanticPose(cx, cy, true),
    horizon: horizonPose(cx, cy, false),
    semanticColor: cluster.color,
  };
  // Billboard: undo the world rotation and scale so the pill stays upright and legible.
  const transform = useTransform(scroll, (p) => {
    const q = poseAt(p, dummy);
    const rx = sample(p, CAM_P, CAM_RX);
    const ry = sample(p, CAM_P, CAM_RY);
    const rz = sample(p, CAM_P, CAM_RZ);
    // Pill hangs off the cluster tile's centre-right, vertically centred, like the reference.
    return `translate3d(${q.x}px, ${q.y}px, ${q.z + 8}px) rotateZ(${-rz}deg) rotateY(${-ry}deg) rotateX(${-rx}deg) scale(${labelScale(p, q)}) translate(-6px, -50%)`;
  });
  const opacity = useTransform(scroll, [0.54, 0.6, 0.68, 0.76], [0, 1, 1, 0]);

  return (
    <motion.div className={`tl-vim-label is-${cluster.color}`} style={reduce ? { opacity: 0 } : { opacity, transform }}>
      {cluster.label}
    </motion.div>
  );
}
