// components/SearchBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMovieStore } from '../store/movieStore';

const SearchBar: React.FC = () => {
  const router = useRouter();
  const { 
    searchQuery, 
    setSearchQuery, 
    darkMode 
  } = useMovieStore();
  
  const [localQuery, setLocalQuery] = useState('');

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search movies, TV shows, actors..."
          className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-movie-gold focus:border-transparent ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        {localQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;