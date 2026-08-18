"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ASSET } from "./content";

const CLIPS = Array.from({ length: 16 }, (_, i) => `${ASSET}/videos/mosaic/clip-${String(i).padStart(2, "0")}.mp4`);
const ROWS = 10;
const COLS = 52;
const RADIUS = 6.8;
const TILE_W = 0.5;
const TILE_H = TILE_W * (9 / 16);
const ROW_PITCH = TILE_H + 0.36;
const SPIN = -0.046;
const FOCUS = 5.6;
const PLANE_ASPECT = TILE_W / TILE_H;

const TILE_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TILE_FRAG = `
  uniform sampler2D map;
  uniform float brightness;
  uniform float blurAmt;
  uniform float opacity;
  uniform float radius;
  uniform float videoAspect;
  uniform float sideFade;
  varying vec2 vUv;

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  vec2 containUV(vec2 uv) {
    float plane = ${PLANE_ASPECT.toFixed(4)};
    float ratio = videoAspect / plane;
    vec2 scale = ratio > 1.0 ? vec2(1.0, ratio) : vec2(1.0 / ratio, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  vec3 sampleTex(vec2 uv) {
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec3(0.055);
    vec3 base = texture2D(map, uv).rgb;
    if (blurAmt < 0.03) return base;
    vec2 px = vec2(blurAmt * 0.0036, blurAmt * 0.006);
    vec3 c = base * 0.44;
    c += texture2D(map, uv + vec2(px.x, 0.0)).rgb * 0.14;
    c += texture2D(map, uv - vec2(px.x, 0.0)).rgb * 0.14;
    c += texture2D(map, uv + vec2(0.0, px.y)).rgb * 0.14;
    c += texture2D(map, uv - vec2(0.0, px.y)).rgb * 0.14;
    return c;
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float d = roundedBox(p, vec2(1.0), radius);
    float alpha = 1.0 - smoothstep(0.0, 0.03, d);
    if (alpha < 0.02) discard;
    vec2 film = containUV((vUv - 0.5) * 0.94 + 0.5);
    gl_FragColor = vec4(sampleTex(film) * brightness, alpha * opacity * sideFade);
  }
`;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function tileMaterial(map: THREE.VideoTexture, videoAspect: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map },
      brightness: { value: 1 },
      blurAmt: { value: 0 },
      opacity: { value: 1 },
      radius: { value: 0.12 },
      videoAspect: { value: videoAspect },
      sideFade: { value: 1 },
    },
    vertexShader: TILE_VERT,
    fragmentShader: TILE_FRAG,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
}

function LimeStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#C8FF4D" aria-hidden>
      <path d="M12 1.2l1.85 8.05L22 12l-8.15 2.75L12 22.8l-1.85-8.05L2 12l8.15-2.75L12 1.2z" />
    </svg>
  );
}

