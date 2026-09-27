import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Trash2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAdminAuth from '../../hooks/useAdminAuth';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import ProjectForm from './ProjectForm';

// The admin dashboard: lists every project with edit/delete controls, and
// toggles into ProjectForm for creating a new one or editing an existing
// one. All writes go through the admin-only backend routes (requireAdmin
// middleware), which read the JWT the axios instance attaches automatically.
const AdminDashboard = () => {
  const { logout } = useAdminAuth();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [editingProject, setEditingProject] = useState(null); // null = not editing
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bumped after every create/update/delete to trigger the effect below to
  // refetch, instead of calling a fetch function directly from event
  // handlers (which would duplicate the effect's fetch-and-setState logic).
  const [refreshCount, setRefreshCount] = useState(0);
  const loadProjects = () => setRefreshCount((count) => count + 1);

  useEffect(() => {
    let cancelled = false;

    const fetchProjects = async () => {
      setStatus('loading');
      try {
        const { data } = await api.get('/projects');
        if (!cancelled) {
          setProjects(data);
          setStatus('success');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, [refreshCount]);

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    try {
      await api.post('/projects', formData);
      toast.success('Project created');
      setIsCreating(false);
      loadProjects();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      await api.put(`/projects/${editingProject._id}`, formData);
      toast.success('Project updated');
      setEditingProject(null);
      loadProjects();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    try {
      await api.delete(`/projects/${project._id}`);
      toast.success('Project deleted');
      loadProjects();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isFormOpen = isCreating || Boolean(editingProject);

  return (
    <div className="section-padding container-narrow pt-32">
      <div className="mb-stack flex items-center justify-between">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="mt-2 font-display text-display-3 text-cream">Projects</h1>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-pill border border-maroon-light px-4 py-2 text-sm text-body transition-colors hover:border-rose hover:text-rose"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {isFormOpen ? (
        <ProjectForm
          key={editingProject?._id || 'new'}
          initialProject={editingProject}
          isSubmitting={isSubmitting}
          onSubmit={editingProject ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsCreating(false);
            setEditingProject(null);
          }}
        />
      ) : (
        <>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="mb-8 flex items-center gap-2 rounded-pill bg-rose px-6 py-2.5 font-semibold text-maroon-dark shadow-soft transition-all hover:shadow-glow"
          >
            <Plus size={18} /> New Project
          </button>

          {status === 'loading' && <Loader />}
          {status === 'error' && <ErrorMessage message="Couldn't load projects." />}

          {status === 'success' && (
            <div className="flex flex-col gap-3">
              {projects.length === 0 && (
                <p className="text-body">No projects yet — add your first one above.</p>
              )}
              {projects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-card border border-maroon-light bg-maroon-dark bg-card-sheen p-4"
                >
                  <div>
                    <p className="font-display text-lg text-cream">{project.title}</p>
                    <p className="text-sm text-body">
                      {project.category} · /{project.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProject(project)}
                      aria-label={`Edit ${project.title}`}
                      className="rounded-full border border-maroon-light p-2 text-cream transition-colors hover:border-rose hover:text-rose"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      aria-label={`Delete ${project.title}`}
                      className="rounded-full border border-maroon-light p-2 text-cream transition-colors hover:border-red-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
