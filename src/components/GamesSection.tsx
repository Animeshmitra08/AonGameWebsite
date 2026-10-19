import { useEffect, useRef, useState } from 'react';
import appsAndGames from '../data/apps-and-games.json';

interface Game {
  name: string;
  genre: string;
  description: string;
  tag: string;
  tagEmoji: string;
  rating: number;
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
    <span className="text-accent text-sm tracking-wider" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆')).join('')}
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
        className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
      >
        <StoreIcon store={store} />
        <span className="leading-tight">
          <span className="block text-[10px] font-normal text-gray-400">Get it on</span>
          <span className="block">{store}</span>
        </span>
      </a>
    );
  }

  return (
    <span
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-lg border border-dark-border bg-dark/40 px-3 py-2 text-xs text-gray-400"
    >
      <StoreIcon store={store} />
      <span className="leading-tight">
        <span className="block text-[10px] font-normal">Not available</span>
        <span className="block">{store}</span>
      </span>
    </span>
  );
}

function GameCard({ game, index }: { game: Game; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`game-card glass group relative flex flex-col overflow-hidden rounded-2xl border border-dark-border bg-dark-card transition-all duration-500 hover:scale-[1.03] hover:border-primary/50 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)] ${
        isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
      }`}
      style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
    >
      {/* Game Screenshot Placeholder */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ background: game.gradient }}
        />
        {/* Overlay pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card/90 via-transparent to-transparent" />

        {/* Genre Tag Badge */}
        <span
          className={`absolute top-3 right-3 ${game.tagColor} inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur-md`}
        >
          <span>{game.tagEmoji}</span>
          {game.tag}
        </span>

        {/* Floating title on image */}
        <div className="absolute bottom-3 left-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg font-heading">{game.name}</h3>
          <p className="text-sm text-white/70">{game.genre}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="flex-1 text-sm leading-relaxed text-gray-400">{game.description}</p>

        <div className="flex items-center justify-between gap-3 pt-2">
          <StarRating rating={game.rating} />
        </div>
        <div className="flex flex-wrap gap-2 border-t border-dark-border/70 pt-3">
          <StoreBadge store="Google Play" listing={game.googlePlay} />
          <StoreBadge store="App Store" listing={game.appStore} />
        </div>
      </div>

      {/* Glow border effect on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 border border-primary/30" />
    </div>
  );
}

export default function GamesSection() {
  return (
    <section id="games" className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-gradient font-heading mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Featured Games
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Explore our portfolio of immersive gaming experiences — from cyberpunk adventures to
            mind-bending puzzles, each crafted with passion and cutting-edge technology.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {catalog.map((game, index) => (
            <GameCard key={game.name} game={game} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
