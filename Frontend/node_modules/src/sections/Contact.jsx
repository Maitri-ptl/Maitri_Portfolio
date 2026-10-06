import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Github, Linkedin, Download } from 'lucide-react';
import api from '../lib/axios';
import Button from '../components/Button';
import { SOCIAL_LINKS, RESUME_URL } from '../utils/constants';
import { revealTransition } from '../utils/motion';

const ICONS = { Github, Linkedin, Mail };

// "Let's Build Something" contact section. Left side: availability + social
// links. Right side: a form that client-validates with react-hook-form,
// then POSTs to /api/contact where the backend re-validates and saves it.
const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      await api.post('/contact', formData);
      toast.success("Message sent — I'll get back to you soon!");
      reset();
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-narrow grid grid-cols-1 gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={revealTransition}
        >
          <span className="eyebrow">Get In Touch</span>
          <h2 className="mt-3 font-display text-display-3 text-cream">
            Let&apos;s Build Something
          </h2>
          <p className="mt-4 text-body">
            I&apos;m currently open for new projects and collaborations.
            Whether you have a question or just want to say hi, my inbox is
            always open.
          </p>

          <ul className="mt-stack flex flex-col gap-4">
            {SOCIAL_LINKS.map((social) => {
              const Icon = ICONS[social.icon];
              return (
                <li key={social.label}>
                  <motion.a
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="flex items-center gap-3 text-body transition-colors hover:text-rose"
                  >
                    <Icon size={20} />
                    {social.label}
                  </motion.a>
                </li>
              );
            })}
          </ul>

          <Button href={RESUME_URL} download="Maitri_Patel_Resume.pdf" variant="outline" className="mt-stack">
            <Download size={18} /> Download Resume
          </Button>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={revealTransition}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="glass-panel flex flex-col gap-6 rounded-card p-6 sm:p-8"
        >
          {/* Fields get a subtle filled surface + border that brightens on
              focus (rather than a bare underline) — reads as a considered
              input control instead of an unstyled/unfinished form field. */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-body">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full rounded-lg border border-maroon-light bg-maroon-light/30 px-4 py-3 text-cream outline-none transition-all duration-200 focus:border-rose focus:bg-maroon-light/50 focus:shadow-glow"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-rose">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-body">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
              className="w-full rounded-lg border border-maroon-light bg-maroon-light/30 px-4 py-3 text-cream outline-none transition-all duration-200 focus:border-rose focus:bg-maroon-light/50 focus:shadow-glow"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-rose">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm text-body">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              {...register('message', {
                required: 'Message is required',
                minLength: { value: 10, message: 'Message must be at least 10 characters' },
              })}
              className="w-full resize-none rounded-lg border border-maroon-light bg-maroon-light/30 px-4 py-3 text-cream outline-none transition-all duration-200 focus:border-rose focus:bg-maroon-light/50 focus:shadow-glow"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-rose">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" className="self-start disabled:opacity-60">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
