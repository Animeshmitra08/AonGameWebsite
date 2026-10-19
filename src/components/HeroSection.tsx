import { useEffect, useState, useRef } from 'react';

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
    size: Math.random() * 4 + 2,                       // 2-6 px
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${(Math.random() * 6).toFixed(1)}s`,        // 0-6s stagger
    duration: `${(Math.random() * 8 + 6).toFixed(1)}s`, // 6-14s cycle
    opacity: Math.random() * 0.5 + 0.2,
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
      className="relative flex flex-col items-center gap-1 px-6 py-4 group"
    >
      {/* glow */}
      <span className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <span className="text-3xl md:text-4xl font-heading font-bold text-primary drop-shadow-[0_0_12px_var(--color-primary)]">
        {count}
        {suffix}
      </span>
      <span className="text-sm text-gray-400 tracking-wide uppercase">
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
      {/* -------- animated gradient background -------- */}
      <div
        className="pointer-events-none absolute inset-0 z-0 animate-gradient"
        style={{
          background:
            'linear-gradient(135deg, #071411 0%, #10251d 25%, #10231e 50%, #0c1b16 75%, #071411 100%)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* -------- floating particles -------- */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-float pointer-events-none absolute z-[1] rounded-full bg-primary/60"
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

      {/* -------- content -------- */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-4 pt-20 pb-8 max-w-4xl mx-auto">
        {/* headline */}
        <h1 className="text-gradient font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight animate-fade-in-up">
          We Create Worlds
        </h1>

        {/* subtitle */}
        <p
          className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-300 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}
        >
          Pushing the boundaries of interactive entertainment with cutting-edge
          technology and boundless creativity
        </p>

        {/* CTA buttons */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-5 animate-fade-in-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
        >
          {/* primary CTA */}
          <a
            href="#games"
            className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-primary/25 transition-transform duration-300 hover:scale-105 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            Explore Our Games
          </a>

          {/* secondary CTA */}
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-full border border-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            Meet the Studio
          </a>
        </div>
      </div>

      {/* -------- scroll cue -------- */}
      <a
        href="#games"
        className="relative z-10 flex flex-col items-center gap-1 py-4 text-gray-500 transition-colors hover:text-primary animate-bounce"
        aria-label="Scroll to games"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <svg
          className="h-5 w-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>

      <div
        className="relative z-10 w-full border-t border-white/5 bg-dark/60 backdrop-blur-md animate-fade-in-up"
        style={{ animationDelay: '0.75s', animationFillMode: 'backwards' }}
      >
        <div className="mx-auto grid max-w-5xl grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

    </section>
  );
}
