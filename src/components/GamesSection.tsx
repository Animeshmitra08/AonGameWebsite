import type { PointerEvent } from 'react';
import { Star } from 'lucide-react';
import appsAndGames from '../data/apps-and-games.json';
import Reveal from './Reveal';

interface Game {
  name: string;
  genre: string;
  description: string;
  tag: string;
  tagEmoji: string;
  rating: number;
  bgimage?: string;
  gradient: string;
  tagColor: string;
  googlePlay: StoreListing;
  appStore: StoreListing;
}

interface StoreListing {
  available: boolean;
  link: string | null;
}

const catalog: Game[] = appsAndGames.games;

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-primary text-primary drop-shadow-[0_0_4px_rgba(59,158,255,0.6)]' : 'text-slate-600'}`}
        />
      ))}
    </span>
  );
}

type StoreName = 'Google Play' | 'App Store';

function StoreIcon({ store }: { store: StoreName }) {
  if (store === 'Google Play') {
    return (
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 2.7c-.3.4-.5.9-.5 1.6v15.4c0 .7.2 1.2.5 1.6L12.2 12 3.5 2.7Z" fill="#34A853" />
        <path d="m14 10.2-2.2-2.3-7.4-5.2L12.2 12l1.8-1.8Z" fill="#4285F4" />
        <path d="m4.4 21.3 7.4-5.2 2.2-2.3-1.8-1.8-8.7 9.3c.3.1.6.1.9 0Z" fill="#FBBC04" />
        <path d="m20 10.3-4.3-2.4-3.5 4.1 3.5 4.1 4.3-2.4c1.4-.8 1.4-2.6 0-3.4Z" fill="#EA4335" />
      </svg>
    );
  }

  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m7 20 7-16M17 20 10 4M5.5 14h13" />
    </svg>
  );
}

function StoreBadge({ store, listing }: { store: StoreName; listing: StoreListing }) {
  const label =
    listing.available && listing.link
      ? `Get it on ${store}`
      : `${store} · Not available`;

  if (listing.available && listing.link) {
    return (
      <a
        href={listing.link}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/20 hover:shadow-[0_8px_20px_-8px_rgba(59,158,255,0.6)]"
      >
        <StoreIcon store={store} />
        <span className="leading-tight">
          <span className="block text-[10px] font-normal text-slate-400">Get it on</span>
          <span className="block">{store}</span>
        </span>
      </a>
    );
  }

  return (
    <span
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-slate-500"
    >
      <span className="opacity-50 grayscale">
        <StoreIcon store={store} />
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] font-normal">Not available</span>
        <span className="block">{store}</span>
      </span>
    </span>
  );
}

function monogram(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

/* moves the card's accent light to follow the pointer */
function trackPointer(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

function GameCard({ game, index }: { game: Game; index: number }) {
  return (
    <article
      onPointerMove={trackPointer}
      className="game-card surface surface-interactive group relative flex h-full flex-col overflow-hidden rounded-2xl"
    >
      {/* ── Key art (built from the game's own gradient) ── */}
      <div className="relative h-52 w-full overflow-hidden">
        <div
          className="absolute inset-0 saturate-[1.1] transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ background: game.gradient }}
        />
        {/* cinematic grade so bright gradients sit in the dark UI */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/30 to-black/60" />
        {/* perspective floor grid */}
        <div
          className="absolute inset-x-[-20%] bottom-0 h-3/4 origin-bottom opacity-40 [mask-image:linear-gradient(to_top,#000_10%,transparent_90%)]"
          style={{
            transform: 'perspective(320px) rotateX(58deg)',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        {/* monogram */}
        <span
          aria-hidden="true"
          className="absolute -right-2 top-1/2 -translate-y-1/2 font-heading text-[7.5rem] font-black leading-none tracking-tighter text-white/15 mix-blend-overlay transition-transform duration-700 ease-out group-hover:-translate-x-2"
        >
          {monogram(game.name)}
        </span>
        {/* screenshot in a half-circle peeking in from the left edge, mirroring the monogram */}
        {game.bgimage && (
          <div
            aria-hidden="true"
            className="absolute left-0 top-[42%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 transition-[translate,scale] duration-700 ease-out group-hover:-translate-x-[38%] group-hover:scale-105"
          >
            <div className="relative h-full w-full overflow-hidden rounded-full bg-white/[0.04] ring-1 ring-white/20 shadow-[0_0_30px_-6px_rgba(0,0,0,0.6)] transition-[box-shadow] duration-700 group-hover:ring-white/40 group-hover:shadow-[0_0_34px_-4px_rgba(59,158,255,0.45)]">
              <img
                src={game.bgimage}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                className="h-full w-full object-cover opacity-30 transition-[scale,opacity] duration-700 ease-out group-hover:scale-115 group-hover:opacity-55"
              />
              {/* tint so the photo sits in the card's colour */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_50%,transparent_30%,rgba(0,0,0,0.45)_100%)]" />
            </div>
            {/* rotating arc on hover */}
            <div className="absolute -inset-2 rounded-full border-2 border-transparent border-t-white/50 border-r-primary/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:[animation:spin_4s_linear_infinite]" />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/20 to-transparent" />

        {/* index */}
        <span className="absolute top-3 left-4 font-heading text-[11px] font-bold tracking-[0.2em] text-white/60">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Genre Tag Badge */}
        <span
          className={`absolute top-3 right-3 ${game.tagColor} inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-md`}
        >
          <span aria-hidden="true">{game.tagEmoji}</span>
          {game.tag}
        </span>

        {/* Floating title on image */}
        <div className="absolute bottom-3 left-4 right-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/90">{game.genre}</p>
          <h3 className="font-heading text-xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">{game.name}</h3>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="relative flex flex-1 flex-col gap-4 p-5">
        <p className="flex-1 text-sm leading-relaxed text-slate-400">{game.description}</p>

        <div className="flex items-center gap-3">
          <StarRating rating={game.rating} />
        </div>
        <div className="flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
          <StoreBadge store="Google Play" listing={game.googlePlay} />
          <StoreBadge store="App Store" listing={game.appStore} />
        </div>
      </div>

      {/* top edge highlight */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </article>
  );
}

export default function GamesSection() {
  return (
    <section id="games" className="relative overflow-hidden py-24 sm:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[min(900px,100%)] rounded-full bg-primary/[0.07] blur-[120px]" />
      <div className="section-divider pointer-events-none absolute inset-x-0 top-0" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <Reveal className="mb-14 text-center sm:mb-16">
          <span className="eyebrow mb-5">Our Portfolio</span>
          <h2 className="font-heading mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-metal">Featured</span> <span className="text-gradient">Games</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-400 sm:text-lg">
            Explore our portfolio of immersive gaming experiences — from cyberpunk adventures to
            mind-bending puzzles, each crafted with passion and cutting-edge technology.
          </p>
        </Reveal>

        {/* Games Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {catalog.map((game, index) => (
            <Reveal key={game.name} delay={(index % 3) * 0.08} className="h-full">
              <GameCard game={game} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
