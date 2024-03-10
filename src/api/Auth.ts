import axios, {AxiosResponse} from 'axios';
import {BaseApi} from './BaseApi';

export enum EUserRoles {
  admin = 'admin',
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

export interface ILoginResponse {
  user: IUserDto;
  tokens: IOauthTokensDto;
}

export interface IOauthTokensDto {
  access_token: string;
  access_token_expiration_ts: number;
  refresh_token: string;
  refresh_token_expiration_ts: number;
}

export class AuthApi extends BaseApi {
  public static login(data: {login: string; password: string}): Promise<AxiosResponse<ILoginResponse>> {
    return axios.post(this.url('/auth/login'), data);
  }

  public static auth() {
    return axios.get<IUserDto>(this.url('/auth/view'));
  }

  public static refreshToken(data: {refresh_token: string}) {
    return axios.post<IOauthTokensDto>(this.url('/auth/refresh_token'), data);
  }
}
