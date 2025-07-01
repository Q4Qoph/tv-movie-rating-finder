// Step 3: Updated lib/api.ts
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    api_key: API_KEY,
  },
});

// Helper function to safely get year from date
const getYearFromDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).getFullYear().toString();
  } catch {
    return '';
  }
};

// Helper function to format runtime
const formatRuntime = (minutes: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const movieApi = {
  // Search endpoints
  searchAll: async (query: string) => {
    const response = await api.get(`/search/multi`, {
      params: { query: encodeURIComponent(query) }
    });
    
    return {
      searchType: 'All',
      expression: query,
      results: response.data.results.map((item: any) => ({
        id: item.id.toString(),
        resultType: item.media_type === 'movie' ? 'Movie' : 
                   item.media_type === 'tv' ? 'TV Series' : 'Person',
        image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 
               item.profile_path ? `${IMAGE_BASE_URL}${item.profile_path}` : '',
        title: item.title || item.name,
        description: item.overview || item.known_for_department || 
                    (item.release_date ? `Released: ${getYearFromDate(item.release_date)}` : 
                     item.first_air_date ? `First aired: ${getYearFromDate(item.first_air_date)}` : ''),
      })),
      errorMessage: response.data.results.length === 0 ? 'No results found' : null,
    };
  },

  searchMovies: async (query: string) => {
    const response = await api.get(`/search/movie`, {
      params: { query: encodeURIComponent(query) }
    });
    
    return {
      searchType: 'Movie',
      expression: query,
      results: response.data.results.map((item: any) => ({
        id: item.id.toString(),
        resultType: 'Movie',
        image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
        title: item.title,
        description: item.overview || `Released: ${getYearFromDate(item.release_date)}`,
      })),
      errorMessage: response.data.results.length === 0 ? 'No movies found' : null,
    };
  },

  searchSeries: async (query: string) => {
    const response = await api.get(`/search/tv`, {
      params: { query: encodeURIComponent(query) }
    });
    
    return {
      searchType: 'TV Series',
      expression: query,
      results: response.data.results.map((item: any) => ({
        id: item.id.toString(),
        resultType: 'TV Series',
        image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
        title: item.name,
        description: item.overview || `First aired: ${getYearFromDate(item.first_air_date)}`,
      })),
      errorMessage: response.data.results.length === 0 ? 'No TV series found' : null,
    };
  },

  searchNames: async (query: string) => {
    const response = await api.get(`/search/person`, {
      params: { query: encodeURIComponent(query) }
    });
    
    return {
      searchType: 'Person',
      expression: query,
      results: response.data.results.map((item: any) => ({
        id: item.id.toString(),
        resultType: 'Person',
        image: item.profile_path ? `${IMAGE_BASE_URL}${item.profile_path}` : '',
        title: item.name,
        description: item.known_for_department || 
                    item.known_for?.map((work: any) => work.title || work.name).join(', ') || '',
      })),
      errorMessage: response.data.results.length === 0 ? 'No people found' : null,
    };
  },

  // Title details for movies
  getTitle: async (id: string) => {
    try {
      // First try as movie
      const response = await api.get(`/movie/${id}`, {
        params: {
          append_to_response: 'credits,videos,images,reviews,similar,releases'
        }
      });
      
      const data = response.data;
      const trailer = data.videos?.results?.find((v: any) => 
        v.type === 'Trailer' && v.site === 'YouTube'
      );
      
      return {
        id: data.id.toString(),
        title: data.title,
        originalTitle: data.original_title,
        fullTitle: `${data.title} (${getYearFromDate(data.release_date)})`,
        type: 'Movie',
        year: getYearFromDate(data.release_date),
        image: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : '',
        releaseDate: data.release_date || '',
        runtimeMins: data.runtime?.toString() || '',
        runtimeStr: formatRuntime(data.runtime),
        plot: data.overview || '',
        plotLocal: data.overview || '',
        awards: '', // TMDb doesn't have detailed awards data
        directors: data.credits?.crew
          ?.filter((person: any) => person.job === 'Director')
          .map((d: any) => d.name).join(', ') || '',
        directorList: data.credits?.crew
          ?.filter((person: any) => person.job === 'Director')
          .map((d: any) => ({
            id: d.id.toString(),
            name: d.name,
          })) || [],
        writers: data.credits?.crew
          ?.filter((person: any) => ['Writer', 'Screenplay', 'Story'].includes(person.job))
          .map((w: any) => w.name).join(', ') || '',
        writerList: data.credits?.crew
          ?.filter((person: any) => ['Writer', 'Screenplay', 'Story'].includes(person.job))
          .map((w: any) => ({
            id: w.id.toString(),
            name: w.name,
          })) || [],
        stars: data.credits?.cast?.slice(0, 3).map((actor: any) => actor.name).join(', ') || '',
        starList: data.credits?.cast?.slice(0, 3).map((actor: any) => ({
          id: actor.id.toString(),
          name: actor.name,
        })) || [],
        actorList: data.credits?.cast?.slice(0, 20).map((actor: any) => ({
          id: actor.id.toString(),
          image: actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : '',
          name: actor.name,
          asCharacter: actor.character || '',
        })) || [],
        genres: data.genres?.map((g: any) => g.name).join(', ') || '',
        genreList: data.genres?.map((g: any) => ({
          key: g.id.toString(),
          value: g.name,
        })) || [],
        countries: data.production_countries?.map((c: any) => c.name).join(', ') || '',
        countryList: data.production_countries?.map((c: any) => ({
          key: c.iso_3166_1,
          value: c.name,
        })) || [],
        languages: data.spoken_languages?.map((l: any) => l.english_name).join(', ') || '',
        languageList: data.spoken_languages?.map((l: any) => ({
          key: l.iso_639_1,
          value: l.english_name,
        })) || [],
        contentRating: data.releases?.countries?.find((c: any) => c.iso_3166_1 === 'US')
          ?.release_dates?.[0]?.certification || '',
        imDbRating: data.vote_average ? (data.vote_average).toFixed(1) : '',
        imDbRatingVotes: data.vote_count?.toLocaleString() || '',
        metacriticRating: '', // TMDb doesn't have Metacritic scores
        ratings: {
          imDb: data.vote_average ? (data.vote_average).toFixed(1) : '',
          metacritic: '',
          theMovieDb: data.vote_average ? (data.vote_average).toFixed(1) : '',
          rottenTomatoes: '',
          filmAffinity: '',
        },
        trailer: trailer ? {
          videoId: trailer.key,
          videoTitle: trailer.name,
          videoDescription: trailer.overview || '',
          thumbnailUrl: `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`,
          link: `https://www.youtube.com/watch?v=${trailer.key}`,
          linkEmbed: `https://www.youtube.com/embed/${trailer.key}`,
        } : null,
        images: {
          items: data.images?.backdrops?.slice(0, 20).map((img: any) => ({
            title: data.title,
            image: `${BACKDROP_BASE_URL}${img.file_path}`,
          })) || [],
        },
        posters: {
          posters: data.images?.posters?.slice(0, 10).map((img: any) => ({
            link: `${IMAGE_BASE_URL}${img.file_path}`,
            aspectRatio: img.aspect_ratio,
          })) || [],
          backdrops: data.images?.backdrops?.slice(0, 10).map((img: any) => ({
            link: `${BACKDROP_BASE_URL}${img.file_path}`,
            aspectRatio: img.aspect_ratio,
          })) || [],
        },
        similars: data.similar?.results?.slice(0, 10).map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
          imDbRating: item.vote_average ? item.vote_average.toFixed(1) : '',
        })) || [],
        boxOffice: {
          budget: data.budget ? `$${data.budget.toLocaleString()}` : '',
          openingWeekendUSA: '', // TMDb doesn't have this data
          grossUSA: '', // TMDb doesn't have this data
          cumulativeWorldwideGross: data.revenue ? `$${data.revenue.toLocaleString()}` : '',
        },
        errorMessage: null,
      };
    } catch (movieError) {
      // If movie fails, try as TV series
      try {
        const response = await api.get(`/tv/${id}`, {
          params: {
            append_to_response: 'credits,videos,images,reviews,similar,content_ratings'
          }
        });
        
        const data = response.data;
        const trailer = data.videos?.results?.find((v: any) => 
          v.type === 'Trailer' && v.site === 'YouTube'
        );
        
        return {
          id: data.id.toString(),
          title: data.name,
          originalTitle: data.original_name,
          fullTitle: `${data.name} (${getYearFromDate(data.first_air_date)})`,
          type: 'TV Series',
          year: getYearFromDate(data.first_air_date),
          image: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : '',
          releaseDate: data.first_air_date || '',
          runtimeMins: data.episode_run_time?.[0]?.toString() || '',
          runtimeStr: data.episode_run_time?.[0] ? `${data.episode_run_time[0]} min/episode` : '',
          plot: data.overview || '',
          plotLocal: data.overview || '',
          awards: '',
          directors: data.created_by?.map((creator: any) => creator.name).join(', ') || '',
          directorList: data.created_by?.map((creator: any) => ({
            id: creator.id.toString(),
            name: creator.name,
          })) || [],
          writers: data.created_by?.map((creator: any) => creator.name).join(', ') || '',
          writerList: data.created_by?.map((creator: any) => ({
            id: creator.id.toString(),
            name: creator.name,
          })) || [],
          stars: data.credits?.cast?.slice(0, 3).map((actor: any) => actor.name).join(', ') || '',
          starList: data.credits?.cast?.slice(0, 3).map((actor: any) => ({
            id: actor.id.toString(),
            name: actor.name,
          })) || [],
          actorList: data.credits?.cast?.slice(0, 20).map((actor: any) => ({
            id: actor.id.toString(),
            image: actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : '',
            name: actor.name,
            asCharacter: actor.character || '',
          })) || [],
          genres: data.genres?.map((g: any) => g.name).join(', ') || '',
          genreList: data.genres?.map((g: any) => ({
            key: g.id.toString(),
            value: g.name,
          })) || [],
          countries: data.production_countries?.map((c: any) => c.name).join(', ') || '',
          countryList: data.production_countries?.map((c: any) => ({
            key: c.iso_3166_1,
            value: c.name,
          })) || [],
          languages: data.spoken_languages?.map((l: any) => l.english_name).join(', ') || '',
          languageList: data.spoken_languages?.map((l: any) => ({
            key: l.iso_639_1,
            value: l.english_name,
          })) || [],
          contentRating: data.content_ratings?.results?.find((c: any) => c.iso_3166_1 === 'US')?.rating || '',
          imDbRating: data.vote_average ? data.vote_average.toFixed(1) : '',
          imDbRatingVotes: data.vote_count?.toLocaleString() || '',
          metacriticRating: '',
          ratings: {
            imDb: data.vote_average ? data.vote_average.toFixed(1) : '',
            metacritic: '',
            theMovieDb: data.vote_average ? data.vote_average.toFixed(1) : '',
            rottenTomatoes: '',
            filmAffinity: '',
          },
          trailer: trailer ? {
            videoId: trailer.key,
            videoTitle: trailer.name,
            videoDescription: trailer.overview || '',
            thumbnailUrl: `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`,
            link: `https://www.youtube.com/watch?v=${trailer.key}`,
            linkEmbed: `https://www.youtube.com/embed/${trailer.key}`,
          } : null,
          images: {
            items: data.images?.backdrops?.slice(0, 20).map((img: any) => ({
              title: data.name,
              image: `${BACKDROP_BASE_URL}${img.file_path}`,
            })) || [],
          },
          posters: {
            posters: data.images?.posters?.slice(0, 10).map((img: any) => ({
              link: `${IMAGE_BASE_URL}${img.file_path}`,
              aspectRatio: img.aspect_ratio,
            })) || [],
            backdrops: data.images?.backdrops?.slice(0, 10).map((img: any) => ({
              link: `${BACKDROP_BASE_URL}${img.file_path}`,
              aspectRatio: img.aspect_ratio,
            })) || [],
          },
          similars: data.similar?.results?.slice(0, 10).map((item: any) => ({
            id: item.id.toString(),
            title: item.name,
            image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
            imDbRating: item.vote_average ? item.vote_average.toFixed(1) : '',
          })) || [],
          tvSeriesInfo: {
            yearEnd: data.last_air_date ? getYearFromDate(data.last_air_date) : '',
            creators: data.created_by?.map((creator: any) => creator.name).join(', ') || '',
            creatorList: data.created_by?.map((creator: any) => ({
              id: creator.id.toString(),
              name: creator.name,
            })) || [],
            seasons: data.seasons?.map((season: any) => season.season_number.toString()) || [],
          },
          errorMessage: null,
        };
      } catch (tvError) {
        console.error('Error fetching title details:', tvError);
        return {
          errorMessage: 'Title not found or error fetching details',
        };
      }
    }
  },

  // Get ratings (TMDb only has its own ratings)
  getRatings: async (id: string) => {
    try {
      const response = await api.get(`/movie/${id}`);
      const data = response.data;
      
      return {
        imDbId: id,
        title: data.title,
        fullTitle: `${data.title} (${getYearFromDate(data.release_date)})`,
        type: 'Movie',
        year: getYearFromDate(data.release_date),
        imDb: data.vote_average ? data.vote_average.toFixed(1) : '',
        metacritic: '',
        theMovieDb: data.vote_average ? data.vote_average.toFixed(1) : '',
        rottenTomatoes: '',
        filmAffinity: '',
        errorMessage: null,
      };
    } catch (error) {
      return {
        errorMessage: 'Ratings not found',
      };
    }
  },

  // Get reviews
  getReviews: async (id: string) => {
    try {
      const response = await api.get(`/movie/${id}/reviews`);
      const data = response.data;
      
      return {
        imDbId: id,
        title: '',
        fullTitle: '',
        type: 'Movie',
        year: '',
        items: data.results?.map((review: any) => ({
          username: review.author,
          userUrl: review.url || '',
          reviewLink: review.url || '',
          warningSpoilers: false, // TMDb doesn't mark spoilers
          date: review.created_at ? new Date(review.created_at).toLocaleDateString() : '',
          rate: review.author_details?.rating ? review.author_details.rating.toString() : '',
          helpful: '', // TMDb doesn't have helpful votes
          title: 'Review',
          content: review.content || '',
        })) || [],
        errorMessage: data.results?.length === 0 ? 'No reviews found' : null,
      };
    } catch (error) {
      return {
        items: [],
        errorMessage: 'Reviews not found',
      };
    }
  },

  // Get FAQ (TMDb doesn't have FAQ data, return empty)
  getFAQ: async (id: string) => {
    return {
      imDbId: id,
      title: '',
      fullTitle: '',
      type: 'Movie',
      year: '',
      items: [],
      spoilerItems: [],
      errorMessage: 'FAQ data not available',
    };
  },

  // Charts and lists
  getTop250Movies: async () => {
    const response = await api.get('/movie/top_rated', {
      params: { page: 1 }
    });
    
    return {
      items: response.data.results.slice(0, 250).map((item: any, index: number) => ({
        id: item.id.toString(),
        rank: (index + 1).toString(),
        title: item.title,
        fullTitle: `${item.title} (${getYearFromDate(item.release_date)})`,
        year: getYearFromDate(item.release_date),
        image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
        crew: '', // Would need additional API calls for director info
        imDbRating: item.vote_average ? item.vote_average.toFixed(1) : '',
        imDbRatingCount: item.vote_count?.toLocaleString() || '',
      })),
      errorMessage: null,
    };
  },

  getTop250TVs: async () => {
    const response = await api.get('/tv/top_rated', {
      params: { page: 1 }
    });
    
    return {
      items: response.data.results.slice(0, 250).map((item: any, index: number) => ({
        id: item.id.toString(),
        rank: (index + 1).toString(),
        title: item.name,
        fullTitle: `${item.name} (${getYearFromDate(item.first_air_date)})`,
        year: getYearFromDate(item.first_air_date),
        image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
        crew: '',
        imDbRating: item.vote_average ? item.vote_average.toFixed(1) : '',
        imDbRatingCount: item.vote_count?.toLocaleString() || '',
      })),
      errorMessage: null,
    };
  },

  getMostPopularMovies: async () => {
    const response = await api.get('/movie/popular', {
      params: { page: 1 }
    });
    
    return {
      items: response.data.results.map((item: any, index: number) => ({
        id: item.id.toString(),
        rank: (index + 1).toString(),
        rankUpDown: '', // TMDb doesn't provide rank change data
        title: item.title,
        fullTitle: `${item.title} (${getYearFromDate(item.release_date)})`,
        year: getYearFromDate(item.release_date),
        image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
        crew: '',
        imDbRating: item.vote_average ? item.vote_average.toFixed(1) : '',
        imDbRatingCount: item.vote_count?.toLocaleString() || '',
      })),
      errorMessage: null,
    };
  },

  getMostPopularTVs: async () => {
    const response = await api.get('/tv/popular', {
      params: { page: 1 }
    });
    
    return {
      items: response.data.results.map((item: any, index: number) => ({
        id: item.id.toString(),
        rank: (index + 1).toString(),
        rankUpDown: '',
        title: item.name,
        fullTitle: `${item.name} (${getYearFromDate(item.first_air_date)})`,
        year: getYearFromDate(item.first_air_date),
        image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
        crew: '',
        imDbRating: item.vote_average ? item.vote_average.toFixed(1) : '',
        imDbRatingCount: item.vote_count?.toLocaleString() || '',
      })),
      errorMessage: null,
    };
  },

  getInTheaters: async () => {
    const response = await api.get('/movie/now_playing', {
      params: { page: 1 }
    });
    
    return {
      items: response.data.results.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        fullTitle: `${item.title} (${getYearFromDate(item.release_date)})`,
        year: getYearFromDate(item.release_date),
        releaseState: 'In Theaters',
        image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
        runtimeMins: '',
        runtimeStr: '',
        plot: item.overview || '',
        contentRating: '',
        imDbRating: item.vote_average ? item.vote_average.toFixed(1) : '',
        imDbRatingCount: item.vote_count?.toLocaleString() || '',
        metacriticRating: '',
        genres: '',
        genreList: [],
        directors: '',
        directorList: [],
        stars: '',
        starList: [],
      })),
      errorMessage: null,
    };
  },

  getComingSoon: async () => {
    const response = await api.get('/movie/upcoming', {
      params: { page: 1 }
    });
    
    return {
      items: response.data.results.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        fullTitle: `${item.title} (${getYearFromDate(item.release_date)})`,
        year: getYearFromDate(item.release_date),
        releaseState: 'Coming Soon',
        image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
        runtimeMins: '',
        runtimeStr: '',
        plot: item.overview || '',
        contentRating: '',
        imDbRating: item.vote_average ? item.vote_average.toFixed(1) : '',
        imDbRatingCount: item.vote_count?.toLocaleString() || '',
        metacriticRating: '',
        genres: '',
        genreList: [],
        directors: '',
        directorList: [],
        stars: '',
        starList: [],
      })),
      errorMessage: null,
    };
  },

  // Get person details
  getName: async (id: string) => {
    try {
      const response = await api.get(`/person/${id}`, {
        params: {
          append_to_response: 'movie_credits,tv_credits,combined_credits'
        }
      });
      
      const data = response.data;
      
      return {
        id: data.id.toString(),
        name: data.name,
        role: data.known_for_department || '',
        image: data.profile_path ? `${IMAGE_BASE_URL}${data.profile_path}` : '',
        summary: data.biography || '',
        birthDate: data.birthday || '',
        deathDate: data.deathday || '',
        awards: '', // TMDb doesn't have awards data
        height: '', // TMDb doesn't have height data
        knownFor: data.combined_credits?.cast?.slice(0, 10).map((item: any) => ({
          id: item.id.toString(),
          title: item.title || item.name,
          fullTitle: `${item.title || item.name} (${getYearFromDate(item.release_date || item.first_air_date)})`,
          year: getYearFromDate(item.release_date || item.first_air_date),
          role: item.character || item.job || '',
          image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : '',
        })) || [],
        castMovies: data.combined_credits?.cast?.map((item: any) => ({
          id: item.id.toString(),
          role: item.character || '',
          title: item.title || item.name,
          year: getYearFromDate(item.release_date || item.first_air_date),
          description: item.overview || '',
        })) || [],
        errorMessage: null,
      };
    } catch (error) {
      return {
        errorMessage: 'Person not found',
      };
    }
  },
};
