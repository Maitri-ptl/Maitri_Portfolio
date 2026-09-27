// Offline fallback copy of the portfolio projects (mirrors Backend/data/projects.js).
//
// The site loads projects from the API. If the API is unreachable, or its
// database has no projects yet, the site shows this list instead so the
// Projects section is never blank. Once the API returns real projects (e.g.
// after seeding, or after you edit them in the admin dashboard), those win and
// this list is ignored.
//
// If you change a project in Backend/data/projects.js, mirror it here.

export const FALLBACK_PROJECTS = [
  {
    "title": "GlowEssence — Multi-Vendor E-Commerce",
    "slug": "glowessence",
    "category": "MERN Stack",
    "summary": "A multi-vendor clean beauty e-commerce platform with shopper, seller, and admin roles.",
    "role": "Collaborated in a 4-member team to build a full-stack e-commerce platform for a clean beauty brand using React 19, Redux Toolkit, Node.js, Express, and MongoDB.",
    "description": "GlowEssence is a full-stack e-commerce platform for a clean beauty brand, supporting three distinct roles: shopper, seller, and admin.\n\nSecurity: JWT-based authentication, bcrypt password hashing, and role-based middleware restrict sellers to managing only their own products, with secure access control across all API routes.\n\nShopper experience: live filtering and sorting, cart and wishlist, and multi-item checkout with real Razorpay payments.\n\nDashboards: seller and admin dashboards with sales and platform analytics.",
    "image": "/projects/glowessence.svg",
    "tags": [
      "E-Commerce",
      "React 19",
      "Redux Toolkit",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Razorpay"
    ],
    "liveUrl": "https://glow-essence-sigma.vercel.app/",
    "repoUrl": "https://github.com/Maitri-ptl/GlowEssence",
    "featured": true,
    "order": 1,
    "_id": "glowessence"
  },
  {
    "title": "React Blog Application",
    "slug": "react-blog-application",
    "category": "Frontend",
    "summary": "A full-featured blog app with complete CRUD for posts, built with React.js.",
    "role": "Built the full application in React.js — component architecture, state management with React Hooks, and CRUD flows against a mock REST API.",
    "description": "A full-featured blog application built with React.js, with complete CRUD (Create, Read, Update, Delete) functionality for blog posts.\n\nJSON Server is used to simulate a REST API backend, enabling realistic data handling and asynchronous state management.\n\nThe UI follows a component-based architecture and uses React Hooks for efficient state management and reusable UI components.",
    "image": "/projects/react-blog.svg",
    "tags": [
      "React.js",
      "React Hooks",
      "JSON Server",
      "REST API"
    ],
    "liveUrl": "",
    "repoUrl": "https://github.com/Maitri-ptl/Maitri-pr-3-React-Blog",
    "featured": true,
    "order": 2,
    "_id": "react-blog-application"
  },
  {
    "title": "Flipkart Clone",
    "slug": "flipkart-clone",
    "category": "MERN Stack",
    "summary": "A full-stack Flipkart-style e-commerce clone with product listings and a cart.",
    "role": "Built the full MERN stack: MongoDB schemas, RESTful Express.js APIs, and the React frontend integration.",
    "description": "A full-stack e-commerce clone of Flipkart built with the MERN stack (MongoDB, Express.js, React.js, Node.js), featuring product listings and cart functionality.\n\nMongoDB schemas were designed for product and user data, and RESTful Express.js APIs handle the backend logic and frontend integration.",
    "image": "/projects/flipkart-clone.svg",
    "tags": [
      "E-Commerce",
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js"
    ],
    "liveUrl": "",
    "repoUrl": "https://github.com/Maitri-ptl/Maitri-Node-pr-Ecom",
    "featured": true,
    "order": 3,
    "_id": "flipkart-clone"
  },
  {
    "title": "JavaScript Quiz App",
    "slug": "javascript-quiz-app",
    "category": "Frontend",
    "summary": "A 30-question JavaScript quiz with question navigation, live progress, and scoring.",
    "role": "Built the entire app with vanilla JavaScript (ES modules), HTML, CSS, and Bootstrap — quiz logic, UI, and result flow.",
    "description": "An interactive JavaScript quiz that tests core JS knowledge across 30 multiple-choice questions, built with vanilla JavaScript and Bootstrap.\n\nA question list lets you jump to any question, and answered questions are highlighted as you go. Live counters show how many questions are attempted and remaining, and you can move between questions with Previous / Next without losing your answers.\n\nOn submit, the final score is revealed with a counting animation, and closing the result resets the quiz back to the start screen.",
    "image": "/projects/quiz-app.svg",
    "tags": [
      "JavaScript",
      "Bootstrap",
      "HTML5",
      "CSS3"
    ],
    "liveUrl": "https://quiz-app-xi-henna.vercel.app/",
    "repoUrl": "https://github.com/Maitri-ptl/Quiz-App",
    "featured": true,
    "order": 4,
    "_id": "javascript-quiz-app"
  }
];

export const getFallbackProject = (slug) =>
  FALLBACK_PROJECTS.find((project) => project.slug === slug) || null;

export const getFallbackSimilar = (slug) => {
  const current = getFallbackProject(slug);
  if (!current) return [];
  return FALLBACK_PROJECTS.filter(
    (project) => project.category === current.category && project.slug !== slug
  ).slice(0, 3);
};
