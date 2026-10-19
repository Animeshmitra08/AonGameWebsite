import { Gamepad2 } from 'lucide-react';

/** Static stand-in for the two hero controllers — shown while loading or without WebGL. */
export function HeroControllersFallback() {
  // mirrors getLayout in HeroScene: beside the copy, or a row above it when stacked
  const icon =
    'absolute top-[50vh] h-[clamp(7rem,20vmin,15rem)] w-[clamp(7rem,20vmin,15rem)] -translate-y-1/2 text-slate-300/15 drop-shadow-[0_0_30px_rgba(59,158,255,0.35)] hero-stacked:top-[calc(88px_+_min(38vw,300px)_*_0.42)] hero-stacked:h-[min(30vw,13rem)] hero-stacked:w-[min(30vw,13rem)]';
  return (
    <div className="absolute inset-0">
      <Gamepad2 className={`${icon} left-[6%] -rotate-12 hero-stacked:left-[14%]`} strokeWidth={0.8} />
      <Gamepad2 className={`${icon} right-[6%] rotate-12 hero-stacked:right-[14%]`} strokeWidth={0.8} />
    </div>
  );
}

/** Static stand-in for the about-section controller. */
export function ControllerFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-[20%] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.25),transparent_70%)]" />
      <Gamepad2 className="relative h-1/3 w-1/3 text-slate-300/80 drop-shadow-[0_0_24px_rgba(59,158,255,0.45)]" strokeWidth={1.2} />
    </div>
  );
}
