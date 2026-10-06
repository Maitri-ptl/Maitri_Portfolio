import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import api from '../lib/axios';
import { getFallbackProject, getFallbackSimilar } from '../data/projects';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import ProjectCard from '../components/ProjectCard';

// "/project/:slug" route — fetches and displays one project's full detail
// (GET /api/projects/:slug), plus a "Similar Projects" row of other
// projects sharing the same category (GET /api/projects/:slug/similar).
// Handles loading/error states, including a "project not found" message
// if the slug doesn't match anything.
const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchProject = async () => {
      setStatus('loading');
      try {
        const [{ data: projectData }, { data: similarData }] = await Promise.all([
          api.get(`/projects/${slug}`),
          api.get(`/projects/${slug}/similar`),
        ]);
        setProject(projectData);
        setSimilarProjects(similarData);
        setStatus('success');
      } catch {
        // API unreachable or project not in the DB → use the built-in copy if
        // this slug is one of the default projects; otherwise show "not found".
        const fallback = getFallbackProject(slug);
        if (fallback) {
          setProject(fallback);
          setSimilarProjects(getFallbackSimilar(slug));
          setStatus('success');
        } else {
          setStatus('error');
        }
      }
    };

    fetchProject();
    // Scroll to top on navigating between project detail pages, so
    // clicking a "Similar Project" card doesn't leave you mid-scroll on
    // the previous project's page.
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (status === 'loading') return <Loader />;

  if (status === 'error') {
    return (
      <div className="section-padding container-narrow pt-32 text-center">
        <ErrorMessage message="This project couldn't be found." />
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-rose hover:text-rose-light">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="section-padding container-narrow pt-32"
    >
      <Link
        to="/#projects"
        className="mb-8 inline-flex items-center gap-2 text-rose transition-colors hover:text-rose-light"
      >
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <img
        src={project.image}
        alt={project.title}
        className="mb-8 w-full rounded-card object-cover shadow-card"
      />

      <span className="eyebrow">{project.category}</span>
      <h1 className="mt-2 font-display text-display-3 text-cream">{project.title}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-pill bg-maroon-light px-3 py-1 text-sm text-rose">
            {tag}
          </span>
        ))}
      </div>

      {project.role && (
        <div className="mt-6 rounded-card border border-maroon-light bg-maroon-light/20 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-rose">My Role</p>
          <p className="mt-2 text-body">{project.role}</p>
        </div>
      )}

      <p className="mt-6 max-w-3xl whitespace-pre-line text-lg text-body">
        {project.description}
      </p>

      <div className="mt-8 flex gap-4">
        {project.liveUrl && (
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="flex items-center gap-2 rounded-pill bg-rose px-6 py-3 font-semibold text-maroon-dark shadow-soft hover:shadow-glow"
          >
            Live Site <ExternalLink size={16} />
          </motion.a>
        )}
        {project.repoUrl && (
          <motion.a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="flex items-center gap-2 rounded-pill border border-rose px-6 py-3 font-semibold text-cream hover:bg-rose/10"
          >
            Source Code <Github size={16} />
          </motion.a>
        )}
      </div>

      {similarProjects.length > 0 && (
        <div className="mt-stack border-t border-maroon-light pt-stack">
          <span className="eyebrow">More like this</span>
          <h2 className="mt-2 font-display text-display-3 text-cream">Similar Projects</h2>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similarProjects.map((similar, index) => (
              <ProjectCard key={similar._id} project={similar} index={index} />
            ))}
          </div>
        </div>
      )}
    </motion.article>
  );
};

export default ProjectDetail;
