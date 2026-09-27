const Project = require('../models/Project');

// GET /api/projects
// GET /api/projects?category=Frontend|Backend|MERN Stack
// Returns every project (optionally filtered by category, for the
// homepage's filter tabs), sorted by the manual `order` field (ascending),
// then newest first as a tiebreaker.
const getProjects = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:slug
// Returns a single project by its slug, for the /project/:slug detail page.
// Passes a 404 error to the error handler if nothing matches.
const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      const error = new Error(`No project found with slug "${req.params.slug}"`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:slug/similar
// Returns other projects sharing the same category as :slug (excluding
// itself), for the "Similar Projects" list on the detail page. Capped at 3
// so it stays a short, scannable row rather than dumping every match.
const getSimilarProjects = async (req, res, next) => {
  try {
    const current = await Project.findOne({ slug: req.params.slug });

    if (!current) {
      const error = new Error(`No project found with slug "${req.params.slug}"`);
      error.statusCode = 404;
      throw error;
    }

    const similar = await Project.find({
      category: current.category,
      _id: { $ne: current._id },
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(3);

    res.status(200).json(similar);
  } catch (error) {
    next(error);
  }
};

// POST /api/projects (admin-only, see routes/projectRoutes.js)
// Creates a new project from the admin dashboard's form.
const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 400;
      error.message = 'A project with that slug already exists';
    } else if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    next(error);
  }
};

// PUT /api/projects/:id (admin-only)
// Updates an existing project. Uses Mongo _id (not slug) so renaming the
// slug itself doesn't break the lookup mid-edit.
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(project);
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 400;
      error.message = 'A project with that slug already exists';
    } else if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    next(error);
  }
};

// DELETE /api/projects/:id (admin-only)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  getSimilarProjects,
  createProject,
  updateProject,
  deleteProject,
};
