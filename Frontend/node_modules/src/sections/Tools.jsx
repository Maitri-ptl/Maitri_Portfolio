import { motion } from 'framer-motion';
import { DEV_TOOLS, LANGUAGES } from '../utils/constants';
import ToolBadge from '../components/ToolBadge';
import { staggerContainer, staggerItem, revealTransition } from '../utils/motion';

// "Tools I Use" section, split into two groups: day-to-day dev tools/AI
// assistants, and the core languages/tech stack — clearer than one mixed
// grid, and lets each group's badge count breathe at its own width.
// Alternating badges within a group get a small vertical offset on desktop
// (md:even:mt-5) to break the rigid equal-grid look into a more editorial
// brick pattern, without touching the grid structure — degrades to a flat
// grid below md where the offset is dropped.
const ToolGroup = ({ eyebrow, items }) => (
  <div>
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={revealTransition}
      className="eyebrow mb-6 text-center"
    >
      {eyebrow}
    </motion.p>

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(0.06)}
      className="grid grid-cols-2 gap-gap sm:grid-cols-3 md:grid-cols-4"
    >
      {items.map((tool, index) => (
        <motion.div key={tool.label} variants={staggerItem} className={index % 2 === 1 ? 'md:mt-5' : ''}>
          <ToolBadge label={tool.label} icon={tool.icon} />
        </motion.div>
      ))}
    </motion.div>
  </div>
);

const Tools = () => {
  return (
    <section className="section-padding bg-maroon-dark">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={revealTransition}
          className="section-heading flex flex-col items-center gap-3 text-center"
        >
          <span className="eyebrow">Stack</span>
          <h2 className="font-display text-display-3 text-cream">Tools I Use</h2>
        </motion.div>

        <div className="flex flex-col gap-stack">
          <ToolGroup eyebrow="Dev Tools & AI" items={DEV_TOOLS} />
          <ToolGroup eyebrow="Languages & Frameworks" items={LANGUAGES} />
        </div>
      </div>
    </section>
  );
};

export default Tools;
