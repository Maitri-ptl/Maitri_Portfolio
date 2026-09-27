const mongoose = require('mongoose');

// Schema for a single portfolio project.
// `slug` is the URL-friendly identifier used for the /project/:slug detail
// route on the frontend (e.g. "task-manager-api"), so it must be unique.
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      // Drives the homepage filter tabs and the "Similar Projects" list on
      // the detail page (same category = similar).
      type: String,
      required: [true, 'Project category is required'],
      enum: ['Frontend', 'Backend', 'MERN Stack'],
    },
    summary: {
      // Short description shown on the project card in the grid.
      type: String,
      required: [true, 'Project summary is required'],
      trim: true,
    },
    role: {
      // What was actually built/done on this project, e.g. "Built the REST
      // API, designed the MongoDB schema, integrated JWT auth."
      type: String,
      required: [true, 'Project role is required'],
      trim: true,
    },
    description: {
      // Longer write-up shown on the project detail page.
      type: String,
      required: [true, 'Project description is required'],
    },
    image: {
      // URL or path to the card/hero image for this project.
      type: String,
      required: [true, 'Project image is required'],
    },
    tags: {
      // e.g. ["React", "Node.js", "MongoDB"] — shown as small pills on the card.
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: '',
    },
    repoUrl: {
      type: String,
      default: '',
    },
    featured: {
      // Marks a project for the "Selected Projects" home section.
      type: Boolean,
      default: true,
    },
    order: {
      // Lower numbers show first; lets us control display order without
      // relying on insertion order or timestamps.
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
