import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/">
            Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/cms">
            Go to CMS
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;