import {EUserRoles} from '../../api/Auth';

export interface IUser {
  id: string;
  login?: string;
  firstname?: string;
  lastname?: string;
  assignedRoles: EUserRoles[];
}
