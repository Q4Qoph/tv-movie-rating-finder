// components/RatingBadge.tsx
'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: string | undefined;
  source: 'imdb' | 'metacritic' | 'rotten' | 'tmdb';
  votes?: string;
  darkMode?: boolean;
}

const RatingBadge: React.FC<RatingBadgeProps> = ({ 
  rating, 
  source, 
  votes, 
  darkMode = false 
}) => {
  if (!rating || rating === 'N/A' || rating === '') return null;

  const getSourceConfig = () => {
    switch (source) {
      case 'imdb':
        return {
          name: 'IMDb',
          bgColor: 'bg-yellow-500',
          textColor: 'text-black',
          icon: <Star className="h-4 w-4 fill-current" />
        };
      case 'metacritic':
        const score = parseInt(rating);
        const bgColor = score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';
        return {
          name: 'Metacritic',
          bgColor,
          textColor: 'text-white',
          suffix: '/100'
        };
      case 'rotten':
        return {
          name: 'Rotten Tomatoes',
          bgColor: parseInt(rating) >= 60 ? 'bg-red-500' : 'bg-green-500',
          textColor: 'text-white',
          suffix: '%'
        };
      case 'tmdb':
        return {
          name: 'TMDb',
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          suffix: '/10'
        };
    }
  };

  const config = getSourceConfig();

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-lg ${config.bgColor} ${config.textColor}`}>
      {config.icon && <span className="mr-1">{config.icon}</span>}
      <span className="font-semibold">
        {rating}{config.suffix || ''}
      </span>
      <span className="ml-2 text-xs opacity-75">{config.name}</span>
      {votes && (
        <span className="ml-1 text-xs opacity-75">
          ({votes})
        </span>
      )}
    </div>
  );
};

export default RatingBadge;