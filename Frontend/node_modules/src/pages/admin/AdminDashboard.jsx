import { useEffect, useState } from 'react';
import { ExternalLink, FolderKanban, LogOut, Mail, MailOpen, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import Logo from '../../components/Logo';
import ThemeToggle from '../../components/ThemeToggle';
import ConfirmDialog from '../../components/ConfirmDialog';
import ProjectForm from './ProjectForm';
import ProjectsPanel from './ProjectsPanel';
import MessagesPanel from './MessagesPanel';

// The admin dashboard: an overview (stats), a Projects tab (create / edit /
// delete / reorder) and a Messages tab (contact-form inbox). All writes go
// through admin-only backend routes (requireAdmin middleware), which read the
// JWT the axios instance attaches automatically. If the session has expired,
// the axios interceptor sends the admin back to the login screen.
const AdminDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState('projects');

  const [projects, setProjects] = useState([]);
  const [projectsStatus, setProjectsStatus] = useState('loading');
  const [messages, setMessages] = useState([]);
  const [messagesStatus, setMessagesStatus] = useState('loading');

  const [editingProject, setEditingProject] = useState(null); // null = not editing
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); // { type, item }
  const [isDeleting, setIsDeleting] = useState(false);

  // Bumped to trigger the effects below to refetch, instead of calling a
  // fetch function directly from event handlers (which would duplicate the
  // effects' fetch-and-setState logic).
  const [refresh, setRefresh] = useState({ projects: 0, messages: 0 });
  const reload = (key) => setRefresh((prev) => ({ ...prev, [key]: prev[key] + 1 }));

  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        if (!cancelled) {
          setProjects(data);
          setProjectsStatus('success');
        }
      } catch {
        if (!cancelled) setProjectsStatus('error');
      }
    };
    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, [refresh.projects]);

  useEffect(() => {
    let cancelled = false;
    const fetchMessages = async () => {
      try {
        const { data } = await api.get('/messages');
        if (!cancelled) {
          setMessages(data);
          setMessagesStatus('success');
        }
      } catch {
        if (!cancelled) setMessagesStatus('error');
      }
    };
    fetchMessages();
    return () => {
      cancelled = true;
    };
  }, [refresh.messages]);

  // ---- Projects -----------------------------------------------------------

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    try {
      await api.post('/projects', formData);
      toast.success('Project created');
      setIsCreating(false);
      reload('projects');
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
      reload('projects');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Swaps a project with its neighbour, then renumbers `order` 1..n so the
  // sequence is always clean, saving only the projects whose number changed.
  const handleMove = async (project, direction) => {
    const from = projects.findIndex((p) => p._id === project._id);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= projects.length) return;

    const reordered = [...projects];
    [reordered[from], reordered[to]] = [reordered[to], reordered[from]];
    const renumbered = reordered.map((p, i) => ({ ...p, order: i + 1 }));
    const originalOrder = new Map(projects.map((p) => [p._id, p.order]));
    const changed = renumbered.filter((p) => p.order !== originalOrder.get(p._id));

    setProjects(renumbered); // optimistic
    try {
      await Promise.all(changed.map((p) => api.put(`/projects/${p._id}`, { order: p.order })));
    } catch (error) {
      toast.error(error.message);
      reload('projects'); // roll back to what the server has
    }
  };

  // ---- Messages -----------------------------------------------------------

  const handleToggleRead = async (message, read, { silent = false } = {}) => {
    setMessages((prev) => prev.map((m) => (m._id === message._id ? { ...m, read } : m))); // optimistic
    try {
      await api.patch(`/messages/${message._id}`, { read });
    } catch (error) {
      setMessages((prev) => prev.map((m) => (m._id === message._id ? { ...m, read: message.read } : m)));
      if (!silent) toast.error(error.message);
    }
  };

  // ---- Delete (shared confirm dialog) --------------------------------------

  const handleConfirmDelete = async () => {
    const { type, item } = pendingDelete;
    setIsDeleting(true);
    try {
      await api.delete(type === 'project' ? `/projects/${item._id}` : `/messages/${item._id}`);
      toast.success(type === 'project' ? 'Project deleted' : 'Message deleted');
      setPendingDelete(null);
      reload(type === 'project' ? 'projects' : 'messages');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const isFormOpen = isCreating || Boolean(editingProject);

  const stats = [
    { label: 'Projects', value: projects.length, icon: FolderKanban },
    { label: 'Featured', value: featuredCount, icon: Star },
    { label: 'Messages', value: messages.length, icon: Mail },
    { label: 'Unread', value: unreadCount, icon: MailOpen, highlight: unreadCount > 0 },
  ];

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'messages', label: 'Messages', icon: Mail, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-cream/10 bg-maroon/85 backdrop-blur-md">
        <div className="container-narrow flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Logo className="h-7" />
            <span className="rounded-pill border border-rose/50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.15em] text-rose">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-pill border border-maroon-light px-4 py-2 text-sm text-body transition-colors hover:border-rose hover:text-rose sm:flex"
            >
              <ExternalLink size={15} /> View site
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="flex items-center gap-2 rounded-pill border border-maroon-light px-3 py-2 text-sm text-body transition-colors hover:border-rose hover:text-rose sm:px-4"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container-narrow px-4 py-8 sm:px-8 sm:py-12">
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
            <div className="mb-8">
              <span className="eyebrow">Dashboard</span>
              <h1 className="mt-2 font-display text-display-3 text-cream">Welcome back, Maitri</h1>
            </div>

            <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map(({ label, value, icon: Icon, highlight }) => (
                <div
                  key={label}
                  className="rounded-card border border-maroon-light bg-maroon-dark bg-card-sheen p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between text-body">
                    <span className="text-xs uppercase tracking-[0.15em]">{label}</span>
                    <Icon size={16} className={highlight ? 'text-rose' : ''} />
                  </div>
                  <p className={`mt-2 font-display text-3xl ${highlight ? 'text-rose' : 'text-cream'}`}>{value}</p>
                </div>
              ))}
            </div>

            <div role="tablist" className="mb-8 flex gap-6 border-b border-maroon-light">
              {tabs.map(({ id, label, icon: Icon, badge }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
                    tab === id ? 'border-rose text-rose' : 'border-transparent text-body hover:text-cream'
                  }`}
                >
                  <Icon size={16} /> {label}
                  {badge > 0 && (
                    <span className="rounded-full bg-rose px-2 py-0.5 text-xs text-maroon-dark">{badge}</span>
                  )}
                </button>
              ))}
            </div>

            {tab === 'projects' ? (
              <ProjectsPanel
                projects={projects}
                status={projectsStatus}
                onCreate={() => setIsCreating(true)}
                onEdit={setEditingProject}
                onDelete={(item) => setPendingDelete({ type: 'project', item })}
                onMove={handleMove}
              />
            ) : (
              <MessagesPanel
                messages={messages}
                status={messagesStatus}
                onToggleRead={handleToggleRead}
                onDelete={(item) => setPendingDelete({ type: 'message', item })}
              />
            )}
          </>
        )}
      </main>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete?.type === 'project' ? 'Delete this project?' : 'Delete this message?'}
        message={
          pendingDelete?.type === 'project'
            ? `“${pendingDelete?.item.title}” will be removed from your portfolio. This can't be undone.`
            : `The message from ${pendingDelete?.item.name} will be permanently deleted.`
        }
        isBusy={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default AdminDashboard;
