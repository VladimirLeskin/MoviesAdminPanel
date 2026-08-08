import {TypesafeBaseApi} from './TypesafeBaseApi';
import {ACCESS_TOKEN_STORAGE} from './oauth2/BaseOAuth2Client';
import {AssignRoleRequest, SetUserRolesRequest} from './Api';

export default class UsersApi extends TypesafeBaseApi {
  private static authHeaders() {
    return {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`};
  }

  public static getUsers() {
    return this.transport.get('/movies-api/v2/users', {
      headers: this.authHeaders(),
    });
  }

  public static getUser(id: number) {
    return this.transport.get('/movies-api/v2/users/{id}', {
      headers: this.authHeaders(),
      route: {id: String(id)},
    });
  }

  public static setUserRoles(id: number, request: SetUserRolesRequest) {
    return this.transport.put('/movies-api/v2/users/{id}/roles', {
      headers: this.authHeaders(),
      route: {id: String(id)},
      data: request,
    });
  }

  public static assignRole(id: number, request: AssignRoleRequest) {
    return this.transport.post('/movies-api/v2/users/{id}/roles', {
      headers: this.authHeaders(),
      route: {id: String(id)},
      data: request,
    });
  }

  public static revokeRole(id: number, roleName: string) {
    return this.transport.delete('/movies-api/v2/users/{id}/roles/{roleName}', {
      headers: this.authHeaders(),
      route: {id: String(id), roleName},
    });
  }
}
