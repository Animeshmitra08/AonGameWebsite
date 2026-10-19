import { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  bio: string;
  gradient: string;
  socials: { icon: string; label: string; href: string }[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'Alex Chen',
    role: 'Creative Director',
    initials: 'AC',
    gradient: 'from-primary via-accent to-purple-500',
    bio: 'Visionary storyteller with 12+ years crafting immersive game worlds. Alex leads the creative vision behind every title we ship.',
    socials: [
      { icon: '🐦', label: 'Twitter', href: '#' },
      { icon: '💼', label: 'LinkedIn', href: '#' },
      { icon: '🎮', label: 'Gaming', href: '#' },
    ],
  },
  {
    name: 'Sarah Mitchell',
    role: 'Lead Developer',
    initials: 'SM',
    gradient: 'from-accent via-emerald-400 to-cyan-400',
    bio: 'Full-stack engine architect who turns wild ideas into buttery-smooth 60fps experiences. Passionate about performant code.',
    socials: [
      { icon: '🐦', label: 'Twitter', href: '#' },
      { icon: '💼', label: 'LinkedIn', href: '#' },
      { icon: '🎮', label: 'Gaming', href: '#' },
    ],
  },
  {
    name: 'James Park',
    role: 'Art Director',
    initials: 'JP',
    gradient: 'from-purple-500 via-pink-500 to-rose-400',
    bio: 'Award-winning artist blending stylized aesthetics with cutting-edge rendering. Every pixel tells a story under his direction.',
    socials: [
      { icon: '🐦', label: 'Twitter', href: '#' },
      { icon: '💼', label: 'LinkedIn', href: '#' },
      { icon: '🎮', label: 'Gaming', href: '#' },
    ],
  },
  {
    name: 'Luna Rodriguez',
    role: 'Sound Designer',
    initials: 'LR',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    bio: 'Audio alchemist who sculpts soundscapes that pull players deeper into the experience. Grammy-nominated composer and sound engineer.',
    socials: [
      { icon: '🐦', label: 'Twitter', href: '#' },
      { icon: '💼', label: 'LinkedIn', href: '#' },
      { icon: '🎮', label: 'Gaming', href: '#' },
    ],
  },
];

function TeamCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="glass group relative flex flex-col items-center rounded-2xl border border-dark-border bg-dark-card p-8 text-center transition-all duration-500 ease-out hover:border-primary/50"
      style={{
        transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 0 30px rgba(163, 230, 53, 0.15), 0 20px 60px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(0, 0, 0, 0.2)',
        animationDelay: `${index * 150}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow border effect on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(145deg, rgba(163,230,53,0.1), transparent 50%, rgba(45,212,191,0.1))',
        }}
      />

      {/* Avatar */}
      <div className="relative mb-6">
        <div
          className={`flex h-[120px] w-[120px] items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-3xl font-bold text-white shadow-lg ring-4 ring-white/10 transition-all duration-500 group-hover:ring-primary/30 group-hover:scale-105`}
        >
          {member.initials}
        </div>
        {/* Subtle rotating ring on hover */}
        <div
          className="absolute -inset-2 rounded-full border-2 border-transparent border-t-primary/40 border-r-accent/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            animation: isHovered ? 'spin 4s linear infinite' : 'none',
          }}
        />
      </div>

      {/* Name & Role */}
      <h3 className="mb-1 text-xl font-bold text-white transition-colors duration-300 font-heading">
        {member.name}
      </h3>
      <p className="mb-4 text-sm font-semibold tracking-wider text-primary uppercase">
        {member.role}
      </p>

      {/* Bio */}
      <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-400">
        {member.bio}
      </p>

      {/* Social Icons */}
      <div className="flex items-center gap-4">
        {member.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-dark-lighter text-lg transition-all duration-300 hover:bg-primary/20 hover:scale-110 hover:shadow-[0_0_12px_rgba(163,230,53,0.3)]"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section id="team" className="relative overflow-hidden bg-dark-lighter px-4 py-24 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-heading text-gradient mb-4 text-4xl font-bold sm:text-5xl">
            Meet The Team
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            The talented minds behind the magic. Our diverse team of creators, engineers,
            and artists are united by one goal — building games that players never forget.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
