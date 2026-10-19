import { lazy, useEffect, useState, useRef } from 'react';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import ThreeStage from './three/ThreeStage';
import { HeroControllersFallback } from './three/Fallbacks';

const HeroScene = lazy(() => import('./three/HeroScene'));

/* ------------------------------------------------------------------ */
/*  Counting-up hook – animates a number from 0 → target              */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(target);
            return;
          }
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ------------------------------------------------------------------ */
/*  Particle field                                                     */
/* ------------------------------------------------------------------ */
interface Particle {
  id: number;
  size: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
  opacity: number;
}

function generateParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1.5,                     // 1.5-4.5 px
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${(Math.random() * 6).toFixed(1)}s`,        // 0-6s stagger
    duration: `${(Math.random() * 8 + 6).toFixed(1)}s`, // 6-14s cycle
    opacity: Math.random() * 0.4 + 0.15,
  }));
}

const particles = generateParticles(18);

/* ------------------------------------------------------------------ */
/*  Stat card data                                                     */
/* ------------------------------------------------------------------ */
const stats: { value: number; suffix: string; label: string }[] = [
  { value: 50, suffix: '+', label: 'Games Released' },
  { value: 10, suffix: 'M+', label: 'Players' },
  { value: 15, suffix: '+', label: 'Awards' },
  { value: 8, suffix: '', label: 'Years Experience' },
];

/* ------------------------------------------------------------------ */
/*  Stat card component                                                */
/* ------------------------------------------------------------------ */
function StatCard({ value, suffix, label }: (typeof stats)[number]) {
  const { count, ref } = useCountUp(value, 2200);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center gap-1 px-4 py-5 sm:px-6 group"
    >
      {/* glow */}
      <span className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="text-3xl md:text-4xl font-heading font-bold text-white tabular-nums drop-shadow-[0_0_18px_rgba(59,158,255,0.45)]">
        {count}
        <span className="text-primary">{suffix}</span>
      </span>
      <span className="text-[11px] sm:text-xs font-medium text-slate-400 tracking-[0.18em] uppercase text-center">
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col items-center overflow-hidden bg-dark"
    >
      {/* -------- drifting gradient blobs (blurred, compositor-only transforms) -------- */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="hero-blob -left-[15%] -top-[20%] h-[max(55vw,26rem)] w-[max(55vw,26rem)] bg-primary/35 [animation-duration:24s]" />
        <div className="hero-blob -right-[15%] top-[5%] h-[max(50vw,24rem)] w-[max(50vw,24rem)] bg-secondary/35 [animation-duration:28s] [animation-delay:-8s]" />
        <div className="hero-blob left-[25%] -bottom-[25%] h-[max(42vw,22rem)] w-[max(42vw,22rem)] bg-accent/30 [animation-duration:22s] [animation-delay:-14s]" />
        <div className="hero-blob left-[45%] top-[25%] h-[max(26vw,14rem)] w-[max(26vw,14rem)] bg-cyan-400/20 [animation-duration:30s] [animation-delay:-4s]" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-gradient-to-b from-transparent to-dark" />

      {/* -------- floating particles -------- */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-float pointer-events-none absolute z-[1] rounded-full bg-primary/70"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* -------- 3D controllers flanking the copy (one shared canvas) -------- */}
      <div className="pointer-events-none absolute inset-0 z-[5] animate-fade-in-up [animation-delay:0.2s] [animation-fill-mode:backwards]">
        <ThreeStage
          scene={HeroScene}
          fallback={<HeroControllersFallback />}
          eager
          className="h-full w-full"
        />
      </div>

      {/* soft dark pool behind the copy keeps it legible over blobs and models */}
      <div className="pointer-events-none absolute left-1/2 top-[45%] z-[6] h-[70%] w-[min(56rem,100%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(7,8,12,0.7),transparent)]" />

      {/* -------- content -------- */}
      {/* stacked layout: reserve the row the controllers occupy (see getLayout in HeroScene) */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pt-24 pb-6 text-center sm:px-6 md:pt-28 hero-stacked:justify-start hero-stacked:pt-[calc(104px_+_min(38vw,300px)_*_0.85)]!">
        <span className="eyebrow animate-fade-in-up">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Indie Game Studio
        </span>

        {/* headline */}
        <h1
          className="mt-6 font-heading text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-extrabold leading-[1.02] tracking-tight animate-fade-in-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
        >
          <span className="text-metal block">We Create</span>
          <span className="text-gradient block">Worlds</span>
        </h1>

        {/* subtitle */}
        <p
          className="mt-6 max-w-xl text-base sm:text-lg md:text-xl text-slate-300/90 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}
        >
          Pushing the boundaries of interactive entertainment with cutting-edge
          technology and boundless creativity
        </p>

        {/* CTA buttons */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}
        >
          {/* primary CTA */}
          <a
            href="#games"
            className="btn-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wider"
          >
            Explore Our Games
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>

          {/* secondary CTA */}
          <a
            href="#about"
            className="btn-ghost inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wider"
          >
            Meet the Studio
          </a>
        </div>
      </div>

      {/* -------- scroll cue -------- */}
      <a
        href="#games"
        className="relative z-10 flex flex-col items-center gap-1 py-4 text-slate-500 transition-colors hover:text-primary animate-bounce rounded-md"
        aria-label="Scroll to games"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="h-5 w-5 text-primary" aria-hidden="true" />
      </a>

      <div
        className="relative z-10 w-full px-4 pb-6 sm:px-6 lg:px-8 animate-fade-in-up"
        style={{ animationDelay: '0.75s', animationFillMode: 'backwards' }}
      >
        {/* gap-px over a hairline background draws the dividers at every breakpoint */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] backdrop-blur-xl shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)] md:grid-cols-4 [&>*]:bg-dark-card/85">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
