import {TypesafeBaseApi} from './TypesafeBaseApi';
import {ACCESS_TOKEN_STORAGE} from './oauth2/BaseOAuth2Client';
import {UserTokens} from './Api';

export enum EUserRoles {
  admin = 'admin',
  operator = 'operator',
}

export enum EUserPermissions {
  editRoles = 'editRoles',
}

export interface ITokens {
  access: IToken;
  refresh: IToken;
}

export interface IToken {
  token: string;
  expires: Date;
}

export class AuthApi extends TypesafeBaseApi {
  public static login(data: {login: string; password: string}) {
    return this.transport
      .post('/movies-api/v2/auth/login', {
        data,
        headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
      })
      .then(resp => this.oauthTokensDtoToToken(resp.data.tokens));
  }

  public static auth() {
    return this.transport.get('/movies-api/v2/auth', {
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
    });
  }

  public static refreshToken(data: {refreshToken: string}) {
    return this.transport
      .post('/movies-api/v2/auth/refresh_token', {data})
      .then(resp => this.oauthTokensDtoToToken(resp.data));
  }

  public static oauthTokensDtoToToken(dto: UserTokens): ITokens {
    return {
      access: {
        token: dto.accessToken,
        expires: new Date(dto.accessTokenExpirationTs * 1000),
      },
      refresh: {
        token: dto.refreshToken,
        expires: new Date(dto.refreshTokenExpirationTs * 1000),
      },
    };
  }
}
