// components/MovieGrid.tsx
'use client';

import React from 'react';
import MovieCard from './MovieCard';
import { SearchResult, PopularItem } from '../types';

interface MovieGridProps {
  items: (SearchResult | PopularItem)[];
  type?: 'search' | 'popular';
  loading?: boolean;
  error?: string | null;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  items, 
  type = 'search', 
  loading = false, 
  error = null 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 aspect-[3/4] rounded-lg mb-3"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-3 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-movie-gold text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <MovieCard 
          key={item.id} 
          item={item} 
          type={type}
        />
      ))}
    </div>
  );
};

export default MovieGrid;