// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import NotesView from './components/NotesView';
import CalendarView from './components/CalendarView';
import TaskModal from './components/TaskModal';
import NoteModal from './components/NoteModal';
import SearchBar from './components/SearchBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { categories } from './data/categories';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('task');
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('created');
  const [filterBy, setFilterBy] = useState('all');

  const themeClasses = darkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-rose-50 via-rose-100 to-pink-50';

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setEditingItem(null);
  }, []);

  const handleNewTask = useCallback(() => {
    setModalType('task');
    setEditingItem(null);
    setShowModal(true);
  }, []);

  const handleNewNote = useCallback(() => {
    setModalType('note');
    setEditingItem(null);
    setShowModal(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'n') {
        e.preventDefault();
        handleNewNote();
      }
      if (e.key === 't') {
        e.preventDefault();
        handleNewTask();
      }
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('#search-input');
        if (searchInput) searchInput.focus();
      }
      if (e.key === 'Escape') {
        handleModalClose();
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewNote, handleNewTask, handleModalClose]);

  const appProps = {
    notes,
    setNotes,
    todos,
    setTodos,
    darkMode,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    viewMode,
    setViewMode,
    editingItem,
    setEditingItem,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    activeTab,
    setActiveTab,
    setSidebarOpen
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      <div className="max-w-7xl mx-auto">

        {/* Top Navigation */}
        <nav
          className={`${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white/80 backdrop-blur-lg border-gray-200'
          } border-b sticky top-0 z-40 transition-all duration-300 rounded-b-2xl`}
        >
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-800/40 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-700 via-rose-500 to-pink-400 bg-clip-text text-transparent">
                  Tasks & Notes
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  darkMode={darkMode}
                />

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-xl transition-colors ${
                    darkMode
                      ? 'hover:bg-gray-700 text-yellow-400'
                      : 'hover:bg-rose-100 text-gray-600'
                  }`}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={handleNewTask}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  <span className="hidden sm:inline">New Task</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex">
          <Sidebar
            {...appProps}
            sidebarOpen={sidebarOpen}
            categories={categories}
          />

          {/* Main Content */}
          <main className="flex-1 lg:ml-0 transition-all duration-300">
            {activeTab === 'dashboard' && (
              <Dashboard
                {...appProps}
                onNewTask={handleNewTask}
                onNewNote={handleNewNote}
              />
            )}
            {activeTab === 'tasks' && <TasksView {...appProps} />}
            {activeTab === 'notes' && <NotesView {...appProps} />}
            {activeTab === 'calendar' && <CalendarView {...appProps} />}
          </main>
        </div>

        {/* Modals */}
        {showModal && modalType === 'task' && (
          <TaskModal
            {...appProps}
            onClose={handleModalClose}
            categories={categories}
          />
        )}

        {showModal && modalType === 'note' && (
          <NoteModal {...appProps} onClose={handleModalClose} />
        )}

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
