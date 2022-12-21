import Config from '../entries/Config';
import axios, {AxiosResponse} from 'axios';
import {IPagedResponse} from './types';
import {IMovieDto, IMovieGenre, IMovieInfoDto} from './dto/MovieDto';

interface IFindRequestParams {
  pageSize?: number;
  page?: number;
  search?: string;
}

export default class MoviesApi {
  private static get baseUrl(): string {
    return Config.apiUrl;
  }

  public static getMovieInfo(movieId: string): Promise<AxiosResponse<IMovieInfoDto>> {
    return axios.get(`${MoviesApi.baseUrl}/movies/view?id=${movieId}`);
  }

  public static getMovies(params: IFindRequestParams): Promise<AxiosResponse<IPagedResponse<IMovieDto>>> {
    const paramsParts = Object.entries(params)
      .filter(([, value]) => value != null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
    return axios.get(`${MoviesApi.baseUrl}/movies?${paramsParts.join('&')}`);
  }

  public static getGenresDescriptions(): Promise<AxiosResponse<IPagedResponse<IMovieGenre>>> {
    return axios.get(`${MoviesApi.baseUrl}/genres?`);
  }

  public static createMovieInfo(movieInfoDto: IMovieInfoDto): Promise<AxiosResponse<IMovieInfoDto>> {
    return axios.post(`${MoviesApi.baseUrl}/movies/create`, movieInfoDto);
  }
}
