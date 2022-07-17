import Config from '../entries/Config';
import axios, {AxiosResponse} from 'axios';
import {IPagedResponse} from './types';
import {IMovieDto} from './dto/MovieDto';

interface IFindRequestParams {
  pageSize?: number;
  offset?: number;
  search?: string;
}

export default class MoviesApi {
  private static get baseUrl(): string {
    return Config.apiUrl;
  }

  public static getMovies(params: IFindRequestParams): Promise<AxiosResponse<IPagedResponse<IMovieDto>>> {
    const paramsParts = Object.entries(params)
      .filter(([, value]) => value != null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
    return axios.get(`${MoviesApi.baseUrl}/movies?${paramsParts.join('&')}`);
  }
}
