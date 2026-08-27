"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const KAI = {
  dark: 0x08080d,
  shell: 0x0c0b11,
  deck: 0x0a090e,
  purple: 0x9a5ca3,
  lavender: 0xd9b3e2,
  yellow: 0xf4c05f,
  gradLavender: 0xcac1cd,
  gradPink: 0xd5a6c8,
  white: 0xffffff,
} as const;

const CUBE_TONES = [KAI.yellow, KAI.yellow, KAI.white, KAI.lavender] as const;
const HEX_TONES = [KAI.yellow, KAI.gradPink, KAI.lavender, KAI.purple, KAI.gradLavender] as const;
const R = 1.12;
const LEN = 2.1;
const DECK_Y = -0.18;
const IN_START = -LEN / 2 - 1.72;
const IN_END = -LEN / 2 + 0.08;
const OUT_START = LEN / 2 - 0.04;
const OUT_END = LEN / 2 + 1.55;

function roundSlab(w: number, h: number, d: number, r: number) {
  const s = new THREE.Shape();
  const x = w / 2;
  const y = h / 2;
  s.moveTo(-x + r, -y);
  s.lineTo(x - r, -y);
  s.quadraticCurveTo(x, -y, x, -y + r);
  s.lineTo(x, y - r);
  s.quadraticCurveTo(x, y, x - r, y);
  s.lineTo(-x + r, y);
  s.quadraticCurveTo(-x, y, -x, y - r);
  s.lineTo(-x, -y + r);
  s.quadraticCurveTo(-x, -y, -x + r, -y);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 5 });
  g.translate(0, 0, -d / 2);
  return g;
}

