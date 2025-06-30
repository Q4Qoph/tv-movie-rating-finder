// app/title/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Play, 
  Calendar, 
  Clock, 
  Globe, 
  Award, 
  Heart,
  Share2,
  Star,
  Users,
  Camera
} from 'lucide-react';
import { useMovieStore } from '../../../store/movieStore';
import { movieApi } from '../../../lib/api';
import { TitleData, ReviewData, FAQData } from '../../../types';
import RatingBadge from '../../../components/RatingBadge';
import CastList from '../../../components/CastList';
import ReviewAccordion from '../../../components/ReviewAccordion';
import ImageGallery from '../../../components/ImageGallery';
import TrailerModal from '../../../components/TrailerModal';

const TitleDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  
  const {
    darkMode,
    selectedTitle,
    titleLoading,
    titleError,
    setSelectedTitle,
    setTitleLoading,
    setTitleError,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    setTrailerModalOpen,
  } = useMovieStore();

  const [reviews, setReviews] = useState<ReviewData | null>(null);
  const [faqs, setFAQs] = useState<FAQData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'reviews' | 'images'>('overview');

  useEffect(() => {
    if (id) {
      fetchTitleDetails(id);
    }
  }, [id]);

  const fetchTitleDetails = async (titleId: string) => {
    setTitleLoading(true);
    setTitleError(null);
    
    try {
      const [titleData, reviewsData, faqsData] = await Promise.all([
        movieApi.getTitle(titleId),
        movieApi.getReviews(titleId).catch(() => null),
        movieApi.getFAQ(titleId).catch(() => null),
      ]);
      
      setSelectedTitle(titleData);
      setReviews(reviewsData);
      setFAQs(faqsData);
    } catch (error) {
      setTitleError('Failed to load title details. Please try again.');
      console.error('Error fetching title details:', error);
    } finally {
      setTitleLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    if (!selectedTitle) return;
    
    if (isFavorite(selectedTitle.id)) {
      removeFromFavorites(selectedTitle.id);
    } else {
      addToFavorites(selectedTitle.id);
    }
  };

  const handleWatchTrailer = () => {
    if (selectedTitle?.trailer) {
      setTrailerModalOpen(true);
    }
  };

  if (titleLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="w-full lg:w-80 aspect-[3/4] bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
                <div className="flex gap-4">
                  <div className="h-12 bg-gray-300 rounded w-32"></div>
                  <div className="h-12 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (titleError || !selectedTitle) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {titleError || 'Title not found'}
          </h1>
          <button 
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'cast', label: 'Cast & Crew', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Award },
    { id: 'images', label: 'Images', icon: Camera },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop */}
        {selectedTitle.posters?.backdrops?.[0] && (
          <div className="absolute inset-0 h-96">
            <Image
              src={selectedTitle.posters.backdrops[0].link}
              alt={selectedTitle.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="w-full lg:w-80 aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={selectedTitle.image}
                alt={selectedTitle.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Details */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {selectedTitle.title}
                {selectedTitle.year && (
                  <span className="text-gray-300 ml-3">({selectedTitle.year})</span>
                )}
              </h1>

              {selectedTitle.originalTitle && selectedTitle.originalTitle !== selectedTitle.title && (
                <p className="text-xl text-gray-300 mb-4">
                  Original: {selectedTitle.originalTitle}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {selectedTitle.contentRating && (
                  <span className="bg-gray-700 px-3 py-1 rounded text-sm">
                    {selectedTitle.contentRating}
                  </span>
                )}
                {selectedTitle.runtimeStr && (
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 mr-1" />
                    {selectedTitle.runtimeStr}
                  </div>
                )}
                {selectedTitle.releaseDate && (
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-1" />
                    {selectedTitle.releaseDate}
                  </div>
                )}
              </div>

              {/* Ratings */}
              {selectedTitle.ratings && (
                <div className="flex flex-wrap gap-3 mb-6">
                  <RatingBadge
                    rating={selectedTitle.ratings.imDb}
                    source="imdb"
                    votes={selectedTitle.imDbRatingVotes}
                  />
                  <RatingBadge
                    rating={selectedTitle.ratings.metacritic}
                    source="metacritic"
                  />
                  <RatingBadge
                    rating={selectedTitle.ratings.rottenTomatoes}
                    source="rotten"
                  />
                  <RatingBadge
                    rating={selectedTitle.ratings.theMovieDb}
                    source="tmdb"
                  />
                </div>
              )}

              {/* Genres */}
              {selectedTitle.genreList && selectedTitle.genreList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedTitle.genreList.map((genre) => (
                    <span
                      key={genre.key}
                      className="bg-movie-gold text-black px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genre.value}
                    </span>
                  ))}
                </div>
              )}

              {/* Plot */}
              {selectedTitle.plot && (
                <p className="text-lg leading-relaxed mb-6 max-w-3xl">
                  {selectedTitle.plot}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {selectedTitle.trailer && (
                  <button
                    onClick={handleWatchTrailer}
                    className="btn-primary flex items-center"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Trailer
                  </button>
                )}
                
                <button
                  onClick={handleFavoriteClick}
                  className={`btn-secondary flex items-center ${
                    isFavorite(selectedTitle.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : ''
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${
                    isFavorite(selectedTitle.id) ? 'fill-current' : ''
                  }`} />
                  {isFavorite(selectedTitle.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>

                <button className="btn-secondary flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className={`border-b mb-8 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-movie-gold text-movie-gold'
                      : darkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`mr-2 h-4 w-4 ${
                    isActive ? 'text-movie-gold' : ''
                  }`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Director, Writers, Stars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {selectedTitle.directorList && selectedTitle.directorList.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Director{selectedTitle.directorList.length > 1 ? 's' : ''}
                    </h3>
                    <div className="space-y-2">
                      {selectedTitle.directorList.map((director) => (
                        <div key={director.id}>
                          <span className={`${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {director.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTitle.writerList && selectedTitle.writerList.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Writer{selectedTitle.writerList.length > 1 ? 's' : ''}
                    </h3>
                    <div className="space-y-2">
                      {selectedTitle.writerList.slice(0, 5).map((writer) => (
                        <div key={writer.id}>
                          <span className={`${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {writer.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTitle.starList && selectedTitle.starList.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Stars
                    </h3>
                    <div className="space-y-2">
                      {selectedTitle.starList.slice(0, 5).map((star) => (
                        <div key={star.id}>
                          <span className={`${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {star.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedTitle.countryList && selectedTitle.countryList.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Globe className="h-5 w-5 mr-2" />
                      Countries
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTitle.countryList.map((country) => (
                        <span
                          key={country.key}
                          className={`px-3 py-1 rounded-full text-sm ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {country.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTitle.languageList && selectedTitle.languageList.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTitle.languageList.map((language) => (
                        <span
                          key={language.key}
                          className={`px-3 py-1 rounded-full text-sm ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {language.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Awards */}
              {selectedTitle.awards && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Award className="h-5 w-5 mr-2" />
                    Awards
                  </h3>
                  <p className={`${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {selectedTitle.awards}
                  </p>
                </div>
              )}

              {/* Box Office */}
              {selectedTitle.boxOffice && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Box Office
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedTitle.boxOffice.budget && (
                      <div className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } shadow`}>
                        <h4 className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Budget
                        </h4>
                        <p className="text-movie-gold font-bold">
                          {selectedTitle.boxOffice.budget}
                        </p>
                      </div>
                    )}
                    {selectedTitle.boxOffice.openingWeekendUSA && (
                      <div className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } shadow`}>
                        <h4 className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Opening Weekend
                        </h4>
                        <p className="text-movie-gold font-bold">
                          {selectedTitle.boxOffice.openingWeekendUSA}
                        </p>
                      </div>
                    )}
                    {selectedTitle.boxOffice.grossUSA && (
                      <div className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } shadow`}>
                        <h4 className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Gross USA
                        </h4>
                        <p className="text-movie-gold font-bold">
                          {selectedTitle.boxOffice.grossUSA}
                        </p>
                      </div>
                    )}
                    {selectedTitle.boxOffice.cumulativeWorldwideGross && (
                      <div className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } shadow`}>
                        <h4 className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Worldwide Gross
                        </h4>
                        <p className="text-movie-gold font-bold">
                          {selectedTitle.boxOffice.cumulativeWorldwideGross}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cast' && selectedTitle.actorList && (
            <CastList cast={selectedTitle.actorList} />
          )}

          {activeTab === 'reviews' && (
            <ReviewAccordion reviews={reviews?.items || []} />
          )}

          {activeTab === 'images' && selectedTitle.images && (
            <ImageGallery images={selectedTitle.images.items || []} />
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal trailerData={selectedTitle.trailer || null} />
    </div>
  );
};

export default TitleDetailPage;