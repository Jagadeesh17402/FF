import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, isDark }) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // Focus on Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search everything... (Ctrl+K)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`pl-10 pr-10 py-2.5 w-80 rounded-xl border-2 transition-all duration-200 focus:ring-2 ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-rose-500/50 focus:border-rose-500' 
            : 'bg-white/80 border-gray-200 backdrop-blur-sm focus:ring-rose-500/20 focus:border-rose-400'
        }`}
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
