import React from 'react';
import { Search, Plus, List, CheckSquare, Edit3, Star, Archive, Trash2, MoreVertical, Clock } from 'lucide-react';
import { ChevronDown } from "lucide-react";
import { getFilteredTasks, formatTime, getPriorityColor } from '../utils/helpers';

const TasksView = ({ 
  todos, 
  setTodos,
  darkMode, 
  selectedCategory, 
  searchTerm, 
  setSearchTerm,
  filterBy, 
  setFilterBy,
  sortBy, 
  setSortBy,
  viewMode, 
  setViewMode,
  setEditingItem, 
  setShowModal, 
  setModalType 
}) => {
  const filteredTasks = getFilteredTasks(todos, selectedCategory, filterBy, searchTerm, sortBy);

  const toggleTaskComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
    ));
  };

  const toggleStarred = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, starred: !todo.starred, updatedAt: new Date() } : todo
    ));
  };

  const archiveItem = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, archived: !todo.archived, updatedAt: new Date() } : todo
    ));
  };

  const deleteItem = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editItem = (task) => {
    setEditingItem({ ...task, type: 'task' });
    setModalType('task');
    setShowModal(true);
  };

  const handleNewTask = () => {
    setModalType('task');
    setEditingItem(null);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with filters */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {selectedCategory ? `${selectedCategory} Tasks` : 'All Tasks'}
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {filteredTasks.length} tasks
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewTask}
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

          <div className="relative w-56">
            <label htmlFor="filter" className="sr-only">
              Filter tasks
            </label>
            <select
              id="filter"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className={`appearance-none w-full px-4 py-3 rounded-xl border pr-10 text-sm font-medium shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                  : "bg-white border-gray-200 text-gray-700 placeholder-gray-500"
              }`}
            >
              <option value="" disabled hidden>
                Filter by...
              </option>
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="starred">Starred</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
              <option value="archived">Archived</option>
            </select>

            {/* Custom dropdown arrow */}
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>

          <div className="relative w-56">
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`appearance-none w-full px-4 py-3 rounded-xl border pr-10 text-sm font-medium shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                  : "bg-white border-gray-200 text-gray-700 placeholder-gray-500"
              }`}
            >
              <option value="" disabled hidden>
                Sort by...
              </option>
              <option value="created">Recently Created</option>
              <option value="updated">Recently Updated</option>
              <option value="due">Due Date</option>
              <option value="priority">Priority</option>
            </select>

            {/* Custom dropdown arrow */}
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>

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
      {filteredTasks.length === 0 ? (
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
          {filteredTasks.map(task => (
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
                    onClick={() => toggleStarred(task.id)}
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
                          onClick={() => editItem(task)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit Task
                        </button>
                        <button
                          onClick={() => archiveItem(task.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Archive className="h-4 w-4" />
                          {task.archived ? 'Unarchive' : 'Archive'}
                        </button>
                        <button
                          onClick={() => deleteItem(task.id)}
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
  );
};

export default TasksView;