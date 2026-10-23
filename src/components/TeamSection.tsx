import { Gamepad2, type LucideIcon } from 'lucide-react';
import Reveal from './Reveal';
import team from '../data/team.json';

type SocialType = 'twitter' | 'linkedin' | 'gaming';

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  bio: string;
  gradient: string;
  socials: { type: SocialType; label: string; href: string }[];
}

/** Lucide component, or a text glyph for brands Lucide no longer ships */
const socialIcons: Record<SocialType, LucideIcon | string> = {
  twitter: '𝕏',
  linkedin: 'in',
  gaming: Gamepad2,
};

const teamMembers = team as TeamMember[];

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="surface surface-interactive group relative flex h-full flex-col items-center rounded-2xl p-8 text-center">
      {/* Glow wash on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(160deg, rgba(59,158,255,0.10), transparent 45%, rgba(124,92,255,0.10))',
        }}
      />

      {/* Avatar */}
      <div className="relative mb-6">
        <div
          className={`relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} font-heading text-3xl font-bold text-white shadow-[inset_0_2px_6px_rgba(255,255,255,0.35),inset_0_-8px_20px_rgba(0,0,0,0.35),0_12px_30px_-10px_rgba(0,0,0,0.8)] ring-4 ring-white/[0.06] transition-all duration-500 group-hover:ring-primary/30 group-hover:scale-105`}
        >
          {member.initials}
        </div>
        {/* Subtle rotating ring on hover */}
        <div className="absolute -inset-2 rounded-full border-2 border-transparent border-t-primary/60 border-r-accent/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:[animation:spin_4s_linear_infinite]" />
      </div>

      {/* Name & Role */}
      <h3 className="relative mb-1 text-lg font-bold text-white font-heading">
        {member.name}
      </h3>
      <p className="relative mb-4 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        {member.role}
      </p>

      {/* Bio */}
      <p className="relative mb-6 flex-1 text-sm leading-relaxed text-slate-400">
        {member.bio}
      </p>

      {/* Social Icons */}
      <div className="relative flex items-center gap-3">
        {member.socials.map((social) => {
          const Icon = socialIcons[social.type];
          return (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-sm font-bold text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/15 hover:text-white hover:shadow-[0_0_14px_rgba(59,158,255,0.35)]"
            >
              {typeof Icon === 'string' ? (
                <span aria-hidden="true">{Icon}</span>
              ) : (
                <Icon className="h-4 w-4" aria-hidden="true" />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section id="team" className="relative overflow-hidden bg-dark-lighter px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      {/* Background decoration */}
      <div className="section-divider pointer-events-none absolute inset-x-0 top-0" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/[0.07] blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-secondary/[0.08] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <Reveal className="mb-14 text-center sm:mb-16">
          <span className="eyebrow mb-5">The Studio</span>
          <h2 className="font-heading mb-4 text-4xl font-bold sm:text-5xl">
            <span className="text-metal">Meet The</span> <span className="text-gradient">Team</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-400 sm:text-lg">
            The talented minds behind the magic. Our diverse team of creators, engineers,
            and artists are united by one goal — building games that players never forget.
          </p>
        </Reveal>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {teamMembers.map((member, index) => (
            <Reveal key={member.name} delay={index * 0.08} className="h-full">
              <TeamCard member={member} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
