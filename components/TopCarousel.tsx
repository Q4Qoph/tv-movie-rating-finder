// components/TopCarousel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { PopularItem } from '../types';
import { useMovieStore } from '../store/movieStore';

interface TopCarouselProps {
  items: PopularItem[];
  title: string;
  loading?: boolean;
}

const TopCarousel: React.FC<TopCarouselProps> = ({ items, title, loading = false }) => {
  const { darkMode } = useMovieStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 768) setItemsPerView(3);
      else if (window.innerWidth < 1024) setItemsPerView(4);
      else if (window.innerWidth < 1280) setItemsPerView(5);
      else setItemsPerView(6);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev + itemsPerView >= items.length ? 0 : prev + itemsPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.max(0, items.length - itemsPerView) : Math.max(0, prev - itemsPerView)
    );
  };

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 aspect-[3/4] rounded-lg mb-3"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={prevSlide}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            width: `${(items.length * 100) / itemsPerView}%`
          }}
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              className="px-2"
              style={{ width: `${100 / items.length}%` }}
            >
              <MovieCard item={item} type="popular" />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ 
          length: Math.ceil(items.length / itemsPerView) 
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * itemsPerView)}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(currentIndex / itemsPerView) === index
                ? 'bg-movie-gold' 
                : darkMode 
                  ? 'bg-gray-600' 
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TopCarousel;