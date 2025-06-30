// components/ReviewAccordion.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useMovieStore } from '../store/movieStore';

interface Review {
  username: string;
  userUrl: string;
  reviewLink: string;
  warningSpoilers: boolean;
  date: string;
  rate: string;
  helpful: string;
  title: string;
  content: string;
}

interface ReviewAccordionProps {
  reviews: Review[];
}

const ReviewAccordion: React.FC<ReviewAccordionProps> = ({ reviews }) => {
  const { darkMode } = useMovieStore();
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

  const toggleReview = (index: number) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedReviews(newExpanded);
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className={`text-xl font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        User Reviews
      </h3>
      
      <div className="space-y-4">
        {reviews.slice(0, 5).map((review, index) => (
          <div 
            key={index}
            className={`border rounded-lg overflow-hidden ${
              darkMode 
                ? 'border-gray-700 bg-gray-800' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <div 
              className={`p-4 cursor-pointer hover:bg-opacity-50 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleReview(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {review.title || 'Review'}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        by {review.username}
                      </span>
                      {review.rate && (
                        <div className="flex items-center text-movie-gold">
                          <Star className="h-3 w-3 fill-current mr-1" />
                          <span className="text-sm">{review.rate}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {review.warningSpoilers && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Spoiler
                    </span>
                  )}
                  {expandedReviews.has(index) ? (
                    <ChevronUp className={`h-5 w-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  ) : (
                    <ChevronDown className={`h-5 w-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  )}
                </div>
              </div>
            </div>
            
            {expandedReviews.has(index) && (
              <div className={`px-4 pb-4 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="pt-4">
                  <p className={`text-sm leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {review.content}
                  </p>
                  <div className={`flex items-center justify-between mt-3 text-xs ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    <span>{review.date}</span>
                    {review.helpful && (
                      <span>{review.helpful} found this helpful</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewAccordion;