export interface IMovieGenre {
  genre_id: number;
  name: string;
  lang: string;
}

export interface IMovieDto {
  movie_id: string;
  original_title: string;
  title: string;
  genres: number[];
  countries: string[];
  date: string; // 2014-05-15
  images: Array<{id: string; path: string}>;
}

export interface IMovieInfoDto {
  id?: string;
  tv_series: boolean;
  imdb_id: string;
  tmdb_id?: number;
  countries: string[];
  genres: IMovieGenre['genre_id'][];
  original_title: string;
  release_date_ts?: number; // seconds, not milliseconds
  end_date_ts?: number; // seconds, not milliseconds
  images: Array<{id?: string; name?: string; content?: string}>;
  descriptions: Record<
    string,
    {
      title: string;
      description?: string;
      tagline?: string;
    }
  >;
}

export interface IMovieListItem {
  id: string;
  movie_id: string;
  original_title: string;
  title: string;
  genres: number[];
  countries: string[];
  date?: Date;
  images: Array<{id: string; path: string}>;
}
