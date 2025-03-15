import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { Post, Category } from '../../types';
import { Button } from '../../components/ui/button';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, categories, addPost, updatePost } = useBlog();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (id) {
      const post = posts.find(p => p.id === id);
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt);
        setCoverImage(post.coverImage || '');
        setSelectedCategories(post.categories.map(c => c.id));
        setStatus(post.status);
      } else {
        navigate('/cms');
      }
    }
  }, [id, posts, navigate]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!id || !posts.find(p => p.id === id)) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  }, [title, id, posts]);

  const handleSave = (saveStatus: 'draft' | 'published') => {
    try {
      if (!title) {
        toast.error('Title is required');
        return;
      }
      
      if (!content) {
        toast.error('Content is required');
        return;
      }
      
      if (selectedCategories.length === 0) {
        toast.error('Select at least one category');
        return;
      }

      const selectedCategoriesObjects = categories.filter(c => 
        selectedCategories.includes(c.id)
      );

      if (id) {
        // Update existing post
        const post = posts.find(p => p.id === id);
        if (post) {
          const updatedPost: Post = {
            ...post,
            title,
            slug,
            content,
            excerpt: excerpt || content.substring(0, 150) + '...',
            coverImage: coverImage || undefined,
            categories: selectedCategoriesObjects,
            status: saveStatus,
            updatedAt: new Date(),
          };
          updatePost(updatedPost);
          toast.success(`Post ${saveStatus === 'published' ? 'published' : 'saved as draft'}`);
        }
      } else {
        // Create new post
        addPost({
          title,
          slug,
          content,
          excerpt: excerpt || content.substring(0, 150) + '...',
          coverImage: coverImage || undefined,
          author: {
            name: 'Admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          },
          categories: selectedCategoriesObjects,
          status: saveStatus,
        });
        toast.success(`Post ${saveStatus === 'published' ? 'published' : 'saved as draft'}`);
      }
      
      navigate('/cms');
    } catch (error) {
      toast.error('Failed to save post');
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/cms')}
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">{id ? 'Edit Post' : 'Create New Post'}</h1>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="h-5 w-5 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
          >
            <Save className="h-5 w-5 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave('published')}
          >
            Publish
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        {!isPreview ? (
          <div className="p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Post title"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="post-slug"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
              {coverImage && (
                <div className="mt-2">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="h-40 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Brief description of the post (optional)"
                rows={2}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Write your post content here..."
                rows={15}
              />
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6 border-b pb-4 dark:border-gray-700">
              <h1 className="text-3xl font-bold mb-4">{title || 'Untitled Post'}</h1>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories
                    .filter(c => selectedCategories.includes(c.id))
                    .map(category => (
                      <span
                        key={category.id}
                        className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                </div>
              )}
            </div>
            
            {coverImage && (
              <div className="mb-6">
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No content yet...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;