"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const KAI = {
  dark: 0x08080d,
  yellow: 0xf4c05f,
  lavender: 0xd9b3e2,
  purple: 0x9a5ca3,
  pink: 0xd5a6c8,
  white: 0xffffff,
} as const;
const TONES = [KAI.lavender, KAI.purple, KAI.pink, KAI.white, KAI.yellow] as const;
const N = 48;

function strand(offY: number, offZ: number, twist: number) {
  const pts = Array.from({ length: 18 }, (_, i) => {
    const t = i / 17;
    const x = -2.4 + t * 4.8;
    return new THREE.Vector3(x, offY + Math.sin(t * Math.PI * 2 + twist) * 0.42, offZ + Math.cos(t * Math.PI * 1.6 + twist) * 0.55);
  });
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.35);
}

function boot(host: HTMLDivElement, reduce: boolean) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(KAI.dark, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 40);
  camera.position.set(1.8, 2.4, 3.4);
  camera.lookAt(0, 0.02, 0);

  const rails = [strand(0.28, 0.12, 0), strand(-0.06, -0.18, 1.2), strand(-0.34, 0.22, 2.1)];
  const pathMat = new THREE.LineBasicMaterial({ color: KAI.lavender, transparent: true, opacity: 0.24 });
  const pathGeos = rails.map((curve) => {
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
    scene.add(new THREE.Line(g, pathMat));
    return g;
  });

  const geo = new THREE.CapsuleGeometry(0.028, 0.16, 4, 8);
  geo.rotateZ(Math.PI / 2);
  const mesh = new THREE.InstancedMesh(
    geo,
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.46, depthWrite: false }),
    N,
  );
  mesh.frustumCulled = false;
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);

  const color = new THREE.Color();
  const seed = Array.from({ length: N }, (_, i) => {
    color.setHex(TONES[i % TONES.length]);
    mesh.setColorAt(i, color);
    return { rail: i % 3, t: (i / N) * 0.94, s: 0.75 + (i % 4) * 0.16 };
  });
  mesh.instanceColor.needsUpdate = true;
  scene.add(mesh);

  const dummy = new THREE.Object3D();
  const tangent = new THREE.Vector3();
  const look = new THREE.Vector3();

  const layout = () => {
    const w = Math.max(host.clientWidth, 1);
    const h = Math.max(host.clientHeight, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const view = 1.7;
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
    seed.forEach((s, i) => {
      const u = ((s.t + t * 0.032) % 1 + 1) % 1;
      const curve = rails[s.rail];
      const p = curve.getPointAt(u);
      curve.getTangentAt(u, tangent);
      dummy.position.copy(p);
      look.copy(p).add(tangent);
      dummy.lookAt(look);
      dummy.rotateY(Math.PI / 2);
      dummy.scale.setScalar(s.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    geo.dispose();
    pathGeos.forEach((g) => g.dispose());
    pathMat.dispose();
    (mesh.material as THREE.Material).dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return boot(host, reduce);
  }, []);

  return (
    <div className="tl-pipe tl-search">
      <div ref={ref} className="tl-pipe-stage" aria-hidden />
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
