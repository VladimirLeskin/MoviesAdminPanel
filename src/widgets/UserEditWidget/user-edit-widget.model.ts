import {EntityEditorModel} from '../../models/EntityEditorModel';
import UsersApi from '../../api/Users';
import {IUser} from './types';
import {makeObservable} from 'mobx';
import {EUserRoles} from '../../api/Auth';

export class UserEditWidgetModel extends EntityEditorModel<IUser> {
  constructor() {
    super();
    makeObservable(this, UserEditWidgetModel.getMobxBaseAnnotations());
  }

  protected getDataRequestPromise(id?: IUser['id']): Promise<IUser> {
    if (id === undefined) {
      return Promise.reject(new Error('User id is required'));
    }

    return UsersApi.getUser(Number(id)).then(({data}) => ({
      id: String(data.id),
      login: data.login,
      firstname: data.firstname,
      lastname: data.lastname,
      assignedRoles: data.assignedRoles.filter(UserEditWidgetModel.isUserRole),
    }));
  }

  protected getDataSaveRequestPromise(data: IUser): Promise<IUser> {
    return UsersApi.setUserRoles(Number(data.id), {roles: data.assignedRoles}).then(({data: saved}) => ({
      id: String(saved.id),
      login: saved.login,
      firstname: saved.firstname,
      lastname: saved.lastname,
      assignedRoles: saved.assignedRoles.filter(UserEditWidgetModel.isUserRole),
    }));
  }

  private static isUserRole(value: string): value is EUserRoles {
    return Object.values(EUserRoles).includes(value as EUserRoles);
  }
}
