"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const CUBES = [
  { x: -2.15, y: 0.85, z: 0.35, a: "#d3a7d9", b: "#8b5cf6" },
  { x: -1.95, y: -0.9, z: 0.25, a: "#f4b4d4", b: "#bf8080" },
  { x: 2.1, y: 0.7, z: 0.45, a: "#f2c07a", b: "#f59e0b" },
  { x: 2.0, y: -0.75, z: 0.2, a: "#f0b070", b: "#ea7a3a" },
] as const;

function gradTex(a: string, b: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const lg = g.createLinearGradient(0, 0, 64, 64);
  lg.addColorStop(0, a);
  lg.addColorStop(1, b);
  g.fillStyle = lg;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function dotTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, "rgba(255,255,255,1)");
  rg.addColorStop(0.35, "rgba(255,230,250,0.7)");
  rg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = rg;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function petalTex() {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const cx = s / 2;
  const cy = s / 2;
  const glow = g.createRadialGradient(cx, cy, 4, cx, cy, 90);
  glow.addColorStop(0, "rgba(255,190,230,0.95)");
  glow.addColorStop(1, "rgba(180,70,180,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, s, s);
  for (let i = 0; i < 4; i++) {
    g.save();
    g.translate(cx, cy);
    g.rotate((i * Math.PI) / 2 + Math.PI / 4);
    const lg = g.createLinearGradient(0, -74, 0, 12);
    lg.addColorStop(0, "#f6c4dc");
    lg.addColorStop(0.45, "#e070b0");
    lg.addColorStop(1, "#8b4fc0");
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(0, 8);
    g.bezierCurveTo(28, -8, 24, -54, 0, -74);
    g.bezierCurveTo(-24, -54, -28, -8, 0, 8);
    g.fill();
    g.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function boot(host: HTMLDivElement, reduce: boolean) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x0c0b10, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0c0b10, 0.045);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.set(0, 0.08, 6.1);

  scene.add(new THREE.AmbientLight(0xded0f2, 0.35));
  scene.add(new THREE.HemisphereLight(0xf4b4d4, 0x1a1220, 0.45));
  const core = new THREE.PointLight(0xec8ec8, 4.2, 8, 2);
  scene.add(core);
  const left = new THREE.PointLight(0xb48ad4, 2.2, 7, 2);
  left.position.set(-2.2, 0.4, 1.2);
  scene.add(left);
  const right = new THREE.PointLight(0xf2af5c, 2.2, 7, 2);
  right.position.set(2.2, -0.2, 1.2);
  scene.add(right);

  const root = new THREE.Group();
  scene.add(root);

  const ico = new THREE.IcosahedronGeometry(1.58, 2);
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(ico),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 }),
  );
  const dots = new THREE.Points(
    ico,
    new THREE.PointsMaterial({
      map: dotTex(),
      size: 0.07,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    }),
  );
  const hull = new THREE.Mesh(
    ico,
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.03, side: THREE.DoubleSide }),
  );
  root.add(hull, wire, dots);

  const inner = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.02, 1)),
    new THREE.LineBasicMaterial({ color: 0xe8c4f0, transparent: true, opacity: 0.12 }),
  );
  root.add(inner);

  const logoMap = petalTex();
  const logo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: logoMap, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  logo.scale.set(0.78, 0.78, 1);
  scene.add(logo);

  const dustGeo = new THREE.BufferGeometry();
  const dustN = 180;
  const dustPos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    const r = 1.2 + Math.random() * 2.8;
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(2 * Math.random() - 1);
    dustPos[i * 3] = r * Math.sin(v) * Math.cos(u);
    dustPos[i * 3 + 1] = r * Math.sin(v) * Math.sin(u);
    dustPos[i * 3 + 2] = r * Math.cos(v);
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      map: dotTex(),
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(dust);

  const cubeGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
  const cubes = CUBES.map((c) => {
    const map = gradTex(c.a, c.b);
    const mesh = new THREE.Mesh(
      cubeGeo,
      new THREE.MeshStandardMaterial({
        map,
        roughness: 0.32,
        metalness: 0.18,
        emissive: new THREE.Color(c.b),
        emissiveIntensity: 0.28,
      }),
    );
    mesh.position.set(c.x, c.y, c.z);
    mesh.rotation.set(0.4, 0.6, 0.2);
    scene.add(mesh);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), mesh.position]);
    const line = new THREE.Line(
      lineGeo,
      new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.09, gapSize: 0.07, transparent: true, opacity: 0.32 }),
    );
    line.computeLineDistances();
    scene.add(line);
    return { mesh, home: new THREE.Vector3(c.x, c.y, c.z), line };
  });

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.42, 0.18);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const timer = new THREE.Timer();
  timer.connect(document);

  let mx = 0;
  let my = 0;
  let live = true;
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    my = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  host.addEventListener("pointermove", onMove);
  const io = new IntersectionObserver(([e]) => {
    live = e.isIntersecting;
  });
  io.observe(host);

  const layout = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  layout();
  const ro = new ResizeObserver(layout);
  ro.observe(host);

  renderer.setAnimationLoop(() => {
    if (!live) return;
    timer.update();
    const t = reduce ? 0 : timer.getElapsed();
    root.rotation.y = t * 0.12;
    inner.rotation.y = -t * 0.18;
    dust.rotation.y = t * 0.04;
    logo.scale.setScalar(0.74 + Math.sin(t * 1.6) * 0.04);
    cubes.forEach((c, i) => {
      const bob = reduce ? 0 : Math.sin(t * 1.1 + i * 1.4) * 0.12;
      c.mesh.position.set(c.home.x, c.home.y + bob, c.home.z);
      c.mesh.rotation.x = 0.4 + t * 0.25;
      c.mesh.rotation.y = 0.6 + t * 0.32;
      const pos = c.line.geometry.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(1, c.mesh.position.x, c.mesh.position.y, c.mesh.position.z);
      pos.needsUpdate = true;
      c.line.computeLineDistances();
    });
    camera.position.x += (mx * 0.32 - camera.position.x) * 0.05;
    camera.position.y += (0.08 + my * 0.18 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    composer.render();
  });

  return () => {
    renderer.setAnimationLoop(null);
    host.removeEventListener("pointermove", onMove);
    io.disconnect();
    ro.disconnect();
    composer.dispose();
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mats = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
      mats.forEach((m) => {
        const rec = m as unknown as Record<string, { dispose?: () => void }>;
        Object.values(rec).forEach((v) => v?.dispose?.());
        m.dispose();
      });
    });
    ico.dispose();
    cubeGeo.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

export function OrchestrationScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return boot(host, reduce);
  }, []);

  return <div ref={ref} className="tl-orch-scene" aria-hidden />;
}
