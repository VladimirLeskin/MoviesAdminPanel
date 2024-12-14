import {TypesafeBaseApi} from './TypesafeBaseApi';
import {ACCESS_TOKEN_STORAGE} from './oauth2/BaseOAuth2Client';

export class TypesafeLevelsApi extends TypesafeBaseApi {
  public static getLevels(filters: {page: number; pageSize: number}) {
    return this.transport.get('/movies-api/v2/levels', {
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
      query: filters,
    });
  }

  public static getLevelInfo(levelId: number) {
    return this.transport.get('/movies-api/v2/levels/{id}', {
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
      route: {id: levelId.toString()},
    });
  }
}
