import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { Post } from '../types';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPostBySlug, posts } = useBlog();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      const foundPost = getPostBySlug(slug);
      
      if (foundPost && foundPost.status === 'published') {
        setPost(foundPost);
        
        // Find related posts (same category)
        const related = posts
          .filter(p => 
            p.id !== foundPost.id && 
            p.status === 'published' &&
            p.categories.some(c => 
              foundPost.categories.some(fc => fc.id === c.id)
            )
          )
          .slice(0, 3);
        
        setRelatedPosts(related);
      } else {
        navigate('/');
      }
    }
  }, [slug, getPostBySlug, posts, navigate]);

  if (!post) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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

      <article className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        {post.coverImage && (
          <div className="relative h-80 md:h-96">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 mb-8 gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost, index) => (
              <motion.div
                key={relatedPost.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800"
              >
                {relatedPost.coverImage && (
                  <img
                    src={relatedPost.coverImage}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">
                    <Link to={`/post/${relatedPost.slug}`} className="hover:text-primary transition-colors">
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{relatedPost.author.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {format(new Date(relatedPost.publishedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostPage;