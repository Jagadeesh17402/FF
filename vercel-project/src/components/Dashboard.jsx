import React from 'react';
import { CheckSquare, FileText, Clock, Target, Star, Edit3, Plus } from 'lucide-react';
import { getCurrentDate, getTodayTasks, getOverdueTasks, formatTime, getPriorityColor, getNoteColor } from '../utils/helpers';

const Dashboard = ({ 
  todos, 
  setTodos,
  notes, 
  darkMode, 
  onNewTask, 
  onNewNote, 
  setEditingItem, 
  setShowModal, 
  setModalType 
}) => {
  const { fullDate } = getCurrentDate();
  const todayTasks = getTodayTasks(todos);
  const overdueTasks = getOverdueTasks(todos);

  const toggleTaskComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
    ));
  };

  const editItem = (item, type) => {
    setEditingItem({ ...item, type });
    if (type === 'task') {
      setModalType('task');
    } else {
      setModalType('note');
    }
    setShowModal(true);
  };

  const statsCards = [
    {
      title: "Today's Tasks",
      count: todayTasks.length,
      icon: CheckSquare,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Overdue",
      count: overdueTasks.length,
      icon: Clock,
      color: "from-red-500 to-red-600"
    },
    {
      title: "Notes",
      count: notes.filter(n => !n.archived).length,
      icon: FileText,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Completed",
      count: todos.filter(t => t.completed).length,
      icon: Target,
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
        <h2 className="text-3xl font-bold mb-2">Organize and Manage your Goals.</h2>
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{fullDate}</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} text-white rounded-xl`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Tasks */}
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Today's Tasks</h3>
          <button
            onClick={onNewTask}
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
            onClick={onNewNote}
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
  );
};

export default Dashboard;