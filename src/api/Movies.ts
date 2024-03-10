import axios, {AxiosResponse} from 'axios';
import {IPagedResponse} from './types';
import {IMovieDto, IMovieGenre, IMovieInfoDto} from './dto/MovieDto';
import {BaseApi} from './BaseApi';

interface IFindRequestParams {
  pageSize?: number;
  page?: number;
  search?: string;
}

export default class MoviesApi extends BaseApi {
  public static getMovieInfo(movieId: string): Promise<AxiosResponse<IMovieInfoDto>> {
    return axios.get(this.url(`/movies/view?id=${movieId}`));
  }

  public static getMovies(params: IFindRequestParams): Promise<AxiosResponse<IPagedResponse<IMovieDto>>> {
    const paramsParts = Object.entries(params)
      .filter(([, value]) => value != null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
    return axios.get(this.url(`/movies?${paramsParts.join('&')}`));
  }

  public static getGenresDescriptions(): Promise<AxiosResponse<IPagedResponse<IMovieGenre>>> {
    return axios.get(this.url('/genres'));
  }

  public static createMovieInfo(movieInfoDto: IMovieInfoDto): Promise<AxiosResponse<IMovieInfoDto>> {
    return axios.post(this.url('/movies/create'), movieInfoDto);
  }
}
