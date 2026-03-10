import React from 'react';
import { Home, CheckSquare, FileText, CalendarDays } from 'lucide-react';
import { getTodayTasks, getUpcomingTasks } from '../utils/helpers';

const Sidebar = ({ 
  sidebarOpen, 
  darkMode, 
  activeTab, 
  setActiveTab, 
  setSelectedCategory, 
  setSidebarOpen,
  categories, 
  todos, 
  notes, 
  selectedCategory 
}) => {
  const todayTasks = getTodayTasks(todos);
  const upcomingTasks = getUpcomingTasks(todos);

  const mainNavItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, count: todayTasks.length },
    { id: 'tasks', name: 'Tasks', icon: CheckSquare, count: todos.filter(t => !t.completed && !t.archived).length },
    { id: 'notes', name: 'Notes', icon: FileText, count: notes.filter(n => !n.archived).length },
    { id: 'calendar', name: 'Calendar', icon: CalendarDays, count: upcomingTasks.length },
  ];

  return (
    <aside
      className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-4 left-4 z-30 w-72 h-[calc(100vh-2rem)] transition-transform duration-300
        ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white/60 backdrop-blur-lg border-gray-200'}
        border rounded-3xl shadow-lg flex flex-col`}
    >
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 
  scrollbar-thin scrollbar-thumb-gray-400/70 scrollbar-track-transparent 
  hover:scrollbar-thumb-gray-500/90 
  [&::-webkit-scrollbar]:w-1.5 
  [&::-webkit-scrollbar-thumb]:bg-transparent 
  hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/70 
  dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500/70">
        
        {/* Main Navigation */}
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Main
          </h3>
          <nav className="space-y-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedCategory(null);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                      : darkMode
                      ? "hover:bg-gray-800 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === item.id
                        ? "bg-white/20 text-white"
                        : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories */}
        <div>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Categories
          </h3>
          <nav className="space-y-2">
            {categories.map(category => {
              const Icon = category.icon;
              const count = todos.filter(t => t.category === category.name && !t.completed && !t.archived).length;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setActiveTab('tasks');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                    selectedCategory === category.name && activeTab === 'tasks'
                      ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                      : darkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  {count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      selectedCategory === category.name && activeTab === 'tasks'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Stats */}
        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
          <h3 className="font-semibold mb-3">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Today's Tasks</span>
              <span className="font-bold text-indigo-600">{todayTasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Overdue</span>
              <span className="font-bold text-rose-600">{todos.filter(t => {
                if (!t.dueDate || t.completed || t.archived) return false;
                return new Date(t.dueDate) < new Date();
              }).length}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Notes</span>
              <span className="font-bold text-purple-600">{notes.filter(n => !n.archived).length}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
