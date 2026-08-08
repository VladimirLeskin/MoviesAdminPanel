import {makeAutoObservable, runInAction} from 'mobx';
import {toast} from 'react-toastify';
import {RoleListItem} from '../api/Api';
import RolesApi from '../api/Roles';
import {getAxiosErrorText} from '../api/stdAxiosErrorHandler';

class RolesModel {
  private _roles?: RoleListItem[] = undefined;
  private _isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public invalidate() {
    this.loadRoles();
  }

  public get roles() {
    if (!this._roles && !this._isLoading) {
      this.loadRoles();
      return {};
    } else {
      return (
        this._roles?.reduce<Record<string, RoleListItem>>((acc, cur) => {
          acc[cur.name] = cur;
          return acc;
        }, {}) ?? {}
      );
    }
  }

  private loadRoles() {
    this._isLoading = true;
    RolesApi.getRoles()
      .then(resp => {
        runInAction(() => {
          this._roles = resp.data.items;
        });
      })
      .catch(e => toast.error(`Ошибка загрузки ролей\n${getAxiosErrorText(e)}`))
      .finally(() => {
        runInAction(() => {
          this._isLoading = false;
        });
      });
  }
}

export const ROLES = new RolesModel();
