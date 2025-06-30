// types/index.ts
export interface SearchResult {
  id: string;
  resultType: string;
  image: string;
  title: string;
  description: string;
}

export interface SearchData {
  searchType: string;
  expression: string;
  results: SearchResult[];
  errorMessage?: string;
}

export interface TitleData {
  id: string;
  title: string;
  originalTitle: string;
  fullTitle: string;
  type: string;
  year: string;
  image: string;
  releaseDate: string;
  runtimeMins: string;
  runtimeStr: string;
  plot: string;
  plotLocal: string;
  awards: string;
  directors: string;
  directorList: Array<{ id: string; name: string }>;
  writers: string;
  writerList: Array<{ id: string; name: string }>;
  stars: string;
  starList: Array<{ id: string; name: string }>;
  actorList: Array<{
    id: string;
    image: string;
    name: string;
    asCharacter: string;
  }>;
  genres: string;
  genreList: Array<{ key: string; value: string }>;
  countries: string;
  countryList: Array<{ key: string; value: string }>;
  languages: string;
  languageList: Array<{ key: string; value: string }>;
  contentRating: string;
  imDbRating: string;
  imDbRatingVotes: string;
  metacriticRating: string;
  ratings?: {
    imDb: string;
    metacritic: string;
    theMovieDb: string;
    rottenTomatoes: string;
    filmAffinity: string;
  };
  trailer?: {
    videoId: string;
    videoTitle: string;
    videoDescription: string;
    thumbnailUrl: string;
    link: string;
    linkEmbed: string;
  };
  images?: {
    items: Array<{ title: string; image: string }>;
  };
  posters?: {
    posters: Array<{ link: string; aspectRatio: number }>;
    backdrops: Array<{ link: string; aspectRatio: number }>;
  };
  similars?: Array<{
    id: string;
    title: string;
    image: string;
    imDbRating: string;
  }>;
  errorMessage?: string;
}

export interface PopularItem {
  id: string;
  rank: string;
  rankUpDown?: string;
  title: string;
  fullTitle: string;
  year: string;
  image: string;
  crew: string;
  imDbRating: string;
  imDbRatingCount: string;
}

export interface PopularData {
  items: PopularItem[];
  errorMessage?: string;
}

export interface ReviewData {
  items: Array<{
    username: string;
    userUrl: string;
    reviewLink: string;
    warningSpoilers: boolean;
    date: string;
    rate: string;
    helpful: string;
    title: string;
    content: string;
  }>;
  errorMessage?: string;
}

export interface FAQData {
  items: Array<{
    question: string;
    answer: string;
  }>;
  spoilerItems: Array<{
    question: string;
    answer: string;
  }>;
  errorMessage?: string;
}