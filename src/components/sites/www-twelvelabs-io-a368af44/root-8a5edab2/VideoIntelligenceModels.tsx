"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMemo, useRef, type ReactNode } from "react";
import { ASSET } from "./content";

const TILE_IMGS = Array.from({ length: 16 }, (_, i) => `${ASSET}/images/vim/${String(i).padStart(2, "0")}.jpg`);

type Pose = { x: number; y: number; z: number; o: number; s: number };
type Semantic = "pink" | "green" | "yellow" | "orange";

type Tile = {
  id: number;
  src: string | null;
  semantic: Semantic | null;
  poses: Pose[];
};

const STAGES = [0, 0.1, 0.18, 0.34, 0.5, 0.7, 0.86, 1] as const;

const FEATURES = [
  { img: 0, label: "A DOG SPRINTS ACROSS SAND", c: 5, r: 2, semantic: "pink" as const },
  { img: 1, label: "SURFER CARVES A WAVE AT SUNSET", c: 4, r: 5, semantic: "green" as const },
  { img: 2, label: "TWO CHEFS PLATE A DISH", c: 9, r: 3, semantic: "yellow" as const },
  { img: 3, label: "CROWD CHEERS AS THE GOAL LANDS", c: 10, r: 1, semantic: "orange" as const },
] as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function poseAt(p: number, poses: Pose[]): Pose {
  let i = 0;
  while (i < STAGES.length - 2 && p > STAGES[i + 1]) i++;
  const t = (p - STAGES[i]) / (STAGES[i + 1] - STAGES[i] || 1);
  const A = poses[i];
  const B = poses[i + 1];
  return {
    x: lerp(A.x, B.x, t),
    y: lerp(A.y, B.y, t),
    z: lerp(A.z, B.z, t),
    o: lerp(A.o, B.o, t),
    s: lerp(A.s, B.s, t),
  };
}

function buildTiles(): Tile[] {
  const cols = 15;
  const rows = 7;
  const mx = (cols - 1) / 2;
  const my = (rows - 1) / 2;
  const tiles: Tile[] = [];
  let n = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const gx = c - mx;
      const gy = r - my;
      const onCross = Math.abs(gx) < 0.51 || Math.abs(gy) < 0.51;
      const inCube = Math.abs(gx) <= 3 && Math.abs(gy) <= 2;
      if (!onCross && (c * 5 + r * 3) % 7 === 0) continue;

      const feature = FEATURES.find((f) => f.c === c && f.r === r);
      const blank = !feature && n % 8 === 3;
      const src = feature ? TILE_IMGS[feature.img] : blank ? null : TILE_IMGS[n % TILE_IMGS.length];
      const semantic = feature?.semantic ?? (blank ? null : (["pink", "green", "yellow", "orange"] as const)[n % 4]);
      const layer = ((c + r) % 3) - 1;

      tiles.push({
        id: n++,
        src,
        semantic,
        poses: [
          { x: gx * 30, y: gy * 22, z: inCube ? layer * 56 : -28, o: inCube ? 0.95 : 0, s: 0.7 },
          { x: gx * 48, y: gy * 34, z: layer * 22, o: inCube || onCross ? 0.92 : 0.12, s: 0.84 },
          { x: gx * 72, y: gy * 56, z: 0, o: onCross ? 1 : 0.06, s: 0.95 },
          { x: gx * 88, y: gy * 68, z: gy * -8, o: 0.98, s: 1 },
          { x: gx * 96, y: gy * 72, z: 0, o: 1, s: 1.02 },
          { x: gx * 104, y: gy * 78 + 16, z: r * -28, o: 0.88, s: 1.04 },
          { x: gx * 70, y: 70 + r * 22, z: -60 - r * 50, o: r < 2 ? 0.25 : 0.8, s: 0.96 },
          { x: gx * 48, y: 96 + r * 14, z: -100 - r * 70, o: r < 2 ? 0.2 : 0.7, s: 0.9 },
        ],
      });
    }
  }
  return tiles;
}

const TILES = buildTiles();

if (process.env.NODE_ENV !== "production") {
  if (TILES.length < 50 || TILES.length > 140) throw new Error(`vim tiles ${TILES.length}`);
  if (TILES[0].poses.length !== STAGES.length) throw new Error("vim poses");
  const mid = poseAt(0.4, TILES[0].poses);
  if (!Number.isFinite(mid.x + mid.y + mid.z + mid.o + mid.s)) throw new Error("vim pose");
}

export function VideoIntelligenceModels() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const tiles = useMemo(() => TILES, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      className={`tl-vim${reduce ? " is-static" : ""}`}
      aria-labelledby="tl-vim-title"
    >
      <div className="tl-vim-pin">
        <Narrative scroll={scrollYProgress} reduce={!!reduce} />
        <MediaUniverse scroll={scrollYProgress} tiles={tiles} reduce={!!reduce} />
      </div>
    </section>
  );
}

function band(p: number, enter0: number, enter1: number, leave0: number, leave1: number) {
  if (p < enter0) return 0;
  if (p < enter1) return (p - enter0) / (enter1 - enter0);
  if (p < leave0) return 1;
  if (p < leave1) return 1 - (p - leave0) / (leave1 - leave0);
  return 0;
}

