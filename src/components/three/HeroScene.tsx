import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer, Sparkles, useGLTF } from '@react-three/drei';
import {
  MathUtils,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Group,
  type Material,
  type Mesh,
  type Object3D,
} from 'three';
import { BRAND, useWindowPointer, type SceneProps } from './utils';

/* ------------------------------------------------------------------ */
/*  Two copies of the controller model flanking the hero copy.        */
/*  Source: src/assets/3d/Controller.glb (22 MB) → optimised with     */
/*  gltf-transform (weld + simplify 50% + quantize + meshopt) into     */
/*  public/models/controller.glb (~1 MB), keeping material names.     */
/* ------------------------------------------------------------------ */

const MODEL_URL = '/models/controller.glb';
/** width of the source model along X, in its own units */
const MODEL_WIDTH = 15;

/*
 * The export dropped every material property (all 13 are plain white), so the
 * look is restored here by material name.
 */
function createSkins(): Record<string, Material> {
  const glow = (color: string, intensity = 0.9) =>
    new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.3, toneMapped: false });

  return {
    'Shiny black': new MeshPhysicalMaterial({
      color: '#10131b',
      metalness: 0.35,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    // the shell (front/rear panels, grips) — re-cast from white plastic to graphite
    'Dull white': new MeshPhysicalMaterial({
      color: '#2a2f3d',
      metalness: 0.2,
      roughness: 0.42,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    }),
    'Shiny white': new MeshPhysicalMaterial({ color: '#c9d2e3', metalness: 1, roughness: 0.18, clearcoat: 0.6 }),
    'Metal bits': new MeshStandardMaterial({ color: '#aeb8cc', metalness: 1, roughness: 0.25 }),
    'Logo black': new MeshStandardMaterial({ color: '#07090d', metalness: 0.4, roughness: 0.4 }),
    Analogs: new MeshStandardMaterial({ color: '#141822', metalness: 0.1, roughness: 0.85 }),
    'Analogs bump': new MeshStandardMaterial({ color: '#1f2433', metalness: 0.2, roughness: 0.7 }),
    'Front buttons transparent': new MeshPhysicalMaterial({
      color: '#1a1f2c',
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1,
      transparent: true,
      opacity: 0.55,
    }),
    'Front button inserts': new MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.4 }),
    Blue: glow(BRAND.blue),
    Green: glow('#34d399', 0.7),
    Red: glow('#fb7185', 0.7),
    Yellow: glow('#fbbf24', 0.6),
  };
}

const fallbackSkin = new MeshStandardMaterial({ color: '#1b2030', metalness: 0.4, roughness: 0.4 });

/* ------------------------------------------------------------------ */
/*  Responsive placement                                               */
/*  Computed in CSS pixels (the canvas covers the hero, which starts  */
/*  at the top of the page) and converted to world units at z = 0.    */
/* ------------------------------------------------------------------ */
type Side = -1 | 1;

/** approximate width of the centred copy column (h1 / subtitle), px */
const COPY_WIDTH = 600;
const NAV_HEIGHT = 64;

/**
 * Must match the `hero-stacked` variant in index.css, which reserves room
 * above the copy for the controller row.
 */
function isStacked() {
  return window.innerWidth < window.innerHeight * 1.15 || window.innerWidth < 900;
}

interface Layout {
  x: number;
  y: number;
  width: number;
  yaw: number;
  pitch: number;
  roll: number;
}

function getLayout(canvasW: number, canvasH: number, pxToWorld: number, side: Side): Layout {
  const toWorld = (px: number, py: number) => [(px - canvasW / 2) * pxToWorld, (canvasH / 2 - py) * pxToWorld];

  if (!isStacked()) {
    // one controller centred in each gutter beside the copy, angled toward it
    const gutter = (canvasW - COPY_WIDTH) / 2;
    const widthPx = Math.min(gutter * 0.78, window.innerHeight * 0.42, 420);
    const cx = side === -1 ? gutter * 0.5 : canvasW - gutter * 0.5;
    const [x, y] = toWorld(cx, window.innerHeight * 0.5);
    return { x, y, width: widthPx * pxToWorld, yaw: -side * 0.55, pitch: 0.5, roll: side * 0.1 };
  }

  // a row of two above the copy, tilted toward each other
  const widthPx = Math.min(canvasW * 0.38, 300);
  const cx = canvasW / 2 + side * canvasW * 0.24;
  const [x, y] = toWorld(cx, NAV_HEIGHT + 24 + widthPx * 0.42);
  return { x, y, width: widthPx * pxToWorld, yaw: -side * 0.45, pitch: 0.75, roll: side * 0.15 };
}

