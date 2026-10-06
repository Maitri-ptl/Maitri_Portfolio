import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cardHover, springSoft } from '../utils/motion';

// A single project card, modeled on the reference's layout: a number +
// category label above the image, then the thumbnail with a hover
// overlay, then the title and tag pills below. The whole card links to
// the project's detail page at /project/:slug.
const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
      className="h-full"
    >
      <Link to={`/project/${project.slug}`} className="group block">
        {/* Number + primary category, e.g. "01  Branding & Web Design" */}
        <div className="mb-4 flex items-baseline gap-3 text-xs uppercase tracking-[0.15em] text-body/70">
          <span className="font-display text-lg text-rose">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="accent-rule" />
          <span>{project.tags[0] || 'Project'}</span>
        </div>

        {/* Elevated card surface: soft warm-tinted shadow + a subtle inner
            highlight along the top edge (bg-card-sheen) so the surface reads
            as a raised panel rather than a flat color block. The whole
            surface lifts via the parent's `cardHover` spring, and the
            border glows in sync so it feels like one coordinated motion
            rather than separate CSS transitions racing each other. */}
        <div className="relative overflow-hidden rounded-card border border-maroon-light/60 bg-card-sheen bg-maroon-light shadow-card transition-[box-shadow,border-color] duration-300 group-hover:border-rose/50 group-hover:shadow-lift">
          <div className="aspect-[4/3] overflow-hidden">
            <motion.img
              src={project.image}
              alt={project.title}
              variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
              transition={springSoft}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Hover overlay with "View Project" prompt — frosted glass pill
              instead of a flat tinted box, echoing the nav/hero glass so the
              "reveal" reads as a premium surface, not just a color fade. */}
          <motion.div
            initial={{ opacity: 0 }}
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            className="absolute inset-0 flex items-center justify-center bg-maroon-dark/50 backdrop-blur-[2px]"
          >
            <motion.span
              variants={{ rest: { y: 8, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
              transition={springSoft}
              className="glass flex items-center gap-2 rounded-pill px-5 py-2 font-sans text-sm font-semibold text-cream"
            >
              View Project <ArrowUpRight size={16} />
            </motion.span>
          </motion.div>
        </div>

        <h3 className="mt-5 font-display text-xl text-cream">{project.title}</h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-pill border border-maroon-light bg-maroon-light/40 px-3 py-1 text-xs text-rose"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
