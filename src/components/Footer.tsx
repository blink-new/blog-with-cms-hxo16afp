import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-inner dark:bg-gray-900">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">BlogCMS</h3>
            <p className="text-gray-600 dark:text-gray-400">
              A modern blog platform with a custom content management system.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white">
                  Search
                </Link>
              </li>
              <li>
                <Link to="/cms" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white">
                  CMS
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-gray-600 dark:text-gray-400">
              This blog platform is built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {currentYear} BlogCMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;