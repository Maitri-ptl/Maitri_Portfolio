const express = require('express');
const {
  getProjects,
  getProjectBySlug,
  getSimilarProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// Public reads
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.get('/:slug/similar', getSimilarProjects);

// Admin-only writes — requireAdmin checks the JWT before the controller
// runs. Field validation (required fields, category enum) is enforced by
// the Mongoose schema itself (models/Project.js), which the controllers
// already map to clean 400 responses.
router.post('/', requireAdmin, createProject);
router.put('/:id', requireAdmin, updateProject);
router.delete('/:id', requireAdmin, deleteProject);

module.exports = router;
