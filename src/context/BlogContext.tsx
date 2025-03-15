import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Post, Category, Author } from '../types';

interface BlogContextType {
  posts: Post[];
  categories: Category[];
  addPost: (post: Omit<Post, 'id' | 'publishedAt' | 'updatedAt'>) => string;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  getPostBySlug: (slug: string) => Post | undefined;
  getPostsByCategory: (categoryId: string) => Post[];
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => string;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  searchPosts: (query: string) => Post[];
}

const defaultAuthor: Author = {
  name: 'Admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('blog-posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('blog-categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      {
        id: uuidv4(),
        name: 'General',
        slug: 'general',
        description: 'General blog posts'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('blog-posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('blog-categories', JSON.stringify(categories));
  }, [categories]);

  const addPost = (postData: Omit<Post, 'id' | 'publishedAt' | 'updatedAt'>) => {
    const now = new Date();
    const id = uuidv4();
    const newPost: Post = {
      ...postData,
      id,
      publishedAt: now,
      updatedAt: now,
    };
    setPosts([...posts, newPost]);
    return id;
  };

  const updatePost = (updatedPost: Post) => {
    updatedPost.updatedAt = new Date();
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const getPostBySlug = (slug: string) => {
    return posts.find(post => post.slug === slug);
  };

  const getPostsByCategory = (categoryId: string) => {
    return posts.filter(post => 
      post.categories.some(category => category.id === categoryId) && 
      post.status === 'published'
    );
  };

  const addCategory = (categoryData: Omit<Category, 'id' | 'slug'>) => {
    const id = uuidv4();
    const slug = categoryData.name.toLowerCase().replace(/\s+/g, '-');
    const newCategory: Category = {
      ...categoryData,
      id,
      slug,
    };
    setCategories([...categories, newCategory]);
    return id;
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(categories.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    ));
  };

  const deleteCategory = (id: string) => {
    // Don't delete if posts are using this category
    const isUsed = posts.some(post => post.categories.some(category => category.id === id));
    if (isUsed) {
      throw new Error('Cannot delete category that is in use');
    }
    setCategories(categories.filter(category => category.id !== id));
  };

  const searchPosts = (query: string) => {
    const searchTerm = query.toLowerCase();
    return posts.filter(post => 
      (post.title.toLowerCase().includes(searchTerm) || 
       post.content.toLowerCase().includes(searchTerm) ||
       post.excerpt.toLowerCase().includes(searchTerm)) &&
      post.status === 'published'
    );
  };

  return (
    <BlogContext.Provider value={{
      posts,
      categories,
      addPost,
      updatePost,
      deletePost,
      getPostBySlug,
      getPostsByCategory,
      addCategory,
      updateCategory,
      deleteCategory,
      searchPosts,
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};