import {EFieldInfoType, IEnumMultiFieldInfo} from '../../entries/FieldInfo';
import {StringField} from '../../components/itemEditorFields';
import {TItemSchema} from '../../entries/BaseEntity';
import {IUser} from './types';
import {MultiEnumField} from '../../components/itemEditorFields/EnumField/MultiEnumField';
import {EUserRoles} from '../../api/Auth';

const roleOptions = Object.values(EUserRoles).map(role => ({
  label: role,
  value: role,
}));

const rolesFieldInfo: IEnumMultiFieldInfo<EUserRoles> = {
  type: EFieldInfoType.ENUM_MULTI,
  title: 'Роли',
  renderer: MultiEnumField,
  options: roleOptions,
};

export const schema: TItemSchema<IUser> = {
  id: {title: 'ID', renderer: StringField, disabled: true},
  login: {title: 'Логин', renderer: StringField, disabled: true},
  firstname: {title: 'Имя', renderer: StringField, disabled: true},
  lastname: {title: 'Фамилия', renderer: StringField, disabled: true},
  assignedRoles: rolesFieldInfo,
};
