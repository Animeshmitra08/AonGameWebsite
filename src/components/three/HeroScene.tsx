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
 * The export dropped every material property (all 13 are plain white), so each
 * colourway is rebuilt here: first by part (node) name, then by material name.
 */
type Variant = 'carbon' | 'arctic';

interface Skin {
  /** part name (node name without the "o " prefix) → material */
  parts: Record<string, Material>;
  /** original material name → material */
  materials: Record<string, Material>;
  fallback: Material;
}

const glow = (color: string, intensity = 0.9) =>
  new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.3, toneMapped: false });

function createSkin(variant: Variant): Skin {
  const dark = variant === 'carbon';
  const accent = dark ? BRAND.blue : BRAND.violet;

  // gloss front panel, softer-touch back and grips — the classic two-texture shell
  const front = dark
    ? new MeshPhysicalMaterial({ color: '#0b0d12', metalness: 0.2, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.06 })
    : new MeshPhysicalMaterial({ color: '#eef1f6', metalness: 0, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.12 });
  const back = dark
    ? new MeshPhysicalMaterial({ color: '#15181f', metalness: 0.1, roughness: 0.62, clearcoat: 0.15 })
    : new MeshPhysicalMaterial({ color: '#d9dee7', metalness: 0, roughness: 0.55, sheen: 0.3, sheenColor: '#ffffff' });
  // anodised accent on triggers and bumpers
  const accentMetal = new MeshPhysicalMaterial({
    color: accent,
    metalness: 0.85,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
  });
  const dpad = dark
    ? new MeshStandardMaterial({ color: '#c9d2e3', metalness: 1, roughness: 0.18 })
    : new MeshPhysicalMaterial({ color: '#2a2f3d', metalness: 0.6, roughness: 0.3, clearcoat: 0.8 });
  const trim = new MeshPhysicalMaterial({
    color: dark ? '#0f1218' : '#1d212b',
    metalness: 0.3,
    roughness: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  });

  return {
    parts: {
      Front_panel: front,
      Rear_panel: back,
      Left_3: back, // grips
      Right_3: back,
      Battery_door: back,
      Left_1: accentMetal, // triggers
      Right_1: accentMetal,
      Left_2: accentMetal, // bumpers
      Right_2: accentMetal,
      Dpad: dpad,
    },
    materials: {
      'Dull white': back,
      'Shiny black': trim,
      'Shiny white': glow(accent, 1.1), // Xbox logo, view & menu buttons light up
      'Logo black': new MeshStandardMaterial({ color: '#07090d', metalness: 0.4, roughness: 0.4 }),
      'Metal bits': new MeshStandardMaterial({ color: '#aeb8cc', metalness: 1, roughness: 0.25 }),
      Analogs: new MeshStandardMaterial({ color: dark ? '#12151c' : '#2a2f3d', metalness: 0.1, roughness: 0.85 }),
      'Analogs bump': new MeshStandardMaterial({ color: dark ? '#1f2433' : '#3a4152', metalness: 0.2, roughness: 0.7 }),
      'Front buttons transparent': new MeshPhysicalMaterial({
        color: dark ? '#1a1f2c' : '#3a4152',
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
    },
    fallback: trim,
  };
}

/** GLTFLoader sanitises "o Front_panel" to "o_Front_panel"; multi-material parts are a group of meshes */
function partName(obj: Object3D | null): string {
  for (let o = obj; o; o = o.parent) {
    if (/^o[_ ]/.test(o.name)) return o.name.replace(/^o[_ ]/, '');
  }
  return '';
}

function applySkin(root: Object3D, skin: Skin) {
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const original = (mesh.material as Material).name;
    // the Xbox button is two materials; only skin its shell, keep the logo per material
    const byPart = original === 'Shiny white' || original === 'Logo black' ? undefined : skin.parts[partName(mesh)];
    mesh.material = byPart ?? skin.materials[original] ?? skin.fallback;
  });
}

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
    // < gutter width: the yaw toward the copy enlarges the outer edge in perspective
    const widthPx = Math.min(gutter * 0.7, window.innerHeight * 0.4, 400);
    const cx = side === -1 ? gutter * 0.5 : canvasW - gutter * 0.5;
    const [x, y] = toWorld(cx, window.innerHeight * 0.5);
    // negative pitch tips the face up toward the viewer, like a controller on a desk
    return { x, y, width: widthPx * pxToWorld, yaw: -side * 0.55, pitch: -0.4, roll: side * 0.1 };
  }

  // a row of two above the copy, tilted toward each other
  // keep in sync with the hero-stacked padding in HeroSection and the fallback in Fallbacks
  const widthPx = Math.min(canvasW * 0.38, 260);
  const cx = canvasW / 2 + side * canvasW * 0.24;
  const [x, y] = toWorld(cx, NAV_HEIGHT + 24 + widthPx * 0.5);
  return { x, y, width: widthPx * pxToWorld, yaw: -side * 0.45, pitch: -0.55, roll: side * 0.15 };
}

/**
 * The source model is mirrored (face buttons on the wrong side once it's stood
 * up), so flip its Z — the top/bottom axis while it lies flat — instead of just
 * rotating it. three.js corrects winding and normals for negative scale.
 */
function setBodyScale(body: Group | null, s: number) {
  body?.scale.set(s, s, -s);
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
    setBodyScale(body.current, l.width / MODEL_WIDTH);
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
    setBodyScale(body.current, MathUtils.damp(body.current.scale.x, l.width / MODEL_WIDTH, 4, dt));
  });

  return (
    <group ref={rig}>
      <Float speed={animate ? 1.6 : 0} rotationIntensity={0.3} floatIntensity={0.8} floatingRange={[-0.12, 0.12]}>
        {/* model lies flat (face up, +Y); stand it up so the face points at the camera.
            Its scale is mirrored on Z — see setBodyScale */}
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

  // two copies sharing geometry: carbon black on the left, arctic white on the right
  const [left, right] = useMemo(() => {
    const carbon = scene.clone(true);
    const arctic = scene.clone(true);
    applySkin(carbon, createSkin('carbon'));
    applySkin(arctic, createSkin('arctic'));
    return [carbon, arctic];
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
