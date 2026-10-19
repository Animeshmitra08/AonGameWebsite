import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import SceneBoundary from './SceneBoundary';
import { canUseWebGL, type SceneProps } from './utils';

interface ThreeStageProps {
  scene: LazyExoticComponent<ComponentType<SceneProps>>;
  /** static visual shown while loading, without WebGL, or if the scene fails */
  fallback: ReactNode;
  className?: string;
  /** mount immediately (above the fold) instead of waiting for the viewport */
  eager?: boolean;
}

/**
 * Hosts a lazily-loaded R3F scene inside a fixed-size box so nothing shifts while
 * three.js downloads. The canvas only mounts near the viewport, pauses when
 * scrolled away, and cross-fades over the static fallback once it has a context.
 */
export default function ThreeStage({ scene: Scene, fallback, className = '', eager = false }: ThreeStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [supported] = useState(canUseWebGL);
  const [mounted, setMounted] = useState(eager);
  const [inView, setInView] = useState(eager);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el || !supported) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [supported]);

  const showScene = ready && !failed;

  return (
    <div ref={ref} className={`relative ${className}`} aria-hidden="true">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${showScene ? 'opacity-0' : 'opacity-100'}`}
      >
        {fallback}
      </div>

      {supported && mounted && !failed && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${showScene ? 'opacity-100' : 'opacity-0'}`}
        >
          <SceneBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <Scene active={inView} reducedMotion={reducedMotion} onReady={() => setReady(true)} />
            </Suspense>
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
