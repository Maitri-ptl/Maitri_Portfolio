import { motion } from 'framer-motion';
import Button from '../components/Button';

// Catch-all "/*" route — a themed 404 page instead of a blank/default one.
const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-7xl font-bold text-rose md:text-9xl"
      >
        404
      </motion.h1>
      <p className="max-w-md text-body">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button to="/">Back to Home</Button>
    </div>
  );
};

export default NotFound;
