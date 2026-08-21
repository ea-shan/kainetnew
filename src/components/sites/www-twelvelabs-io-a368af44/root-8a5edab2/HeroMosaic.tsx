"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GROUND = "#241833";
const WIDE = "(min-width: 1100px)";

const PARTICLE_VERT = /* glsl */ `
  attribute float aT;
  attribute float aY0;
  attribute float aZ0;
  attribute float aSeed;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uLeft;
  uniform float uRight;
  uniform vec2 uMouse;
  varying float vT;
  varying float vFlow;

  void main() {
    float k = pow(clamp(aT, 0.0, 1.0), 1.62);
    float spread = mix(1.12, 0.012, smoothstep(0.0, 1.0, k));
    float bow = sin(aT * 3.14159265) * aY0 * 0.16;
    vec3 p = vec3(mix(uLeft, uRight, aT), aY0 * spread + bow, aZ0 * spread * 0.4);
    p.xy += uMouse * (1.0 - aT) * 0.05;
    vT = aT;
    vFlow = fract(uTime * aSpeed + aSeed);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  varying float vT;
  varying float vFlow;

  void main() {
    vec3 tail = vec3(0.35, 0.42, 0.92);
    vec3 mid = vec3(0.72, 0.78, 1.0);
    vec3 head = vec3(1.0);
    vec3 col = mix(tail, mid, smoothstep(0.0, 0.55, vT));
    col = mix(col, head, smoothstep(0.62, 1.0, vT));
    float pulse = 0.5 + 0.5 * smoothstep(0.14, 0.0, abs(vT - vFlow));
    float fade = 0.28 + 0.72 * pow(vT, 0.8);
    gl_FragColor = vec4(col * pulse, fade);
  }
`;

const WAVE_VERT = /* glsl */ `
  attribute float aX;
  varying float vX;
  void main() {
    vX = aX;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const WAVE_FRAG = /* glsl */ `
  varying float vX;
  void main() {
    vec3 left = vec3(1.0);
    vec3 mid = vec3(0.494, 0.784, 0.910);
    vec3 right = vec3(0.239, 0.353, 0.620);
    vec3 col = mix(left, mid, smoothstep(0.08, 0.48, vX));
    col = mix(col, right, smoothstep(0.48, 0.95, vX));
    float fade = 1.0 - smoothstep(0.88, 1.0, vX);
    gl_FragColor = vec4(col * 1.45, fade);
  }