interface RigProps {
  model: Object3D;
  side: Side;
  animate: boolean;
  pointer: RefObject<{ x: number; y: number }>;
}

function ControllerRig({ model, side, animate, pointer }: RigProps) {
  const rig = useRef<Group>(null);
  const body = useRef<Group>(null);
  const phase = side === -1 ? 0 : Math.PI;

  // start off to the side and glide in (or appear in place when motion is reduced)
  const get = useThree((s) => s.get);
  useLayoutEffect(() => {
    const { size, viewport } = get();
    const l = getLayout(size.width, size.height, viewport.width / size.width, side);
    rig.current?.position.set(l.x + (animate ? side * viewport.width * 0.3 : 0), l.y, 0);
    body.current?.scale.setScalar(l.width / MODEL_WIDTH);
    // mount-only: useFrame owns the pose afterwards
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const g = rig.current;
    if (!g || !body.current) return;
    const { size, viewport } = state;
    const l = getLayout(size.width, size.height, viewport.width / size.width, side);

    // without animation, snap straight to the target pose
    const dt = animate ? delta : 100;
    const sway = animate ? Math.sin(state.clock.elapsedTime * 0.5 + phase) * 0.14 : 0;
    const p = pointer.current;

    g.position.x = MathUtils.damp(g.position.x, l.x, 2.2, dt);
    g.position.y = MathUtils.damp(g.position.y, l.y, 2.2, dt);
    g.rotation.y = MathUtils.damp(g.rotation.y, l.yaw + sway + p.x * 0.3, 2.5, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, l.pitch + p.y * 0.2, 2.5, dt);
    g.rotation.z = MathUtils.damp(g.rotation.z, l.roll, 2.5, dt);
    body.current.scale.setScalar(MathUtils.damp(body.current.scale.x, l.width / MODEL_WIDTH, 4, dt));
  });

  return (
    <group ref={rig}>
      <Float speed={animate ? 1.6 : 0} rotationIntensity={0.3} floatIntensity={0.8} floatingRange={[-0.12, 0.12]}>
        {/* model lies flat (face up, +Y); stand it up so the face points at the camera */}
        <group ref={body} rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={model} />
        </group>
      </Float>
    </group>
  );
}

function Controllers({ animate, onReady }: { animate: boolean; onReady: () => void }) {
  const { scene } = useGLTF(MODEL_URL, false);
  const pointer = useWindowPointer();

  // re-skin once, then make a second copy that shares geometry and materials
  const [left, right] = useMemo(() => {
    const skins = createSkins();
    const skinned = scene.clone(true);
    skinned.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) mesh.material = skins[(mesh.material as Material).name] ?? fallbackSkin;
    });
    return [skinned, skinned.clone(true)];
  }, [scene]);

  // tell the stage to cross-fade only once the model is actually on screen
  useEffect(() => onReady(), [onReady]);

  return (
    <>
      <ControllerRig model={left} side={-1} animate={animate} pointer={pointer} />
      <ControllerRig model={right} side={1} animate={animate} pointer={pointer} />
    </>
  );
}

export default function HeroScene({ active, reducedMotion, onReady }: SceneProps) {
  const animate = active && !reducedMotion;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 12], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={animate ? 'always' : 'demand'}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 6, 8]} intensity={2.2} />
      {/* coloured rims — kept low so the materials still read as charcoal + chrome */}
      <pointLight position={[-9, -2, 3]} intensity={6} color={BRAND.blue} />
      <pointLight position={[9, 2, 3]} intensity={6} color={BRAND.violet} />

      {/* procedural studio lighting — reflections without downloading an HDR.
          Lightformers aim at the origin; panels all around keep glossy parts readable. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 3]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, 0, 8]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color={BRAND.blue} position={[-6, 1, 2]} scale={[5, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color={BRAND.violet} position={[6, -1, 2]} scale={[5, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color={BRAND.blue} position={[-4, 4, -4]} scale={[8, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color={BRAND.violet} position={[4, -4, -4]} scale={[8, 6, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Controllers animate={animate} onReady={onReady} />
      </Suspense>

      <Sparkles count={50} scale={[18, 9, 4]} size={2.4} speed={animate ? 0.3 : 0} opacity={0.6} color={BRAND.ice} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL, false);
