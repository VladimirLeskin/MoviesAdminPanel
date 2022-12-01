import axios, {AxiosResponse} from 'axios';
import Config from '../entries/Config';

export interface IUserDto {
  login?: string;
}

export class AuthApi {
  public static login(data: {login: string; password: string}): Promise<AxiosResponse<unknown>> {
    return axios.post(Config.apiUrl + '/auth/login', data);
  }

  public static auth() {
    return axios.get<IUserDto>(Config.apiUrl + '/auth/view');
  }
}
