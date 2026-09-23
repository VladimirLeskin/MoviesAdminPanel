import {TypesafeBaseApi} from './TypesafeBaseApi';
import {ACCESS_TOKEN_STORAGE} from './oauth2/BaseOAuth2Client';
import {LevelInfoSaveRequest} from './Api';

export class LevelsApi extends TypesafeBaseApi {
  public static createLevelInfo(levelInfo: LevelInfoSaveRequest) {
    return this.transport.post('/movies-api/v2/levels', {
      data: levelInfo,
    });
  }

  public static editLevelInfo(id: number, levelInfo: LevelInfoSaveRequest) {
    return this.transport.put('/movies-api/v2/levels/{id}', {
      data: levelInfo,
      route: {id: id.toString()},
    });
  }

  public static getLevels(filters: {page: number; pageSize: number}) {
    return this.transport.get('/movies-api/v2/levels', {
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
      query: filters,
    });
  }

  public static getLevelInfo(levelId: number) {
    return this.transport.get('/movies-api/v2/levels/{id}', {
      route: {id: levelId.toString()},
    });
  }

  public static publishLevel(levelId: number, active: boolean) {
    return this.transport.post('/movies-api/v2/levels/{id}/publish', {
      route: {id: levelId.toString()},
      query: {active},
    });
  }

  public static deleteLevel(levelId: number) {
    return this.transport.delete('/movies-api/v2/levels/{id}', {
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
      route: {id: levelId.toString()},
    });
  }
}
