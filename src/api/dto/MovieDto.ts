export interface IMovieDto {
  movie_id: string;
  original_title: string;
  title: string;
  date: string; // 2014-05-15
  images: Array<{id: string; path: string}>;
}

export interface IMovieInfoDto {
  id?: string;
  imdb_id: string;
  tmdb_id?: string;
  country: string;
  adult: boolean;
  original_title: string;
  release_date_ts?: number;
  images: Array<{id?: string; name?: string, content?: string}>;
  descriptions: Record<
    string,
    {
      title: string;
      description: string;
      tagline: string;
    }
  >;
}
