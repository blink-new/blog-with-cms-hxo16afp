import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';
import { Post, Category } from '@/types';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, categories } = useBlog();
  const [categoryPosts, setCategoryPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (slug) {
      const foundCategory = categories.find(c => c.slug === slug);
      
      if (foundCategory) {
        setCategory(foundCategory);
        
        const filtered = posts.filter(post => 
          post.status === 'published' && 
          post.categories.some(c => c.id === foundCategory.id)
        );
        
        setCategoryPosts(filtered);
      }
    }
  }, [slug, categories, posts]);

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The category you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
        )}
      </div>

      {categoryPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4">No Posts Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            There are no published posts in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryPosts.map((post, index) => (
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
                  {post.categories.filter(c => c.id !== category.id).slice(0, 2).map(category => (
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
      )}
    </motion.div>
  );
};

export default CategoryPage;