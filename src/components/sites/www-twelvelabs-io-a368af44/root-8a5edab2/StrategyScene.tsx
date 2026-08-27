"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const KAI = {
  dark: 0x08080d,
  purple: 0x9a5ca3,
  lavender: 0xd9b3e2,
  yellow: 0xf4c05f,
  gradLavender: 0xcac1cd,
  gradPink: 0xd5a6c8,
  white: 0xffffff,
} as const;

const NODE_TONES = [KAI.yellow, KAI.purple, KAI.gradPink, KAI.yellow, KAI.lavender] as const;
const POSE = { x: 0.19, y: 0.02, z: -0.67, rx: -1.87, ry: 0.02, rz: 0.55 };
const PW = 1.18;
const PH = 1.62;
const PR = 0.28;
const SPAN = 5.2;
const CAP_LEN = 2.15;

function roundShape(w: number, h: number, r: number) {
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
  return s;
}

function plateGeo(w: number, h: number, d: number, r: number) {
  const g = new THREE.ExtrudeGeometry(roundShape(w, h, r), {
    depth: d,
    bevelEnabled: false,
    curveSegments: 6,
  });
  g.translate(0, 0, -d / 2);
  g.rotateY(Math.PI / 2);
  return g;
}

function atX(x: number) {
  return {
    x,
    y: -0.06 * x,
    z: 0.42 * Math.sin(x * 0.55) - 0.18 * x,
  };
}

function railCurve(offY: number, offZ: number, n = 28) {
  const pts = Array.from({ length: n }, (_, i) => {
    const x = -SPAN / 2 + (SPAN * i) / (n - 1);
    const p = atX(x);
    return new THREE.Vector3(p.x, p.y + offY, p.z + offZ);
  });
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4);
}

