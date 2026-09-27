// Populates the database with Maitri's real portfolio projects (taken from her
// resume + the Quiz App repo). Run with: bun run seed
//
// This script is safe to re-run: it clears existing projects first, so it never
// duplicates data. NOTE: because it clears first, it will also remove any
// projects you added through the admin dashboard — after the first seed, prefer
// the admin dashboard for day-to-day edits.
//
// The project list itself lives in data/projects.js.
// (You usually don't need to run this by hand anymore: the server seeds these
// projects automatically on startup whenever the projects collection is empty.)

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Project = require('./models/Project');
const sampleProjects = require('./data/projects');

const runSeed = async () => {
  try {
    await connectDB();
    await Project.deleteMany();
    await Project.insertMany(sampleProjects);
    console.log(`Seeded ${sampleProjects.length} sample projects.`);
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

runSeed();
