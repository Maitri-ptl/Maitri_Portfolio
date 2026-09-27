# Maitri Patel — Portfolio

A full-stack (MERN) personal portfolio: React + Vite + Tailwind CSS on the
frontend, Express + MongoDB on the backend. Projects are stored in MongoDB
and fetched dynamically; contact form submissions are saved to MongoDB too.

## Project structure

```
Maitri_Portfolio/
├── Frontend/     → React app (Vite, Tailwind, React Router)
├── Backend/      → Express API (Mongoose, MongoDB)
└── README.md     → this file
```

## Prerequisites

- [Bun](https://bun.sh) (used as the package manager/runtime for both apps)
- MongoDB running locally on the default port (`mongodb://localhost:27017`),
  or a MongoDB Atlas connection string

## 1. Backend setup

```bash
cd Backend
bun install
```

`Backend/.env` needs these variables (see `.env.example` for the template):

```
MONGO_URI=<your MongoDB Atlas connection string, or a local mongodb:// URI>
PORT=5000
CLIENT_URL=http://localhost:5173
ADMIN_PASS=<a password only you know>
ADMIN_URL=/admin-<a random slug>
JWT_SECRET=<a long random hex string>
```

`Frontend/.env` needs a matching `VITE_ADMIN_URL` set to the same slug as
`ADMIN_URL` above (see the Admin dashboard section below).

Seed the database with sample projects (safe to re-run — it clears and
re-inserts each time):

```bash
bun run seed
```

Start the API:

```bash
bun run dev
```

The server runs at `http://localhost:5000`. Check it's alive:
`http://localhost:5000/api/health`

## 2. Frontend setup

In a separate terminal:

```bash
cd Frontend
bun install
bun run dev
```

The site runs at `http://localhost:5173`.

`Frontend/.env` already points at the local API:

```
VITE_API_URL=http://localhost:5000/api
```

## Personal content

- **About photo** — `Frontend/src/assets/maitri.jpg` (shown in the About section,
  `Frontend/src/sections/About.jsx`). Replace the file, keeping the filename.
- **Resume** — `Frontend/public/Maitri_Patel_Resume.pdf`. Replace the file (same
  name) to update the View/Download buttons in the navbar, hero, About, and contact.
- **Social links** — `Frontend/src/utils/constants.js` → `SOCIAL_LINKS`.
- **Projects** — `Backend/seed.js` contains the real projects (GlowEssence, React
  Blog, Flipkart Clone, JavaScript Quiz App). Thumbnails are in
  `Frontend/public/projects/`; swap them for real screenshots via the admin
  dashboard (image URL) when ready. Re-running `bun run seed` wipes the collection
  first, so use the admin dashboard for later edits.

## Light / dark theme

The navbar has a sun/moon toggle. The choice is saved in `localStorage`; first-time
visitors get dark. All colors are CSS variables in `Frontend/src/index.css`
(`:root` = light, `.dark` = dark), mapped to the same Tailwind color names
(`maroon`, `cream`, `rose`, `body`) in `tailwind.config.js`.

## Available scripts

**Backend** (`cd Backend`)
| Command | What it does |
|---|---|
| `bun run dev` | Start the API with nodemon (auto-restarts on file changes) |
| `bun run start` | Start the API normally |
| `bun run seed` | Seed the database with sample projects |

**Frontend** (`cd Frontend`)
| Command | What it does |
|---|---|
| `bun run dev` | Start the Vite dev server |
| `bun run build` | Build for production into `Frontend/dist` |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |

## Learning more

See [LEARNINGS.md](./LEARNINGS.md) for beginner-friendly explanations of
every library and pattern used in this codebase (framer-motion, Mongoose,
CORS, environment variables, etc.), with pointers to exactly where each one
is used.
