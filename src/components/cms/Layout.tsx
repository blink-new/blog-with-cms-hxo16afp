import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, Image, ChevronLeft, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CMSLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { to: '/cms', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/cms/posts/new', icon: <FileText className="h-5 w-5" />, label: 'New Post' },
    { to: '/cms/categories', icon: <FolderOpen className="h-5 w-5" />, label: 'Categories' },
    { to: '/cms/media', icon: <Image className="h-5 w-5" />, label: 'Media' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-10 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 md:relative",
          isSidebarOpen ? "w-64" : "w-20",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h1 className={cn("font-bold text-primary", isSidebarOpen ? "text-xl" : "text-xs")}>
            {isSidebarOpen ? "BlogCMS" : "B"}
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hidden md:block"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", !isSidebarOpen && "rotate-180")} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/cms'}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center p-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                      !isSidebarOpen && "justify-center"
                    )
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t dark:border-gray-700">
          <NavLink
            to="/"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Back to Blog</span>}
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white shadow-sm p-4 md:hidden dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">BlogCMS</h1>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default CMSLayout;