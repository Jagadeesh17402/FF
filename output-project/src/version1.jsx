import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Bell, Settings, CheckSquare, FileText, Edit3, Trash2, Clock, Tag, Filter, Lightbulb, Utensils, Briefcase, Dumbbell, Music, X } from 'lucide-react';

const NoteTodoApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [categories] = useState([
    { id: 1, name: 'Idea', icon: Lightbulb, color: 'from-[#76111b] to-[#c96378]', taskCount: 2 },
    { id: 2, name: 'Food', icon: Utensils, color: 'from-[#e49daf] to-[#a3253a]', taskCount: 3 },
    { id: 3, name: 'Work', icon: Briefcase, color: 'from-[#76111b] to-[#e49daf]', taskCount: 14 },
    { id: 4, name: 'Sport', icon: Dumbbell, color: 'from-[#c96378] to-[#edbec8]', taskCount: 5 },
    { id: 5, name: 'Music', icon: Music, color: 'from-[#a3253a] to-[#c96378]', taskCount: 4 }
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('task');
  const [editingItem, setEditingItem] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  
  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    category: 'Idea',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    completed: false,
    tags: []
  });
  
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'Personal',
    tags: [],
    reminder: ''
  });

  // Get current date info
  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    return { day, month, dayName };
  };

  const { day, month, dayName } = getCurrentDate();

  // Get today's tasks
  const getTodayTasks = () => {
    const today = new Date().toDateString();
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      return new Date(todo.dueDate).toDateString() === today;
    });
  };

  const todayTasks = getTodayTasks();

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

    // Add to calendar if has due date
    if (newTask.dueDate) {
      const event = {
        id: `task-${newTask.id}`,
        title: newTask.title,
        date: new Date(`${newTask.dueDate}${newTask.dueTime ? 'T' + newTask.dueTime : ''}`),
        type: 'task',
        category: newTask.category,
        priority: newTask.priority
      };
      setCalendarEvents([...calendarEvents.filter(e => e.id !== event.id), event]);
    }

    // Reset form
    setTaskForm({
      title: '',
      description: '',
      category: 'Idea',
      priority: 'medium',
      dueDate: '',
      dueTime: '',
      completed: false,
      tags: []
    });
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

    // Add to calendar if reminder is set
    if (newNote.reminder) {
      const event = {
        id: `note-${newNote.id}`,
        title: `Note: ${newNote.title}`,
        date: new Date(newNote.reminder),
        type: 'note',
        category: newNote.category
      };
      setCalendarEvents([...calendarEvents.filter(e => e.id !== event.id), event]);
    }

    // Reset form
    setNoteForm({
      title: '',
      content: '',
      category: 'Personal',
      tags: [],
      reminder: ''
    });
    setShowModal(false);
    setEditingItem(null);
  };

  // Toggle task completion
  const toggleTaskComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
    ));
  };

  // Delete item
  const deleteItem = (id, type) => {
    if (type === 'task') {
      setTodos(todos.filter(todo => todo.id !== id));
      setCalendarEvents(calendarEvents.filter(event => event.id !== `task-${id}`));
    } else {
      setNotes(notes.filter(note => note.id !== id));
      setCalendarEvents(calendarEvents.filter(event => event.id !== `note-${id}`));
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
        tags: item.tags || []
      });
      setModalType('task');
    } else {
      setNoteForm({
        title: item.title,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        reminder: item.reminder || ''
      });
      setModalType('note');
    }
    setShowModal(true);
  };

  // Get category tasks
  const getCategoryTasks = (categoryName) => {
    return todos.filter(todo => todo.category === categoryName);
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

  // Get priority color using exact palette
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-[#76111b] to-[#a3253a]';
      case 'medium': return 'bg-gradient-to-r from-[#c96378] to-[#e49daf]';
      case 'low': return 'bg-gradient-to-r from-[#e49daf] to-[#edbec8]';
      default: return 'bg-gradient-to-r from-[#edbec8] to-[#f5e6ea]';
    }
  };

  // Filter items
  const getFilteredTasks = () => {
    let filtered = selectedCategory ? getCategoryTasks(selectedCategory) : todos;
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  };

  const getFilteredNotes = () => {
    let filtered = notes;
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e6ea] via-[#edbec8] to-rose-100">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Panel - Today */}
            <div className="bg-gradient-to-br from-[#76111b] to-[#c96378] rounded-3xl p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-lg font-medium">{day} {month}</span>
                </div>
                <Bell className="h-6 w-6 opacity-70" />
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Today</h1>
                <p className="text-[#edbec8]">{dayName} • {todayTasks.length} Tasks</p>
                <button
                  onClick={() => { setModalType('task'); setShowModal(true); }}
                  className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-200"
                >
                  Add New
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-[#edbec8] mb-4">My Tasks</h3>
                {todayTasks.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <p className="text-sm text-[#edbec8]">No tasks for today</p>
                    <p className="text-xs text-[#edbec8]/70">Add a task to get started</p>
                  </div>
                ) : (
                  todayTasks.slice(0, 5).map(task => (
                    <div key={task.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`mt-1 p-1 rounded-full transition-all ${
                            task.completed 
                              ? 'bg-green-400 text-white' 
                              : 'bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          <CheckSquare className="h-4 w-4" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              {task.dueTime ? formatTime(task.dueTime) : 'All Day'}
                            </span>
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                          </div>
                          <p className={`text-sm ${task.completed ? 'line-through opacity-60' : ''}`}>{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-[#edbec8] mt-1">{task.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Middle Panel - Categories */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Create Task</h2>
                <Clock className="h-6 w-6 text-[#c96378]" />
              </div>

              {/* Calendar Mini */}
              <div className="grid grid-cols-7 gap-1 mb-6 text-xs">
                {['14', '15', '16', '17', '18', '19', '20'].map((date, i) => (
                  <div key={i} className={`p-2 text-center rounded-lg ${
                    i === 0 ? 'bg-gradient-to-r from-[#76111b] to-[#c96378] text-white' : 'text-gray-600'
                  }`}>
                    {date}
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-gray-800 mb-4">Choose Activity</h3>
              
              <div className="space-y-3">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => { 
                        setSelectedCategory(category.name); 
                        setActiveTab('tasks');
                      }}
                      className="w-full bg-gradient-to-r from-[#f5e6ea] to-[#edbec8] hover:from-[#edbec8] hover:to-[#e49daf] rounded-2xl p-4 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-gray-800">{category.name}</h4>
                            <p className="text-sm text-gray-500">{getCategoryTasks(category.name).length} Tasks</p>
                          </div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-[#c96378] group-hover:border-[#76111b] transition-colors"></div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => { setModalType('task'); setShowModal(true); }}
                className="w-full mt-6 bg-gradient-to-r from-[#76111b] to-[#c96378] text-white p-4 rounded-full font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add New Task
              </button>
            </div>

            {/* Right Panel - Documents & Calendar */}
            <div className="space-y-6">
              {/* Documents */}
              <div className="bg-gradient-to-br from-[#c96378] to-[#e49daf] rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Documents</h3>
                  <Search className="h-5 w-5 opacity-70" />
                </div>
                
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                      <p className="text-sm">No documents yet</p>
                      <p className="text-xs opacity-70">Create your first note</p>
                    </div>
                  ) : (
                    notes.slice(0, 3).map((note, i) => (
                      <div key={note.id} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-200 cursor-pointer"
                           onClick={() => editItem(note, 'note')}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-6 rounded bg-gradient-to-r ${
                            i === 0 ? 'from-[#76111b] to-[#a3253a]' : 
                            i === 1 ? 'from-[#e49daf] to-[#edbec8]' : 
                            'from-[#c96378] to-[#e49daf]'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{note.title}</h4>
                            <p className="text-xs opacity-70">{note.category}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => { setModalType('note'); setShowModal(true); }}
                  className="w-full mt-4 bg-white/20 backdrop-blur-sm p-3 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-200"
                >
                  Add Document
                </button>
              </div>

              {/* Calendar */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Calendar</h3>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">September 2024</p>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                    <div key={day} className="text-center p-1 font-medium">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-sm">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = i - 2; // Start from -2 to show previous month dates
                    const isCurrentMonth = date > 0 && date <= 30;
                    const isToday = date === new Date().getDate();
                    const hasEvent = isCurrentMonth && calendarEvents.some(event => 
                      new Date(event.date).getDate() === date
                    );
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded-lg text-center p-1 relative ${
                          isToday 
                            ? 'bg-gradient-to-r from-[#76111b] to-[#c96378] text-white font-bold' 
                            : isCurrentMonth 
                            ? 'text-gray-700 hover:bg-[#f5e6ea]' 
                            : 'text-gray-300'
                        }`}
                      >
                        {isCurrentMonth ? date : ''}
                        {hasEvent && (
                          <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                            isToday ? 'bg-white' : 'bg-[#c96378]'
                          }`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upcoming events */}
                <div className="mt-4 space-y-2">
                  {calendarEvents.slice(0, 2).map(event => (
                    <div key={event.id} className="flex items-center gap-2 p-2 bg-gradient-to-r from-[#f5e6ea] to-[#edbec8] rounded-lg">
                      <div className="w-2 h-2 bg-[#c96378] rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {calendarEvents.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-2">No upcoming events</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks View */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {selectedCategory ? `${selectedCategory} Tasks` : 'All Tasks'}
                  </h1>
                  <p className="text-gray-600">{getFilteredTasks().length} tasks</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setSelectedCategory(null);
                    }}
                    className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => { setModalType('task'); setShowModal(true); }}
                    className="px-4 py-2 bg-gradient-to-r from-[#76111b] to-[#c96378] text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#c96378] focus:border-transparent"
                />
              </div>
            </div>

            {/* Tasks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredTasks().length === 0 ? (
                <div className="col-span-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
                  <CheckSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg text-gray-600 mb-2">No tasks found</p>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try a different search term' : 'Create your first task to get started'}
                  </p>
                </div>
              ) : (
                getFilteredTasks().map(task => (
                  <div key={task.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`p-2 rounded-xl transition-all ${
                            task.completed 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 hover:bg-[#f5e6ea] text-gray-400'
                          }`}
                        >
                          <CheckSquare className="h-4 w-4" />
                        </button>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => editItem(task, 'task')}
                          className="p-2 text-gray-400 hover:text-[#c96378] hover:bg-[#f5e6ea] rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(task.id, 'task')}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className={`font-semibold text-gray-800 mb-2 ${task.completed ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-sm text-gray-600 mb-3 ${task.completed ? 'line-through opacity-60' : ''}`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-gradient-to-r from-[#edbec8] to-[#f5e6ea] text-[#76111b] px-2 py-1 rounded-full font-medium">
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                          {task.dueTime && ` ${formatTime(task.dueTime)}`}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Notes View */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
                  <p className="text-gray-600">{getFilteredNotes().length} documents</p>
                </div>
                <button
                  onClick={() => { setModalType('note'); setShowModal(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-[#76111b] to-[#c96378] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  New Document
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#c96378] focus:border-transparent"
                />
              </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredNotes().length === 0 ? (
                <div className="col-span-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg text-gray-600 mb-2">No documents found</p>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try a different search term' : 'Create your first document to get started'}
                  </p>
                </div>
              ) : (
                getFilteredNotes().map((note, i) => (
                  <div key={note.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-8 h-6 rounded bg-gradient-to-r ${
                        i % 3 === 0 ? 'from-[#76111b] to-[#a3253a]' : 
                        i % 3 === 1 ? 'from-[#c96378] to-[#e49daf]' : 
                        'from-[#e49daf] to-[#edbec8]'
                      }`}></div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => editItem(note, 'note')}
                          className="p-2 text-gray-400 hover:text-[#c96378] hover:bg-[#f5e6ea] rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(note.id, 'note')}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2">{note.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.content}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-gradient-to-r from-[#edbec8] to-[#f5e6ea] text-[#76111b] px-2 py-1 rounded-full font-medium">
                        {note.category}
                      </span>
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
                  <p className="text-gray-600">September 2024</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
                    Today
                  </button>
                  <button 
                    onClick={() => { setModalType('task'); setShowModal(true); }}
                    className="px-4 py-2 bg-gradient-to-r from-[#76111b] to-[#c96378] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Event
                  </button>
                </div>
              </div>
            </div>

            {/* Full Calendar */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <div className="grid grid-cols-7 gap-4 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center font-medium text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 35 }, (_, i) => {
                  const date = i - 2; // Start from -2 to show previous month dates
                  const isCurrentMonth = date > 0 && date <= 30;
                  const isToday = date === new Date().getDate();
                  const dayEvents = isCurrentMonth ? calendarEvents.filter(event => 
                    new Date(event.date).getDate() === date
                  ) : [];
                  
                  return (
                    <div
                      key={i}
                      className={`aspect-square p-2 rounded-2xl border-2 transition-all duration-200 ${
                        isToday 
                          ? 'bg-gradient-to-r from-[#76111b] to-[#c96378] text-white border-[#76111b] font-bold' 
                          : isCurrentMonth 
                          ? 'border-gray-100 hover:border-[#c96378] hover:bg-[#f5e6ea]' 
                          : 'border-transparent text-gray-300'
                      }`}
                    >
                      <div className="h-full flex flex-col">
                        <span className={`text-sm mb-1 ${isToday ? 'text-white' : 'text-gray-700'}`}>
                          {isCurrentMonth ? date : ''}
                        </span>
                        <div className="flex-1 space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${
                                isToday 
                                  ? 'bg-white/20 text-white' 
                                  : event.type === 'task'
                                  ? 'bg-[#c96378] text-white'
                                  : 'bg-[#e49daf] text-white'
                              }`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className={`text-xs ${isToday ? 'text-white' : 'text-gray-500'}`}>
                              +{dayEvents.length - 2} more
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
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {calendarEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No upcoming events</p>
                    <p className="text-sm">Create a task with a due date to see it here</p>
                  </div>
                ) : (
                  calendarEvents
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map(event => (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#f5e6ea] to-[#edbec8] rounded-2xl hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#76111b] to-[#c96378] rounded-2xl flex items-center justify-center text-white font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {event.date.toLocaleDateString()} 
                          {event.date.getHours() !== 0 && ` at ${event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                          event.type === 'task' ? 'bg-[#edbec8] text-[#76111b]' : 'bg-[#c96378] text-white'
                        }`}>
                          {event.category || event.type}
                        </span>
                      </div>
                      {event.priority && (
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(event.priority)}`}></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-2 shadow-2xl border border-white/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`p-4 rounded-2xl transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-[#76111b] to-[#c96378] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-[#f5e6ea]'
                }`}
              >
                <Calendar className="h-6 w-6" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('tasks');
                  setSelectedCategory(null);
                }}
                className={`p-4 rounded-2xl transition-all duration-200 ${
                  activeTab === 'tasks'
                    ? 'bg-gradient-to-r from-[#76111b] to-[#c96378] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-[#f5e6ea]'
                }`}
              >
                <CheckSquare className="h-6 w-6" />
              </button>
              <button
                onClick={() => { setModalType('task'); setShowModal(true); }}
                className="p-4 bg-gradient-to-r from-[#76111b] to-[#c96378] rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-6 w-6" />
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`p-4 rounded-2xl transition-all duration-200 ${
                  activeTab === 'notes'
                    ? 'bg-gradient-to-r from-[#76111b] to-[#c96378] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-[#f5e6ea]'
                }`}
              >
                <FileText className="h-6 w-6" />
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`p-4 rounded-2xl transition-all duration-200 ${
                  activeTab === 'calendar'
                    ? 'bg-gradient-to-r from-[#76111b] to-[#c96378] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-[#f5e6ea]'
                }`}
              >
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {modalType === 'task' ? (editingItem ? 'Edit Task' : 'Create Task') : (editingItem ? 'Edit Note' : 'Create Note')}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setTaskForm({
                      title: '',
                      description: '',
                      category: 'Idea',
                      priority: 'medium',
                      dueDate: '',
                      dueTime: '',
                      completed: false,
                      tags: []
                    });
                    setNoteForm({
                      title: '',
                      content: '',
                      category: 'Personal',
                      tags: [],
                      reminder: ''
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {modalType === 'task' ? (
                <form onSubmit={handleAddTask} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Task name..."
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none"
                    required
                  />
                  
                  <textarea
                    placeholder="Task Description..."
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    rows="3"
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none resize-none"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={taskForm.category}
                      onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                      className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none"
                    />
                    
                    <input
                      type="time"
                      value={taskForm.dueTime}
                      onChange={(e) => setTaskForm({ ...taskForm, dueTime: e.target.value })}
                      className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#76111b] to-[#c96378] text-white p-4 rounded-2xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    {editingItem ? 'Update Task' : 'Create Task'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddNote} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none"
                    required
                  />
                  
                  <textarea
                    placeholder="Start writing your note..."
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                    rows="6"
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none resize-none"
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={noteForm.category}
                      onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                      className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Ideas">Ideas</option>
                      <option value="Journal">Journal</option>
                    </select>
                    
                    <input
                      type="datetime-local"
                      value={noteForm.reminder}
                      onChange={(e) => setNoteForm({ ...noteForm, reminder: e.target.value })}
                      className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#c96378] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#76111b] to-[#c96378] text-white p-4 rounded-2xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    {editingItem ? 'Update Note' : 'Create Note'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteTodoApp;