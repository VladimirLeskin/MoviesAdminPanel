import {EntityEditorModel} from '../../models/EntityEditorModel';
import RolesApi from '../../api/Roles';
import {IRole} from './types';
import {action, makeObservable, observable} from 'mobx';
import {PermissionListItem, RoleListItem} from '../../api/Api';
import {toast} from 'react-toastify';
import {getAxiosErrorText} from '../../api/stdAxiosErrorHandler';

export class RoleEditWidgetModel extends EntityEditorModel<IRole> {
  public permissionOptions: Array<{label: string; value: string}> = [];
  public childRoleOptions: Array<{label: string; value: string}> = [];

  constructor() {
    super();
    makeObservable(this, {
      ...RoleEditWidgetModel.getMobxBaseAnnotations(),
      permissionOptions: observable,
      childRoleOptions: observable,
      loadOptions: action.bound,
    });
  }

  public loadOptions(currentRoleName?: string) {
    return Promise.all([RolesApi.getPermissions(), RolesApi.getRoles()])
      .then(([permissionsResp, rolesResp]) => {
        this.permissionOptions = permissionsResp.data.items.map((permission: PermissionListItem) => ({
          value: permission.name,
          label: permission.description ? `${permission.name} — ${permission.description}` : permission.name,
        }));

        this.childRoleOptions = rolesResp.data.items
          .filter((role: RoleListItem) => role.name !== currentRoleName)
          .map((role: RoleListItem) => ({
            value: role.name,
            label: role.description ? `${role.name} — ${role.description}` : role.name,
          }));
      })
      .catch(e => toast.error(`Ошибка загрузки данных\n${getAxiosErrorText(e)}`));
  }

  protected getDataRequestPromise(id?: IRole['id']): Promise<IRole> {
    if (id === undefined) {
      return Promise.reject(new Error('Role name is required'));
    }

    return RolesApi.getRole(id).then(({data}) => ({
      id: data.name,
      name: data.name,
      description: data.description,
      permissions: data.permissions ?? [],
      childRoles: data.childRoles ?? [],
      effectivePermissions: data.effectivePermissions ?? [],
    }));
  }

  protected getDataSaveRequestPromise(data: IRole): Promise<IRole> {
    return RolesApi.updateRole(data.name, {
      permissions: data.permissions,
      childRoles: data.childRoles,
    }).then(({data: saved}) => ({
      id: saved.name,
      name: saved.name,
      description: saved.description,
      permissions: saved.permissions ?? [],
      childRoles: saved.childRoles ?? [],
      effectivePermissions: saved.effectivePermissions ?? [],
    }));
  }
}
