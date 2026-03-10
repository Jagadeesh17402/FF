import React, { useState, useEffect } from 'react'; 
import { X, Star } from 'lucide-react';

const noteColors = [
  { name: 'Red', value: '#a33353' },
  { name: 'Pink', value: '#c96378' },
  { name: 'Light Pink', value: '#e49aaf' },
  { name: 'Very Light Pink', value: '#edbec8' },
];

const NoteModal = ({ 
  notes, 
  setNotes,
  darkMode, 
  editingItem,
  onClose 
}) => {
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'Personal',
    tags: [],
    reminder: '',
    starred: false,
    archived: false,
    color: noteColors[0].value,
  });

  useEffect(() => {
    if (editingItem) {
      setNoteForm({
        title: editingItem.title || '',
        content: editingItem.content || '',
        category: editingItem.category || 'Personal',
        tags: editingItem.tags || [],
        reminder: editingItem.reminder || '',
        starred: editingItem.starred || false,
        archived: editingItem.archived || false,
        color: editingItem.color || noteColors[0].value
      });
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
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

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`rounded-2xl p-6 w-full max-w-md shadow-2xl`}
        style={{ backgroundColor: darkMode ? '#1f1f1f' : '#fff' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {editingItem ? 'Edit Note' : 'Create New Note'}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Note title..."
            value={noteForm.title}
            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
            className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'
            }`}
            required
            autoFocus
          />

          <textarea
            placeholder="Start writing your note..."
            value={noteForm.content}
            onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
            rows="5"
            className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'
            }`}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={noteForm.category}
                onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                className={`w-full p-2 rounded-xl border focus:ring-2 focus:ring-pink-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Ideas</option>
                <option>Journal</option>
                <option>Learning</option>
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

          <div className="flex items-center gap-3">
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
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              style={{ background: 'linear-gradient(90deg, #a33353, #ff6788ff)' }}
            >
              {editingItem ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
