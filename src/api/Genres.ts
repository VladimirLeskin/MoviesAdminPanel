import {TypesafeBaseApi} from './TypesafeBaseApi';

export class GenresApi extends TypesafeBaseApi {
  public static getGenresDescriptions() {
    return this.transport.get('/movies-api/v2/genres', {});
  }
}
