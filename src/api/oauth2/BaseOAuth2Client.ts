import axios from 'axios';
import {AuthApi, IOauthTokensDto} from '../Auth';

interface IToken {
  token: string;
  expires: Date;
}

export interface ITokensResponse {
  accessToken: IToken;
  refreshToken: IToken;
}

const ACCESS_TOKEN_STORAGE_KEY = 'MOVIES_ACCESS_TOKENS';
const REFRESH_TOKEN_STORAGE_KEY = 'MOVIES_REFRESH_TOKENS';

export class BaseOAuth2Client {
  private _accessToken?: IToken;
  private _refreshToken?: IToken;
  private refreshingAccessTokenTimer?: number;

  constructor(private onTokensChanged: () => void) {
    try {
      this.accessToken = this.readTokenFromLocalStorage(ACCESS_TOKEN_STORAGE_KEY);
      this.refreshToken = this.readTokenFromLocalStorage(REFRESH_TOKEN_STORAGE_KEY);
    } catch (e) {
      this.accessToken = undefined;
      this.refreshToken = undefined;
      console.error(e);
    }
  }

  private refreshAccessToken(): Promise<ITokensResponse> {
    return AuthApi.refreshToken({refresh_token: this._refreshToken?.token ?? ''}).then(({data: r}) => ({
      accessToken: {token: r.access_token, expires: new Date(r.access_token_expiration_ts * 1000)},
      refreshToken: {token: r.refresh_token, expires: new Date(r.refresh_token_expiration_ts * 1000)},
    }));
  }

  public updateTokens(tokens: {access: IToken; refresh: IToken}) {
    this.accessToken = tokens.access;
    this.refreshToken = tokens.refresh;
  }

  public async getAccessTokenByRefresh() {
    try {
      const response = await this.refreshAccessToken();
      this.refreshToken = response.refreshToken;
      this.accessToken = response.accessToken;
    } catch (e) {
      this.refreshToken = undefined;
      this.accessToken = undefined;
    }
  }

  public set refreshToken(value: IToken | undefined) {
    this.writeTokenToLocalStorage(REFRESH_TOKEN_STORAGE_KEY, value);
    this._refreshToken = value;
  }

  public get accessToken(): IToken | undefined {
    return this._accessToken;
  }

  public set accessToken(value: IToken | undefined) {
    this.writeTokenToLocalStorage(ACCESS_TOKEN_STORAGE_KEY, value);
    this._accessToken = value;

    // TODO перенести в подходящее место
    axios.defaults.headers.common['Authorization'] = `Bearer ${value?.token ?? ''}`;

    if (this._accessToken) {
      const timeEpsilon = 1000 * 60 * 5; // 5 минут
      // Запрашиваем новый токен за 5 минут до окончания действия текущего
      const timeToUpdateToken = Math.max(0, this._accessToken.expires.getTime() - new Date().getTime() - timeEpsilon);

      clearTimeout(this.refreshingAccessTokenTimer);
      this.refreshingAccessTokenTimer = window.setTimeout(() => this.getAccessTokenByRefresh(), timeToUpdateToken);
    }
    this.onTokensChanged();
  }

  private writeTokenToLocalStorage(key: string, token: IToken | undefined) {
    if (token) {
      localStorage.setItem(key, JSON.stringify(token));
    } else {
      localStorage.removeItem(key);
    }
  }

  private readTokenFromLocalStorage(key: string): IToken | undefined {
    const savedValue = JSON.parse(localStorage.getItem(key) || `""`) || undefined;
    if (savedValue) {
      return {
        token: savedValue.token,
        expires: new Date(savedValue.expires),
      };
    }
    return undefined;
  }

  public login = async (login: string, password: string) => {
    try {
      const response = await AuthApi.login({login, password});
      this.processTokens(response.data.tokens);
      return true;
    } catch {
      return false;
    }
  };

  private processTokens(tokens: IOauthTokensDto) {
    this.updateTokens({
      access: {
        token: tokens.access_token,
        expires: new Date(tokens.access_token_expiration_ts * 1000),
      },
      refresh: {
        token: tokens.refresh_token,
        expires: new Date(tokens.refresh_token_expiration_ts * 1000),
      },
    });
  }
}
