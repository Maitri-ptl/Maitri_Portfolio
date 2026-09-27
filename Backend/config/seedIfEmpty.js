const Project = require('../models/Project');
const defaultProjects = require('../data/projects');

// Runs once after the DB connects: if the projects collection is EMPTY, insert
// the default portfolio projects so the site never shows a blank Projects
// section on a fresh database (new Atlas cluster, first deploy, etc.).
//
// It only ever inserts when there are zero projects, so it never overwrites or
// duplicates anything you add through the admin dashboard. To turn it off, set
// AUTO_SEED=false in Backend/.env.
const seedIfEmpty = async () => {
  if (process.env.AUTO_SEED === 'false') return;

  try {
    const count = await Project.countDocuments();
    if (count > 0) return;

    await Project.insertMany(defaultProjects);
    console.log(`Projects collection was empty — added ${defaultProjects.length} default projects.`);
  } catch (error) {
    // Never crash the API over seeding; the site has its own fallback list.
    console.error(`Auto-seed failed: ${error.message}`);
  }
};

module.exports = seedIfEmpty;
