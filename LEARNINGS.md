# Learnings

Notes on every library, tool, and pattern used in this project that's worth
understanding — written for a developer who knows JavaScript but is new to
these specific tools. Updated as the project was built, not dumped at the end.

---

## React Router (v6) — nested routes + `<Outlet />`

**What it is:** A library that lets a React app have multiple "pages"
(URLs) without reloading the browser. It swaps components in and out based
on the current URL.

**Why it's used here:** We need `/`, `/project/:slug`, and a catch-all 404
page, but the Navbar and Footer should stay on screen across all of them.
`<Outlet />` is a placeholder inside a shared layout component — React
Router renders whichever route matched *into* that placeholder.

**Where to find it:**
- Route definitions: `Frontend/src/App.jsx`
- The shared layout with `<Outlet />`: `Frontend/src/layouts/MainLayout.jsx`
- `BrowserRouter` wraps the whole app in `Frontend/src/main.jsx`

```jsx
// App.jsx
<Route element={<MainLayout />}>
  <Route path="/" element={<Home />} />
  <Route path="/project/:slug" element={<ProjectDetail />} />
  <Route path="*" element={<NotFound />} />
</Route>
```

---

## framer-motion and `whileInView`

**What it is:** An animation library for React. Instead of writing CSS
`@keyframes` by hand, you describe a start state and end state as plain
objects, and framer-motion handles the transition.

**Why it's used here:** Every section needs a subtle fade/slide-in effect
as you scroll to it. `whileInView` tells framer-motion "animate to this
state once this element scrolls into the viewport" — no manual scroll
listeners needed.

**Where to find it:** Every file in `Frontend/src/sections/`, e.g.:

```jsx
// Projects.jsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }} // only animate once, when 30% visible
  transition={{ duration: 0.5 }}
>
```

---

## IntersectionObserver / scroll-spy pattern

**What it is:** A built-in browser API that tells you when an element
enters or leaves the viewport, without you having to calculate scroll
positions yourself.

**Why it's used here:** The Navbar needs to highlight whichever section
(Home, Projects, Process, Contact) is currently on screen as you scroll —
that's called a "scroll-spy." A custom hook (`useScrollSpy`) sets up one
`IntersectionObserver` watching all the section elements and updates state
whenever one becomes visible.

**Where to find it:** `Frontend/src/hooks/useScrollSpy.js`, used by
`Frontend/src/components/Navbar.jsx`.

---

## Mongoose schemas & models

**What it is:** MongoDB itself doesn't enforce a fixed shape for documents
(it's schema-less), but that makes bugs easy — e.g. saving a project without
a title. Mongoose is a library that lets you define a **schema** (the shape
a document should have) and turns it into a **model** (an object you use to
query/create/update documents of that shape).

**Why it's used here:** We have two kinds of data — projects and contact
messages — each with required fields (a project needs a title and slug; a
message needs a name, email, and message body). Mongoose validates this
automatically before anything gets saved.

**Where to find it:** `Backend/models/Project.js`, `Backend/models/Message.js`

```js
// models/Message.js
const messageSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'] },
  message: { type: String, required: [true, 'Message is required'] },
});
```

---

## Express middleware — what a middleware function even is

**What it is:** A middleware is just a function that runs *before* your
route handler, with access to the request and response objects. It can
inspect/modify the request, end the response early, or pass control along
with `next()`. Express runs middleware in the order you `.use()` them.

**Why it's used here:** Several things need to happen to *every* request
(or every request of a certain kind) before the "real" logic runs:
- `express.json()` — parses the raw request body into `req.body`
- `cors()` — checks/allows cross-origin requests
- `validateContact` — checks the contact form fields are valid *before* the
  controller tries to save anything
- `errorHandler` — a special middleware (four arguments instead of three)
  that catches errors from anywhere else in the app

**Where to find it:** `Backend/server.js` (where middleware is mounted with
`app.use(...)`), `Backend/middleware/errorHandler.js`,
`Backend/middleware/validateContact.js`

```js
// server.js
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api/contact', contactRoutes); // validateContact runs inside this router
app.use(errorHandler); // must be mounted LAST
```

---

## CORS (why the backend needs it)

**What it is:** CORS (Cross-Origin Resource Sharing) is a browser security
rule: by default, JavaScript running on one origin (e.g.
`http://localhost:5173`) can't make requests to a different origin (e.g.
`http://localhost:5000`) unless that other server explicitly allows it.

