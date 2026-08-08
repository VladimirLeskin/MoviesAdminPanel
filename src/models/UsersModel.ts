import {makeAutoObservable, runInAction} from 'mobx';
import {toast} from 'react-toastify';
import {UserListItem} from '../api/Api';
import UsersApi from '../api/Users';
import {getAxiosErrorText} from '../api/stdAxiosErrorHandler';

class UsersModel {
  private _users?: UserListItem[] = undefined;
  private _isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public invalidate() {
    this.loadUsers();
  }

  public get users() {
    if (!this._users && !this._isLoading) {
      this.loadUsers();
      return {};
    } else {
      return (
        this._users?.reduce<Record<number, UserListItem>>((acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        }, {}) ?? {}
      );
    }
  }

  private loadUsers() {
    this._isLoading = true;
    UsersApi.getUsers()
      .then(resp => {
        runInAction(() => {
          this._users = resp.data.items;
        });
      })
      .catch(e => toast.error(`Ошибка загрузки пользователей\n${getAxiosErrorText(e)}`))
      .finally(() => {
        runInAction(() => {
          this._isLoading = false;
        });
      });
  }
}

export const USERS = new UsersModel();
