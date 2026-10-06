// Centralized static content: nav links, socials, tools, process steps.
// Keeping these here (instead of hardcoded JSX) means updating a link or
// adding a tool is a one-line change, not a hunt through components.

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/Maitri-ptl', icon: 'Github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maitri-patel-1a6406375', icon: 'Linkedin' },
  // A Gmail "compose" URL (not `mailto:`) so this always opens Gmail in the
  // browser — mailto: links instead hand off to whatever the visitor's OS
  // has set as the default mail app (often Outlook/Microsoft Mail), which is
  // not what we want here.
  {
    label: 'Email',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=maitripatel036@gmail.com',
    icon: 'Mail',
  },
];

// Resume PDF served from Frontend/public. To update it, just replace that file
// (keep the same filename) — the View/Download buttons pick it up automatically.
export const RESUME_URL = '/Maitri_Patel_Resume.pdf';

// In-page anchor links used by the Navbar and its scroll-spy highlighting.
export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

// "Tools I Use" data, split into two groups for the Tools section:
// day-to-day dev tools/AI assistants, and the core languages/tech stack.
// `icon` names are keys into the ICON_MAP in components/ToolBadge.jsx,
// which resolves them to real brand-logo icons (react-icons) except where
// noted, so the grid reads as actual recognizable tools.
export const DEV_TOOLS = [
  { label: 'Claude', icon: 'SiClaude' },
  // No official VS Code brand mark ships in react-icons/simple-icons —
  // falls back to a generic code-editor glyph, everything else here is a
  // real brand logo.
  { label: 'VS Code', icon: 'Code2' },
  { label: 'Git', icon: 'SiGit' },
  { label: 'GitHub', icon: 'SiGithub' },
  { label: 'Postman', icon: 'SiPostman' },
  { label: 'Vite', icon: 'SiVite' },
];

export const LANGUAGES = [
  { label: 'JavaScript', icon: 'SiJavascript' },
  { label: 'Python', icon: 'SiPython' },
  { label: 'React', icon: 'SiReact' },
  { label: 'Node.js', icon: 'SiNodedotjs' },
  { label: 'Express', icon: 'SiExpress' },
  { label: 'MongoDB', icon: 'SiMongodb' },
  { label: 'HTML5', icon: 'SiHtml5' },
  { label: 'CSS3', icon: 'SiCss3Alt' },
  { label: 'Tailwind CSS', icon: 'SiTailwindcss' },
];

// "My Process" steps shown in the Process section.
export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description: 'Understanding the goals, users, and constraints behind a project.',
  },
  {
    number: '02',
    title: 'Define',
    description: 'Planning the data model, API contract, and component structure.',
  },
  {
    number: '03',
    title: 'Design',
    description: 'Wireframing flows and translating them into a clean UI.',
  },
  {
    number: '04',
    title: 'Develop',
    description: 'Building with clean, tested, maintainable full-stack code.',
  },
  {
    number: '05',
    title: 'Deliver',
    description: 'Testing, deploying, and iterating based on real feedback.',
  },
];
