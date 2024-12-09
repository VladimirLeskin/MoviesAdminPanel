export interface IMovieGenre {
  genre_id: number;
  name: string;
  lang: string;
}

export interface IMovieListItem {
  id: string;
  tvSeries: boolean;
  status: 'ACTIVE' | 'MODERATION';
  movie_id: string;
  original_title: string;
  title: string;
  genres: number[];
  countries: string[];
  date?: Date;
  images: Array<{id: string; path: string}>;
}
