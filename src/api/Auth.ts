import axios, {AxiosResponse} from 'axios';
import Config from '../entries/Config';

export enum EUserRoles {
  // eslint-disable-next-line no-unused-vars
  admin = 'admin',
  // eslint-disable-next-line no-unused-vars
  operator = 'operator',
}

export interface IUserRole {
  type: number;
  name: EUserRoles;
  description: string | null;
  ruleName: string | null;
  data: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface IUserDto {
  login?: string;
  roles?: Partial<Record<EUserRoles, IUserRole>>;
}

export class AuthApi {
  public static login(data: {login: string; password: string}): Promise<AxiosResponse<unknown>> {
    return axios.post(Config.apiUrl + '/auth/login', data);
  }

  public static auth() {
    return axios.get<IUserDto>(Config.apiUrl + '/auth/view');
  }
}
