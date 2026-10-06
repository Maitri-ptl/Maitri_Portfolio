import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../lib/axios';
import { FALLBACK_PROJECTS } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { staggerContainer, staggerItem, revealTransition, buttonHover } from '../utils/motion';

const CATEGORIES = ['Frontend', 'Backend', 'MERN Stack'];

// "Selected Projects" section — fetches every project once from the
// backend (GET /api/projects), then filters by category client-side (the
// dataset is small, so a second round trip per tab click isn't worth it).
// Renders the result as a horizontally scrollable row of cards (a
// "slider"): each card keeps a fixed width and the row scroll-snaps
// card-by-card, so it behaves like a carousel while still being a plain
// scrollable flex row under the hood (native touch-swipe on mobile,
// drag-to-scroll or the arrow buttons on desktop).
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [activeFilter, setActiveFilter] = useState('All');
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        // Empty database → show the built-in list instead of a blank section.
        setProjects(Array.isArray(data) && data.length > 0 ? data : FALLBACK_PROJECTS);
        setStatus('success');
      } catch {
        // API unreachable (server down / not deployed yet) → same fallback.
        setProjects(FALLBACK_PROJECTS);
        setStatus('success');
      }
    };

    fetchProjects();
  }, []);

  // Category tabs: "All" plus only the categories that have at least one
  // project, so there's never an empty tab (e.g. no Backend-only project yet).
  // Add a project in that category (admin dashboard) and its tab appears.
  const filters = useMemo(
    () => ['All', ...CATEGORIES.filter((c) => projects.some((p) => p.category === c))],
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      activeFilter === 'All'
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [projects, activeFilter]
  );

  // Scrolls the row by roughly one card width in the given direction.
  const scrollByCard = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.offsetWidth || 320;
    el.scrollBy({ left: direction * (cardWidth + 32), behavior: 'smooth' });
  };

  return (
    <section id="projects" className="section-padding bg-maroon-dark">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={revealTransition}
          className="mb-8 flex flex-wrap items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-3">
            <span className="eyebrow">Portfolio</span>
            <h2 className="font-display text-display-3 text-cream">Selected Projects</h2>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#projects"
              className="group hidden items-center gap-2 text-sm uppercase tracking-[0.1em] text-rose transition-colors hover:text-rose-light md:flex"
            >
              View All Projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>

            {/* Slider controls — only useful once cards are loaded */}
            {status === 'success' && filteredProjects.length > 0 && (
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={() => scrollByCard(-1)}
                  aria-label="Scroll to previous project"
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonHover}
                  className="glass rounded-full p-2.5 text-cream transition-colors duration-200 hover:text-rose hover:shadow-glow"
                >
                  <ArrowLeft size={16} />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => scrollByCard(1)}
                  aria-label="Scroll to next project"
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonHover}
                  className="glass rounded-full p-2.5 text-cream transition-colors duration-200 hover:text-rose hover:shadow-glow"
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category filter tabs */}
        <div className="section-heading flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-pill border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? 'border-rose bg-rose text-maroon-dark'
                  : 'border-maroon-light text-body hover:border-rose hover:text-rose'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {status === 'loading' && <Loader />}
        {status === 'error' && (
          <ErrorMessage message="Couldn't load projects right now. Please check back soon." />
        )}
        {status === 'success' && filteredProjects.length === 0 && (
          <ErrorMessage message="No projects in this category yet." />
        )}

        {status === 'success' && filteredProjects.length > 0 && (
          <motion.div
            key={activeFilter}
            ref={scrollRef}
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1)}
            className="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:theme(colors.rose.DEFAULT)_transparent]"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                variants={staggerItem}
                className="w-[80vw] flex-none snap-start sm:w-[360px]"
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
