import { useState, useEffect, useCallback } from 'react';

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

  /* ── lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
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
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-dark/80 backdrop-blur-xl shadow-lg shadow-primary/5 border-b border-dark-border/50'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          {/* ── Logo ── */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="relative flex items-baseline gap-0 group select-none"
          >
            <span className="font-heading text-base sm:text-xl md:text-2xl font-black tracking-wider text-white drop-shadow-[0_0_12px_rgba(163,230,53,0.35)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(163,230,53,0.6)]">
              AONDIGICON
            </span>
            <span className="font-heading text-base sm:text-xl md:text-2xl font-black tracking-wider text-accent ml-1 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_18px_rgba(45,212,191,0.8)]">
              GAMES
            </span>
            {/* animated glow line under logo */}
            <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-500 group-hover:w-full" />
          </a>

          {/* ── Desktop Links ── */}
          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-3 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-300 rounded-md
                      ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'}
                    `}
                  >
                    {link.label}
                    {/* active / hover underline */}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-accent transition-all duration-300 ${
                        isActive ? 'w-4/5 opacity-100' : 'w-0 opacity-0'
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA ── */}
          <a
            href="#games"
            onClick={(e) => handleNavClick(e, '#games')}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider text-white
              bg-gradient-to-r from-primary via-secondary to-accent
              shadow-lg shadow-primary/25
              transition-all duration-300
              hover:shadow-primary/50 hover:scale-105 hover:brightness-110
              active:scale-95
              relative overflow-hidden group"
          >
            {/* shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="relative z-10">Play Now</span>
          </a>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? 'translate-y-[9px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? '-translate-y-[9px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile Slide-in Menu ── */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-dark/95 backdrop-blur-2xl border-l border-dark-border/60 shadow-2xl shadow-black/50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* close button */}
        <div className="flex items-center justify-between px-5 h-16">
          <span className="font-heading text-lg font-bold text-white">
            AONDIGICON<span className="text-accent ml-1">GAMES</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-px mx-5 bg-gradient-to-r from-primary/40 via-accent/30 to-transparent" />

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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-300
                    ${isActive
                      ? 'text-accent bg-accent/10 border border-accent/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      isActive ? 'bg-accent shadow-[0_0_6px_rgba(45,212,191,0.6)]' : 'bg-gray-600'
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
            className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-white
              bg-gradient-to-r from-primary via-secondary to-accent
              shadow-lg shadow-primary/25
              hover:shadow-primary/40 hover:brightness-110
              active:scale-[0.97] transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Now
          </a>
        </div>

        {/* decorative bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      </aside>
    </>
  );
}
