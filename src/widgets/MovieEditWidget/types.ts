export interface IEditedMovieInfo {
  id?: string;
  imdb_id: string;
  tmdb_id?: string;
  countries: string[];
  adult: boolean;
  genres: number[];
  original_title: string;
  release_date?: Date;
  images: Array<{id?: string; src?: string, content?: string}>;
  descriptions: Array<{
    lang: string;
    title?: string;
    description?: string;
    tagline?: string;
  }>;
}
