import axios from 'axios';
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

interface IUserDto {
  login?: string;
  roles?: Partial<Record<EUserRoles, IUserRole>>;
}

interface ILoginResponse {
  user: IUserDto;
  tokens: IOauthTokensDto;
}

interface IOauthTokensDto {
  access_token: string;
  access_token_expiration_ts: number;
  refresh_token: string;
  refresh_token_expiration_ts: number;
}

export interface ITokens {
  access: IToken;
  refresh: IToken;
}

export interface IToken {
  token: string;
  expires: Date;
}

export class AuthApi extends BaseApi {
  public static login(data: {login: string; password: string}) {
    return axios
      .post<ILoginResponse>(this.url('/auth/login'), data)
      .then(resp => this.oauthTokensDtoToToken(resp.data.tokens));
  }

  public static auth() {
    return axios.get<IUserDto>(this.url('/auth/view'));
  }

  public static refreshToken(data: {refresh_token: string}) {
    return axios
      .post<IOauthTokensDto>(this.url('/auth/refresh_token'), data)
      .then(resp => this.oauthTokensDtoToToken(resp.data));
  }

  public static oauthTokensDtoToToken(dto: IOauthTokensDto): ITokens {
    return {
      access: {
        token: dto.access_token,
        expires: new Date(dto.access_token_expiration_ts * 1000),
      },
      refresh: {
        token: dto.refresh_token,
        expires: new Date(dto.refresh_token_expiration_ts * 1000),
      },
    };
  }
}
