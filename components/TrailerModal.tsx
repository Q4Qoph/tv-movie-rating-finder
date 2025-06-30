// components/TrailerModal.tsx
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useMovieStore } from '../store/movieStore';

interface TrailerModalProps {
  trailerData: {
    videoId: string;
    videoTitle: string;
    linkEmbed: string;
  } | null;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ trailerData }) => {
  const { trailerModalOpen, setTrailerModalOpen } = useMovieStore();

  const closeModal = () => {
    setTrailerModalOpen(false);
  };

  if (!trailerModalOpen || !trailerData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative bg-black rounded-lg overflow-hidden max-w-4xl w-full">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="aspect-video">
          <iframe
            src={trailerData.linkEmbed}
            title={trailerData.videoTitle}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
