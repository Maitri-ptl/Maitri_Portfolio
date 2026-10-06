import { motion } from 'framer-motion';
import { Award, Download, GraduationCap, MapPin } from 'lucide-react';
import Button from '../components/Button';
import { RESUME_URL } from '../utils/constants';
import { revealTransition, staggerContainer, staggerItem } from '../utils/motion';
import portrait from '../assets/maitri.jpg';

// Quick facts shown under the intro, taken from the resume.
const FACTS = [
  { icon: MapPin, label: 'Based in', value: 'Navsari, Gujarat, India' },
  {
    icon: GraduationCap,
    label: 'Education',
    value: 'B.Sc. IT (2nd year) — Vidhya Deep University, Kim, Gujarat',
  },
  {
    icon: Award,
    label: 'Certification',
    value:
      'Full Stack Development with MERN — thingQbator Program, Nasscom Foundation (Cisco CSR Initiative), in partnership with Zikshaa',
  },
];

// "About" section, placed right before Projects: portrait on one side, a short
// intro + quick facts (from the resume) on the other. Stacks to a single column
// on mobile with the photo first.
const About = () => {
  return (
    <section id="about" className="section-padding">
      <div className="container-narrow grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        {/* Portrait — offset accent frame behind the photo so it sits in the
            same rose/maroon language as the rest of the site. */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={revealTransition}
          className="relative mx-auto w-full max-w-xs sm:max-w-sm"
        >
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 h-full w-full rounded-card border border-rose/50"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 scale-105 rounded-full bg-blob-rose blur-3xl"
          />
          <img
            src={portrait}
            alt="Portrait of Maitri Patel"
            width="800"
            height="800"
            loading="lazy"
            className="relative aspect-[4/5] w-full rounded-card object-cover object-top shadow-lift"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerContainer(0.1)}
        >
          <motion.div variants={staggerItem} className="flex flex-col gap-3">
            <span className="eyebrow">About Me</span>
            <h2 className="font-display text-display-3 text-cream">Hi, I&apos;m Maitri Patel</h2>
          </motion.div>

          <motion.p variants={staggerItem} className="mt-5 text-body md:text-lg">
            I&apos;m an aspiring Full Stack Developer with hands-on experience in the MERN stack
            (MongoDB, Express.js, React.js, Node.js), plus HTML, CSS, JavaScript, and SQL. I enjoy
            building responsive web applications and working through CRUD flows from the database
            all the way to the UI.
          </motion.p>
          <motion.p variants={staggerItem} className="mt-4 text-body md:text-lg">
            I&apos;m looking for an entry-level Full Stack Developer role where I can contribute to
            real-world web development projects.
          </motion.p>

          <motion.ul variants={staggerItem} className="mt-stack flex flex-col gap-5">
            {FACTS.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full border border-maroon-light bg-maroon-light/40 text-rose">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-meta font-semibold uppercase text-rose">{label}</p>
                  <p className="mt-1 text-cream">{value}</p>
                </div>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={staggerItem} className="mt-stack">
            <Button href={RESUME_URL} download="Maitri_Patel_Resume.pdf">
              <Download size={18} /> Download Resume
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
