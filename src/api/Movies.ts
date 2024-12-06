import {AxiosResponse} from 'axios';
import {IPagedResponse} from './types';
import {IMovieGenre, IMovieInfoDto} from './dto/MovieDto';
import {BaseApi} from './BaseApi';

export default class MoviesApi extends BaseApi {
  public static getGenresDescriptions(): Promise<AxiosResponse<IPagedResponse<IMovieGenre>>> {
    return this.transport.get(this.url('/genres'));
  }

  public static createMovieInfo(movieInfoDto: IMovieInfoDto): Promise<AxiosResponse<IMovieInfoDto>> {
    return this.transport.post(this.url('/movies/create'), movieInfoDto);
  }
}
