import { useState, useEffect, useCallback } from 'react';
import { m } from 'framer-motion';
import { Play, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Games', href: '#games' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── lock body scroll + close on Escape when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  /* ── intersection observer for active link highlight ── */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* ── smooth scroll handler ── */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(href);
      }
    },
    [],
  );

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-dark/70 backdrop-blur-xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] border-b border-white/[0.06]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          {/* ── Logo ── */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="relative flex items-baseline gap-0 group select-none rounded-md"
          >
            <span className="font-heading text-base sm:text-xl md:text-2xl font-black tracking-wider text-white drop-shadow-[0_0_12px_rgba(59,158,255,0.35)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(59,158,255,0.6)]">
              AONDIGICON
            </span>
            <span className="font-heading text-base sm:text-xl md:text-2xl font-black tracking-wider text-accent ml-1 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(167,139,250,0.8)]">
              GAMES
            </span>
            {/* animated glow line under logo */}
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500 group-hover:w-full" />
          </a>

          {/* ── Desktop Links ── */}
          <ul className="hidden md:flex items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.025] p-1 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <li key={link.href} className="relative">
                  {isActive && (
                    <m.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full border border-primary/25 bg-gradient-to-b from-primary/20 to-secondary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative block px-3.5 lg:px-4 py-1.5 text-xs lg:text-[13px] font-semibold tracking-[0.14em] uppercase rounded-full transition-colors duration-300
                      ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}
                    `}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA ── */}
          <a
            href="#games"
            onClick={(e) => handleNavClick(e, '#games')}
            className="btn-primary hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold uppercase tracking-wider"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Play Now</span>
          </a>

          {/* ── Mobile Hamburger ── */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:text-white hover:border-primary/40 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <div className="relative w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile Slide-in Menu ── */}
      <aside
        id="mobile-menu"
        aria-label="Mobile navigation"
        inert={!mobileOpen}
        className={`fixed top-0 right-0 z-50 h-full w-[min(20rem,85vw)] bg-dark-lighter/95 backdrop-blur-2xl border-l border-white/[0.06] shadow-2xl shadow-black/60 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* close button */}
        <div className="flex items-center justify-between px-5 h-16">
          <span className="font-heading text-lg font-bold text-white">
            AONDIGICON<span className="text-accent ml-1">GAMES</span>
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="h-px mx-5 bg-gradient-to-r from-primary/50 via-secondary/30 to-transparent" />

        {/* mobile nav links */}
        <ul className="flex flex-col gap-1 px-3 mt-4">
          {navLinks.map((link, idx) => {
            const isActive = activeSection === link.href;
            return (
              <li
                key={link.href}
                className="transition-all duration-500"
                style={{
                  transitionDelay: mobileOpen ? `${idx * 60 + 100}ms` : '0ms',
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(24px)',
                }}
              >
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300
                    ${isActive
                      ? 'text-white bg-gradient-to-r from-primary/15 to-secondary/5 border border-primary/25'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      isActive ? 'bg-primary shadow-[0_0_8px_rgba(59,158,255,0.8)]' : 'bg-slate-600'
                    }`}
                  />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* mobile CTA */}
        <div
          className="px-5 mt-6 transition-all duration-500"
          style={{
            transitionDelay: mobileOpen ? `${navLinks.length * 60 + 160}ms` : '0ms',
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <a
            href="#games"
            onClick={(e) => handleNavClick(e, '#games')}
            className="btn-primary flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wider"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            Play Now
          </a>
        </div>

        {/* decorative bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-secondary/10 to-transparent pointer-events-none" />
      </aside>
    </>
  );
}
