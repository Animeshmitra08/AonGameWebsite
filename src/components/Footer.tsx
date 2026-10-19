import { useState, type FormEvent } from 'react';
import { Camera, Check, MessageCircle, Play, Tv, type LucideIcon } from 'lucide-react';
import appsAndGames from '../data/apps-and-games.json';

const quickLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Games', href: '#games' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

/* icon is a Lucide component, or a text glyph for brands Lucide no longer ships */
const socialLinks: { name: string; icon: LucideIcon | string; href: string }[] = [
  { name: 'Twitter', icon: '𝕏', href: '#' },
  { name: 'Discord', icon: MessageCircle, href: '#' },
  { name: 'YouTube', icon: Play, href: '#' },
  { name: 'Twitch', icon: Tv, href: '#' },
  { name: 'Instagram', icon: Camera, href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative overflow-hidden bg-dark-lighter">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[min(800px,100%)] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />

      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1 – Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <a href="#hero" className="inline-block group rounded-md">
              <h3 className="text-xl font-heading font-bold tracking-wider text-white transition-colors duration-300 group-hover:drop-shadow-[0_0_12px_rgba(59,158,255,0.5)]">
                AONDIGICON<span className="text-accent"> GAMES</span>
              </h3>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Crafting immersive gaming experiences that push the boundaries of creativity and
              technology. Join us on the journey to redefine interactive entertainment.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:border-primary/50 hover:bg-primary/15 transition-all duration-300 hover:-translate-y-0.5 text-xs font-bold"
                >
                  {typeof social.icon === 'string' ? (
                    <span aria-hidden="true">{social.icon}</span>
                  ) : (
                    <social.icon className="w-4 h-4" aria-hidden="true" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h4 className="text-xs font-heading font-semibold text-white uppercase tracking-[0.2em] mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-border group-hover:bg-primary group-hover:shadow-[0_0_6px_rgba(59,158,255,0.8)] transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Our Games */}
          <div>
            <h4 className="text-xs font-heading font-semibold text-white uppercase tracking-[0.2em] mb-5">
              Our Games
            </h4>
            <ul className="space-y-3">
              {appsAndGames.games.slice(0, 4).map((game) => (
                <li key={game.name}>
                  <a
                    href="#games"
                    className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-border group-hover:bg-accent group-hover:shadow-[0_0_6px_rgba(167,139,250,0.8)] transition-all duration-300" />
                    {game.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Newsletter */}
          <div>
            <h4 className="text-xs font-heading font-semibold text-white uppercase tracking-[0.2em] mb-5">
              Newsletter
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Subscribe to get the latest news, updates, and early access to new releases.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                required
                aria-label="Email address"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark/80 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all duration-300 hover:border-white/15 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
              />
              <button
                type="submit"
                aria-live="polite"
                className="btn-primary w-full py-2.5 rounded-xl font-semibold text-sm"
              >
                <span className="inline-flex items-center justify-center gap-1.5">
                  {subscribed ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      Subscribed!
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AONDIGICON GAMES. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-slate-500 hover:text-slate-200 transition-colors duration-300 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-slate-200 transition-colors duration-300 text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