function Narrative({ scroll, reduce }: { scroll: MotionValue<number>; reduce: boolean }) {
  const models = useTransform(scroll, (p) => (p < 0.08 ? 1 : p < 0.14 ? 1 - (p - 0.08) / 0.06 : 0));
  const marengo = useTransform(scroll, (p) => band(p, 0.08, 0.16, 0.34, 0.4));
  const pegasus = useTransform(scroll, (p) => band(p, 0.32, 0.42, 0.62, 0.68));
  const jockey = useTransform(scroll, (p) => band(p, 0.62, 0.7, 0.8, 0.86));
  const production = useTransform(scroll, (p) => band(p, 0.86, 0.92, 1.01, 1.2));

  return (
    <div className="tl-vim-copy">
      <NarrativeBlock
        opacity={models}
        reduce={reduce}
        eyebrow="THE MODELS"
        title={
          <>
            Built on the models
            <br />
            that understand video.
          </>
        }
        description={
          <>
            Marengo finds it, Pegasus describes it.
            <br />
            Jockey turns it into something you can query.
          </>
        }
        position="center"
        headingId="tl-vim-title"
      />
      <NarrativeBlock
        opacity={marengo}
        reduce={reduce}
        eyebrow="MARENGO"
        title={
          <>
            Indexes media
            <br />
            by meaning.
          </>
        }
        description="Makes video and photo libraries searchable by phrase, image, clip, concept, action, object, place, or person."
        position="left"
      />
      <NarrativeBlock
        opacity={pegasus}
        reduce={reduce}
        eyebrow="PEGASUS"
        title={
          <>
            Understands media
            <br />
            in natural language.
          </>
        }
        description="Describes scenes, summarizes clips, explains context, generates captions, and reasons over what happens inside video."
        position="left"
      />
      <NarrativeBlock
        opacity={jockey}
        reduce={reduce}
        eyebrow="JOCKEY"
        title={
          <>
            Orchestrates the workflow
            <br />
            across the library.
          </>
        }
        description="Breaks down a request, searches the right parts of the library, reasons over results, and returns output your application can use."
        position="left"
      />
      <NarrativeBlock
        opacity={production}
        reduce={reduce}
        eyebrow="IN PRODUCTION"
        title={
          <>
            Teams are already
            <br />
            querying their video.
          </>
        }
        description={null}
        position="left"
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
}: {
  opacity: MotionValue<number>;
  reduce: boolean;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  position: "left" | "center";
  headingId?: string;
}) {
  return (
    <motion.div
      className={`tl-vim-block is-${position}`}
      style={
        reduce && position !== "center"
          ? { opacity: 0, visibility: "hidden" }
          : reduce
            ? undefined
            : { opacity, visibility: useTransform(opacity, (v) => (v < 0.04 ? "hidden" : "visible")) }
      }
    >
      <p className="tl-vim-pill">{eyebrow}</p>
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
  const stages = [...STAGES];
  const rotateX = useTransform(scroll, stages, [2, 14, 40, 58, 64, 68, 73, 78]);
  const rotateZ = useTransform(scroll, [0, 0.12, 0.22, 0.36, 1], [0, -5, -1, 0, 0]);
  const scale = useTransform(scroll, stages, [0.62, 0.78, 0.92, 1.04, 1.14, 1.24, 1.34, 1.44]);
  const y = useTransform(scroll, stages, [8, 28, 56, 88, 120, 150, 180, 210]);
  const z = useTransform(scroll, stages, [40, 50, 70, 100, 140, 200, 260, 340]);

  return (
    <div className="tl-vim-stage" aria-hidden>
      <motion.div
        className="tl-vim-world"
        style={reduce ? undefined : { rotateX, rotateZ, scale, y, z }}
      >
        <div className="tl-vim-grid" />
        {tiles.map((tile) => (
          <MediaTile key={tile.id} tile={tile} scroll={scroll} reduce={reduce} />
        ))}
      </motion.div>
      <SemanticLabels scroll={scroll} reduce={reduce} />
    </div>
  );
}

function MediaTile({
  tile,
  scroll,
  reduce,
}: {
  tile: Tile;
  scroll: MotionValue<number>;
  reduce: boolean;
}) {
  const transform = useTransform(scroll, (p) => {
    const q = poseAt(p, tile.poses);
    return `translate3d(${q.x}px, ${q.y}px, ${q.z}px) scale(${q.s})`;
  });
  const opacity = useTransform(scroll, (p) => poseAt(p, tile.poses).o);
  const wash = useTransform(scroll, [0.48, 0.54, 0.68, 0.76, 1], [0, tile.semantic ? 0.55 : 0, tile.semantic ? 0.55 : 0, 0, 0]);
  const rest = tile.poses[0];

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
      {tile.semantic ? <motion.i className={`tl-vim-wash is-${tile.semantic}`} style={reduce ? { opacity: 0 } : { opacity: wash }} /> : null}
    </motion.div>
  );
}

function SemanticLabels({ scroll, reduce }: { scroll: MotionValue<number>; reduce: boolean }) {
  const opacity = useTransform(scroll, [0, 0.48, 0.54, 0.66, 0.74, 1], [0, 0, 1, 1, 0, 0]);

  return (
    <motion.div className="tl-vim-labels" style={reduce ? { opacity: 0 } : { opacity }}>
      {FEATURES.map((f) => (
        <span key={f.label} className={`tl-vim-label is-${f.semantic}`}>
          {f.label}
        </span>
      ))}
    </motion.div>
  );
}
