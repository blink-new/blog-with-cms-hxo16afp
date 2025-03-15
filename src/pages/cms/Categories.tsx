import { useState } from 'react';
import { useBlog } from '@/context/BlogContext';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useBlog();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      addCategory({
        name: categoryName,
        description: categoryDescription,
      });
      
      setCategoryName('');
      setCategoryDescription('');
      setIsAddingCategory(false);
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const handleUpdateCategory = () => {
    if (!categoryName.trim() || !editingCategoryId) {
      toast.error('Category name is required');
      return;
    }

    try {
      const category = categories.find(c => c.id === editingCategoryId);
      if (category) {
        updateCategory({
          ...category,
          name: categoryName,
          description: categoryDescription,
        });
        
        setCategoryName('');
        setCategoryDescription('');
        setEditingCategoryId(null);
        toast.success('Category updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = (id: string) => {
    try {
      deleteCategory(id);
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Cannot delete category that is in use');
    }
  };

  const startEditing = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setCategoryName(category.name);
      setCategoryDescription(category.description || '');
      setEditingCategoryId(id);
      setIsAddingCategory(false);
    }
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryDescription('');
  };

  const cancelAdding = () => {
    setIsAddingCategory(false);
    setCategoryName('');
    setCategoryDescription('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        {!isAddingCategory && !editingCategoryId && (
          <Button onClick={() => setIsAddingCategory(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {/* Add/Edit Category Form */}
      {(isAddingCategory || editingCategoryId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingCategoryId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={editingCategoryId ? cancelEditing : cancelAdding}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Category name"
              />
            </div>
            
            <div>
              <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                id="categoryDescription"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Brief description of the category"
                rows={2}
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={editingCategoryId ? cancelEditing : cancelAdding}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button onClick={editingCategoryId ? handleUpdateCategory : handleAddCategory}>
                {editingCategoryId ? 'Update' : 'Add'} Category
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">All Categories</h2>
        </div>
        
        {categories.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No categories yet. Add your first category!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <motion.li
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(category.id)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Categories;