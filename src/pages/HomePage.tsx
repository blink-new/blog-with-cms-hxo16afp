import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';
import { Post } from '@/types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { posts, categories } = useBlog();
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);

  useEffect(() => {
    const filtered = posts.filter(post => post.status === 'published');
    setPublishedPosts(filtered);
    
    // Set the most recent post as featured
    if (filtered.length > 0) {
      const sorted = [...filtered].sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      setFeaturedPost(sorted[0]);
    }
  }, [posts]);

  if (publishedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Welcome to BlogCMS</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          There are no published posts yet. Go to the CMS to create your first post!
        </p>
        <Link
          to="/cms/posts/new"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
        >
          Create Your First Post
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Featured Post */}
      {featuredPost && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 pb-2 border-b dark:border-gray-700">Featured Post</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
            {featuredPost.coverImage && (
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {featuredPost.categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                <Link to={`/post/${featuredPost.slug}`} className="hover:text-primary transition-colors">
                  {featuredPost.title}
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{featuredPost.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {featuredPost.author.avatar && (
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">{featuredPost.author.name}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {format(new Date(featuredPost.publishedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Posts */}
      <div>
        <h2 className="text-3xl font-bold mb-6 pb-2 border-b dark:border-gray-700">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedPosts
            .filter(post => post.id !== featuredPost?.id)
            .slice(0, 6)
            .map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.categories.slice(0, 2).map(category => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {category.name}
                      </Link>
                    ))}
                    {post.categories.length > 2 && (
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        +{post.categories.length - 2}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    <Link to={`/post/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 pb-2 border-b dark:border-gray-700">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={`/category/${category.slug}`}
                className="block p-4 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow dark:bg-gray-800"
              >
                <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {publishedPosts.filter(post => 
                    post.categories.some(c => c.id === category.id)
                  ).length} posts
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;