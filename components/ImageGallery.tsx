// components/ImageGallery.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMovieStore } from '../store/movieStore';

interface ImageItem {
  title: string;
  image: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  title?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title = "Images" }) => {
  const { 
    darkMode, 
    imageGalleryOpen, 
    setImageGalleryOpen, 
    selectedImageIndex, 
    setSelectedImageIndex 
  } = useMovieStore();

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setImageGalleryOpen(true);
  };

  const closeGallery = () => {
    setImageGalleryOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.slice(0, 8).map((image, index) => (
            <div 
              key={index}
              className="aspect-video relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openGallery(index)}
            >
              <Image
                src={image.image}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
            </div>
          ))}
        </div>
        
        {images.length > 8 && (
          <button 
            onClick={() => openGallery(0)}
            className="mt-4 text-movie-gold hover:text-yellow-600 transition-colors"
          >
            View all {images.length} images →
          </button>
        )}
      </div>

      {/* Full Screen Gallery Modal */}
      {imageGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Image */}
            <div className="relative max-w-4xl max-h-full mx-4">
              <Image
                src={images[selectedImageIndex]?.image}
                alt={images[selectedImageIndex]?.title}
                width={1200}
                height={800}
                className="object-contain max-h-screen"
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
              {selectedImageIndex + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;