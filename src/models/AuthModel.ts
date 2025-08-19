import {AuthApi, EUserRoles} from '../api/Auth';
import {makeAutoObservable} from 'mobx';
import {BaseOAuth2Client} from '../api/oauth2/BaseOAuth2Client';

export class AuthModel {
  public login?: string = undefined;
  public roles?: EUserRoles[];
  public isLoading = false;
  private oauth2Client = new BaseOAuth2Client(() => this.auth());

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public onLogin(login: string, password: string) {
    return this.oauth2Client.login(login, password).then(success => {
      if (success) {
        this.auth();
        return true;
      } else {
        alert('Не удалось авторизоваться');
      }
      return success;
    });
  }

  public auth() {
    this.isLoading = true;
    AuthApi.auth()
      .then(resp => {
        this.login = resp.data.login;
        this.roles = resp.data.roles.filter(AuthModel.isUserRole);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private static isUserRole(value: string): value is EUserRoles {
    return Object.values(EUserRoles).includes(value as EUserRoles);
  }
}
