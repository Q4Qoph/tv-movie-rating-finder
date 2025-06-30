// app/top-charts/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Star, Film, Tv } from 'lucide-react';
import { useMovieStore } from '../../store/movieStore';
import { movieApi } from '../../lib/api';
import MovieGrid from '../../components/MovieGrid';

const TopChartsPage: React.FC = () => {
  const {
    darkMode,
    topMovies,
    topTVs,
    popularMovies,
    popularTVs,
    setTopMovies,
    setTopTVs,
    setPopularMovies,
    setPopularTVs,
  } = useMovieStore();

  const [activeChart, setActiveChart] = useState<'top-movies' | 'top-tvs' | 'popular-movies' | 'popular-tvs'>('top-movies');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChartsData();
  }, []);

  const fetchChartsData = async () => {
    setLoading(true);
    try {
      const [topMoviesData, topTVsData, popularMoviesData, popularTVsData] = await Promise.all([
        movieApi.getTop250Movies(),
        movieApi.getTop250TVs(),
        movieApi.getMostPopularMovies(),
        movieApi.getMostPopularTVs(),
      ]);

      setTopMovies(topMoviesData);
      setTopTVs(topTVsData);
      setPopularMovies(popularMoviesData);
      setPopularTVs(popularTVsData);
    } catch (error) {
      console.error('Error fetching charts data:', error);
    } finally {
      setLoading(false);
    }
  };

  const charts = [
    {
      id: 'top-movies',
      title: 'Top 250 Movies',
      icon: Trophy,
      data: topMovies,
      description: 'The highest-rated movies of all time'
    },
    {
      id: 'top-tvs',
      title: 'Top 250 TV Shows',
      icon: Star,
      data: topTVs,
      description: 'The highest-rated TV series of all time'
    },
    {
      id: 'popular-movies',
      title: 'Most Popular Movies',
      icon: Film,
      data: popularMovies,
      description: 'Currently trending movies'
    },
    {
      id: 'popular-tvs',
      title: 'Most Popular TV Shows',
      icon: Tv,
      data: popularTVs,
      description: 'Currently trending TV shows'
    },
  ];

  const getCurrentData = () => {
    const chart = charts.find(c => c.id === activeChart);
    return chart?.data;
  };

  const getCurrentTitle = () => {
    const chart = charts.find(c => c.id === activeChart);
    return chart?.title || '';
  };

  const getCurrentDescription = () => {
    const chart = charts.find(c => c.id === activeChart);
    return chart?.description || '';
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Top Charts
          </h1>
          <p className={`text-lg ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Discover the best movies and TV shows based on ratings and popularity
          </p>
        </div>

        {/* Chart Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {charts.map((chart) => {
              const Icon = chart.icon;
              const isActive = activeChart === chart.id;
              
              return (
                <button
                  key={chart.id}
                  onClick={() => setActiveChart(chart.id as any)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                    isActive
                      ? 'border-movie-gold bg-movie-gold bg-opacity-10'
                      : darkMode
                        ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <Icon className={`h-6 w-6 mr-3 ${
                      isActive ? 'text-movie-gold' : darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <h3 className={`font-semibold ${
                      isActive ? 'text-movie-gold' : darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {chart.title}
                    </h3>
                  </div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {chart.description}
                  </p>
                  {chart.data && (
                    <p className={`text-xs mt-2 ${
                      isActive ? 'text-movie-gold' : darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {chart.data.items?.length || 0} items
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Chart */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {getCurrentTitle()}
          </h2>
          <p className={`${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {getCurrentDescription()}
          </p>
        </div>

        {/* Results Grid */}
        <MovieGrid
          items={getCurrentData()?.items || []}
          type="popular"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TopChartsPage;