**Why it's used here:** The React app (port 5173) and the Express API
(port 5000) are different origins during local development (and will likely
be different domains in production too). Without CORS configured, the
browser would block every `axios` call the frontend makes to the API.

**Where to find it:** `Backend/server.js` — `cors({ origin: process.env.CLIENT_URL })`
only allows requests from the exact frontend URL in `.env`, not from anywhere.

---

## react-hook-form

**What it is:** A form library that manages form state (values, validation,
error messages, submit status) without you writing `useState` for every
single input.

**Why it's used here:** The Contact form needs validation (required fields,
email format, minimum message length) and a loading state while submitting.
`register()` wires an `<input>` up to the form's internal state and
validation rules in one line.

**Where to find it:** `Frontend/src/sections/Contact.jsx`

```jsx
const { register, handleSubmit, formState: { errors } } = useForm();

<input {...register('email', {
  required: 'Email is required',
  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
})} />
{errors.email && <p>{errors.email.message}</p>}
```

---

## express-validator

**What it is:** The backend equivalent of react-hook-form's validation —
a set of middleware functions that check `req.body` fields against rules
(required, is-an-email, length limits, etc.) before your controller runs.

**Why it's used here:** Client-side validation (react-hook-form) can be
bypassed — someone could send a raw POST request straight to the API. The
backend re-validates independently so bad data can never reach the
database, regardless of what hit the API.

**Where to find it:** `Backend/middleware/validateContact.js` (the rules),
`Backend/controllers/contactController.js` (where `validationResult(req)`
checks whether those rules passed).

---

## Environment variables (`.env`) and why secrets aren't hardcoded

**What it is:** A `.env` file holds key-value pairs (like `MONGO_URI=...`)
that get loaded into `process.env` at runtime, instead of being written
directly into your code.

