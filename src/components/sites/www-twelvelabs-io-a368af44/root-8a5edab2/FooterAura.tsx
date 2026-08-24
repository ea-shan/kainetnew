"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uReduce;
  uniform vec2 uRes;
  uniform vec2 uMouse;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.03 + 13.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * (1.0 - uReduce);
    vec2 m = uMouse * 0.035;

    float n1 = fbm(uv * vec2(1.15, 1.45) + vec2(t * 0.028 + m.x, t * 0.012));
    float n2 = fbm(uv * vec2(1.7, 2.1) + vec2(-t * 0.022, t * 0.018 + m.y));
    float n3 = fbm(uv * 0.85 + vec2(t * 0.016, -t * 0.01));

    float left = smoothstep(0.72, 0.08, uv.x + (n1 - 0.5) * 0.22);
    float right = smoothstep(0.28, 0.96, uv.x + (n2 - 0.5) * 0.2);
    float mid = 1.0 - abs(uv.x - 0.48 - (n3 - 0.5) * 0.12) * 1.7;

    vec3 cream = vec3(0.933, 0.933, 0.933);
    vec3 lav = vec3(0.808, 0.812, 0.969);
    vec3 lilac = vec3(0.847, 0.737, 0.922);
    vec3 dusk = vec3(0.498, 0.482, 0.757);
    vec3 peach = vec3(0.902, 0.745, 0.776);
    vec3 ash = vec3(0.792, 0.757, 0.804);
    vec3 mango = vec3(1.0, 0.835, 0.502);

    vec3 col = cream;
    col = mix(col, lav, left * mix(0.55, 0.95, n1));
    col = mix(col, lilac, clamp(mid, 0.0, 1.0) * n3 * 0.42);
    col = mix(col, peach, n2 * 0.38);
    col = mix(col, mango, right * mix(0.5, 0.92, n2));
    col = mix(col, ash, n3 * 0.12);
    col = mix(col, dusk, left * n1 * 0.08);
    col += (hash(uv * uRes + t * 40.0) - 0.5) * 0.02;

    float pulse = 0.5 + 0.5 * sin(t * 0.7);
    vec2 logoP = (uv - vec2(0.5, 0.3)) * vec2(1.55, 2.35);
    float logoGlow = exp(-dot(logoP, logoP) * 3.1);
    col = mix(col, lav, logoGlow * pulse * 0.32);
    col = mix(col, mango, logoGlow * (1.0 - pulse) * 0.16);
    col += logoGlow * pulse * 0.07;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function boot(host: HTMLDivElement, reduce: boolean): () => void {
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xeeeeee, 1);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uReduce: { value: reduce ? 1 : 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2() },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const timer = new THREE.Timer();
  timer.connect(document);
  const mouse = new THREE.Vector2();
  const target = new THREE.Vector2();
  let live = true;

  const fit = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    material.uniforms.uRes.value.set(w, h);
  };

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    target.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  };

  const ro = new ResizeObserver(fit);
  ro.observe(host);
  const io = new IntersectionObserver(([entry]) => {
    live = entry.isIntersecting;
  });
  io.observe(host);
  window.addEventListener("pointermove", onMove, { passive: true });
  fit();

  renderer.setAnimationLoop(() => {
    if (!live) return;
    timer.update();
    mouse.lerp(target, 0.06);
    material.uniforms.uTime.value = reduce ? 0 : timer.getElapsed();
    material.uniforms.uMouse.value.copy(mouse);
    renderer.render(scene, camera);
  });

  return () => {
    renderer.setAnimationLoop(null);
    window.removeEventListener("pointermove", onMove);
    ro.disconnect();
    io.disconnect();
    mesh.geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

export function FooterAura() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return boot(host, reduce);
  }, []);

  return <div ref={hostRef} className="absolute inset-0" />;
}