function boot(host: HTMLDivElement, reduce: boolean) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(KAI.dark, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 40);
  camera.position.set(0.08, 1.35, 13);
  camera.lookAt(0.12, 0.02, 0);

  const root = new THREE.Group();
  root.position.set(POSE.x, POSE.y, POSE.z);
  root.rotation.set(POSE.rx, POSE.ry, POSE.rz);
  scene.add(root);

  const geos: THREE.BufferGeometry[] = [];
  const plate = plateGeo(PW, PH, 0.018, PR);
  geos.push(plate);
  const fillMid = new THREE.MeshBasicMaterial({
    color: KAI.white,
    transparent: true,
    opacity: 0.055,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const fillGhost = new THREE.MeshBasicMaterial({
    color: KAI.white,
    transparent: true,
    opacity: 0.018,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const edgeMid = new THREE.LineDashedMaterial({
    color: KAI.white,
    transparent: true,
    opacity: 0.52,
    dashSize: 0.07,
    gapSize: 0.055,
  });
  const edgeGhost = new THREE.LineDashedMaterial({
    color: KAI.white,
    transparent: true,
    opacity: 0.22,
    dashSize: 0.07,
    gapSize: 0.055,
  });

  const PLANE_N = 14;
  const planes = Array.from({ length: PLANE_N }, (_, i) => {
    const t = i / (PLANE_N - 1);
    const x = -SPAN / 2 + SPAN * t;
    const p = atX(x);
    const mid = Math.abs(x) < CAP_LEN / 2 + 0.08;
    const g = new THREE.Group();
    g.add(new THREE.Mesh(plate, mid ? fillMid : fillGhost));
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(plate), mid ? edgeMid : edgeGhost);
    edge.computeLineDistances();
    g.add(edge);
    g.position.set(p.x, p.y, p.z);
    g.userData = { t, x };
    g.scale.setScalar(mid ? 1 : 0.96);
    root.add(g);
    return g;
  });

  const capGeo = plateGeo(PW + 0.22, PH + 0.22, CAP_LEN, PR + 0.08);
  geos.push(capGeo);
  const cap = new THREE.Mesh(
    capGeo,
    new THREE.MeshBasicMaterial({
      color: KAI.gradLavender,
      transparent: true,
      opacity: 0.055,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  const capEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(capGeo),
    new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.92 }),
  );
  const capCore = new THREE.Group();
  capCore.add(cap, capEdge);
  const capP = atX(0);
  capCore.position.set(capP.x, capP.y, capP.z);
  root.add(capCore);

  const rails = [
    railCurve(PH / 2 + 0.06, 0.02),
    railCurve(-PH / 2 - 0.06, -0.02),
  ].map((curve) => {
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
    geos.push(g);
    const line = new THREE.Line(
      g,
      new THREE.LineDashedMaterial({
        color: KAI.gradLavender,
        transparent: true,
        opacity: 0.38,
        dashSize: 0.09,
        gapSize: 0.07,
      }),
    );
    line.computeLineDistances();
    root.add(line);
    return line;
  });

  const nodeN = 13;
  const hexGeo = new THREE.CylinderGeometry(0.062, 0.062, 0.048, 6);
  hexGeo.rotateZ(Math.PI / 2);
  geos.push(hexGeo);
  const hexes = new THREE.InstancedMesh(hexGeo, new THREE.MeshBasicMaterial(), nodeN);
  hexes.frustumCulled = false;
  hexes.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(nodeN * 3), 3);
  const color = new THREE.Color();
  const nodeSeed = [
    [-0.72, 0.42, 0.18],
    [-0.55, -0.28, -0.22],
    [-0.38, 0.08, 0.32],
    [-0.18, 0.48, -0.08],
    [-0.08, -0.38, 0.16],
    [0.06, 0.22, -0.28],
    [0.16, -0.12, 0.34],
    [0.28, 0.46, 0.1],
    [0.42, -0.42, -0.14],
    [0.58, 0.12, 0.24],
    [0.68, -0.22, -0.3],
    [0.78, 0.38, 0.06],
    [0.9, -0.08, 0.2],
  ].map((slot, i) => {
    color.setHex(NODE_TONES[i % NODE_TONES.length]);
    hexes.setColorAt(i, color);
    return { x: slot[0], y: slot[1], z: slot[2], spin: 0.25 + (i % 5) * 0.12, phase: i * 0.47 };
  });
  hexes.instanceColor.needsUpdate = true;
  root.add(hexes);

  const dummy = new THREE.Object3D();
  const dashMats = [edgeMid, edgeGhost, ...(rails.map((l) => l.material) as THREE.LineDashedMaterial[])];

  const layout = () => {
    const w = Math.max(host.clientWidth, 1);
    const h = Math.max(host.clientHeight, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const view = 2.72;
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

    root.position.set(POSE.x, POSE.y + (reduce ? 0 : Math.sin(t * 0.42) * 0.035), POSE.z);
    root.rotation.set(POSE.rx, POSE.ry, POSE.rz);
    capCore.scale.setScalar(1 + Math.sin(t * 0.55) * 0.008);

    planes.forEach((g) => {
      const breathe = Math.sin(t * 0.5 + g.userData.t * 2.2) * 0.018;
      const p = atX(g.userData.x);
      g.position.set(p.x, p.y + breathe, p.z);
    });

    nodeSeed.forEach((n, i) => {
      const drift = ((t * 0.11 + n.phase) % 1) * 0.16 - 0.08;
      const pulse = 0.88 + Math.sin(t * 1.6 + n.phase) * 0.12;
      dummy.position.set(n.x + drift, n.y + Math.sin(t * 0.7 + n.phase) * 0.03, n.z);
      dummy.rotation.set(0.2, t * n.spin, 0.15);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      hexes.setMatrixAt(i, dummy.matrix);
    });
    hexes.instanceMatrix.needsUpdate = true;

    dashMats.forEach((m, i) => {
      m.scale = 1 + Math.sin(t * 0.35 + i) * 0.08;
    });

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
    geos.forEach((g) => g.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}

const NOTES = [
  {
    k: "speed",
    label: "CHANNEL MIX",
    body: "Search, Display, Demand Gen, and Performance Max weighted in one split.",
  },
  {
    k: "scale",
    label: "BUDGET",
    body: "Allocation mapped from the research, written before anyone bids.",
  },
  {
    k: "prop",
    label: "BIDS",
    body: "Match types and bid floors per ad group, not one number for all.",
  },
] as const;

export function StrategyScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return boot(host, reduce);
  }, []);

  return (
    <div className="tl-pipe tl-strat">
      <div ref={ref} className="tl-pipe-stage" aria-hidden />
      <p className="tl-pipe-title">Campaign Strategy Agent</p>
      {NOTES.map((n) => (
        <p key={n.k} className={`tl-pipe-note tl-pipe-note-${n.k}`}>
          <span>{n.label}</span>
          {n.body}
        </p>
      ))}
    </div>
  );
}
