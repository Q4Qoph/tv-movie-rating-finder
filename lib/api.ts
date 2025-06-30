// lib/api.ts
import axios from 'axios';
import { SearchData, TitleData, PopularData, ReviewData, FAQData } from '../types';

const API_KEY = process.env.NEXT_PUBLIC_TV_API_KEY;
const BASE_URL = 'https://tv-api.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const movieApi = {
  // Search endpoints
  searchAll: async (query: string): Promise<SearchData> => {
    const response = await api.get(`/API/SearchAll/${API_KEY}/${encodeURIComponent(query)}`);
    return response.data;
  },
  
  searchMovies: async (query: string): Promise<SearchData> => {
    const response = await api.get(`/API/SearchMovie/${API_KEY}/${encodeURIComponent(query)}`);
    return response.data;
  },
  
  searchSeries: async (query: string): Promise<SearchData> => {
    const response = await api.get(`/API/SearchSeries/${API_KEY}/${encodeURIComponent(query)}`);
    return response.data;
  },
  
  searchNames: async (query: string): Promise<SearchData> => {
    const response = await api.get(`/API/SearchName/${API_KEY}/${encodeURIComponent(query)}`);
    return response.data;
  },
  
  // Title details
  getTitle: async (id: string): Promise<TitleData> => {
    const response = await api.get(`/en/API/Title/${API_KEY}/${id}`);
    return response.data;
  },
  
  getRatings: async (id: string) => {
    const response = await api.get(`/API/Ratings/${API_KEY}/${id}`);
    return response.data;
  },
  
  getTrailer: async (id: string) => {
    const response = await api.get(`/API/Trailer/${API_KEY}/${id}`);
    return response.data;
  },
  
  getImages: async (id: string) => {
    const response = await api.get(`/API/Images/${API_KEY}/${id}`);
    return response.data;
  },
  
  getPosters: async (id: string) => {
    const response = await api.get(`/API/Posters/${API_KEY}/${id}`);
    return response.data;
  },
  
  getFullCast: async (id: string) => {
    const response = await api.get(`/API/FullCast/${API_KEY}/${id}`);
    return response.data;
  },
  
  getReviews: async (id: string): Promise<ReviewData> => {
    const response = await api.get(`/API/Reviews/${API_KEY}/${id}`);
    return response.data;
  },
  
  getFAQ: async (id: string): Promise<FAQData> => {
    const response = await api.get(`/API/FAQ/${API_KEY}/${id}`);
    return response.data;
  },
  
  getAwards: async (id: string) => {
    const response = await api.get(`/API/Awards/${API_KEY}/${id}`);
    return response.data;
  },
  
  // Charts and lists
  getTop250Movies: async (): Promise<PopularData> => {
    const response = await api.get(`/API/Top250Movies/${API_KEY}`);
    return response.data;
  },
  
  getTop250TVs: async (): Promise<PopularData> => {
    const response = await api.get(`/API/Top250TVs/${API_KEY}`);
    return response.data;
  },
  
  getMostPopularMovies: async (): Promise<PopularData> => {
    const response = await api.get(`/API/MostPopularMovies/${API_KEY}`);
    return response.data;
  },
  
  getMostPopularTVs: async (): Promise<PopularData> => {
    const response = await api.get(`/API/MostPopularTVs/${API_KEY}`);
    return response.data;
  },
  
  getInTheaters: async (): Promise<PopularData> => {
    const response = await api.get(`/API/InTheaters/${API_KEY}`);
    return response.data;
  },
  
  getComingSoon: async (): Promise<PopularData> => {
    const response = await api.get(`/API/ComingSoon/${API_KEY}`);
    return response.data;
  },
  
  getBoxOffice: async () => {
    const response = await api.get(`/API/BoxOffice/${API_KEY}`);
    return response.data;
  },
};