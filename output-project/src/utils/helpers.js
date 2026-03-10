// Format time from 24h to 12h format
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Get priority color class
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-400';
  }
};

// Get note color classes
export const getNoteColor = (color) => {
  switch (color) {
    case 'yellow': return 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
    case 'green': return 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800';
    case 'blue': return 'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    case 'purple': return 'bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
    case 'pink': return 'bg-pink-100 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800';
    default: return 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700';
  }
};

// Get current date info
export const getCurrentDate = () => {
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

// Get today's tasks
export const getTodayTasks = (todos) => {
  const today = new Date().toDateString();
  return todos.filter(todo => {
    if (!todo.dueDate || todo.archived) return false;
    return new Date(todo.dueDate).toDateString() === today;
  });
};

// Get overdue tasks
export const getOverdueTasks = (todos) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return todos.filter(todo => {
    if (!todo.dueDate || todo.completed || todo.archived) return false;
    return new Date(todo.dueDate) < today;
  });
};

// Get upcoming tasks (next 7 days)
export const getUpcomingTasks = (todos) => {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  return todos.filter(todo => {
    if (!todo.dueDate || todo.archived) return false;
    const dueDate = new Date(todo.dueDate);
    return dueDate >= today && dueDate <= nextWeek;
  });
};

export const validateTask = (task) => {
  const errors = {};
  if (!task.title || task.title.trim() === '') {
    errors.title = 'Title is required';
  }
  // Optional: more validation for dueDate, priority, etc.
  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
};

// Filter and sort tasks
export const getFilteredTasks = (todos, selectedCategory, filterBy, searchTerm, sortBy) => {
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

// Filter and sort notes
export const getFilteredNotes = (notes, filterBy, searchTerm, sortBy) => {
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