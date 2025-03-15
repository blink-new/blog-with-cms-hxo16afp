import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import CMSDashboard from './pages/cms/Dashboard';
import CMSEditor from './pages/cms/Editor';
import CMSCategories from './pages/cms/Categories';
import CMSMedia from './pages/cms/Media';
import Layout from './components/Layout';
import CMSLayout from './components/cms/Layout';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BlogProvider>
      <Router>
        <Routes>
          {/* Public Blog Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="post/:slug" element={<PostPage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
          
          {/* CMS Routes */}
          <Route path="/cms" element={<CMSLayout />}>
            <Route index element={<CMSDashboard />} />
            <Route path="posts/new" element={<CMSEditor />} />
            <Route path="posts/edit/:id" element={<CMSEditor />} />
            <Route path="categories" element={<CMSCategories />} />
            <Route path="media" element={<CMSMedia />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </BlogProvider>
  );
}

export default App;