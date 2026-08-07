import {ApiControllers, TmdbImportRequest} from './Api';
import {TypesafeBaseApi} from './TypesafeBaseApi';
import {ACCESS_TOKEN_STORAGE} from './oauth2/BaseOAuth2Client';

export type TmdbDiscoverFilter = ApiControllers['/movies-api/v2/tmdb/discover']['get'][0]['query'];

export class TmdbApi extends TypesafeBaseApi {
  public static discover(filter: TmdbDiscoverFilter) {
    return this.transport.get('/movies-api/v2/tmdb/discover', {
      query: filter,
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
    });
  }

  public static importItems(request: TmdbImportRequest) {
    return this.transport.post('/movies-api/v2/tmdb/import', {
      data: request,
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
    });
  }
}
