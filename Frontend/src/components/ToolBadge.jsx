import { Code2, Wrench } from 'lucide-react';
import {
  SiClaude,
  SiGit,
  SiGithub,
  SiPostman,
  SiVite,
  SiJavascript,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiHtml5,
  SiTailwindcss,
} from 'react-icons/si';
import { FaCss3Alt } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { cardHover, springSnappy } from '../utils/motion';

// A single badge in the "Tools I Use" grid: an icon + label with a subtle
// hover lift and glowing border. Most icons are real brand logos from
// react-icons (simple-icons/font-awesome) so the grid reads as actual
// recognizable tools rather than generic glyphs.
//
// Icons are imported by name (not `import * as` from the whole package)
// so Vite can tree-shake everything unused — simple-icons alone ships
// thousands of icons, and a wildcard import pulled the entire set into the
// bundle (blew it up from ~1MB to ~7.7MB) even though only a dozen are used.
const ICON_MAP = {
  SiClaude,
  SiGit,
  SiGithub,
  SiPostman,
  SiVite,
  SiJavascript,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiHtml5,
  SiTailwindcss,
  SiCss3Alt: FaCss3Alt,
  Code2,
};

const ToolBadge = ({ label, icon }) => {
  const Icon = ICON_MAP[icon] || Wrench;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
      className="flex flex-col items-center gap-3 rounded-card border border-maroon-light bg-maroon-dark bg-card-sheen p-6 text-center shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-rose hover:shadow-glow"
    >
      <motion.span variants={{ rest: { rotate: 0 }, hover: { rotate: -8, scale: 1.1 } }} transition={springSnappy}>
        <Icon className="text-rose" size={28} />
      </motion.span>
      <span className="text-sm font-medium text-cream">{label}</span>
    </motion.div>
  );
};

export default ToolBadge;
