import {AuthApi} from '../api/Auth';
import {makeAutoObservable} from 'mobx';

export class AuthModel {
  public login?: string = undefined;
  public isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
    this.auth();
  }

  public onLogin(login: string, password: string) {
    return AuthApi.login({login, password})
      .then(() => {
        this.auth();
        return true;
      })
      .catch(() => {
        alert('Не удалось авторизоваться');
        return false;
      });
  }

  public auth() {
    this.isLoading = true;
    AuthApi.auth().then(resp => {
      this.login = resp.data.login;
    }).finally(() => {
      this.isLoading = false;
    });
  }
}
