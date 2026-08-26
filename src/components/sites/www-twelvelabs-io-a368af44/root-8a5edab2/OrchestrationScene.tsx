"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const KAI = {
  dark: 0x08080d,
  darkSurface: 0x14111c,
  purple: 0x9a5ca3,
  lavender: 0xd9b3e2,
  yellow: 0xf4c05f,
  gradLavender: 0xcac1cd,
  gradPink: 0xd5a6c8,
  white: 0xffffff,
} as const;

const CUBE_TONES = [KAI.yellow, KAI.yellow, KAI.yellow, KAI.yellow, KAI.lavender, KAI.gradPink] as const;
const HEX_TONES = [KAI.gradLavender, KAI.purple, KAI.lavender, KAI.gradPink] as const;
const R = 1.22;
const R_IN = 0.9;
const LEN = 1.95;

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

function boot(host: HTMLDivElement, reduce: boolean) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(KAI.dark, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 40);
  camera.position.set(0.1, 0.12, 12);
  camera.lookAt(0, 0, 0);

  const root = new THREE.Group();
  root.rotation.set(0.24, -0.72, 0.58);
  scene.add(root);

  const cylGeo = new THREE.CylinderGeometry(R, R, LEN, 16, 4, true);
  cylGeo.rotateZ(Math.PI / 2);
  const innerGeo = new THREE.CylinderGeometry(R_IN, R_IN, LEN, 16, 4, true);
  innerGeo.rotateZ(Math.PI / 2);

  const body = new THREE.Mesh(
    cylGeo,
    new THREE.MeshBasicMaterial({
      color: KAI.darkSurface,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const mesh = new THREE.LineSegments(
    new THREE.WireframeGeometry(cylGeo),
    new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.7 }),
  );
  const inner = new THREE.LineSegments(
    new THREE.WireframeGeometry(innerGeo),
    new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.22 }),
  );
  root.add(body, mesh, inner);

  const ringGeo = new THREE.EdgesGeometry(new THREE.RingGeometry(R_IN, R, 28));
  const ringMat = new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.78 });
  const mouth = new THREE.LineSegments(ringGeo, ringMat);
  mouth.rotation.y = Math.PI / 2;
  mouth.position.x = -LEN / 2;
  const exit = mouth.clone();
  exit.position.x = LEN / 2;
  root.add(mouth, exit);

  const cubeN = 160;
  const cubeGeo = new THREE.BoxGeometry(0.11, 0.11, 0.11);
  const cubes = new THREE.InstancedMesh(
    cubeGeo,
    new THREE.MeshBasicMaterial(),
    cubeN,
  );
  cubes.frustumCulled = false;
  cubes.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cubeN * 3), 3);
  const cubeSeed = Array.from({ length: cubeN }, () => ({
    a: Math.random() * Math.PI * 2,
    r: 0.1 + Math.random() * (R_IN - 0.18),
    x: (Math.random() - 0.5) * LEN * 0.86,
    s: 0.7 + Math.random() * 0.7,
    spin: 0.4 + Math.random() * 1.2,
  }));
  const color = new THREE.Color();
  cubeSeed.forEach((_, i) => {
    color.setHex(CUBE_TONES[i % CUBE_TONES.length]);
    cubes.setColorAt(i, color);
  });
  cubes.instanceColor.needsUpdate = true;
  root.add(cubes);

  const slabN = 6;
  const slabGeo = roundSlab(0.62, 0.82, 0.13, 0.16);
  const slabFill = new THREE.MeshBasicMaterial({
    color: KAI.darkSurface,
    transparent: true,
    opacity: 0.72,
  });
  const slabEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(slabGeo),
    new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.62 }),
  );
  const slabs = Array.from({ length: slabN }, (_, i) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(slabGeo, slabFill), slabEdge.clone());
    g.userData.phase = i / slabN;
    root.add(g);
    return g;
  });

  const hexN = 54;
  const hexGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.032, 6);
  hexGeo.rotateX(Math.PI / 2);
  const hexes = new THREE.InstancedMesh(
    hexGeo,
    new THREE.MeshBasicMaterial(),
    hexN,
  );
  hexes.frustumCulled = false;
  hexes.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(hexN * 3), 3);
  const hexSeed = Array.from({ length: hexN }, (_, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6) % 9;
    color.setHex(HEX_TONES[col % HEX_TONES.length]);
    hexes.setColorAt(i, color);
    return { col, row, t: Math.random() };
  });
  hexes.instanceColor.needsUpdate = true;
  root.add(hexes);

  const dummy = new THREE.Object3D();

  const layout = () => {
    const w = Math.max(host.clientWidth, 1);
    const h = Math.max(host.clientHeight, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const view = 2.55;
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
    mesh.rotation.x = t * 0.35;
    inner.rotation.x = t * 0.35;
    body.rotation.x = t * 0.35;

    cubeSeed.forEach((c, i) => {
      const ang = c.a + t * 0.55;
      const x = ((c.x + t * 0.42 + LEN / 2) % LEN) - LEN / 2;
      dummy.position.set(x, Math.cos(ang) * c.r, Math.sin(ang) * c.r);
      dummy.rotation.set(t * c.spin, t * c.spin * 0.7, t * 0.3);
      dummy.scale.setScalar(c.s);
      dummy.updateMatrix();
      cubes.setMatrixAt(i, dummy.matrix);
    });
    cubes.instanceMatrix.needsUpdate = true;

    slabs.forEach((g) => {
      const p = ((t * 0.18 + g.userData.phase) % 1 + 1) % 1;
      const x = -LEN / 2 - 1.42 + p * 1.28;
      g.position.set(x, 0, 0);
      g.rotation.y = 0.04;
      const fade = p < 0.08 ? p / 0.08 : p > 0.88 ? (1 - p) / 0.12 : 1;
      g.scale.setScalar(0.92 + fade * 0.08);
      g.visible = fade > 0.04;
    });

    hexSeed.forEach((h, i) => {
      const p = ((t * 0.16 + h.t) % 1 + 1) % 1;
      dummy.position.set(
        LEN / 2 + 0.1 + p * 0.92,
        (h.row - 4) * 0.108,
        (h.col - 2.5) * 0.12,
      );
      dummy.rotation.set(0.12, 0.18, 0);
      dummy.scale.setScalar(0.85 + p * 0.2);
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
    innerGeo.dispose();
    cubeGeo.dispose();
    slabGeo.dispose();
    hexGeo.dispose();
    ringGeo.dispose();
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