`;

type WaveLine = {
  line: number;
  freq: number;
  phase: number;
  amp: number;
};

type FieldApi = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
  timer: THREE.Timer;
  particles: THREE.LineSegments;
  wave: THREE.LineSegments;
  core: THREE.Mesh;
  glow: THREE.Mesh;
  partMat: THREE.ShaderMaterial;
  waveLines: WaveLine[];
  waveSegs: number;
  waveLeft: number;
  waveRight: number;
  mouse: THREE.Vector2;
  target: THREE.Vector2;
};

function makeParticles(): { mesh: THREE.LineSegments; material: THREE.ShaderMaterial } {
  const count = 720;
  const segs = 36;
  const pairs = count * (segs - 1);
  const pos = new Float32Array(pairs * 2 * 3);
  const aT = new Float32Array(pairs * 2);
  const aY0 = new Float32Array(pairs * 2);
  const aZ0 = new Float32Array(pairs * 2);
  const aSeed = new Float32Array(pairs * 2);
  const aSpeed = new Float32Array(pairs * 2);

  let w = 0;
  for (let i = 0; i < count; i++) {
    const seed = Math.random();
    const g = Math.pow(Math.random(), 0.48);
    const y0 = (Math.random() > 0.5 ? 1 : -1) * g * 1.22;
    const z0 = (Math.random() - 0.5) * 0.45;
    const speed = 0.08 + Math.random() * 0.16;
    for (let s = 0; s < segs - 1; s++) {
      for (const t of [s / (segs - 1), (s + 1) / (segs - 1)]) {
        aT[w] = t;
        aY0[w] = y0;
        aZ0[w] = z0;
        aSeed[w] = seed;
        aSpeed[w] = speed;
        w += 1;
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
  geo.setAttribute("aY0", new THREE.BufferAttribute(aY0, 1));
  geo.setAttribute("aZ0", new THREE.BufferAttribute(aZ0, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
  geo.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeed, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLeft: { value: -1.6 },
      uRight: { value: -0.02 },
      uMouse: { value: new THREE.Vector2() },
    },
    vertexShader: PARTICLE_VERT,
    fragmentShader: PARTICLE_FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const mesh = new THREE.LineSegments(geo, material);
  mesh.frustumCulled = false;
  return { mesh, material };
}

function makeWave(): {
  mesh: THREE.LineSegments;
  material: THREE.ShaderMaterial;
  lines: WaveLine[];
  segs: number;
} {
  const count = 12;
  const segs = 80;
  const pairs = count * (segs - 1);
  const pos = new Float32Array(pairs * 2 * 3);
  const aX = new Float32Array(pairs * 2);
  const lines: WaveLine[] = [];
  for (let i = 0; i < count; i++) {
    lines.push({
      line: i / (count - 1),
      freq: 6.6 + i * 0.32,
      phase: i * 0.38,
      amp: 0.78 + (i % 3) * 0.07,
    });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aX", new THREE.BufferAttribute(aX, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: WAVE_VERT,
    fragmentShader: WAVE_FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const mesh = new THREE.LineSegments(geo, material);
  mesh.frustumCulled = false;
  return { mesh, material, lines, segs };
}

function writeWave(
  mesh: THREE.LineSegments,
  lines: WaveLine[],
  segs: number,
  left: number,
  right: number,
  time: number,
) {
  const pos = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
  const aX = mesh.geometry.getAttribute("aX") as THREE.BufferAttribute;
  let w = 0;
  for (const spec of lines) {
    for (let s = 0; s < segs - 1; s++) {
      for (const t of [s / (segs - 1), (s + 1) / (segs - 1)]) {
        const env1 = Math.exp(-Math.pow((t - 0.4) / 0.26, 2));
        const env2 = 0.3 * Math.exp(-Math.pow((t - 0.76) / 0.15, 2));
        const open = t < 0.09 ? t / 0.09 : t > 0.92 ? Math.max(0, 1 - (t - 0.92) / 0.08) : 1;
        const env = (env1 + env2) * open;
        const osc =
          Math.sin(t * spec.freq - time * 1.22 + spec.phase) * 0.065 +
          Math.sin(t * spec.freq * 1.85 + time * 0.68 + spec.phase * 1.25) * 0.022;
        const y = (spec.line - 0.5) * spec.amp * env * 1.25 + osc * env;
        pos.setXYZ(w, left + (right - left) * t, y, (spec.line - 0.5) * 0.035);
        aX.setX(w, t);
        w += 1;
      }
    }
  }
  pos.needsUpdate = true;
  aX.needsUpdate = true;
}

function makeGlow(): THREE.Mesh {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uAspect: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      uniform float uAspect;
      void main() {
        vec2 p = (vUv * 2.0 - 1.0) * vec2(uAspect, 1.0);
        float d = length(p * vec2(0.72, 1.15));
        float a = smoothstep(1.35, 0.12, d) * 0.32;
        gl_FragColor = vec4(0.498, 0.482, 0.757, a);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), material);
  mesh.position.z = -1;
  return mesh;
}

function makeCore(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(0.045, 24, 16);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, 0, 0.2);
  return mesh;
}

function layout(api: FieldApi, wide: boolean) {
  const { renderer, camera, particles, core, glow, partMat } = api;
  const el = renderer.domElement;
  const w = el.clientWidth || 1;
  const h = el.clientHeight || 1;
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);

  const aspect = w / h;
  camera.left = -aspect;
  camera.right = aspect;
  camera.top = 1;
  camera.bottom = -1;
  camera.updateProjectionMatrix();

  const gap = Math.min(0.028, 16 / w);
  const glowMat = glow.material as THREE.ShaderMaterial;
  if (glowMat.uniforms.uAspect) glowMat.uniforms.uAspect.value = aspect;
  partMat.uniforms.uLeft.value = -aspect;
  partMat.uniforms.uRight.value = -gap;
  if (wide) {
    api.waveLeft = gap;
    api.waveRight = aspect;
    particles.visible = true;
    core.visible = true;
  } else {
    api.waveLeft = -aspect * 0.15;
    api.waveRight = aspect;
    particles.visible = false;
    core.visible = false;
  }
}

function boot(host: HTMLDivElement, reduce: boolean): () => void {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  renderer.setClearColor(0x241833, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
  camera.position.set(0, 0, 8);

  scene.add(new THREE.AmbientLight(0xcecff7, 0.35));
  scene.add(new THREE.HemisphereLight(0xcecff7, 0x241833, 0.45));
  const key = new THREE.PointLight(0xcecff7, 2.4, 6, 2);
  key.position.set(0, 0.1, 1.4);
  scene.add(key);
  const fill = new THREE.PointLight(0x7f7bc1, 1.1, 8, 2);
  fill.position.set(-1.2, 0.2, 1.2);
  scene.add(fill);

  const { mesh: particles, material: partMat } = makeParticles();
  const { mesh: wave, material: waveMat, lines: waveLines, segs: waveSegs } = makeWave();
  const core = makeCore();
  const glow = makeGlow();
  scene.add(glow, particles, wave, core);

  const timer = new THREE.Timer();
  timer.connect(document);

  const api: FieldApi = {
    renderer,
    camera,
    scene,
    timer,
    particles,
    wave,
    core,
    glow,
    partMat,
    waveLines,
    waveSegs,
    waveLeft: 0.02,
    waveRight: 1.6,
    mouse: new THREE.Vector2(),
    target: new THREE.Vector2(),
  };

  const wideMq = window.matchMedia(WIDE);
  layout(api, wideMq.matches);

  const onMove = (e: PointerEvent) => {
    api.target.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  };
  const onWide = () => layout(api, wideMq.matches);
  const ro = new ResizeObserver(() => layout(api, wideMq.matches));
  ro.observe(host);
  window.addEventListener("pointermove", onMove, { passive: true });
  wideMq.addEventListener("change", onWide);

  renderer.setAnimationLoop(() => {
    api.timer.update();
    const t = reduce ? 0 : api.timer.getElapsed();
    api.mouse.lerp(api.target, 0.07);
    partMat.uniforms.uTime.value = t;
    partMat.uniforms.uMouse.value.copy(api.mouse);
    writeWave(wave, api.waveLines, api.waveSegs, api.waveLeft, api.waveRight, t);
    camera.position.x = api.mouse.x * 0.12;
    camera.position.y = api.mouse.y * 0.08;
    camera.lookAt(0, 0, 0);
    const pulse = 0.92 + Math.sin(t * 2.1) * 0.08;
    core.scale.setScalar(wideMq.matches ? pulse : 0);
    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    window.removeEventListener("pointermove", onMove);
    wideMq.removeEventListener("change", onWide);
    ro.disconnect();
    particles.geometry.dispose();
    wave.geometry.dispose();
    core.geometry.dispose();
    partMat.dispose();
    waveMat.dispose();
    (core.material as THREE.Material).dispose();
    glow.geometry.dispose();
    (glow.material as THREE.Material).dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

function HeroField() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return boot(host, reduce);
  }, []);

  return <div ref={hostRef} className="absolute inset-0" />;
}

type Pt = { x: number; y: number };

function displace(a: Pt, b: Pt, depth: number, jag: number, out: Pt[]) {
  if (depth <= 0) {
    out.push(b);
    return;
  }
  const mx = (a.x + b.x) / 2 + (Math.random() - 0.5) * jag;
  const my = (a.y + b.y) / 2 + (Math.random() - 0.5) * jag;
  const mid = { x: mx, y: my };
  displace(a, mid, depth - 1, jag * 0.52, out);
  displace(mid, b, depth - 1, jag * 0.52, out);
}

function boltPath(origin: Pt, angle: number, length: number): Pt[] {
  const end = {
    x: origin.x + Math.cos(angle) * length,
    y: origin.y + Math.sin(angle) * length,
  };
  const pts: Pt[] = [origin];
  displace(origin, end, 5, length * 0.18, pts);
  return pts;
}

function strokeBolt(ctx: CanvasRenderingContext2D, pts: Pt[], width: number, color: string) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();
}

type Step = {
  n: string;
  label: string;
  title: string;
  line: string;
  left: string;
  top: string;
  invert?: boolean;
};

const STEPS: Step[] = [
  { n: "01", label: "BRIEF", title: "Brief it.", line: "Describe the ad like a teammate.", left: "59%", top: "32%" },
  { n: "02", label: "REVIEW", title: "Review it.", line: "Audience, keywords, and creative.", left: "77%", top: "28%" },
  { n: "03", label: "APPROVE", title: "Approve it.", line: "Nothing ships until you say so.", left: "59%", top: "64%", invert: true },
  { n: "04", label: "IMPROVE", title: "Improve it.", line: "Agents tune what's already live.", left: "77%", top: "70%", invert: true },
];

const STEP_DEPTH = [0.8, 1.2, 0.7, 1.25];

function HeroSteps() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = [...layer.querySelectorAll<HTMLElement>("[data-step]")];
    const max = 38;
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      mx = ((e.clientX / window.innerWidth) * 2 - 1) * max;
      my = ((e.clientY / window.innerHeight) * 2 - 1) * max;
    };

    const tick = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      for (let i = 0; i < nodes.length; i++) {
        const d = STEP_DEPTH[i] ?? 1;
        nodes[i].style.transform = `translate3d(${cx * d}px, ${cy * d}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layerRef} className="absolute inset-0">
      {STEPS.map((s, i) => (
        <div
          key={s.n}
          className="tl-step absolute hidden min-[1100px]:block"
          style={{ left: s.left, top: s.top, animationDelay: `${0.35 + i * 0.14}s` }}
        >
          <div data-step className="will-change-transform">
            <div className="-translate-x-1/2 -translate-y-1/2">
              <div className={s.invert ? "tl-wave-ride-inv" : "tl-wave-ride"} style={{ animationDelay: `${i * 0.42}s` }}>
                <div className="relative flex min-w-[196px] flex-col items-center bg-[#241833]/80 px-5 py-3.5 text-center">
                  <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-white/70" />
                  <span className="absolute top-0 right-0 h-3 w-3 border-t border-r border-white/70" />
                  <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/70" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/70" />
                  <span className="font-mono text-[10px] tracking-[0.22em] text-white/45">
                    {s.n} {s.label}
                  </span>
                  <span className="mt-1.5 font-mono text-[13px] leading-none tracking-[0.16em] text-white uppercase">
                    {s.title}
                  </span>
                  <span className="mt-1.5 max-w-[180px] text-center font-mono text-[10px] leading-snug tracking-[0.04em] text-white/40 uppercase">
                    {s.line}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroLightning() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let nextAt = performance.now() + 380;

    type Flash = { paths: Pt[][]; born: number; life: number };
    let flashes: Flash[] = [];

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (now: number) => {
      const origin = { x: width * 0.5, y: height * 0.48 };
      const dirs = [-1.55, -1.2, -0.35, 0.15, 1.35, 1.62, 2.95, 3.4];
      const count = Math.random() > 0.45 ? 3 : 2;
      const paths: Pt[][] = [];
      for (let i = 0; i < count; i++) {
        const angle = dirs[Math.floor(Math.random() * dirs.length)] + (Math.random() - 0.5) * 0.22;
        const length = height * (0.16 + Math.random() * 0.22);
        const main = boltPath(origin, angle, length);
        paths.push(main);
        if (main.length > 6 && Math.random() > 0.35) {
          const fork = main[Math.floor(main.length * (0.35 + Math.random() * 0.3))];
          paths.push(boltPath(fork, angle + (Math.random() > 0.5 ? 0.7 : -0.7), length * 0.38));
        }
      }
      flashes.push({ paths, born: now, life: 220 + Math.random() * 120 });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      if (now >= nextAt) {
        spawn(now);
        if (Math.random() > 0.55) spawn(now);
        nextAt = now + 1100 + Math.random() * 1700;
      }
      flashes = flashes.filter((flash) => now - flash.born < flash.life);
      for (const flash of flashes) {
        const age = Math.max(0, (now - flash.born) / flash.life);
        const alpha = Math.max(0, age < 0.12 ? age / 0.12 : 1 - (age - 0.12) / 0.88);
        const flicker = 0.72 + Math.random() * 0.28;
        const a = alpha * flicker;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.shadowColor = "rgba(206,207,247,0.85)";
        ctx.shadowBlur = 18;
        for (const path of flash.paths) {
          strokeBolt(ctx, path, 7.5, `rgba(127,123,193,${0.22 * a})`);
          strokeBolt(ctx, path, 3.2, `rgba(206,207,247,${0.45 * a})`);
          strokeBolt(ctx, path, 1.15, `rgba(255,255,255,${0.95 * a})`);
        }
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full mix-blend-screen" />;
}

export function HeroMosaic() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: GROUND }} aria-hidden>
      <div
        className="absolute inset-0 isolate"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 48%, rgba(127,123,193,0.28) 0%, rgba(36,24,51,0.35) 48%, #241833 80%)",
        }}
      >
        <HeroField />
        <HeroLightning />
      </div>

      <HeroSteps />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(36,24,51,0.6)_0%,rgba(36,24,51,0.34)_18%,rgba(36,24,51,0.1)_32%,transparent_44%)]" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#241833]/80 to-transparent" />
      <div className="absolute top-[11%] bottom-0 left-1/2 hidden w-px -translate-x-1/2 border-l border-dashed border-white/40 min-[1100px]:block" />
    </div>
  );
}