**Why it's used here:** Two reasons. First, secrets — a database connection
string can contain a username/password, and you never want that committed
to git (that's why `.env` is in `.gitignore`). Second, portability — the
same code can run against a local database in development and a different
one in production just by changing `.env`, with zero code changes.

**Where to find it:** `Backend/.env` (real values, git-ignored),
`Backend/.env.example` (a template showing what keys are needed, safe to
commit), loaded via `require('dotenv').config()` at the top of
`Backend/server.js`. The frontend has the same pattern with
`Frontend/.env` and `VITE_API_URL` (Vite requires env vars exposed to the
browser to be prefixed with `VITE_`).

---

## Tailwind's theme extension (why we're not writing plain CSS)

**What it is:** Tailwind CSS gives you small utility classes (`px-4`,
`text-lg`, `bg-red-500`) instead of writing custom CSS files. `tailwind.config.js`
lets you *extend* Tailwind's defaults with your own design tokens — custom
colors, fonts, spacing — so those utilities become project-specific
(`bg-maroon`, `font-display`) instead of generic.

**Why it's used here:** The whole site needs one consistent color palette
and typography system (maroon/cream/rose from the design reference). Instead
of hardcoding hex codes in every component, they're defined once in
`tailwind.config.js` and reused everywhere as class names — changing the
brand color later means editing one file, not searching every component.

**Where to find it:** `Frontend/tailwind.config.js`

```js
theme: {
  extend: {
    colors: { maroon: { DEFAULT: '#2a0e12', dark: '#1a080b' }, cream: '#f0e4d3' },
    fontFamily: { display: ['"Playfair Display"', 'serif'], sans: ['Inter', 'sans-serif'] },
  },
}
```

---

## Centralized error handling in Express

**What it is:** Instead of every controller wrapping its logic in
`try/catch` and independently deciding how to format an error response,
controllers call `next(error)` and one shared middleware (with 4 arguments:
`(err, req, res, next)`) decides how *all* errors get turned into JSON
responses.

**Why it's used here:** Consistency — every error from the API (a 404
project, failed validation, a database error) comes back in the same
`{ success: false, message: "..." }` shape, so the frontend only needs one
way to read errors (see `Frontend/src/lib/axios.js`'s response interceptor).

**Where to find it:** `Backend/middleware/errorHandler.js`, called from
every controller via `catch (error) { next(error) }`.

---

## Axios instance + interceptors

**What it is:** Axios is an HTTP client (an alternative to the browser's
built-in `fetch`). Creating an "instance" via `axios.create()` lets you
pre-configure things like the base URL once, instead of repeating it in
every request. An "interceptor" is a function that runs automatically on
every request or response.

**Why it's used here:** Every API call in the frontend needs the same
`baseURL` (from `.env`) and the same error-shape handling. Rather than
importing raw `axios` and repeating `http://localhost:5000/api/...` and
try/catch boilerplate everywhere, components import one shared `api`
instance.

**Where to find it:** `Frontend/src/lib/axios.js`

```js
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(error.response?.data?.message || error.message))
);
```

---

## react-hot-toast

**What it is:** A small library for showing temporary "toast" pop-up
notifications (e.g. "Message sent!") without building that UI yourself.

**Why it's used here:** The contact form needs to tell the user whether
their submission succeeded or failed, without a jarring full-page alert.
`<Toaster />` is mounted once in the layout; any component can then call
`toast.success(...)` or `toast.error(...)` from anywhere.

**Where to find it:** `<Toaster />` in `Frontend/src/layouts/MainLayout.jsx`,
`toast.success(...)` / `toast.error(...)` in `Frontend/src/sections/Contact.jsx`.

---

## lucide-react

**What it is:** A library of consistent, MIT-licensed SVG icons packaged
as React components — `<Menu />`, `<ArrowRight />`, etc.

**Why it's used here:** Rather than hand-drawing SVGs or pulling in
inconsistent icon sets, every icon across the site (nav hamburger, socials,
tool badges, arrows) comes from one library, so they all share the same
visual weight and style.

**Where to find it:** Used throughout, e.g. `Frontend/src/components/Navbar.jsx`
(`Menu`, `X`), `Frontend/src/components/ToolBadge.jsx` (dynamic icon lookup
by name from `constants.js`).

---

## Why `slug` instead of MongoDB's `_id` in the URL

**What it is:** Every MongoDB document gets an auto-generated `_id` like
`654a1b2c...`. A "slug" is a human-readable identifier you define yourself,
e.g. `task-manager-api`.

**Why it's used here:** `/project/654a1b2c...` is ugly and meaningless in a
URL; `/project/task-manager-api` is readable and works well for sharing
links. The `Project` schema marks `slug` as `unique`, and
`GET /api/projects/:slug` looks projects up by that field instead of `_id`.

**Where to find it:** `Backend/models/Project.js` (`slug` field),
`Backend/controllers/projectController.js` (`getProjectBySlug`).

---

## JWT (JSON Web Tokens) — the admin login

**What it is:** A JWT is a signed, tamper-proof string the server hands out
after you prove who you are (here: entering the right password). The
browser stores it and sends it back on every request that needs
authorization. The server can verify the signature without a database
lookup — the token itself proves it was issued by the server and hasn't
been altered.

**Why it's used here:** The admin dashboard needs *some* form of
authentication so random visitors can't create/edit/delete projects, but
there's only one admin and one shared password — a full user-accounts
system (sign-up, password reset, etc.) would be overkill. JWT gives a
simple "prove you logged in once" mechanism: log in with the password once,
get a token, and every admin API call afterward includes that token instead
of the password.

**Where to find it:**
- Issuing a token on successful login: `Backend/controllers/authController.js`
- Verifying a token before allowing writes: `Backend/middleware/requireAdmin.js`
- Storing the token and attaching it to requests: `Frontend/src/hooks/useAdminAuth.js`
  and the request interceptor in `Frontend/src/lib/axios.js`

```js
// requireAdmin.js — runs before create/update/delete routes
jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired
```

---

## "Security by obscurity" isn't real security — why the admin URL alone isn't enough

**What it is:** Hiding something at a hard-to-guess URL (like
`/admin-d9a03fa2f3`) instead of a predictable one (`/admin`) makes it
harder to *stumble upon*, but doesn't stop someone who already knows or
finds the URL from getting in.

**Why it's used here:** The random URL is just the *first* layer — it
keeps the login page from being obvious to automated bots scanning for
`/admin`, `/login`, etc. The *real* protection is the password check on the
backend (`Backend/controllers/authController.js`) and the JWT requirement
on every write (`requireAdmin` middleware) — even if someone found the URL,
they still can't create/edit/delete anything without the password.

**Where to find it:** `Frontend/.env` → `VITE_ADMIN_URL` (the slug),
`Frontend/src/App.jsx` (mounts the admin route at that slug),
`Backend/.env` → `ADMIN_PASS` (the actual gate).
