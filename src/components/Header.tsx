import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';
import { Search, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const { categories } = useBlog();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            BlogCMS
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
                Categories
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/cms" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white">
              CMS
            </Link>
          </nav>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <input
              type="text"
              placeholder="Search posts..."
              className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Categories</p>
                <div className="pl-4 space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to="/cms"
                className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                CMS
              </Link>
            </nav>
            <form onSubmit={handleSearch} className="mt-4 flex">
              <input
                type="text"
                placeholder="Search posts..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;