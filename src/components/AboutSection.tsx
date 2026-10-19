import { lazy } from 'react';
import { Globe, Palette, Target, Volume2 } from 'lucide-react';
import Reveal from './Reveal';
import ThreeStage from './three/ThreeStage';
import { ControllerFallback } from './three/Fallbacks';

const ControllerScene = lazy(() => import('./three/ControllerScene'));

const features = [
  {
    icon: Target,
    title: 'Innovative Gameplay',
    description: 'Pioneering mechanics that redefine how players interact with digital worlds.',
  },
  {
    icon: Palette,
    title: 'Stunning Visuals',
    description: 'Breathtaking art direction powered by cutting-edge rendering technology.',
  },
  {
    icon: Volume2,
    title: 'Immersive Audio',
    description: 'Spatial soundscapes that pull you deeper into every moment of the experience.',
  },
  {
    icon: Globe,
    title: 'Cross-Platform',
    description: 'Play anywhere, anytime — seamless experiences across all major platforms.',
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-dark py-24 sm:py-32"
    >
      {/* ---- subtle background grid ---- */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[480px] w-[480px] rounded-full bg-secondary/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* ==================== LEFT COLUMN ==================== */}
          <div>
            <Reveal>
              {/* label */}
              <span className="eyebrow mb-5">About Us</span>

              {/* heading */}
              <h2 className="font-heading mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                <span className="text-metal">Crafting Digital Experiences</span>{' '}
                <span className="text-gradient">Since&nbsp;2018</span>
              </h2>

              {/* paragraphs */}
              <p className="mb-4 max-w-xl leading-relaxed text-slate-300/90">
                At AonDigicon Games we live and breathe game development. Our
                multidisciplinary team of designers, engineers, and storytellers
                shares a single obsession — building interactive worlds that
                captivate, challenge, and inspire millions of players around the
                globe.
              </p>
              <p className="mb-10 max-w-xl leading-relaxed text-slate-400/90">
                From rapid prototypes to polished AAA-quality releases, we push
                the boundaries of what's possible. Every pixel, every polygon,
                every line of code is driven by relentless innovation and a deep
                love for the craft.
              </p>
            </Reveal>

            {/* feature grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08} className="h-full">
                  <div className="surface surface-interactive group h-full rounded-xl p-5">
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-gradient-to-br from-primary/20 to-secondary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-300 group-hover:text-white">
                      <f.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mb-1 text-sm font-semibold text-white">
                      {f.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-400">
                      {f.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ==================== RIGHT COLUMN ==================== */}
          <Reveal delay={0.15} className="flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[380px] sm:max-w-[480px]">
              {/* ---- decorative glowing orbs ---- */}
              <span className="absolute -top-6 -left-6 h-3 w-3 rounded-full bg-primary opacity-60 animate-float animation-delay-200 shadow-[0_0_12px_rgba(59,158,255,0.7)]" />
              <span className="absolute -right-4 top-1/4 h-2 w-2 rounded-full bg-secondary opacity-50 animate-float animation-delay-500 shadow-[0_0_10px_rgba(124,92,255,0.7)]" />
              <span className="absolute bottom-8 -left-8 h-2.5 w-2.5 rounded-full bg-accent opacity-50 animate-float animation-delay-700 shadow-[0_0_10px_rgba(167,139,250,0.7)]" />
              <span className="absolute -bottom-4 right-12 h-2 w-2 rounded-full bg-primary opacity-40 animate-float animation-delay-300 shadow-[0_0_8px_rgba(59,158,255,0.6)]" />

              {/* ---- outer ring (slow rotation, clipped into an animated border) ---- */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div
                  className="absolute inset-[-50%]"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(59,158,255,0.7), transparent 25%, rgba(124,92,255,0.55), transparent 55%, rgba(167,139,250,0.4), transparent 80%)',
                    animation: 'spin 16s linear infinite',
                  }}
                />
              </div>

              {/* ---- framed stage ---- */}
              <div className="absolute inset-[1.5px] overflow-hidden rounded-3xl border border-white/[0.06] bg-[radial-gradient(ellipse_at_50%_35%,#161A25_0%,#0B0D13_60%,#07080C_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
                <ThreeStage
                  scene={ControllerScene}
                  fallback={<ControllerFallback />}
                  className="h-full w-full"
                />
              </div>

              {/* ---- corner accent lines ---- */}
              <div className="pointer-events-none absolute top-[14px] left-[14px] h-10 w-[1px] bg-gradient-to-b from-primary/60 to-transparent" />
              <div className="pointer-events-none absolute top-[14px] left-[14px] h-[1px] w-10 bg-gradient-to-r from-primary/60 to-transparent" />
              <div className="pointer-events-none absolute right-[14px] bottom-[14px] h-10 w-[1px] bg-gradient-to-t from-accent/60 to-transparent" />
              <div className="pointer-events-none absolute right-[14px] bottom-[14px] h-[1px] w-10 bg-gradient-to-l from-accent/60 to-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
