import { useState, type FormEvent } from 'react';

const socialLinks = [
  { name: 'Twitter', icon: '𝕏', href: '#' },
  { name: 'Discord', icon: '🎮', href: '#' },
  { name: 'YouTube', icon: '▶', href: '#' },
  { name: 'LinkedIn', icon: 'in', href: '#' },
];

const contactDetails = [
  { icon: '📧', label: 'Email', value: 'hello@aondigicon.com', href: 'mailto:hello@aondigicon.com' },
  { icon: '📍', label: 'Location', value: 'San Francisco, CA', href: '#' },
  { icon: '📱', label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
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
    'w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none';

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-dark overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-4 border border-primary/20">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column – Contact info */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-4">
                Let's Build Something Epic
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Whether you're looking to collaborate on a groundbreaking game, explore partnership
                opportunities, or simply want to say hello — our team is ready to connect. Let's
                create the next generation of gaming experiences together.
              </p>
            </div>

            {/* Contact details */}
            <div className="space-y-5">
              {contactDetails.map((detail) => (
                <a
                  key={detail.label}
                  href={detail.href}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-dark-card/50 border border-dark-border hover:border-primary/40 transition-all duration-300"
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-2xl group-hover:scale-110 transition-transform duration-300">
                    {detail.icon}
                  </span>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">{detail.label}</p>
                    <p className="text-white font-medium group-hover:text-primary transition-colors duration-300">
                      {detail.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="flex items-center justify-center w-11 h-11 rounded-lg bg-dark-card border border-dark-border text-gray-400 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:scale-110 text-sm font-bold"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right column – Contact form */}
          <div className="animate-fade-in-up [animation-delay:200ms]">
            <form
              onSubmit={handleSubmit}
              className="relative p-6 sm:p-8 rounded-2xl bg-dark-card/60 backdrop-blur-xl border border-dark-border shadow-2xl shadow-black/20"
            >
              {/* Glow accent */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />

              <h4 className="text-xl font-heading font-semibold text-white mb-6">
                Send us a message
              </h4>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-sm text-gray-400 mb-1.5">
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
                  <label htmlFor="contact-email" className="block text-sm text-gray-400 mb-1.5">
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
                  <label htmlFor="contact-subject" className="block text-sm text-gray-400 mb-1.5">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-sm text-gray-400 mb-1.5">
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
                  className="group relative w-full py-3.5 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {/* Gradient bg */}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary" />
                  {/* Glow */}
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : submitted ? (
                      <>✓ Message Sent!</>
                    ) : (
                      <>
                        Send Message
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
