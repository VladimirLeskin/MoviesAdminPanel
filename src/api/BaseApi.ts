import Config from '../entries/Config';

export class BaseApi {
  protected static url(path: string) {
    return Config.apiUrl + path;
  }
}
