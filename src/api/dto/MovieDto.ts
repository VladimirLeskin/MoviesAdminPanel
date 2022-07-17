export interface IMovieDto {
  movie_id: string;
  original_title: string;
  title: string;
  date: string; // 2014-05-15
  images: Array<{id: string; path: string}>;
}
