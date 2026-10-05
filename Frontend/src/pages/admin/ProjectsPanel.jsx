import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Github,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const CATEGORIES = ['Frontend', 'Backend', 'MERN Stack'];

const iconButton =
  'rounded-full border border-maroon-light p-2 text-cream transition-colors hover:border-rose hover:text-rose disabled:pointer-events-none disabled:opacity-30';

// The "Projects" tab: search + category filter over the full project list,
// with edit / delete / reorder controls. Reordering is only enabled on the
// unfiltered list, since moving inside a filtered view would be ambiguous.
const ProjectsPanel = ({ projects, status, onCreate, onEdit, onDelete, onMove }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const counts = useMemo(() => {
    const result = { All: projects.length };
    CATEGORIES.forEach((c) => {
      result[c] = projects.filter((p) => p.category === c).length;
    });
    return result;
  }, [projects]);

  const isFiltering = query.trim() !== '' || category !== 'All';

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || p.title.toLowerCase().includes(q) || p.slug.includes(q) || (p.tags || []).some((t) => t.toLowerCase().includes(q)))
    );
  }, [projects, query, category]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-body" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, slug or tag"
            aria-label="Search projects"
            className="w-full rounded-pill border border-maroon-light bg-maroon-light/30 py-2.5 pl-10 pr-4 text-sm text-cream outline-none transition-all placeholder:text-body/50 focus:border-rose focus:shadow-glow"
          />
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center justify-center gap-2 rounded-pill bg-rose px-6 py-2.5 font-semibold text-maroon-dark shadow-soft transition-all hover:shadow-glow"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-pill border px-4 py-1.5 text-sm transition-colors ${
              category === c
                ? 'border-rose bg-rose text-maroon-dark'
                : 'border-maroon-light text-body hover:border-rose hover:text-rose'
            }`}
          >
            {c} <span className="opacity-70">({counts[c]})</span>
          </button>
        ))}
      </div>

      {status === 'loading' && <Loader />}
      {status === 'error' && <ErrorMessage message="Couldn't load projects." />}

      {status === 'success' && (
        <ul className="flex flex-col gap-3">
          {projects.length === 0 && (
            <li className="text-body">No projects yet — add your first one above.</li>
          )}
          {projects.length > 0 && visible.length === 0 && (
            <li className="py-8 text-center text-body">No projects match your search.</li>
          )}

          {visible.map((project, index) => (
            <motion.li
              key={project._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 rounded-card border border-maroon-light bg-maroon-dark bg-card-sheen p-4 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <img
                  src={project.image}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden';
                  }}
                  className="h-14 w-20 flex-none rounded-md border border-maroon-light bg-maroon-light/30 object-cover"
                />
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-display text-lg text-cream">
                    <span className="truncate">{project.title}</span>
                    {project.featured && (
                      <Star size={14} className="flex-none fill-rose text-rose" aria-label="Featured" />
                    )}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-body">
                    <span className="rounded-pill border border-rose/50 px-2 py-0.5 text-rose">
                      {project.category}
                    </span>
                    <span className="truncate">/{project.slug}</span>
                    <span>· order {project.order}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-none items-center gap-2">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} live site`} className={iconButton}>
                    <ExternalLink size={16} />
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`} className={iconButton}>
                    <Github size={16} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => onMove(project, -1)}
                  disabled={isFiltering || index === 0}
                  aria-label={`Move ${project.title} up`}
                  title={isFiltering ? 'Clear search/filter to reorder' : 'Move up'}
                  className={iconButton}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(project, 1)}
                  disabled={isFiltering || index === visible.length - 1}
                  aria-label={`Move ${project.title} down`}
                  title={isFiltering ? 'Clear search/filter to reorder' : 'Move down'}
                  className={iconButton}
                >
                  <ArrowDown size={16} />
                </button>
                <button type="button" onClick={() => onEdit(project)} aria-label={`Edit ${project.title}`} className={iconButton}>
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(project)}
                  aria-label={`Delete ${project.title}`}
                  className="rounded-full border border-maroon-light p-2 text-cream transition-colors hover:border-red-500 hover:text-red-600 dark:hover:border-red-400 dark:hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsPanel;
