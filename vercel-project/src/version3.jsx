import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Calendar, Bell, Settings, CheckSquare, FileText, Edit3, Trash2, Clock, Tag, Filter, Lightbulb, Utensils, Briefcase, Dumbbell, Music, X, Star, Archive, MoreVertical, Copy, Share2, Download, ChevronDown, ChevronRight, Zap, Target, Home, List, BookOpen, CalendarDays, Menu, Sun, Moon } from 'lucide-react';

const NotesToTasksApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const categories = [
    { id: 1, name: 'Work', icon: Briefcase, color: 'from-blue-500 to-blue-600', taskCount: 0 },
    { id: 2, name: 'Personal', icon: Home, color: 'from-green-500 to-green-600', taskCount: 0 },
    { id: 3, name: 'Ideas', icon: Lightbulb, color: 'from-yellow-500 to-yellow-600', taskCount: 0 },
    { id: 4, name: 'Health', icon: Dumbbell, color: 'from-red-500 to-red-600', taskCount: 0 },
    { id: 5, name: 'Learning', icon: BookOpen, color: 'from-purple-500 to-purple-600', taskCount: 0 }
  ];

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('task');
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('created'); // created, updated, priority, due
  const [filterBy, setFilterBy] = useState('all'); // all, completed, pending, high, medium, low
  
  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    completed: false,
    tags: [],
    starred: false,
    archived: false
  });
  
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'Personal',
    tags: [],
    reminder: '',
    starred: false,
    archived: false,
    color: 'default'
  });

  // Get current date info
  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return { day, month, dayName, fullDate };
  };

  const { day, month, dayName, fullDate } = getCurrentDate();

  // Get today's tasks
  const getTodayTasks = () => {
    const today = new Date().toDateString();
    return todos.filter(todo => {
      if (!todo.dueDate || todo.archived) return false;
      return new Date(todo.dueDate).toDateString() === today;
    });
  };

  // Get overdue tasks
  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return todos.filter(todo => {
      if (!todo.dueDate || todo.completed || todo.archived) return false;
      return new Date(todo.dueDate) < today;
    });
  };

  // Get upcoming tasks (next 7 days)
  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return todos.filter(todo => {
      if (!todo.dueDate || todo.archived) return false;
      const dueDate = new Date(todo.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    });
  };

  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks();

  // Add task
  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: editingItem ? editingItem.id : Date.now(),
      ...taskForm,
      createdAt: editingItem ? editingItem.createdAt : new Date(),
      updatedAt: new Date()
    };

    if (editingItem) {
      setTodos(todos.map(todo => todo.id === editingItem.id ? newTask : todo));
    } else {
      setTodos([...todos, newTask]);
    }

    resetTaskForm();
    setShowModal(false);
    setEditingItem(null);
  };

  // Add note
  const handleAddNote = (e) => {
    e.preventDefault();
    const newNote = {
      id: editingItem ? editingItem.id : Date.now(),
      ...noteForm,
      createdAt: editingItem ? editingItem.createdAt : new Date(),
      updatedAt: new Date()
    };

    if (editingItem) {
      setNotes(notes.map(note => note.id === editingItem.id ? newNote : note));
    } else {
      setNotes([...notes, newNote]);
    }

    resetNoteForm();
    setShowModal(false);
    setEditingItem(null);
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      category: 'Work',
      priority: 'medium',
      dueDate: '',
      dueTime: '',
      completed: false,
      tags: [],
      starred: false,
      archived: false
    });
  };

  const resetNoteForm = () => {
    setNoteForm({
      title: '',
      content: '',
      category: 'Personal',
      tags: [],
      reminder: '',
      starred: false,
      archived: false,
      color: 'default'
    });
  };

  // Toggle task completion
  const toggleTaskComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
    ));
  };

  // Toggle starred
  const toggleStarred = (id, type) => {
    if (type === 'task') {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, starred: !todo.starred, updatedAt: new Date() } : todo
      ));
    } else {
      setNotes(notes.map(note => 
        note.id === id ? { ...note, starred: !note.starred, updatedAt: new Date() } : note
      ));
    }
  };

  // Archive item
  const archiveItem = (id, type) => {
    if (type === 'task') {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, archived: !todo.archived, updatedAt: new Date() } : todo
      ));
    } else {
      setNotes(notes.map(note => 
        note.id === id ? { ...note, archived: !note.archived, updatedAt: new Date() } : note
      ));
    }
  };

  // Delete item
  const deleteItem = (id, type) => {
    if (type === 'task') {
      setTodos(todos.filter(todo => todo.id !== id));
    } else {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  // Edit item
  const editItem = (item, type) => {
    setEditingItem({ ...item, type });
    if (type === 'task') {
      setTaskForm({
        title: item.title,
        description: item.description || '',
        category: item.category,
        priority: item.priority,
        dueDate: item.dueDate || '',
        dueTime: item.dueTime || '',
        completed: item.completed,
        tags: item.tags || [],
        starred: item.starred || false,
        archived: item.archived || false
      });
      setModalType('task');
    } else {
      setNoteForm({
        title: item.title,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        reminder: item.reminder || '',
        starred: item.starred || false,
        archived: item.archived || false,
        color: item.color || 'default'
      });
      setModalType('note');
    }
    setShowModal(true);
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  // Get note color
  const getNoteColor = (color) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'green': return 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'blue': return 'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'purple': return 'bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      case 'pink': return 'bg-pink-100 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800';
      default: return 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  // Filter and sort tasks
  const getFilteredTasks = () => {
    let filtered = selectedCategory 
      ? todos.filter(todo => todo.category === selectedCategory)
      : todos;

    // Apply filters
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'completed':
          filtered = filtered.filter(task => task.completed);
          break;
        case 'pending':
          filtered = filtered.filter(task => !task.completed);
          break;
        case 'archived':
          filtered = filtered.filter(task => task.archived);
          break;
        case 'starred':
          filtered = filtered.filter(task => task.starred);
          break;
        case 'high':
        case 'medium':
        case 'low':
          filtered = filtered.filter(task => task.priority === filterBy);
          break;
        default:
          filtered = filtered.filter(task => !task.archived);
      }
    } else {
      filtered = filtered.filter(task => !task.archived);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'due':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        default: // created
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const getFilteredNotes = () => {
    let filtered = notes;

    // Apply filters
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'archived':
          filtered = filtered.filter(note => note.archived);
          break;
        case 'starred':
          filtered = filtered.filter(note => note.starred);
          break;
        default:
          filtered = filtered.filter(note => !note.archived);
      }
    } else {
      filtered = filtered.filter(note => !note.archived);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default: // created
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Top Navigation */}
        <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-lg border-gray-200'} border-b sticky top-0 z-40 transition-all duration-300`}>
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search everything..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 w-80 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-200'
                    }`}
                  />
                </div>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-xl transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-yellow-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <button
                  onClick={() => { setModalType('task'); setShowModal(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  <span className="hidden sm:inline">New Task</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-30 w-72 h-screen transition-transform duration-300 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/50 backdrop-blur-lg border-gray-200'
          } border-r`}>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
              
              {/* Main Navigation */}
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Main
                </h3>
                <nav className="space-y-2">
                  {[
                    { id: 'dashboard', name: 'Dashboard', icon: Home, count: todayTasks.length },
                    { id: 'tasks', name: 'Tasks', icon: CheckSquare, count: todos.filter(t => !t.completed && !t.archived).length },
                    { id: 'notes', name: 'Notes', icon: FileText, count: notes.filter(n => !n.archived).length },
                    { id: 'calendar', name: 'Calendar', icon: CalendarDays, count: upcomingTasks.length },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSelectedCategory(null);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {item.count > 0 && (
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            activeTab === item.id
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
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
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                          selectedCategory === category.name && activeTab === 'tasks'
                            ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                            : darkMode
                            ? 'hover:bg-gray-700 text-gray-300'
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
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                <h3 className="font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Today's Tasks</span>
                    <span className="font-bold text-blue-600">{todayTasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Overdue</span>
                    <span className="font-bold text-red-600">{overdueTasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Notes</span>
                    <span className="font-bold text-purple-600">{notes.filter(n => !n.archived).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 lg:ml-0">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="p-6 space-y-6">
                {/* Welcome Header */}
                <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                  <h2 className="text-3xl font-bold mb-2">Good morning! 👋</h2>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{fullDate}</p>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl">
                        <CheckSquare className="h-6 w-6" />
                      </div>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today's Tasks</p>
                        <p className="text-2xl font-bold">{todayTasks.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overdue</p>
                        <p className="text-2xl font-bold">{overdueTasks.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notes</p>
                        <p className="text-2xl font-bold">{notes.filter(n => !n.archived).length}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl">
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                        <p className="text-2xl font-bold">{todos.filter(t => t.completed).length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today's Tasks */}
                <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Today's Tasks</h3>
                    <button
                      onClick={() => { setModalType('task'); setShowModal(true); }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </button>
                  </div>

                  {todayTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckSquare className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                      <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No tasks for today</p>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Create a task to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todayTasks.map(task => (
                        <div key={task.id} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleTaskComplete(task.id)}
                              className={`mt-1 p-2 rounded-lg transition-all ${
                                task.completed 
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-gray-100 hover:bg-blue-100 dark:bg-gray-600 dark:hover:bg-blue-900/30'
                              }`}
                            >
                              <CheckSquare className="h-4 w-4" />
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className={`font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                                  {task.title}
                                </h4>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                {task.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                              </div>
                              
                              {task.description && (
                                <p className={`text-sm mb-2 ${
                                  task.completed ? 'line-through opacity-60' : ''
                                } ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {task.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs">
                                <span className={`px-2 py-1 rounded-full font-medium ${
                                  darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {task.category}
                                </span>
                                {task.dueTime && (
                                  <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <Clock className="h-3 w-3" />
                                    {formatTime(task.dueTime)}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              <button
                                onClick={() => editItem(task, 'task')}
                                className={`p-2 rounded-lg transition-colors ${
                                  darkMode 
                                    ? 'hover:bg-gray-600 text-gray-400' 
                                    : 'hover:bg-gray-100 text-gray-500'
                                }`}
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Notes */}
                <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Recent Notes</h3>
                    <button
                      onClick={() => { setModalType('note'); setShowModal(true); }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Note
                    </button>
                  </div>

                  {notes.filter(n => !n.archived).length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                      <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No notes yet</p>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Create your first note</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {notes.filter(n => !n.archived).slice(0, 6).map(note => (
                        <div
                          key={note.id}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                            getNoteColor(note.color)
                          }`}
                          onClick={() => editItem(note, 'note')}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium line-clamp-1">{note.title}</h4>
                            {note.starred && <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />}
                          </div>
                          <p className={`text-sm line-clamp-3 mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {note.content}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {note.category}
                            </span>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {new Date(note.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tasks View */}
            {activeTab === 'tasks' && (
              <div className="p-6 space-y-6">
                {/* Header with filters */}
                <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedCategory ? `${selectedCategory} Tasks` : 'All Tasks'}
                      </h2>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {getFilteredTasks().length} tasks
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setModalType('task'); setShowModal(true); }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        New Task
                      </button>
                    </div>
                  </div>

                  {/* Filters and Search */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-3 w-full rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>

                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className={`px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <option value="all">All Tasks</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="starred">Starred</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                      <option value="archived">Archived</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <option value="created">Recently Created</option>
                      <option value="updated">Recently Updated</option>
                      <option value="due">Due Date</option>
                      <option value="priority">Priority</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-3 rounded-xl transition-colors ${
                          viewMode === 'list'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : darkMode
                            ? 'hover:bg-gray-700 text-gray-400'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <List className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-3 rounded-xl transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : darkMode
                            ? 'hover:bg-gray-700 text-gray-400'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <div className="grid grid-cols-2 gap-1 w-5 h-5">
                          <div className="bg-current rounded-sm"></div>
                          <div className="bg-current rounded-sm"></div>
                          <div className="bg-current rounded-sm"></div>
                          <div className="bg-current rounded-sm"></div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tasks List/Grid */}
                {getFilteredTasks().length === 0 ? (
                  <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                    <CheckSquare className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No tasks found</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm ? 'Try a different search term' : 'Create your first task to get started'}
                    </p>
                  </div>
                ) : (
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                      : 'space-y-4'
                  }`}>
                    {getFilteredTasks().map(task => (
                      <div
                        key={task.id}
                        className={`p-6 rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/70 backdrop-blur-sm border-gray-200'
                        } ${task.completed ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleTaskComplete(task.id)}
                              className={`p-2 rounded-xl transition-all ${
                                task.completed 
                                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-gray-100 hover:bg-blue-100 dark:bg-gray-600 dark:hover:bg-blue-900/30'
                              }`}
                            >
                              <CheckSquare className="h-5 w-5" />
                            </button>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleStarred(task.id, 'task')}
                              className={`p-2 rounded-lg transition-colors ${
                                task.starred
                                  ? 'text-yellow-500 hover:text-yellow-600'
                                  : darkMode
                                  ? 'text-gray-400 hover:text-yellow-500'
                                  : 'text-gray-400 hover:text-yellow-500'
                              }`}
                            >
                              <Star className={`h-4 w-4 ${task.starred ? 'fill-current' : ''}`} />
                            </button>
                            
                            <div className="relative group">
                              <button className={`p-2 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                              }`}>
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              
                              <div className={`absolute right-0 top-full mt-1 w-48 rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 ${
                                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                              }`}>
                                <div className="p-2">
                                  <button
                                    onClick={() => editItem(task, 'task')}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                      darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                    Edit Task
                                  </button>
                                  <button
                                    onClick={() => archiveItem(task.id, 'task')}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                      darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <Archive className="h-4 w-4" />
                                    {task.archived ? 'Unarchive' : 'Archive'}
                                  </button>
                                  <button
                                    onClick={() => deleteItem(task.id, 'task')}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-red-100 text-red-600 dark:hover:bg-red-900/30"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h3 className={`text-lg font-semibold mb-2 ${task.completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className={`text-sm mb-4 ${
                            task.completed ? 'line-through opacity-60' : ''
                          } ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {task.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          
                          {task.dueDate && (
                            <div className={`flex items-center gap-1 text-xs ${
                              new Date(task.dueDate) < new Date() && !task.completed
                                ? 'text-red-500'
                                : darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <Clock className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                              {task.dueTime && ` ${formatTime(task.dueTime)}`}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notes View */}
            {activeTab === 'notes' && (
              <div className="p-6 space-y-6">
                <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Notes</h2>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {getFilteredNotes().length} notes
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setModalType('note'); setShowModal(true); }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        New Note
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-3 w-full rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-200'
                        }`}
                      />
                    </div>

                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className={`px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <option value="all">All Notes</option>
                      <option value="starred">Starred</option>
                      <option value="archived">Archived</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <option value="created">Recently Created</option>
                      <option value="updated">Recently Updated</option>
                      <option value="title">Alphabetical</option>
                    </select>
                  </div>
                </div>

                {getFilteredNotes().length === 0 ? (
                  <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                    <FileText className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No notes found</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {searchTerm ? 'Try a different search term' : 'Create your first note to get started'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {getFilteredNotes().map(note => (
                      <div
                        key={note.id}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                          getNoteColor(note.color)
                        }`}
                        onClick={() => editItem(note, 'note')}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold line-clamp-2 flex-1">{note.title}</h3>
                          <div className="flex items-center gap-1 ml-2">
                            {note.starred && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                            <div className="relative group">
                              <button 
                                onClick={(e) => e.stopPropagation()}
                                className={`p-1 rounded-lg transition-colors ${
                                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                                }`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              
                              <div className={`absolute right-0 top-full mt-1 w-48 rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 ${
                                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                              }`}>
                                <div className="p-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStarred(note.id, 'note');
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                      darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <Star className="h-4 w-4" />
                                    {note.starred ? 'Unstar' : 'Star'}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      archiveItem(note.id, 'note');
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                      darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <Archive className="h-4 w-4" />
                                    {note.archived ? 'Unarchive' : 'Archive'}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteItem(note.id, 'note');
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-red-100 text-red-600 dark:hover:bg-red-900/30"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className={`text-sm line-clamp-4 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {note.content}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-1 rounded-full font-medium ${
                            darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {note.category}
                          </span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Calendar View */}
            {activeTab === 'calendar' && (
              <div className="p-6 space-y-6">
                <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Calendar</h2>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => { setModalType('task'); setShowModal(true); }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      New Task
                    </button>
                  </div>

                  {/* Mini Calendar */}
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <div key={day} className={`text-center font-medium p-3 text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {day}
                      </div>
                    ))}
                    
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = i - 2;
                      const isCurrentMonth = date > 0 && date <= 30;
                      const isToday = date === new Date().getDate() && isCurrentMonth;
                      const dayTasks = isCurrentMonth ? todos.filter(task => {
                        if (!task.dueDate || task.archived) return false;
                        return new Date(task.dueDate).getDate() === date;
                      }) : [];
                      
                      return (
                        <div
                          key={i}
                          className={`aspect-square p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isToday 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500' 
                              : isCurrentMonth 
                              ? darkMode
                                ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50' 
                              : 'border-transparent'
                          } ${!isCurrentMonth ? (darkMode ? 'text-gray-600' : 'text-gray-300') : ''}`}
                        >
                          <div className="h-full flex flex-col">
                            <span className={`text-sm font-medium mb-1 ${
                              isToday ? 'text-white' : darkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              {isCurrentMonth ? date : ''}
                            </span>
                            <div className="flex-1 space-y-1">
                              {dayTasks.slice(0, 2).map(task => (
                                <div
                                  key={task.id}
                                  className={`text-[8px] px-1 py-0.5 rounded truncate ${
                                    isToday 
                                      ? 'bg-white/20 text-white' 
                                      : getPriorityColor(task.priority) + ' text-white'
                                  }`}
                                  title={task.title}
                                >
                                  {task.title}
                                </div>
                              ))}
                              {dayTasks.length > 2 && (
                                <div className={`text-[8px] ${
                                  isToday ? 'text-white/70' : darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  +{dayTasks.length - 2}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Today's Tasks
                    </h3>
                    
                    {todayTasks.length === 0 ? (
                      <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No tasks scheduled for today
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {todayTasks.map(task => (
                          <div key={task.id} className={`p-3 rounded-xl border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleTaskComplete(task.id)}
                                className={`p-1 rounded-lg transition-all ${
                                  task.completed 
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-gray-100 hover:bg-blue-100 dark:bg-gray-600 dark:hover:bg-blue-900/30'
                                }`}
                              >
                                <CheckSquare className="h-4 w-4" />
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium ${task.completed ? 'line-through opacity-60' : ''}`}>
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs">
                                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                  {task.dueTime && (
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                      {formatTime(task.dueTime)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      Upcoming
                    </h3>
                    
                    {upcomingTasks.length === 0 ? (
                      <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No upcoming tasks
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingTasks.slice(0, 5).map(task => (
                          <div key={task.id} className={`p-3 rounded-xl border ${
                            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${
                                categories.find(c => c.name === task.category)?.color || 'from-gray-500 to-gray-600'
                              } text-white flex items-center justify-center font-bold text-sm`}>
                                {new Date(task.dueDate).getDate()}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{task.title}</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(task.dueDate).toLocaleDateString()}
                                  {task.dueTime && ` at ${formatTime(task.dueTime)}`}
                                </p>
                              </div>
                              
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                  <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm border-l-4 border-red-500`}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-500">
                      <Bell className="h-5 w-5" />
                      Overdue Tasks ({overdueTasks.length})
                    </h3>
                    
                    <div className="space-y-3">
                      {overdueTasks.map(task => (
                        <div key={task.id} className={`p-4 rounded-xl border-l-2 border-red-400 ${
                          darkMode ? 'bg-red-900/10 border-red-800' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleTaskComplete(task.id)}
                              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 transition-all"
                            >
                              <CheckSquare className="h-4 w-4" />
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-red-700 dark:text-red-400">{task.title}</p>
                              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                {task.dueTime && ` at ${formatTime(task.dueTime)}`}
                              </p>
                            </div>
                            
                            <button
                              onClick={() => editItem(task, 'task')}
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode 
                                  ? 'hover:bg-gray-700 text-gray-400' 
                                  : 'hover:bg-gray-100 text-gray-500'
                              }`}
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {modalType === 'task' 
                    ? (editingItem ? 'Edit Task' : 'Create New Task') 
                    : (editingItem ? 'Edit Note' : 'Create New Note')
                  }
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    resetTaskForm();
                    resetNoteForm();
                  }}
                  className={`p-2 rounded-xl transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {modalType === 'task' ? (
                <form onSubmit={handleAddTask} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Task title..."
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className={`w-full p-4 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Add a description..."
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      rows="3"
                      className={`w-full p-4 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Category
                      </label>
                      <select
                        value={taskForm.category}
                        onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Priority
                      </label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Time
                      </label>
                      <input
                        type="time"
                        value={taskForm.dueTime}
                        onChange={(e) => setTaskForm({ ...taskForm, dueTime: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={taskForm.starred}
                        onChange={(e) => setTaskForm({ ...taskForm, starred: e.target.checked })}
                        className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                      />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Star this task
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingItem(null);
                        resetTaskForm();
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    >
                      {editingItem ? 'Update Task' : 'Create Task'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddNote} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Note title..."
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                      className={`w-full p-4 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Start writing your note..."
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                      rows="8"
                      className={`w-full p-4 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Category
                      </label>
                      <select
                        value={noteForm.category}
                        onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="Ideas">Ideas</option>
                        <option value="Journal">Journal</option>
                        <option value="Learning">Learning</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Note Color
                      </label>
                      <select
                        value={noteForm.color}
                        onChange={(e) => setNoteForm({ ...noteForm, color: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <option value="default">Default</option>
                        <option value="yellow">Yellow</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="pink">Pink</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Reminder
                    </label>
                    <input
                      type="datetime-local"
                      value={noteForm.reminder}
                      onChange={(e) => setNoteForm({ ...noteForm, reminder: e.target.value })}
                      className={`w-full p-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noteForm.starred}
                        onChange={(e) => setNoteForm({ ...noteForm, starred: e.target.checked })}
                        className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                      />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Star this note
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingItem(null);
                        resetNoteForm();
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    >
                      {editingItem ? 'Update Note' : 'Create Note'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
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

export default NotesToTasksApp;