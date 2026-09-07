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
const TONES = [KAI.yellow, KAI.pink, KAI.lavender, KAI.yellow, KAI.purple, KAI.white] as const;
const N = 18;

function rail(y: number, z: number) {
  return new THREE.CatmullRomCurve3(
    [-2.8, -1.5, -0.2, 1.1, 2.5].map((x) => new THREE.Vector3(x, y + x * 0.18, z - x * 0.52)),
    false,
    "catmullrom",
    0.28,
  );
}

function pillGeo() {
  const w = 0.62;
  const h = 0.15;
  const r = 0.074;
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
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.055,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
    curveSegments: 6,
  });
  g.center();
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
  camera.position.set(2.4, 2.8, 3.1);
  camera.lookAt(0.05, 0.04, 0);

  const rails = [rail(0.38, 0.22), rail(0.0, -0.06), rail(-0.38, -0.34)];
  const pathMat = new THREE.LineBasicMaterial({ color: KAI.white, transparent: true, opacity: 0.22 });
  const pathGeos = rails.map((curve) => {
    const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
    scene.add(new THREE.Line(g, pathMat));
    return g;
  });

  const geo = pillGeo();
  const glassMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.13,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const rimMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const rim = new THREE.InstancedMesh(geo, rimMat, N);
  const glass = new THREE.InstancedMesh(geo, glassMat, N);
  rim.frustumCulled = false;
  glass.frustumCulled = false;
  rim.renderOrder = 0;
  glass.renderOrder = 1;
  rim.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
  glass.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);

  const color = new THREE.Color();
  const wash = new THREE.Color();
  const seed = Array.from({ length: N }, (_, i) => {
    color.setHex(TONES[i % TONES.length]);
    rim.setColorAt(i, color);
    wash.copy(color).lerp(new THREE.Color(0xffffff), 0.62);
    glass.setColorAt(i, wash);
    return {
      rail: i % 3,
      t: (i / N) * 0.9,
      len: 0.72 + (i % 5) * 0.22,
      thick: 0.82 + (i % 3) * 0.1,
    };
  });
  rim.instanceColor.needsUpdate = true;
  glass.instanceColor.needsUpdate = true;
  scene.add(rim);
  scene.add(glass);

  const dummy = new THREE.Object3D();
  const tangent = new THREE.Vector3();
  const look = new THREE.Vector3();

  const layout = () => {
    const w = Math.max(host.clientWidth, 1);
    const h = Math.max(host.clientHeight, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    const view = 1.62;
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
      glass.setMatrixAt(i, dummy.matrix);
      dummy.scale.set(s.len * 1.055, s.thick * 1.14, s.thick * 1.1);
      dummy.updateMatrix();
      rim.setMatrixAt(i, dummy.matrix);
    });
    glass.instanceMatrix.needsUpdate = true;
    rim.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    geo.dispose();
    pathGeos.forEach((g) => g.dispose());
    pathMat.dispose();
    glassMat.dispose();
    rimMat.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return boot(host, reduce);
  }, []);

  return (
    <div className="tl-pipe tl-gen">
      <div ref={ref} className="tl-pipe-stage" aria-hidden />
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