function cylGrid(r: number, len: number, rings: number, meridians: number) {
  const pts: number[] = [];
  for (let i = 0; i <= rings; i++) {
    const x = -len / 2 + (len * i) / rings;
    for (let j = 0; j < meridians; j++) {
      const a0 = (j / meridians) * Math.PI * 2;
      const a1 = ((j + 1) / meridians) * Math.PI * 2;
      pts.push(x, Math.cos(a0) * r, Math.sin(a0) * r, x, Math.cos(a1) * r, Math.sin(a1) * r);
    }
  }
  for (let j = 0; j < meridians; j++) {
    const a = (j / meridians) * Math.PI * 2;
    const y = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    pts.push(-len / 2, y, z, len / 2, y, z);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

function boot(host: HTMLDivElement, reduce: boolean) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(KAI.dark, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 40);
  camera.position.set(-0.2, 0.28, 12);
  camera.lookAt(0.12, 0.04, 0);

  const root = new THREE.Group();
  root.rotation.set(0.32, 0.78, 0.5);
  scene.add(root);

  const cylGeo = new THREE.CylinderGeometry(R, R, LEN, 28, 1, true);
  cylGeo.rotateZ(Math.PI / 2);
  const shell = new THREE.Mesh(
    cylGeo,
    new THREE.MeshBasicMaterial({ color: KAI.shell, side: THREE.FrontSide }),
  );
  const gridGeo = cylGrid(R + 0.004, LEN, 5, 14);
  const grid = new THREE.LineSegments(
    gridGeo,
    new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.82 }),
  );
  root.add(shell, grid);

  const ringGeo = new THREE.EdgesGeometry(new THREE.RingGeometry(R - 0.03, R, 32));
  const ringMat = new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.88 });
  const mouth = new THREE.LineSegments(ringGeo, ringMat);
  mouth.rotation.y = Math.PI / 2;
  mouth.position.x = -LEN / 2;
  const exit = mouth.clone();
  exit.position.x = LEN / 2;
  root.add(mouth, exit);

  const deckGeo = new THREE.BoxGeometry(LEN + 3.45, 0.032, 0.74);
  const deck = new THREE.Mesh(deckGeo, new THREE.MeshBasicMaterial({ color: KAI.deck }));
  deck.position.set(0.08, DECK_Y, 0);
  const deckEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(deckGeo),
    new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.32 }),
  );
  deckEdge.position.copy(deck.position);
  root.add(deck, deckEdge);

  const frameGeos: THREE.BufferGeometry[] = [];
  const frameEdge = new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.5 });
  for (let i = 0; i < 5; i++) {
    const s = 1 - i * 0.07;
    const geo = roundSlab(0.58 * s, 0.78 * s, 0.03, 0.14 * s);
    frameGeos.push(geo);
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(geo), frameEdge);
    frame.position.set(IN_START + 0.18 + i * 0.26, DECK_Y + 0.4 * s, 0);
    frame.rotation.y = 0.03;
    root.add(frame);
  }

  const cubeN = 42;
  const cubeGeo = new THREE.BoxGeometry(0.042, 0.042, 0.042);
  const cubes = new THREE.InstancedMesh(cubeGeo, new THREE.MeshBasicMaterial(), cubeN);
  cubes.frustumCulled = false;
  cubes.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cubeN * 3), 3);
  const cubeSeed = Array.from({ length: cubeN }, () => ({
    a: Math.random() * Math.PI * 2,
    r: 0.08 + Math.random() * 0.42,
    x: (Math.random() - 0.5) * LEN * 0.62,
    s: 0.7 + Math.random() * 0.45,
    spin: 0.3 + Math.random() * 0.8,
  }));
  const color = new THREE.Color();
  cubeSeed.forEach((_, i) => {
    color.setHex(CUBE_TONES[i % CUBE_TONES.length]);
    cubes.setColorAt(i, color);
  });
  cubes.instanceColor.needsUpdate = true;
  root.add(cubes);

  const slabN = 5;
  const slabGeo = roundSlab(0.56, 0.74, 0.11, 0.15);
  const slabFill = new THREE.MeshBasicMaterial({ color: KAI.shell, transparent: true, opacity: 0.86 });
  const slabEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(slabGeo),
    new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.7 }),
  );
  const slabs = Array.from({ length: slabN }, (_, i) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(slabGeo, slabFill), slabEdge.clone());
    g.userData.phase = i / slabN;
    g.position.y = DECK_Y + 0.4;
    root.add(g);
    return g;
  });

  const hexN = 28;
  const hexGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.02, 6);
  hexGeo.rotateX(Math.PI / 2);
  const hexes = new THREE.InstancedMesh(hexGeo, new THREE.MeshBasicMaterial(), hexN);
  hexes.frustumCulled = false;
  hexes.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(hexN * 3), 3);
  const hexSeed = Array.from({ length: hexN }, (_, i) => {
    const col = i % 7;
    const row = Math.floor(i / 7);
    color.setHex(HEX_TONES[col % HEX_TONES.length]);
    hexes.setColorAt(i, color);
    return { col, row, t: (i % 7) / 7 + row * 0.08 };
  });
  hexes.instanceColor.needsUpdate = true;
  root.add(hexes);

  const dummy = new THREE.Object3D();

  const layout = () => {
    const w = Math.max(host.clientWidth, 1);
    const h = Math.max(host.clientHeight, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const view = 2.48;
    const aspect = w / h;
    camera.left = -view * aspect;
    camera.right = view * aspect;
    camera.top = view;
    camera.bottom = -view;
    camera.updateProjectionMatrix();
  };
  layout();

  const timer = new THREE.Timer();
  timer.connect(document);
  const ro = new ResizeObserver(layout);
  ro.observe(host);

  renderer.setAnimationLoop(() => {
    timer.update();
    const t = reduce ? 0 : timer.getElapsed();

    cubeSeed.forEach((c, i) => {
      const ang = c.a + t * 0.38;
      dummy.position.set(c.x, DECK_Y + 0.38 + Math.cos(ang) * c.r, Math.sin(ang) * c.r);
      dummy.rotation.set(t * c.spin, t * c.spin * 0.6, t * 0.22);
      dummy.scale.setScalar(c.s);
      dummy.updateMatrix();
      cubes.setMatrixAt(i, dummy.matrix);
    });
    cubes.instanceMatrix.needsUpdate = true;

    slabs.forEach((g) => {
      const p = ((t * 0.14 + g.userData.phase) % 1 + 1) % 1;
      g.position.x = IN_START + p * (IN_END - IN_START);
      g.rotation.set(0, 0.03, 0);
      const fade = p < 0.06 ? p / 0.06 : p > 0.9 ? (1 - p) / 0.1 : 1;
      g.scale.setScalar(0.94 + fade * 0.06);
      g.visible = fade > 0.04;
    });

    hexSeed.forEach((h, i) => {
      const p = ((t * 0.13 + h.t) % 1 + 1) % 1;
      const stagger = ((h.col % 2) - 0.5) * 0.04;
      dummy.position.set(
        OUT_START + p * (OUT_END - OUT_START),
        DECK_Y + 0.2 + h.row * 0.092 + stagger,
        (h.col - 3) * 0.086,
      );
      dummy.rotation.set(0.1, 0.03, 0);
      dummy.scale.setScalar(0.92);
      dummy.updateMatrix();
      hexes.setMatrixAt(i, dummy.matrix);
    });
    hexes.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    scene.traverse((obj) => {
      const m = obj as THREE.Mesh;
      m.geometry?.dispose();
      const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
      mats.forEach((mat) => mat.dispose());
    });
    cylGeo.dispose();
    gridGeo.dispose();
    cubeGeo.dispose();
    slabGeo.dispose();
    hexGeo.dispose();
    ringGeo.dispose();
    deckGeo.dispose();
    frameGeos.forEach((g) => g.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}

const NOTES = [
  {
    k: "speed",
    label: "SPEED",
    body: "~60x real-time ratio: ~1 min to index 1H video; tracking to 100x ratio.",
  },
  {
    k: "scale",
    label: "SCALE",
    body: "10k+ hrs/day today; roadmap to 1M+ hrs/day.",
  },
  {
    k: "prop",
    label: "PROPRIETARY",
    body: "Patented end-to-end video processing + inference system.",
  },
] as const;

export function OrchestrationScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return boot(host, reduce);
  }, []);

  return (
    <div className="tl-pipe" aria-hidden>
      <div ref={ref} className="tl-pipe-stage" />
      <span className="tl-pipe-star" />
      {NOTES.map((n) => (
        <p key={n.k} className={`tl-pipe-note tl-pipe-note-${n.k}`}>
          <span>{n.label}</span>
          {n.body}
        </p>
      ))}
    </div>
  );
}
