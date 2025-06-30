// app/page.tsx (Homepage)
'use client';

import React, { useEffect } from 'react';
import { Play, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useMovieStore } from '../store/movieStore';
import { movieApi } from '../lib/api';
import TopCarousel from '../components/TopCarousel';
import MovieGrid from '../components/MovieGrid';

const HomePage: React.FC = () => {
  const {
    darkMode,
    topMovies,
    popularMovies,
    popularTVs,
    inTheaters,
    comingSoon,
    setTopMovies,
    setPopularMovies,
    setPopularTVs,
    setInTheaters,
    setComingSoon,
  } = useMovieStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          topMoviesData,
          popularMoviesData,
          popularTVsData,
          inTheatersData,
          comingSoonData,
        ] = await Promise.all([
          movieApi.getTop250Movies(),
          movieApi.getMostPopularMovies(),
          movieApi.getMostPopularTVs(),
          movieApi.getInTheaters(),
          movieApi.getComingSoon(),
        ]);

        setTopMovies(topMoviesData);
        setPopularMovies(popularMoviesData);
        setPopularTVs(popularTVsData);
        setInTheaters(inTheatersData);
        setComingSoon(comingSoonData);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      }
    };

    fetchData();
  }, [setTopMovies, setPopularMovies, setPopularTVs, setInTheaters, setComingSoon]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Hero Section */}
      <section className="relative hero-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Discover Your Next
            <br />
            <span className="text-white">Movie Experience</span>
          </h1>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Find ratings, reviews, trailers, and detailed information about millions of movies and TV shows
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary bg-black text-white hover:bg-gray-800">
              <Play className="h-5 w-5 mr-2" />
              Watch Trailers
            </button>
            <button className="btn-secondary bg-white text-black hover:bg-gray-100">
              <TrendingUp className="h-5 w-5 mr-2" />
              Browse Top Charts
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top 250 Movies */}
        <TopCarousel
          items={topMovies?.items || []}
          title="🏆 Top 250 Movies"
          loading={!topMovies}
        />

        {/* In Theaters */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Calendar className={`h-6 w-6 mr-3 ${darkMode ? 'text-movie-gold' : 'text-gray-700'}`} />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              In Theaters Now
            </h2>
          </div>
          <MovieGrid
            items={inTheaters?.items || []}
            type="popular"
            loading={!inTheaters}
          />
        </section>

        {/* Coming Soon */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Clock className={`h-6 w-6 mr-3 ${darkMode ? 'text-movie-gold' : 'text-gray-700'}`} />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Coming Soon
            </h2>
          </div>
          <MovieGrid
            items={comingSoon?.items || []}
            type="popular"
            loading={!comingSoon}
          />
        </section>

        {/* Popular Movies */}
        <TopCarousel
          items={popularMovies?.items || []}
          title="🔥 Most Popular Movies"
          loading={!popularMovies}
        />

        {/* Popular TV Shows */}
        <TopCarousel
          items={popularTVs?.items || []}
          title="📺 Most Popular TV Shows"
          loading={!popularTVs}
        />
      </div>
    </div>
  );
};

export default HomePage;