import {TypesafeBaseApi} from './TypesafeBaseApi';
import {ACCESS_TOKEN_STORAGE} from './oauth2/BaseOAuth2Client';
import {UpdateRoleRequest} from './Api';

export default class RolesApi extends TypesafeBaseApi {
  private static authHeaders() {
    return {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`};
  }

  public static getRoles() {
    return this.transport.get('/movies-api/v2/roles', {
      headers: this.authHeaders(),
    });
  }

  public static getRole(name: string) {
    return this.transport.get('/movies-api/v2/roles/{name}', {
      headers: this.authHeaders(),
      route: {name},
    });
  }

  public static getPermissions() {
    return this.transport.get('/movies-api/v2/permissions', {
      headers: this.authHeaders(),
    });
  }

  public static updateRole(name: string, request: UpdateRoleRequest) {
    return this.transport.put('/movies-api/v2/roles/{name}', {
      headers: this.authHeaders(),
      route: {name},
      data: request,
    });
  }
}
