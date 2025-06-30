// components/Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Moon, Sun, Film, Heart } from 'lucide-react';
import { useMovieStore } from '../store/movieStore';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const { darkMode, toggleDarkMode, favorites } = useMovieStore();

  return (
    <nav className={`sticky top-0 z-50 transition-colors duration-200 ${
      darkMode ? 'bg-movie-dark border-gray-700' : 'bg-white border-gray-200'
    } border-b backdrop-blur-sm bg-opacity-95`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-movie-gold" />
            <span className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              MovieFinder
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/top-charts" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Top Charts
            </Link>
            
            <Link 
              href="/favorites" 
              className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;