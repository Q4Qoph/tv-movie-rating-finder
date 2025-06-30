// app/favorites/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useMovieStore } from '../../store/movieStore';
import { movieApi } from '../../lib/api';
import { TitleData } from '../../types';
import MovieCard from '../../components/MovieCard';

const FavoritesPage: React.FC = () => {
  const { darkMode, favorites, removeFromFavorites } = useMovieStore();
  const [favoriteItems, setFavoriteItems] = useState<TitleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavoriteItems();
  }, [favorites]);

  const fetchFavoriteItems = async () => {
    if (favorites.length === 0) {
      setFavoriteItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const itemPromises = favorites.map(id => movieApi.getTitle(id).catch(() => null));
      const items = await Promise.all(itemPromises);
      setFavoriteItems(items.filter(Boolean) as TitleData[]);
    } catch (error) {
      console.error('Error fetching favorite items:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      favorites.forEach(id => removeFromFavorites(id));
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index}>
                  <div className="bg-gray-300 aspect-[3/4] rounded-lg mb-3"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Heart className={`h-8 w-8 mr-3 text-red-500 fill-current`} />
            <div>
              <h1 className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                My Favorites
              </h1>
              <p className={`${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your favorites
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </button>
          )}
        </div>

        {/* Favorites Grid */}
        {favoriteItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favoriteItems.map((item) => (
              <MovieCard
                key={item.id}
                item={{
                  id: item.id,
                  title: item.title,
                  image: item.image,
                  description: item.plot || '',
                  resultType: item.type
                }}
                type="search"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className={`h-16 w-16 mx-auto mb-4 ${
              darkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No favorites yet
            </h3>
            <p className={`mb-8 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Start adding movies and TV shows to your favorites by clicking the heart icon
            </p>
            <a
              href="/"
              className="btn-primary inline-flex items-center"
            >
              Discover Movies & Shows
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;