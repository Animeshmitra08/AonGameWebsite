import { useEffect, useRef } from 'react';

/** Props every lazily-loaded scene receives from <ThreeStage />. */
export interface SceneProps {
  /** false while the stage is scrolled out of view — scenes should stop rendering */
  active: boolean;
  /** user prefers reduced motion — render a single static frame */
  reducedMotion: boolean;
  /** called once the WebGL context is created so the stage can hide its fallback */
  onReady: () => void;
}

export const BRAND = {
  blue: '#3B9EFF',
  violet: '#7C5CFF',
  lilac: '#A78BFA',
  ice: '#9CC9FF',
} as const;

let webglSupport: boolean | undefined;

export function canUseWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement('canvas');
    webglSupport = !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/**
 * Tracks the pointer across the whole window (normalised to -1…1) so scenes can
 * parallax even when the cursor isn't over the canvas. Only active on fine pointers.
 */
export function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return pointer;
}
