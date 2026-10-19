import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  type LucideIcon,
} from 'lucide-react';
import Reveal from './Reveal';

/* icon is a Lucide component, or a text glyph for brands Lucide no longer ships */
const socialLinks: { name: string; icon: LucideIcon | string; href: string }[] = [
  { name: 'Twitter', icon: '𝕏', href: '#' },
  { name: 'Discord', icon: MessageCircle, href: '#' },
  { name: 'YouTube', icon: Play, href: '#' },
  { name: 'LinkedIn', icon: 'in', href: '#' },
];

const contactDetails = [
  { icon: Mail, label: 'Email', value: 'hello@aondigicon.com', href: 'mailto:hello@aondigicon.com' },
  { icon: MapPin, label: 'Location', value: 'San Francisco, CA', href: '#' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
];

const subjectOptions = ['General', 'Partnership', 'Career', 'Support'];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }, 1500);
  };

  const inputClasses =
    'w-full bg-dark/80 border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-white/15 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none';

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-dark overflow-hidden">
      {/* Background accents */}
      <div className="section-divider pointer-events-none absolute inset-x-0 top-0" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/[0.08] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Reveal className="text-center mb-14 sm:mb-16">
          <span className="eyebrow mb-5">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            <span className="text-metal">Contact</span> <span className="text-gradient">Us</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column – Contact info */}
          <Reveal className="space-y-8">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gradient mb-4">
                Let's Build Something Epic
              </h3>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                Whether you're looking to collaborate on a groundbreaking game, explore partnership
                opportunities, or simply want to say hello — our team is ready to connect. Let's
                create the next generation of gaming experiences together.
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              {contactDetails.map((detail) => (
                <a
                  key={detail.label}
                  href={detail.href}
                  className="surface surface-interactive group flex items-center gap-4 p-4 rounded-xl"
                >
                  <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg border border-primary/25 bg-gradient-to-br from-primary/20 to-secondary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <detail.icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 uppercase tracking-[0.16em]">{detail.label}</p>
                    <p className="text-white font-medium truncate group-hover:text-primary transition-colors duration-300">
                      {detail.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-[0.16em] mb-3">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:border-primary/50 hover:bg-primary/15 hover:shadow-[0_0_14px_rgba(59,158,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 text-sm font-bold"
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
          </Reveal>

          {/* Right column – Contact form */}
          <Reveal delay={0.12}>
            <form
              onSubmit={handleSubmit}
              className="surface relative p-6 sm:p-8 rounded-2xl"
            >
              {/* top edge highlight */}
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              <h4 className="text-xl font-heading font-semibold text-white mb-6">
                Send us a message
              </h4>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-sm text-slate-400 mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-sm text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="block text-sm text-slate-400 mb-1.5">
                    Subject
                  </label>
                  <div className="relative">
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`${inputClasses} appearance-none cursor-pointer pr-10`}
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-dark-card">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-sm text-slate-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Tell us about your project or idea..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-live="polite"
                  className="btn-primary group w-full py-3.5 rounded-xl font-semibold"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="w-5 h-5 animate-spin" aria-hidden="true" />
                        Sending...
                      </>
                    ) : submitted ? (
                      <>
                        <Check className="w-5 h-5" aria-hidden="true" />
                        Message Sent!
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
