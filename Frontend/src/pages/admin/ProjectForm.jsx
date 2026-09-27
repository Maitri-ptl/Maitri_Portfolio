import { useState } from 'react';

const CATEGORIES = ['Frontend', 'Backend', 'MERN Stack'];

const EMPTY_FORM = {
  title: '',
  slug: '',
  category: 'MERN Stack',
  summary: '',
  role: '',
  description: '',
  image: '',
  tags: '',
  liveUrl: '',
  repoUrl: '',
  featured: true,
  order: 0,
};

// Shared add/edit form for a project. `initialProject` (from the API,
// tags as an array) is null when creating; when editing, its fields seed
// the form. `tags` is edited as a comma-separated string in the UI and
// split back into an array only on submit — simpler than an array-editor.
//
// The form's state is seeded once via useState's lazy initializer rather
// than synced from a prop through useEffect — the caller (AdminDashboard)
// passes a `key` that changes between "create" and each project being
// edited, which remounts this component (and so re-runs the initializer)
// instead of this component reacting to prop changes itself.
const ProjectForm = ({ initialProject, onSubmit, onCancel, isSubmitting }) => {
  const [form, setForm] = useState(() =>
    initialProject
      ? { ...EMPTY_FORM, ...initialProject, tags: (initialProject.tags || []).join(', ') }
      : EMPTY_FORM
  );

  const handleChange = (field) => (event) => {
    const value = field === 'featured' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      order: Number(form.order) || 0,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  const inputClasses =
    'w-full rounded-lg border border-maroon-light bg-maroon-light/30 px-4 py-2.5 text-cream outline-none transition-all duration-200 focus:border-rose focus:bg-maroon-light/50 focus:shadow-glow';
  const labelClasses = 'mb-1.5 block text-sm text-body';

  return (
    <form onSubmit={handleSubmit} className="glass-panel flex flex-col gap-4 rounded-card p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="title">Title</label>
          <input id="title" required value={form.title} onChange={handleChange('title')} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="slug">Slug</label>
          <input id="slug" required value={form.slug} onChange={handleChange('slug')} className={inputClasses} placeholder="my-project-slug" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={handleChange('category')} className={inputClasses}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses} htmlFor="order">Display order</label>
          <input id="order" type="number" value={form.order} onChange={handleChange('order')} className={inputClasses} />
        </div>
      </div>

      <div>
        <label className={labelClasses} htmlFor="summary">Summary (short, shown on the card)</label>
        <input id="summary" required value={form.summary} onChange={handleChange('summary')} className={inputClasses} />
      </div>

      <div>
        <label className={labelClasses} htmlFor="role">
          Role — what you actually built on this project
        </label>
        <textarea
          id="role"
          required
          rows={3}
          value={form.role}
          onChange={handleChange('role')}
          placeholder='e.g. "Built the REST API, designed the MongoDB schema, integrated JWT auth."'
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div>
        <label className={labelClasses} htmlFor="description">Description (full write-up, detail page)</label>
        <textarea id="description" required rows={5} value={form.description} onChange={handleChange('description')} className={`${inputClasses} resize-none`} />
      </div>

      <div>
        <label className={labelClasses} htmlFor="image">Image URL</label>
        <input id="image" required value={form.image} onChange={handleChange('image')} className={inputClasses} placeholder="https://..." />
      </div>

      <div>
        <label className={labelClasses} htmlFor="tags">Tags (comma-separated)</label>
        <input id="tags" value={form.tags} onChange={handleChange('tags')} className={inputClasses} placeholder="React, Node.js, MongoDB" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="liveUrl">Live URL (optional)</label>
          <input id="liveUrl" value={form.liveUrl} onChange={handleChange('liveUrl')} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="repoUrl">Repo URL (optional)</label>
          <input id="repoUrl" value={form.repoUrl} onChange={handleChange('repoUrl')} className={inputClasses} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-body">
        <input type="checkbox" checked={form.featured} onChange={handleChange('featured')} className="h-4 w-4 rounded border-maroon-light accent-rose" />
        Featured on homepage
      </label>

      <div className="mt-2 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-pill bg-rose px-6 py-2.5 font-semibold text-maroon-dark shadow-soft transition-all hover:shadow-glow disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialProject ? 'Save Changes' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-pill border border-maroon-light px-6 py-2.5 font-semibold text-cream transition-colors hover:border-rose hover:text-rose"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
