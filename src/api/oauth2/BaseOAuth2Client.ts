import axios from 'axios';
import {AuthApi, IToken, ITokens} from '../Auth';
import {TokenStorage} from './TokenStorage';

const ACCESS_TOKEN_STORAGE = new TokenStorage('MOVIES_ACCESS_TOKENS');
const REFRESH_TOKEN_STORAGE = new TokenStorage('MOVIES_REFRESH_TOKENS');

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
    this.writeTokenToLocalStorage(REFRESH_TOKEN_STORAGE, value);
    this._refreshToken = value;
  }

  public set accessToken(value: IToken | undefined) {
    this.writeTokenToLocalStorage(ACCESS_TOKEN_STORAGE, value);
    this._accessToken = value;

    // TODO перенести в подходящее место
    axios.defaults.headers.common['Authorization'] = `Bearer ${value?.token ?? ''}`;
    this.onTokensChanged();
  }

  private writeTokenToLocalStorage(storage: TokenStorage, token: IToken | undefined) {
    if (token) {
      storage.setData(token);
    } else {
      storage.delete();
    }
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

  private intervalId?: number;

  private keepAccessTokenUpToDate() {
    window.removeEventListener('storage', this.onStorageChanged);
    window.addEventListener('storage', this.onStorageChanged);

    const refreshIfNeeded = () => {
      // Проверяем каждые 2 минуты, и если до конца жизни токена осталось меньше 5 минут, то обновляем его
      const timeEpsilon = 1000 * 60 * 5; // 5 минут

      if (
        this._refreshToken &&
        (!this._accessToken || this._accessToken.expires.getTime() - Date.now() < timeEpsilon)
      ) {
        this.getAccessTokenByRefresh();
      }
    };

    clearInterval(this.intervalId);
    refreshIfNeeded();
    this.intervalId = window.setInterval(refreshIfNeeded, 120_000);
  }

  private onStorageChanged = (event: StorageEvent) => {
    if (event.key === ACCESS_TOKEN_STORAGE.key) {
      this.accessToken = ACCESS_TOKEN_STORAGE.getData() ?? undefined;
    } else if (event.key === REFRESH_TOKEN_STORAGE.key) {
      this.refreshToken = REFRESH_TOKEN_STORAGE.getData() ?? undefined;
    }
  };

  private dropTokens() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }

  private updateTokensFromLocalStorage() {
    this.accessToken = ACCESS_TOKEN_STORAGE.getData() ?? undefined;
    this.refreshToken = REFRESH_TOKEN_STORAGE.getData() ?? undefined;
  }
}
