// app/name/[id]/page.tsx (Actor Detail Page)
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Award, User } from 'lucide-react';
import { useMovieStore } from '../../../store/movieStore';
import { movieApi } from '../../../lib/api';
import MovieCard from '../../../components/MovieCard';

interface NameData {
  id: string;
  name: string;
  role: string;
  image: string;
  summary: string;
  birthDate: string;
  deathDate: string;
  awards: string;
  height: string;
  knownFor: Array<{
    id: string;
    title: string;
    fullTitle: string;
    year: string;
    role: string;
    image: string;
  }>;
  castMovies: Array<{
    id: string;
    role: string;
    title: string;
    year: string;
    description: string;
  }>;
  errorMessage?: string;
}

const ActorDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const { darkMode } = useMovieStore();
  
  const [nameData, setNameData] = useState<NameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchNameData(id);
    }
  }, [id]);

  const fetchNameData = async (nameId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://tv-api.com/API/Name/${process.env.NEXT_PUBLIC_TV_API_KEY}/${nameId}`);
      const data = await response.json();
      
      if (data.errorMessage) {
        setError(data.errorMessage);
      } else {
        setNameData(data);
      }
    } catch (err) {
      setError('Failed to load actor details. Please try again.');
      console.error('Error fetching name data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-80 aspect-[3/4] bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !nameData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <User className={`h-16 w-16 mx-auto mb-4 ${
            darkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <h1 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {error || 'Person not found'}
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

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Photo */}
          <div className="w-full lg:w-80 aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={nameData.image || '/placeholder-person.jpg'}
              alt={nameData.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {nameData.name}
            </h1>

            {nameData.role && (
              <p className={`text-xl mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {nameData.role}
              </p>
            )}

            {/* Bio Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {nameData.birthDate && (
                <div className="flex items-center">
                  <Calendar className={`h-5 w-5 mr-3 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <div>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Born
                    </p>
                    <p className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {nameData.birthDate}
                    </p>
                  </div>
                </div>
              )}

              {nameData.height && (
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Height
                  </p>
                  <p className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {nameData.height}
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            {nameData.summary && (
              <div className="mb-8">
                <h3 className={`text-xl font-semibold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Biography
                </h3>
                <p className={`leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {nameData.summary}
                </p>
              </div>
            )}

            {/* Awards */}
            {nameData.awards && (
              <div>
                <h3 className={`text-xl font-semibold mb-3 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Award className="h-5 w-5 mr-2" />
                  Awards
                </h3>
                <p className={`leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {nameData.awards}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Known For */}
        {nameData.knownFor && nameData.knownFor.length > 0 && (
          <section className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Known For
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {nameData.knownFor.map((item) => (
                <MovieCard
                  key={item.id}
                  item={{
                    id: item.id,
                    title: item.title,
                    image: item.image,
                    description: `${item.role} (${item.year})`,
                    resultType: 'Movie'
                  }}
                  type="search"
                />
              ))}
            </div>
          </section>
        )}

        {/* Filmography */}
        {nameData.castMovies && nameData.castMovies.length > 0 && (
          <section>
            <h2 className={`text-2xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Filmography
            </h2>
            <div className="space-y-4">
              {nameData.castMovies.slice(0, 20).map((movie, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {movie.title}
                      </h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {movie.role} • {movie.year}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {movie.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ActorDetailPage;