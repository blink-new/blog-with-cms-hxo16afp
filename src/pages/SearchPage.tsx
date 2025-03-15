import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { Post } from '../types';
import { format } from 'date-fns';
import { Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchPosts } = useBlog();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      setIsSearching(true);
      
      // Simulate search delay
      const timer = setTimeout(() => {
        const foundPosts = searchPosts(searchQuery);
        setResults(foundPosts);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [searchParams, searchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8 dark:bg-gray-800">
        <h1 className="text-3xl font-bold mb-6">Search Posts</h1>
        
        <form onSubmit={handleSearch} className="flex w-full max-w-lg mb-6">
          <input
            type="text"
            placeholder="Search for posts..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" className="rounded-l-none">
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </form>

        {searchParams.get('q') && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isSearching ? (
              'Searching...'
            ) : (
              <>
                Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchParams.get('q')}"
              </>
            )}
          </p>
        )}
      </div>

      {isSearching ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : results.length === 0 && searchParams.get('q') ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4">No Results Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No posts match your search query. Try different keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {results.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800"
            >
              <div className="md:flex">
                {post.coverImage && (
                  <div className="md:w-1/3">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                )}
                <div className={`p-6 ${post.coverImage ? 'md:w-2/3' : 'w-full'}`}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.categories.map(category => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    <Link to={`/post/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SearchPage;