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
const TONES = [KAI.yellow, KAI.lavender, KAI.pink, KAI.white, KAI.purple] as const;
const N = 52;

function merge(side: number, lift: number) {
  return new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-2.5, lift + side * 0.62, side * 0.82),
      new THREE.Vector3(-1.15, lift + side * 0.28, side * 0.34),
      new THREE.Vector3(0.05, lift, 0.02),
      new THREE.Vector3(1.15, lift - side * 0.06, -side * 0.1),
      new THREE.Vector3(2.45, lift - side * 0.22, side * 0.18),
    ],
    false,
    "catmullrom",
    0.4,
  );
}

function boot(host: HTMLDivElement, reduce: boolean) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(KAI.dark, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 40);
  camera.position.set(1.7, 2.5, 3.3);
  camera.lookAt(0.04, 0.02, 0);

  const rails = [merge(0.92, 0.18), merge(0, 0.02), merge(-0.88, -0.16)];
  const pathMat = new THREE.LineBasicMaterial({ color: KAI.yellow, transparent: true, opacity: 0.42 });
  const pathGeos = rails.map((curve) => {
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
    scene.add(new THREE.Line(g, pathMat));
    return g;
  });

  const ringGeo = new THREE.TorusGeometry(0.24, 0.007, 8, 48);
  const ring = new THREE.Mesh(
    ringGeo,
    new THREE.MeshBasicMaterial({ color: KAI.yellow, transparent: true, opacity: 0.78 }),
  );
  ring.rotation.x = Math.PI / 2.4;
  ring.rotation.z = 0.18;
  scene.add(ring);

  const gateGeo = new THREE.TorusGeometry(0.38, 0.005, 6, 48);
  const gate = new THREE.Mesh(
    gateGeo,
    new THREE.MeshBasicMaterial({ color: KAI.lavender, transparent: true, opacity: 0.4 }),
  );
  gate.rotation.copy(ring.rotation);
  scene.add(gate);

  const geo = new THREE.CapsuleGeometry(0.034, 0.18, 4, 8);
  geo.rotateZ(Math.PI / 2);
  const mesh = new THREE.InstancedMesh(
    geo,
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.72, depthWrite: false }),
    N,
  );
  mesh.frustumCulled = false;
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);

  const color = new THREE.Color();
  const seed = Array.from({ length: N }, (_, i) => {
    color.setHex(TONES[i % TONES.length]);
    mesh.setColorAt(i, color);
    return { rail: i % 3, t: (i / N) * 0.94, s: 0.72 + (i % 4) * 0.16 };
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
    const view = 1.68;
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
    ring.rotation.z = 0.18 + t * 0.12;
    gate.rotation.z = 0.18 - t * 0.08;
    seed.forEach((s, i) => {
      const u = ((s.t + t * 0.03) % 1 + 1) % 1;
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
    ringGeo.dispose();
    gateGeo.dispose();
    pathGeos.forEach((g) => g.dispose());
    pathMat.dispose();
    (mesh.material as THREE.Material).dispose();
    (ring.material as THREE.Material).dispose();
    (gate.material as THREE.Material).dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

const NOTES = [
  {
    k: "speed",
    label: "TEST QUEUE",
    body: "Experiments lined up before a pound moves.",
  },
  {
    k: "mid",
    label: "BUDGET SHIFTS",
    body: "Spend moves only after the test has a result.",
  },
  {
    k: "scale",
    label: "CAMPAIGN FIXES",
    body: "Broken ads and keywords queued beside the shift, not after it.",
  },
  {
    k: "prop",
    label: "APPROVAL",
    body: "Apply, Reject, or Skip on Drift. You pick. Then it moves.",
  },
] as const;

export function OptimizationScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return boot(host, reduce);
  }, []);

  return (
    <div className="tl-pipe tl-opt">
      <div ref={ref} className="tl-pipe-stage" aria-hidden />
      <p className="tl-pipe-title">Optimization Agent</p>
      {NOTES.map((n) => (
        <p key={n.k} className={`tl-pipe-note tl-pipe-note-${n.k}`}>
          <span>{n.label}</span>
          {n.body}
        </p>
      ))}
    </div>
  );
}
