"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Image as DreiImage, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { LockIcon } from "../shared/icons";
import { ASSET } from "./content";

const FALLBACK = `${ASSET}/images/glass-grid-ref.jpg`;

type BoxConfig = {
  position: [number, number, number];
  rotation: [number, number, number];
  image: string;
  phase: number;
};

const BOX_W = 3.15;
const BOX_H = 2.05;
const BOX_D = 1.72;
const RADIUS = 0.38;

const BOXES: BoxConfig[] = [
  {
    position: [-2.25, 0.72, -0.55],
    rotation: [0.025, -0.055, -0.035],
    image: `${ASSET}/images/cta-hub-operator.jpg`,
    phase: 0,
  },
  {
    position: [0, 0, 0],
    rotation: [0.025, -0.055, -0.035],
    image: `${ASSET}/images/jockey-ui.png`,
    phase: 1.7,
  },
  {
    position: [2.25, -0.76, 0.52],
    rotation: [0.025, -0.055, -0.025],
    image: `${ASSET}/images/cta-still.png`,
    phase: 3.4,
  },
];

const GRID_VERT = `
  varying vec3 vPos;
  varying vec3 vWorld;
  varying vec3 vNormal;
  void main() {
    vPos = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const GRID_FRAG = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vPos;
  varying vec3 vWorld;
  varying vec3 vNormal;

  float grid(vec2 uv, float size, float thick) {
    vec2 cell = abs(fract(uv / size) - 0.5);
    float x = 1.0 - smoothstep(thick, thick + 0.02, cell.x);
    float y = 1.0 - smoothstep(thick, thick + 0.02, cell.y);
    return max(x, y);
  }

  void main() {
    float size = 0.22;
    float g = max(grid(vPos.xy, size, 0.012), max(grid(vPos.xz, size, 0.012), grid(vPos.yz, size, 0.012)));
    float wave = smoothstep(0.12, 0.95, sin(vWorld.x * 2.8 + vWorld.y * 2.0 + vWorld.z * 2.4 + uTime * 0.8));
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 3.5);
    float spark = step(0.93, 1.0 - length(fract(vPos.xy / size) - 0.5) * 2.0);
    float alpha = clamp(g * (0.22 + wave * 0.2) + fresnel * 0.62 + spark * 0.28, 0.0, 0.9);
    vec3 color = mix(uColor, vec3(1.0), fresnel * 0.72 + spark);
    gl_FragColor = vec4(color, alpha);
  }
`;

function useGridMaterial() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#d7c9ff") },
        },
        vertexShader: GRID_VERT,
        fragmentShader: GRID_FRAG,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);
  return material;
}

function GlassBox({
  config,
  material,
  reduce,
}: {
  config: BoxConfig;
  material: THREE.ShaderMaterial;
  reduce: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = reduce ? 0 : clock.elapsedTime;
    const p = config.phase;
    group.current.position.set(
      config.position[0] + Math.sin(t * 0.32 + p) * 0.045,
      config.position[1] + Math.sin(t * 0.52 + p) * 0.065,
      config.position[2] + Math.cos(t * 0.35 + p) * 0.035,
    );
    group.current.rotation.set(
      config.rotation[0] + Math.sin(t * 0.4 + p) * 0.009,
      config.rotation[1] + Math.cos(t * 0.3 + p) * 0.012,
      config.rotation[2] + Math.sin(t * 0.34 + p) * 0.008,
    );
    material.uniforms.uTime.value = t;
  });

  return (
    <group ref={group} position={config.position} rotation={config.rotation}>
      <DreiImage
        url={config.image}
        position={[0, 0, BOX_D * 0.12]}
        scale={[BOX_W * 0.84, BOX_H * 0.8]}
        radius={0.08}
        transparent
        opacity={0.96}
        toneMapped={false}
      />
      <RoundedBox args={[BOX_W, BOX_H, BOX_D]} radius={RADIUS} smoothness={8} renderOrder={1}>
        <meshPhysicalMaterial
          color="#f4efff"
          transparent
          opacity={0.08}
          transmission={0.92}
          thickness={0.65}
          roughness={0.05}
          metalness={0}
          ior={1.35}
          clearcoat={1}
          clearcoatRoughness={0.05}
          depthWrite={false}
        />
      </RoundedBox>
      <RoundedBox
        args={[BOX_W + 0.03, BOX_H + 0.03, BOX_D + 0.03]}
        radius={RADIUS + 0.015}
        smoothness={8}
        renderOrder={2}
        material={material}
      />
    </group>
  );
}

function CameraMotion({ reduce }: { reduce: boolean }) {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    if (reduce) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.12, 0.08);
    } else {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.12, 0.035);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.12 + pointer.y * 0.06, 0.035);
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Fit({ children }: { children: ReactNode }) {
  const { viewport } = useThree();
  const s = Math.min(1.18, viewport.width / 8.35);
  return <group scale={s}>{children}</group>;
}

function Scene({ reduce }: { reduce: boolean }) {
  const grid = useGridMaterial();
  return (
    <>
      <ambientLight intensity={1.45} />
      <directionalLight position={[3, 5, 6]} intensity={1.05} color="#fff7fb" />
      <pointLight position={[-4, 2, 4]} intensity={1.7} distance={12} color="#e8ddff" />
      <pointLight position={[4, -2, 3]} intensity={1.25} distance={12} color="#d9b3e2" />
      <Fit>
        {BOXES.map((box) => (
          <GlassBox key={box.image} config={box} material={grid} reduce={reduce} />
        ))}
      </Fit>
      <CameraMotion reduce={reduce} />
      <AdaptiveDpr pixelated />
    </>
  );
}

export function SecurityGlassGrid() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div data-security-grid className="relative mx-auto aspect-[1024/804] w-full max-w-[720px] min-[900px]:mx-0">
      <Canvas
        className="absolute inset-0 !h-full !w-full"
        camera={{ position: [0, 0.08, 8.35], fov: 31 }}
        dpr={[1, 1.75]}
        flat
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        fallback={
          <img src={FALLBACK} alt="Secure by design" width={1024} height={804} className="h-full w-full object-contain" />
        }
      >
        <Suspense fallback={null}>
          <Scene reduce={reduce} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center" aria-hidden>
        <div className="absolute top-[22%] left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
          <span className="flex size-12 items-center justify-center rounded-[14px] border border-[#171717] bg-white min-[768px]:size-[3.25rem]">
            <LockIcon className="size-6 text-[#171717] min-[768px]:size-7" />
          </span>
          <span className="h-8 w-px bg-[#171717] min-[768px]:h-10" />
        </div>
      </div>
    </div>
  );
}
