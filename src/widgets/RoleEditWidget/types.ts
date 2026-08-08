export interface IRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  childRoles: string[];
  effectivePermissions: string[];
}
