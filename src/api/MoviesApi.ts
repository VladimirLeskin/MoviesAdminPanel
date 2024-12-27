import {TypesafeBaseApi} from './TypesafeBaseApi';
import {ACCESS_TOKEN_STORAGE} from './oauth2/BaseOAuth2Client';
import {MovieSaveInfo} from './Api';

interface IFindRequestParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: Array<{field: string; order: 'asc' | 'desc'}>;
}

export class MoviesApi extends TypesafeBaseApi {
  public static getMovies(params: IFindRequestParams) {
    return this.transport.get('/movies-api/v2/movies', {
      query: {
        ...params,
        sort: params.sort?.map(({field, order}) => `${order === 'desc' ? '-' : ''}${field}`),
        sortLang: 'ru',
      },
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
    });
  }

  public static createFromFile(file: File) {
    return this.transport.post('/movies-api/v2/movies/upload', {
      data: {file},
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`,
      },
    });
  }

  public static generateMoviesImages(moviesIds: number[]) {
    return this.transport.post('/movies-api/v2/movies/load-images', {
      data: {moviesIds, minImageWidth: 500},
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`,
      },
    });
  }

  public static getMovieInfo(movieId: number) {
    return this.transport.get('/movies-api/v2/movies/{id}', {
      route: {id: movieId.toString()},
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`,
      },
    });
  }

  public static updateMovieInfo(id: number, movieInfoDto: MovieSaveInfo) {
    return this.transport.put('/movies-api/v2/movies/{id}', {
      route: {id: id.toString()},
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`,
      },
      data: movieInfoDto,
    });
  }

  public static createMovieInfo(movieInfoDto: MovieSaveInfo) {
    return this.transport.post('/movies-api/v2/movies', {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`,
      },
      data: movieInfoDto,
    });
  }
}
