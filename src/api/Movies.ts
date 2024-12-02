import {AxiosResponse} from 'axios';
import {IPagedResponse} from './types';
import {IMovieDto, IMovieGenre, IMovieInfoDto} from './dto/MovieDto';
import {BaseApi} from './BaseApi';

interface IFindRequestParams {
  pageSize?: number;
  page?: number;
  search?: string;
  sort?: Array<{field: string; order: 'asc' | 'desc'}>;
}

export default class MoviesApi extends BaseApi {
  public static getMovieInfo(movieId: string): Promise<AxiosResponse<IMovieInfoDto>> {
    return this.transport.get(this.url(`/movies/view?id=${movieId}`));
  }

  public static getMovies({sort, ...params}: IFindRequestParams): Promise<AxiosResponse<IPagedResponse<IMovieDto>>> {
    const paramsParts = Object.entries(params)
      .filter(([, value]) => value != null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);

    if (sort?.length) {
      paramsParts.push('sort=' + [sort?.map(({field, order}) => `${order === 'desc' ? '-' : ''}${field}`).join(',')]);
    }

    return this.transport.get(this.url(`/movies?${paramsParts.join('&')}`));
  }

  public static getGenresDescriptions(): Promise<AxiosResponse<IPagedResponse<IMovieGenre>>> {
    return this.transport.get(this.url('/genres'));
  }

  public static createMovieInfo(movieInfoDto: IMovieInfoDto): Promise<AxiosResponse<IMovieInfoDto>> {
    return this.transport.post(this.url('/movies/create'), movieInfoDto);
  }

  public static createMoviesFromFile(file: File): Promise<AxiosResponse<number>> {
    return this.transport.post(
      this.url('/v2/movies/upload'),
      {file},
      {headers: {'Content-Type': 'multipart/form-data'}}
    );
  }
}
