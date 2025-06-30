// app/search/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Film, Tv, User, Search } from 'lucide-react';
import { useMovieStore } from '../../store/movieStore';
import { movieApi } from '../../lib/api';
import MovieGrid from '../../components/MovieGrid';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const {
    darkMode,
    searchResults,
    searchLoading,
    searchError,
    setSearchResults,
    setSearchLoading,
    setSearchError,
    setSearchQuery,
  } = useMovieStore();

  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'series' | 'people'>('all');
  const [filteredResults, setFilteredResults] = useState(searchResults?.results || []);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query, setSearchQuery]);

  useEffect(() => {
    filterResults();
  }, [searchResults, activeTab]);

  const performSearch = async (searchQuery: string) => {
    setSearchLoading(true);
    setSearchError(null);
    
    try {
      const results = await movieApi.searchAll(searchQuery);
      setSearchResults(results);
    } catch (error) {
      setSearchError('Failed to search. Please try again.');
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const filterResults = () => {
    if (!searchResults?.results) {
      setFilteredResults([]);
      return;
    }

    let filtered = searchResults.results;
    
    switch (activeTab) {
      case 'movies':
        filtered = searchResults.results.filter(item => 
          item.resultType === 'Movie' || item.resultType === 'Feature Film'
        );
        break;
      case 'series':
        filtered = searchResults.results.filter(item => 
          item.resultType === 'TV Series' || item.resultType === 'TV Mini Series'
        );
        break;
      case 'people':
        filtered = searchResults.results.filter(item => 
          item.resultType === 'Name'
        );
        break;
      default:
        filtered = searchResults.results;
    }
    
    setFilteredResults(filtered);
  };

  const tabs = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'series', label: 'TV Series', icon: Tv },
    { id: 'people', label: 'People', icon: User },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Search Results
          </h1>
          {query && (
            <p className={`text-lg ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Results for "{query}"
              {searchResults && (
                <span className="ml-2">
                  ({searchResults.results?.length || 0} found)
                </span>
              )}
            </p>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className={`border-b ${
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
                    {searchResults && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        isActive
                          ? 'bg-movie-gold text-black'
                          : darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.id === 'all' 
                          ? searchResults.results?.length || 0
                          : tab.id === 'movies'
                            ? searchResults.results?.filter(item => 
                                item.resultType === 'Movie' || item.resultType === 'Feature Film'
                              ).length || 0
                            : tab.id === 'series'
                              ? searchResults.results?.filter(item => 
                                  item.resultType === 'TV Series' || item.resultType === 'TV Mini Series'
                                ).length || 0
                              : searchResults.results?.filter(item => 
                                  item.resultType === 'Name'
                                ).length || 0
                        }
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Results Grid */}
        <MovieGrid
          items={filteredResults}
          type="search"
          loading={searchLoading}
          error={searchError}
        />

        {/* No Results Message */}
        {!searchLoading && !searchError && filteredResults.length === 0 && query && (
          <div className="text-center py-12">
            <Search className={`h-12 w-12 mx-auto mb-4 ${
              darkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-lg font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No results found
            </h3>
            <p className={`${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;