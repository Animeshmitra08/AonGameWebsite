import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Lightformer, RoundedBox } from '@react-three/drei';
import { MathUtils, MeshPhysicalMaterial, MeshStandardMaterial, type Group } from 'three';
import { BRAND, useWindowPointer, type SceneProps } from './utils';

/* ------------------------------------------------------------------ */
/*  Procedural game controller built from primitives (no model file). */
/* ------------------------------------------------------------------ */

const FACE_Z = 0.285;

const faceButtons = [
  { offset: [0, 0.15] as const, color: BRAND.blue },
  { offset: [0.15, 0] as const, color: BRAND.lilac },
  { offset: [0, -0.15] as const, color: BRAND.ice },
  { offset: [-0.15, 0] as const, color: BRAND.violet },
];

function useControllerMaterials() {
  return useMemo(() => {
    const glow = (color: string) =>
      new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1, toneMapped: false });
    return {
      shell: new MeshPhysicalMaterial({
        color: '#1b202c',
        metalness: 0.3,
        roughness: 0.36,
        clearcoat: 0.8,
        clearcoatRoughness: 0.22,
      }),
      grip: new MeshPhysicalMaterial({ color: '#141821', metalness: 0.2, roughness: 0.62 }),
      glossy: new MeshPhysicalMaterial({
        color: '#07090d',
        metalness: 0.2,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
      metal: new MeshStandardMaterial({ color: '#b3bdd1', metalness: 1, roughness: 0.22 }),
      violetMetal: new MeshPhysicalMaterial({ color: BRAND.violet, metalness: 0.85, roughness: 0.28, clearcoat: 0.5 }),
      rubber: new MeshStandardMaterial({ color: '#0e1117', roughness: 0.85 }),
      glowBlue: glow(BRAND.blue),
      buttons: faceButtons.map((b) => glow(b.color)),
    };
  }, []);
}

type Materials = ReturnType<typeof useControllerMaterials>;

function Thumbstick({ x, materials }: { x: number; materials: Materials }) {
  return (
    <group position={[x, -0.25, FACE_Z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.glossy}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 40]} />
      </mesh>
      <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]} material={materials.rubber}>
        <cylinderGeometry args={[0.16, 0.14, 0.11, 40]} />
      </mesh>
      <mesh position={[0, 0, 0.13]} material={materials.metal}>
        <torusGeometry args={[0.125, 0.014, 12, 48]} />
      </mesh>
    </group>
  );
}

function Controller({ animate }: { animate: boolean }) {
  const rig = useRef<Group>(null);
  const pointer = useWindowPointer();
  const materials = useControllerMaterials();

  useFrame((state, delta) => {
    if (!rig.current) return;
    const idle = animate ? Math.sin(state.clock.elapsedTime * 0.45) * 0.3 : 0;
    rig.current.rotation.y = MathUtils.damp(rig.current.rotation.y, idle + pointer.current.x * 0.3, 2.5, delta);
    rig.current.rotation.x = MathUtils.damp(rig.current.rotation.x, -0.38 + pointer.current.y * 0.15, 2.5, delta);
  });

  return (
    <group ref={rig} rotation={[-0.38, 0, 0]}>
      {/* shell */}
      <RoundedBox args={[2.5, 1.15, 0.55]} radius={0.24} smoothness={6} material={materials.shell} />

      {/* grips splay outward */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.98, -0.55, -0.02]}
          rotation={[0, 0, side * 0.42]}
          scale={[1, 1, 0.8]}
          material={materials.grip}
        >
          <capsuleGeometry args={[0.36, 0.8, 10, 28]} />
        </mesh>
      ))}

      {/* shoulder bumpers */}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[0.75, 0.16, 0.36]}
          radius={0.07}
          smoothness={4}
          position={[side * 0.82, 0.6, -0.04]}
          material={materials.violetMetal}
        />
      ))}

      {/* touchpad + light bar */}
      <RoundedBox
        args={[0.8, 0.46, 0.05]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.25, FACE_Z - 0.01]}
        material={materials.glossy}
      />
      <mesh position={[0, 0.53, FACE_Z - 0.005]} material={materials.glowBlue}>
        <boxGeometry args={[0.7, 0.025, 0.02]} />
      </mesh>

      {/* d-pad */}
      <group position={[-0.82, 0.2, FACE_Z]}>
        <mesh material={materials.metal}>
          <boxGeometry args={[0.34, 0.11, 0.06]} />
        </mesh>
        <mesh material={materials.metal}>
          <boxGeometry args={[0.11, 0.34, 0.06]} />
        </mesh>
      </group>

      {/* face buttons */}
      <group position={[0.82, 0.2, FACE_Z]}>
        {faceButtons.map((b, i) => (
          <mesh
            key={b.color}
            position={[b.offset[0], b.offset[1], 0.01]}
            rotation={[Math.PI / 2, 0, 0]}
            material={materials.buttons[i]}
          >
            <cylinderGeometry args={[0.062, 0.062, 0.05, 28]} />
          </mesh>
        ))}
      </group>

      {/* option buttons + home button */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.42, FACE_Z]} rotation={[0, 0, Math.PI / 2]} material={materials.metal}>
          <capsuleGeometry args={[0.025, 0.08, 6, 12]} />
        </mesh>
      ))}
      <mesh position={[0, -0.3, FACE_Z]} rotation={[Math.PI / 2, 0, 0]} material={materials.glowBlue}>
        <cylinderGeometry args={[0.065, 0.065, 0.03, 32]} />
      </mesh>

      <Thumbstick x={-0.4} materials={materials} />
      <Thumbstick x={0.4} materials={materials} />
    </group>
  );
}

export default function ControllerScene({ active, reducedMotion, onReady }: SceneProps) {
  const animate = active && !reducedMotion;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.3, 6.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={animate ? 'always' : 'demand'}
      onCreated={onReady}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} />
      <pointLight position={[-3, 1, 2]} intensity={8} color={BRAND.blue} />
      <pointLight position={[3, -1, 2]} intensity={8} color={BRAND.violet} />

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 1]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={4} color={BRAND.blue} position={[-5, 1, 2]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={4} color={BRAND.violet} position={[5, 0, 2]} scale={[6, 3, 1]} />
      </Environment>

      <Float speed={animate ? 1.2 : 0} rotationIntensity={0.15} floatIntensity={0.5}>
        <Controller animate={animate} />
      </Float>

      <ContactShadows
        position={[0, -1.75, 0]}
        scale={7}
        blur={2.6}
        far={3}
        opacity={0.55}
        resolution={256}
        frames={animate ? Infinity : 1}
      />
    </Canvas>
  );
}
