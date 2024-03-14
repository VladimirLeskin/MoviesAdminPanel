import axios from 'axios';
import {AuthApi, IToken, ITokens} from '../Auth';

const ACCESS_TOKEN_STORAGE_KEY = 'MOVIES_ACCESS_TOKENS';
const REFRESH_TOKEN_STORAGE_KEY = 'MOVIES_REFRESH_TOKENS';

export class BaseOAuth2Client {
  private _accessToken?: IToken;
  private _refreshToken?: IToken;

  constructor(private onTokensChanged: () => void) {
    try {
      this.updateTokensFromLocalStorage();
      this.keepAccessTokenUpToDate();
    } catch (e) {
      this.dropTokens();
      console.error(e);
    }
  }

  private refreshAccessToken(): Promise<ITokens> {
    return AuthApi.refreshToken({refresh_token: this._refreshToken?.token ?? ''});
  }

  private updateTokens(tokens: ITokens) {
    this.accessToken = tokens.access;
    this.refreshToken = tokens.refresh;
  }

  public async getAccessTokenByRefresh() {
    try {
      const tokens = await this.refreshAccessToken();
      this.updateTokens(tokens);
    } catch (e) {
      // TODO понять, что делать в этом случае
    }
  }

  public set refreshToken(value: IToken | undefined) {
    this.writeTokenToLocalStorage(REFRESH_TOKEN_STORAGE_KEY, value);
    this._refreshToken = value;
  }

  public set accessToken(value: IToken | undefined) {
    this.writeTokenToLocalStorage(ACCESS_TOKEN_STORAGE_KEY, value);
    this._accessToken = value;

    // TODO перенести в подходящее место
    axios.defaults.headers.common['Authorization'] = `Bearer ${value?.token ?? ''}`;
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
      const tokens = await AuthApi.login({login, password});
      this.updateTokens(tokens);
      return true;
    } catch {
      return false;
    }
  };

  private keepAccessTokenUpToDate() {
    window.removeEventListener('storage', this.onStorageChanged);
    window.addEventListener('storage', this.onStorageChanged);

    setInterval(() => {
      // Проверяем каждые 2 минуты, и если до конца жизни токена осталось меньше 5 минут, то обновляем его
      const timeEpsilon = 1000 * 60 * 5; // 5 минут

      if (
        this._refreshToken &&
        (!this._accessToken || this._accessToken.expires.getTime() - Date.now() < timeEpsilon)
      ) {
        this.getAccessTokenByRefresh();
      }
    }, 120_000);
  }

  private onStorageChanged = (event: StorageEvent) => {
    if (event.key === ACCESS_TOKEN_STORAGE_KEY) {
      this.accessToken = this.readTokenFromLocalStorage(ACCESS_TOKEN_STORAGE_KEY);
    } else if (event.key === REFRESH_TOKEN_STORAGE_KEY) {
      this.refreshToken = this.readTokenFromLocalStorage(REFRESH_TOKEN_STORAGE_KEY);
    }
  };

  private dropTokens() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }

  private updateTokensFromLocalStorage() {
    this.accessToken = this.readTokenFromLocalStorage(ACCESS_TOKEN_STORAGE_KEY);
    this.refreshToken = this.readTokenFromLocalStorage(REFRESH_TOKEN_STORAGE_KEY);
  }
}
