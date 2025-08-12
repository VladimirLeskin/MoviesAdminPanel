export interface IMovieGenre {
  id: number;
  name: string;
}

export interface IMovieListItem {
  id: number;
  tvSeries: boolean;
  status: 'ACTIVE' | 'MODERATION';
  movie_id: number;
  original_title: string;
  title: string;
  genres: number[];
  countries: string[];
  date?: Date;
  images: Array<{id: number; path: string}>;
}
