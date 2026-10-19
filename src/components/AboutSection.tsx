const features = [
  {
    icon: '🎯',
    title: 'Innovative Gameplay',
    description: 'Pioneering mechanics that redefine how players interact with digital worlds.',
  },
  {
    icon: '🎨',
    title: 'Stunning Visuals',
    description: 'Breathtaking art direction powered by cutting-edge rendering technology.',
  },
  {
    icon: '🔊',
    title: 'Immersive Audio',
    description: 'Spatial soundscapes that pull you deeper into every moment of the experience.',
  },
  {
    icon: '🌐',
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
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(163,230,53,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,.35) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* ==================== LEFT COLUMN ==================== */}
          <div className="animate-fade-in-left">
            {/* label */}
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-accent">
              About Us
            </span>

            {/* heading */}
            <h2 className="font-heading text-gradient mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Crafting Digital Experiences&nbsp;Since&nbsp;2018
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

            {/* feature grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`group rounded-xl border border-dark-border bg-dark-lighter p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(163,230,53,0.12)] animation-delay-${(i + 1) * 200}`}
                >
                  <span className="mb-2 block text-2xl">{f.icon}</span>
                  <h3 className="mb-1 text-sm font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ==================== RIGHT COLUMN ==================== */}
          <div className="animate-fade-in-right flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[380px] sm:max-w-[440px]">
              {/* ---- decorative glowing orbs ---- */}
              <span className="absolute -top-6 -left-6 h-3 w-3 rounded-full bg-accent opacity-60 animate-float animation-delay-200 shadow-[0_0_12px_rgba(45,212,191,0.7)]" />
              <span className="absolute -right-4 top-1/4 h-2 w-2 rounded-full bg-secondary opacity-50 animate-float animation-delay-500 shadow-[0_0_10px_rgba(251,113,133,0.7)]" />
              <span className="absolute bottom-8 -left-8 h-2.5 w-2.5 rounded-full bg-primary opacity-50 animate-float animation-delay-700 shadow-[0_0_10px_rgba(163,230,53,0.7)]" />
              <span className="absolute -bottom-4 right-12 h-2 w-2 rounded-full bg-accent opacity-40 animate-float animation-delay-300 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
              <span className="absolute top-10 right-0 h-1.5 w-1.5 rounded-full bg-primary opacity-40 animate-float animation-delay-900 shadow-[0_0_8px_rgba(163,230,53,0.6)]" />

              {/* ---- outer ring (slow rotation) ---- */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(163,230,53,0.35), transparent 40%, rgba(45,212,191,0.25), transparent 70%, rgba(251,113,133,0.2), transparent)',
                  animation: 'spin 16s linear infinite',
                }}
              />

              {/* ---- outer static border ---- */}
              <div className="absolute inset-[3px] rounded-3xl border border-dark-border bg-dark" />

              {/* ---- middle rotating ring ---- */}
              <div
                className="absolute inset-[28px] rounded-2xl"
                style={{
                  background:
                    'conic-gradient(from 180deg, rgba(45,212,191,0.3), transparent 35%, rgba(163,230,53,0.3), transparent 65%, rgba(251,113,133,0.15), transparent)',
                  animation: 'spin 12s linear infinite reverse',
                }}
              />

              {/* ---- middle fill ---- */}
              <div className="absolute inset-[31px] rounded-2xl border border-dark-border/50 bg-dark-lighter" />

              {/* ---- inner rotating ring ---- */}
              <div
                className="absolute inset-[64px] rounded-xl"
                style={{
                  background:
                    'conic-gradient(from 90deg, rgba(163,230,53,0.4), transparent 30%, rgba(45,212,191,0.35), transparent 60%, rgba(163,230,53,0.2), transparent)',
                  animation: 'spin 10s linear infinite',
                }}
              />

              {/* ---- inner fill ---- */}
              <div className="absolute inset-[67px] rounded-xl border border-primary/20 bg-dark" />

              {/* ---- innermost rotating ring ---- */}
              <div
                className="absolute inset-[100px] rounded-lg"
                style={{
                  background:
                    'conic-gradient(from 270deg, rgba(45,212,191,0.4), transparent 25%, rgba(251,113,133,0.3), transparent 55%, rgba(163,230,53,0.35), transparent)',
                  animation: 'spin 8s linear infinite reverse',
                }}
              />

              {/* ---- innermost fill with gradient ---- */}
              <div
                className="absolute inset-[103px] rounded-lg"
                style={{
                  background:
                    'radial-gradient(circle at 40% 40%, rgba(163,230,53,0.15), rgba(45,212,191,0.08) 60%, transparent)',
                  border: '1px solid rgba(45,212,191,0.15)',
                }}
              />

              {/* ---- core glow element ---- */}
              <div className="absolute inset-[140px] flex items-center justify-center">
                <div
                  className="animate-float h-full w-full rounded-md"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(163,230,53,0.3), rgba(45,212,191,0.2))',
                    boxShadow:
                      '0 0 40px rgba(163,230,53,0.25), 0 0 80px rgba(45,212,191,0.1), inset 0 0 30px rgba(163,230,53,0.15)',
                    border: '1px solid rgba(163,230,53,0.25)',
                  }}
                />
              </div>

              {/* ---- center diamond ---- */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-10 w-10 rotate-45 rounded-sm"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    boxShadow:
                      '0 0 20px rgba(163,230,53,0.5), 0 0 60px rgba(45,212,191,0.2)',
                    animation: 'spin 20s linear infinite reverse',
                  }}
                />
              </div>

              {/* ---- corner accent lines ---- */}
              <div className="absolute top-[14px] left-[14px] h-10 w-[1px] bg-gradient-to-b from-primary/40 to-transparent" />
              <div className="absolute top-[14px] left-[14px] h-[1px] w-10 bg-gradient-to-r from-primary/40 to-transparent" />
              <div className="absolute right-[14px] bottom-[14px] h-10 w-[1px] bg-gradient-to-t from-accent/40 to-transparent" />
              <div className="absolute right-[14px] bottom-[14px] h-[1px] w-10 bg-gradient-to-l from-accent/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