export function HeroMosaic() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const videos: HTMLVideoElement[] = [];
    const textures: THREE.VideoTexture[] = [];
    const materials: THREE.ShaderMaterial[] = [];
    const tiles: { mesh: THREE.Mesh; material: THREE.ShaderMaterial }[] = [];
    const world = new THREE.Vector3();
    const ndc = new THREE.Vector3();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0c);

    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 45);
    const baseCam = new THREE.Vector3(0.12, 0.0, 0.22);
    const look = new THREE.Vector3(4.35, 0.0, 1.45);
    camera.position.copy(baseCam);
    camera.lookAt(look);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    el.insertBefore(renderer.domElement, el.firstChild);

    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    const geometry = new THREE.PlaneGeometry(TILE_W, TILE_H);
    const group = new THREE.Group();
    group.position.set(0.05, 0, 0);
    group.rotation.x = 0.04;
    group.rotation.z = 0.01;

    const syncAspect = (video: HTMLVideoElement, texture: THREE.VideoTexture) => {
      const aspect = video.videoWidth / Math.max(video.videoHeight, 1);
      texture.userData.aspect = aspect;
      for (const material of materials) {
        if (material.uniforms.map.value === texture) material.uniforms.videoAspect.value = aspect;
      }
    };

    for (const src of CLIPS) {
      const video = document.createElement("video");
      video.src = src;
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      video.setAttribute("playsinline", "");
      video.setAttribute("muted", "");
      video.className = "pointer-events-none absolute h-px w-px opacity-0";

      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.anisotropy = anisotropy;
      texture.userData.aspect = 16 / 9;

      const play = () => {
        video.muted = true;
        syncAspect(video, texture);
        void video.play().catch(() => undefined);
      };
      video.addEventListener("loadedmetadata", play);
      video.addEventListener("canplay", play);
      el.appendChild(video);
      play();
      videos.push(video);
      textures.push(texture);
    }

    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const texture = textures[(row * 5 + col * 3) % textures.length];
        const material = tileMaterial(texture, Number(texture.userData.aspect) || 16 / 9);
        materials.push(material);
        const mesh = new THREE.Mesh(geometry, material);
        const theta = (col / COLS) * Math.PI * 2 + row * 0.035;
        const y = (row - (ROWS - 1) / 2) * ROW_PITCH;
        mesh.position.set(Math.sin(theta) * RADIUS, y, Math.cos(theta) * RADIUS);
        mesh.rotation.y = theta + Math.PI;
        group.add(mesh);
        tiles.push({ mesh, material });
      }
    }
    scene.add(group);

    const pointer = { x: 0, y: 0 };
    let lastX = 0;
    let tracked = false;
    let travel = 0;
    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      pointer.y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      if (tracked) travel += x - lastX;
      lastX = x;
      tracked = true;
      pointer.x = x;
    };
    if (!reduceMotion) window.addEventListener("mousemove", onMove, { passive: true });

    const resize = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);

    const timer = new THREE.Timer();
    timer.connect(document);

    renderer.setAnimationLoop(() => {
      timer.update();
      const elapsed = timer.getElapsed();
      if (!reduceMotion) {
        group.rotation.y = elapsed * SPIN + travel * 1.35;
        group.rotation.x = 0.04 + pointer.y * 0.1;
        camera.position.x += (baseCam.x + pointer.x * 0.92 - camera.position.x) * 0.055;
        camera.position.y += (baseCam.y - pointer.y * 0.52 - camera.position.y) * 0.055;
        camera.lookAt(look.x + pointer.x * 0.42, look.y - pointer.y * 0.18, look.z);
      }
      for (const tile of tiles) {
        tile.mesh.getWorldPosition(world);
        const dist = camera.position.distanceTo(world);
        const focus = smoothstep(FOCUS + 5.8, FOCUS - 0.15, dist);
        ndc.copy(world).project(camera);
        const sideFade = 0.3 + 0.7 * smoothstep(-0.12, 0.5, ndc.x);
        const fromCenter = Math.hypot(ndc.x * 0.9, ndc.y * 0.75);
        tile.mesh.scale.setScalar(0.56 + smoothstep(0.06, 0.92, fromCenter) * 0.44);
        tile.material.uniforms.blurAmt.value = (1 - focus) * 0.28 + (1 - sideFade) * 0.18;
        tile.material.uniforms.brightness.value = 0.7 + focus * 0.22 + sideFade * 0.08;
        tile.material.uniforms.opacity.value = 0.78 + focus * 0.22;
        tile.material.uniforms.sideFade.value = sideFade;
      }
      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      timer.disconnect();
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      videos.forEach((video) => {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.remove();
      });
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,12,12,0.82)_0%,rgba(12,12,12,0.62)_24%,rgba(12,12,12,0.32)_44%,rgba(12,12,12,0.1)_62%,transparent_76%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0C0C0C] to-transparent" />
      <LimeStar className="absolute top-[44%] right-6 hidden size-7 min-[1100px]:block" />
    </div>
  );
}
