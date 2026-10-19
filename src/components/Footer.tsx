import { useState, type FormEvent } from 'react';
import appsAndGames from '../data/apps-and-games.json';

const quickLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Games', href: '#games' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { name: 'Twitter', icon: '𝕏', href: '#' },
  { name: 'Discord', icon: '🎮', href: '#' },
  { name: 'YouTube', icon: '▶', href: '#' },
  { name: 'Twitch', icon: '📺', href: '#' },
  { name: 'Instagram', icon: '📸', href: '#' },
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
    <footer className="relative bg-dark-lighter border-t border-dark-border">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1 – Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <a href="#hero" className="inline-block group">
              <h3 className="text-xl font-heading font-bold tracking-wider text-white group-hover:text-primary transition-colors duration-300">
                AONDIGICON<span className="text-primary"> GAMES</span>
              </h3>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Crafting immersive gaming experiences that push the boundaries of creativity and
              technology. Join us on the journey to redefine interactive entertainment.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-dark border border-dark-border text-gray-500 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:scale-110 text-xs font-bold"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-border group-hover:bg-primary transition-colors duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Our Games */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-5">
              Our Games
            </h4>
            <ul className="space-y-3">
              {appsAndGames.games.slice(0, 4).map((game) => (
                <li key={game.name}>
                  <a
                    href="#games"
                    className="group flex items-center gap-2 text-gray-400 hover:text-accent transition-colors duration-300 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-dark-border group-hover:bg-accent transition-colors duration-300" />
                    {game.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Newsletter */}
          <div>
            <h4 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-5">
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Subscribe to get the latest news, updates, and early access to new releases.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              <button
                type="submit"
                className="group relative w-full py-2.5 rounded-lg font-semibold text-white text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary" />
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300" />
                <span className="relative z-10">
                  {subscribed ? '✓ Subscribed!' : 'Subscribe'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-dark-border to-transparent" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AONDIGICON GAMES. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
