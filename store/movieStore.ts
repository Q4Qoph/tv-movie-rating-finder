// store/movieStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchData, TitleData, PopularData } from '../types';

interface MovieStore {
  // Search state
  searchQuery: string;
  searchResults: SearchData | null;
  searchLoading: boolean;
  searchError: string | null;
  
  // Selected title details
  selectedTitle: TitleData | null;
  titleLoading: boolean;
  titleError: string | null;
  
  // Popular/Top charts
  topMovies: PopularData | null;
  topTVs: PopularData | null;
  popularMovies: PopularData | null;
  popularTVs: PopularData | null;
  inTheaters: PopularData | null;
  comingSoon: PopularData | null;
  
  // Favorites (persisted)
  favorites: string[];
  
  // Modal states
  trailerModalOpen: boolean;
  imageGalleryOpen: boolean;
  selectedImageIndex: number;
  
  // Theme
  darkMode: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchData | null) => void;
  setSearchLoading: (loading: boolean) => void;
  setSearchError: (error: string | null) => void;
  
  setSelectedTitle: (title: TitleData | null) => void;
  setTitleLoading: (loading: boolean) => void;
  setTitleError: (error: string | null) => void;
  
  setTopMovies: (movies: PopularData | null) => void;
  setTopTVs: (tvs: PopularData | null) => void;
  setPopularMovies: (movies: PopularData | null) => void;
  setPopularTVs: (tvs: PopularData | null) => void;
  setInTheaters: (movies: PopularData | null) => void;
  setComingSoon: (movies: PopularData | null) => void;
  
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  setTrailerModalOpen: (open: boolean) => void;
  setImageGalleryOpen: (open: boolean) => void;
  setSelectedImageIndex: (index: number) => void;
  
  toggleDarkMode: () => void;
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      // Initial state
      searchQuery: '',
      searchResults: null,
      searchLoading: false,
      searchError: null,
      
      selectedTitle: null,
      titleLoading: false,
      titleError: null,
      
      topMovies: null,
      topTVs: null,
      popularMovies: null,
      popularTVs: null,
      inTheaters: null,
      comingSoon: null,
      
      favorites: [],
      
      trailerModalOpen: false,
      imageGalleryOpen: false,
      selectedImageIndex: 0,
      
      darkMode: false,
      
      // Actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchResults: (results) => set({ searchResults: results }),
      setSearchLoading: (loading) => set({ searchLoading: loading }),
      setSearchError: (error) => set({ searchError: error }),
      
      setSelectedTitle: (title) => set({ selectedTitle: title }),
      setTitleLoading: (loading) => set({ titleLoading: loading }),
      setTitleError: (error) => set({ titleError: error }),
      
      setTopMovies: (movies) => set({ topMovies: movies }),
      setTopTVs: (tvs) => set({ topTVs: tvs }),
      setPopularMovies: (movies) => set({ popularMovies: movies }),
      setPopularTVs: (tvs) => set({ popularTVs: tvs }),
      setInTheaters: (movies) => set({ inTheaters: movies }),
      setComingSoon: (movies) => set({ comingSoon: movies }),
      
      addToFavorites: (id) => {
        const favorites = get().favorites;
        if (!favorites.includes(id)) {
          set({ favorites: [...favorites, id] });
        }
      },
      removeFromFavorites: (id) => {
        const favorites = get().favorites;
        set({ favorites: favorites.filter(fav => fav !== id) });
      },
      isFavorite: (id) => get().favorites.includes(id),
      
      setTrailerModalOpen: (open) => set({ trailerModalOpen: open }),
      setImageGalleryOpen: (open) => set({ imageGalleryOpen: open }),
      setSelectedImageIndex: (index) => set({ selectedImageIndex: index }),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'movie-store',
      partialize: (state) => ({ 
        favorites: state.favorites, 
        darkMode: state.darkMode 
      }),
    }
  )
);
