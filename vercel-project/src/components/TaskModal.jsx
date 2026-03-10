import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';

const TaskModal = ({ 
  todos, 
  setTodos,
  darkMode, 
  editingItem,
  onClose,
  categories 
}) => {
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

  useEffect(() => {
    if (editingItem) {
      setTaskForm({
        title: editingItem.title || '',
        description: editingItem.description || '',
        category: editingItem.category || 'Work',
        priority: editingItem.priority || 'medium',
        dueDate: editingItem.dueDate || '',
        dueTime: editingItem.dueTime || '',
        completed: editingItem.completed || false,
        tags: editingItem.tags || [],
        starred: editingItem.starred || false,
        archived: editingItem.archived || false
      });
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
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

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {editingItem ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              onClick={onClose}
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
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              {editingItem ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;