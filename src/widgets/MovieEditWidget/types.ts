export interface IEditedMovieInfo {
  id?: number;
  status: 'ACTIVE' | 'MODERATION';
  tv_series: boolean;
  imdb_id: string;
  tmdb_id?: string;
  countries: string[];
  genres: number[];
  original_title: string;
  release_date?: Date;
  end_date?: Date;
  images: Array<{id?: number; src?: string; content?: string}>;
  descriptions: Array<{
    lang: string;
    title?: string;
    description?: string;
    tagline?: string;
  }>;
}
