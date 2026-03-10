import React from 'react';
import { Plus, Clock, Calendar, CheckSquare, Bell, Edit3 } from 'lucide-react';
import {
  getTodayTasks,
  getUpcomingTasks,
  getOverdueTasks,
  formatTime,
  getPriorityColor,
} from '../utils/helpers';

const CalendarView = ({
  todos,
  setTodos,
  darkMode,
  setEditingItem,
  setShowModal,
  setModalType,
}) => {
  const todayTasks = getTodayTasks(todos);
  const upcomingTasks = getUpcomingTasks(todos);
  const overdueTasks = getOverdueTasks(todos);

  const toggleTaskComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
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

  const handleNewTaskOnDate = (date) => {
    setModalType('task');
    setEditingItem({ dueDate: date });
    setShowModal(true);
  };

  const relativeDue = (date) => {
    const now = new Date();
    const diff = new Date(date) - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days > 1) return `in ${days} days`;
    if (days === 1) return 'tomorrow';
    if (days === 0) return 'today';
    return `${Math.abs(days)} days overdue`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header + Mini Calendar */}
      <div
        className={`rounded-2xl p-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'
        } shadow-sm`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Calendar</h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p> 
            <p className={`mt-1 text-sm ${ darkMode ? 'text-gray-400' : 'text-gray-500' }`}> 
              Double-click on a calendar date to create a task for that day. 
            </p>
          </div>
          <button
            onClick={handleNewTask}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Task
          </button>
          
        </div>

        {/* Mini Calendar */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className={`text-center font-semibold p-2 text-sm tracking-wide ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}

          {Array.from({ length: 35 }, (_, i) => {
            const date = i - 2;
            const isCurrentMonth = date > 0 && date <= 30;
            const isToday = date === new Date().getDate() && isCurrentMonth;
            const dayTasks = isCurrentMonth
              ? todos.filter((task) => {
                  if (!task.dueDate || task.archived) return false;
                  return new Date(task.dueDate).getDate() === date;
                })
              : [];

            return (
              <div
                key={i}
                onDoubleClick={() =>
                  isCurrentMonth &&
                  handleNewTaskOnDate(
                    new Date(new Date().getFullYear(), new Date().getMonth(), date)
                  )
                }
                className={`aspect-square p-2 rounded-xl border flex flex-col items-center justify-start transition-all duration-200 cursor-pointer ${
                  isToday
                    ? 'bg-gradient-to-br from-[#a33353] to-[#c96378] text-white shadow-md ring-2 ring-[#e49aaf]'
                    : isCurrentMonth
                    ? darkMode
                      ? 'border-gray-600 hover:border-[#c96378] hover:bg-gray-700'
                      : 'border-[#edbec8] hover:bg-[#edbec8]/40 hover:border-[#c96378]'
                    : 'border-transparent'
                } ${
                  !isCurrentMonth
                    ? darkMode
                      ? 'text-gray-600'
                      : 'text-gray-300'
                    : ''
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isToday
                      ? 'text-white'
                      : darkMode
                      ? 'text-gray-200'
                      : 'text-gray-700'
                  }`}
                >
                  {isCurrentMonth ? date : ''}
                </span>
                <div className="flex gap-1 mt-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <span
                      key={task.id}
                      className="w-2 h-2 rounded-full bg-[#a33353]"
                      title={task.title}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Tasks & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div
          className={`rounded-2xl p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'
          } shadow-sm`}
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Today's Tasks
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
              {todayTasks.length}
            </span>
          </h3>

          {todayTasks.length === 0 ? (
            <p
              className={`text-center py-8 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              No tasks scheduled for today
            </p>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-shadow hover:shadow-md ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`p-1 rounded-lg ${
                        task.completed
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 hover:bg-blue-100 dark:bg-gray-600 dark:hover:bg-blue-900/30'
                      }`}
                    >
                      <CheckSquare className="h-4 w-4" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          task.completed ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span
                          className={`w-2 h-2 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        />
                        <span
                          className={
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }
                        >
                          {task.dueTime
                            ? formatTime(task.dueTime)
                            : 'No time set'}
                        </span>
                        {task.category && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 text-xs">
                            {task.category}
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

        {/* Upcoming */}
        <div
          className={`rounded-2xl p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'
          } shadow-sm`}
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Upcoming
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
              {upcomingTasks.length}
            </span>
          </h3>

          {upcomingTasks.length === 0 ? (
            <p
              className={`text-center py-8 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              No upcoming tasks
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-shadow hover:shadow-md ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white ${
                        task.category
                          ? `bg-gradient-to-r ${getPriorityColor(
                              task.priority
                            )}`
                          : 'bg-gray-400'
                      }`}
                    >
                      {new Date(task.dueDate).getDate()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{task.title}</p>
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {relativeDue(task.dueDate)}
                        {task.dueTime && ` · ${formatTime(task.dueTime)}`}
                      </p>
                    </div>

                    <span
                      className={`w-2 h-2 rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overdue */}
      {overdueTasks.length > 0 && (
        <div
          className={`rounded-2xl p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'
          } shadow-sm border-l-4 border-red-500`}
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-500 border-b pb-2">
            <Bell className="h-5 w-5" />
            Overdue Tasks
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300">
              {overdueTasks.length}
            </span>
          </h3>

          <div className="space-y-3">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border-l-2 border-red-400 transition-shadow hover:shadow-md ${
                  darkMode
                    ? 'bg-red-900/10 border-red-800'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 transition-all"
                  >
                    <CheckSquare className="h-4 w-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-red-700 dark:text-red-400">
                      {task.title}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? 'text-red-300' : 'text-red-600'
                      }`}
                    >
                      {relativeDue(task.dueDate)}
                      {task.dueTime && ` · ${formatTime(task.dueTime)}`}
                    </p>
                  </div>

                  <button
                    onClick={() => editItem(task)}
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
  );
};

export default CalendarView;
