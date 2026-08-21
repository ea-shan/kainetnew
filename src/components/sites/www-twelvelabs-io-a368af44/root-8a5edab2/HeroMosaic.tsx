"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export const GROUND = "#08070a";
export const GROUND_GLOW = [
  "radial-gradient(ellipse 72% 58% at 38% 48%, #2a1b2d 0%, transparent 68%)",
  "radial-gradient(ellipse 50% 46% at 72% 52%, #3d2b1f 0%, transparent 62%)",
  "radial-gradient(ellipse 38% 32% at 22% 28%, #4a3728 0%, transparent 52%)",
  "radial-gradient(ellipse 34% 30% at 80% 76%, #2e2620 0%, transparent 48%)",
  "radial-gradient(ellipse 120% 95% at 50% 50%, transparent 36%, #08070a 84%)",
].join(",");
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
  varying float vSeed;

  void main() {
    float t = clamp(aT, 0.0, 1.0);
    // Cosine body = circular sides. Late needle restores the point without a mid-body kink.
    float body = pow(max(cos(t * 1.57079632679), 0.0), 0.72);
    float needle = 1.0 - pow(smoothstep(0.78, 1.0, t), 1.45);
    float spread = 1.12 * body * needle;
    vec3 p = vec3(mix(uLeft, uRight, t), aY0 * spread, aZ0 * spread * 0.4);
    p.xy += uMouse * (1.0 - aT) * 0.05;
    vT = aT;
    vSeed = aSeed;
    vFlow = fract(uTime * aSpeed + aSeed);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  uniform float uTime;
  varying float vT;
  varying float vFlow;
  varying float vSeed;

  void main() {
    vec3 tail = vec3(0.35, 0.42, 0.92);
    vec3 mid = vec3(0.72, 0.78, 1.0);
    vec3 head = vec3(1.0);
    vec3 col = mix(tail, mid, smoothstep(0.0, 0.55, vT));
    col = mix(col, head, smoothstep(0.62, 1.0, vT));
    float pulse = 0.5 + 0.5 * smoothstep(0.14, 0.0, abs(vT - vFlow));
    float fade = 0.28 + 0.72 * pow(vT, 0.8);
    float g = fract(uTime * 0.035 + vSeed);
    float appear = smoothstep(0.16, 0.42, g) * (1.0 - smoothstep(0.78, 0.97, g));
    gl_FragColor = vec4(col * pulse, fade * appear);
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

const FLARE_VERT = /* glsl */ `
  attribute float aAngle;
  attribute float aSpeed;
  attribute float aSeed;
  attribute float aSize;
  attribute float aSpread;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uDpr;
  varying float vLife;
  varying float vHot;
  varying float vBreak;

  void main() {
    float life = fract(uTime * aSpeed + aSeed);
    vLife = life;

    float reach = 0.55 + aSeed * 1.85;
    float r = mix(0.14, reach, pow(life, 0.62));

    float ang = aAngle + sin(uTime * 0.05 + aSeed * 6.28318) * 0.05 * aSpread;
    vec2 dir = vec2(cos(ang), sin(ang));
    vec2 p = dir * r;

    // Bend the field, never attract to the cursor — keeps coverage at center.
    p += uMouse * 0.04 * (1.0 - life);

    float center = 1.0 - smoothstep(0.05, 0.4, length(uMouse));
    vBreak = center;
    vec2 n = vec2(-dir.y, dir.x);
    float burst = center * life * (0.4 + aSeed * 0.95);
    p += n * (aSeed - 0.5) * burst * 1.55;
    p += dir * center * (aSeed - 0.32) * 0.28;

    vHot = smoothstep(0.0, 0.16, life) * (1.0 - smoothstep(0.5, 1.0, life));

    float shrink = 1.0 - life * (0.52 + center * 0.42);
    gl_PointSize = max(1.15, aSize * uDpr * shrink);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, (aSeed - 0.5) * 0.22, 1.0);
  }
`;

const FLARE_FRAG = /* glsl */ `
  varying float vLife;
  varying float vHot;
  varying float vBreak;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float d = length(uv);
    if (d > 1.0) discard;

    vec3 cool = vec3(0.498, 0.482, 0.757);
    vec3 warm = vec3(1.0, 0.93, 0.86);
    vec3 col = mix(cool, warm, vHot);
    col = mix(col, vec3(1.0), vHot * 0.55);

    float core = smoothstep(1.0, 0.12, d);
    float alpha = core * smoothstep(0.02, 0.14, vLife) * (1.0 - smoothstep(0.42, 0.96, vLife));
    alpha *= 1.0 - vBreak * vLife * 0.78;
    alpha *= mix(1.0, smoothstep(1.0, 0.32, d), vBreak);

    gl_FragColor = vec4(col * (0.55 + vHot * 0.95), alpha);
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
  flares: THREE.Points;
  glow: THREE.Mesh;
  partMat: THREE.ShaderMaterial;
  flareMat: THREE.ShaderMaterial;
  waveLines: WaveLine[];
  waveSegs: number;
  waveLeft: number;
  waveRight: number;
  mouse: THREE.Vector2;
  target: THREE.Vector2;
};

function makeParticles(): { mesh: THREE.LineSegments; material: THREE.ShaderMaterial } {
  const count = 720;
  const segs = 52;
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
    const speed = 0.012 + Math.random() * 0.018;
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
          Math.sin(t * spec.freq - time * 0.18 + spec.phase) * 0.065 +
          Math.sin(t * spec.freq * 1.85 + time * 0.1 + spec.phase * 1.25) * 0.022;
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

function makeFlares(): { mesh: THREE.Points; material: THREE.ShaderMaterial } {
  const count = 2400;
  const jets = 16;
  const jetCount = 1680;
  const pos = new Float32Array(count * 3);
  const aAngle = new Float32Array(count);
  const aSpeed = new Float32Array(count);
  const aSeed = new Float32Array(count);
  const aSize = new Float32Array(count);
  const aSpread = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    aSeed[i] = Math.random();
    if (i < jetCount) {
      const j = i % jets;
      const base = (j / jets) * Math.PI * 2 + (j % 2) * 0.1;
      aAngle[i] = base + (Math.random() - 0.5) * 0.15;
      aSpread[i] = 0.22;
      aSize[i] = 2.4 + Math.random() * 5.8;
      aSpeed[i] = 0.016 + Math.random() * 0.028;
    } else {
      aAngle[i] = Math.random() * Math.PI * 2;
      aSpread[i] = 1;
      aSize[i] = 1.15 + Math.random() * 2.6;
      aSpeed[i] = 0.008 + Math.random() * 0.016;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aAngle", new THREE.BufferAttribute(aAngle, 1));
  geo.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeed, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
  geo.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
  geo.setAttribute("aSpread", new THREE.BufferAttribute(aSpread, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uDpr: { value: 1 },
    },
    vertexShader: FLARE_VERT,
    fragmentShader: FLARE_FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const mesh = new THREE.Points(geo, material);
  mesh.frustumCulled = false;
  return { mesh, material };
}

function layout(api: FieldApi, wide: boolean) {
  const { renderer, camera, particles, glow, partMat, flareMat } = api;
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
  flareMat.uniforms.uDpr.value = dpr;
  if (wide) {
    api.waveLeft = gap;
    api.waveRight = aspect;
    particles.visible = true;
  } else {
    api.waveLeft = -aspect * 0.15;
    api.waveRight = aspect;
    particles.visible = false;
  }
}

function boot(host: HTMLDivElement, reduce: boolean): () => void {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });
  renderer.setClearColor(0x08070a, 0);
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
  const { mesh: flares, material: flareMat } = makeFlares();
  const glow = makeGlow();
  scene.add(glow, particles, wave, flares);

  const timer = new THREE.Timer();
  timer.connect(document);

  const api: FieldApi = {
    renderer,
    camera,
    scene,
    timer,
    particles,
    wave,
    flares,
    glow,
    partMat,
    flareMat,
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
    flareMat.uniforms.uTime.value = t;
    flareMat.uniforms.uMouse.value.copy(api.mouse);
    writeWave(wave, api.waveLines, api.waveSegs, api.waveLeft, api.waveRight, t);
    camera.position.x = api.mouse.x * 0.12;
    camera.position.y = api.mouse.y * 0.08;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    window.removeEventListener("pointermove", onMove);
    wideMq.removeEventListener("change", onWide);
    ro.disconnect();
    particles.geometry.dispose();
    wave.geometry.dispose();
    flares.geometry.dispose();
    partMat.dispose();
    waveMat.dispose();
    flareMat.dispose();
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

export function HeroMosaic() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ backgroundColor: GROUND, backgroundImage: GROUND_GLOW }}
      aria-hidden
    >
      <div className="absolute inset-0 isolate">
        <HeroField />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,10,0.88)_0%,rgba(8,7,10,0.62)_16%,rgba(8,7,10,0.22)_30%,transparent_44%)]" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#08070a]/80 to-transparent" />
    </div>
  );
}
