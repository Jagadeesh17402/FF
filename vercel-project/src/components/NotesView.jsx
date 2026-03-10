import React from 'react';
import { Search, Plus, FileText, Star, Archive, Trash2, MoreVertical } from 'lucide-react';
import { ChevronDown } from "lucide-react";
import { getFilteredNotes, getNoteColor } from '../utils/helpers';

const NotesView = ({ 
  notes, 
  setNotes,
  darkMode, 
  searchTerm, 
  setSearchTerm,
  filterBy, 
  setFilterBy,
  sortBy, 
  setSortBy,
  setEditingItem, 
  setShowModal, 
  setModalType 
}) => {
  const filteredNotes = getFilteredNotes(notes, filterBy, searchTerm, sortBy);

  const toggleStarred = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, starred: !note.starred, updatedAt: new Date() } : note
    ));
  };

  const archiveItem = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, archived: !note.archived, updatedAt: new Date() } : note
    ));
  };

  const deleteItem = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const editItem = (note) => {
    setEditingItem({ ...note, type: 'note' });
    setModalType('note');
    setShowModal(true);
  };

  const handleNewNote = () => {
    setModalType('note');
    setEditingItem(null);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Notes</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {filteredNotes.length} notes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNewNote}
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

          {/* Filter Dropdown */}
          <div className="relative w-48">
            <label htmlFor="note-filter" className="sr-only">
              Filter notes
            </label>
            <select
              id="note-filter"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className={`appearance-none w-full px-4 py-3 rounded-xl border pr-10 text-sm font-medium shadow-sm transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                  : "bg-white border-gray-200 text-gray-700 placeholder-gray-500"
              }`}
            >
              <option value="" disabled hidden>
                Filter by...
              </option>
              <option value="all">All Notes</option>
              <option value="starred">Starred</option>
              <option value="archived">Archived</option>
            </select>

            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-56">
            <label htmlFor="note-sort" className="sr-only">
              Sort notes
            </label>
            <select
              id="note-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`appearance-none w-full px-4 py-3 rounded-xl border pr-10 text-sm font-medium shadow-sm transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer ${
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
              <option value="title">Alphabetical</option>
            </select>

            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm'} shadow-sm`}>
          <FileText className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No notes found</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {searchTerm ? 'Try a different search term' : 'Create your first note to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                getNoteColor(note.color)
              }`}
              onClick={() => editItem(note)}
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
                            toggleStarred(note.id);
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
                            archiveItem(note.id);
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
                            deleteItem(note.id);
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
  );
};

export default NotesView;