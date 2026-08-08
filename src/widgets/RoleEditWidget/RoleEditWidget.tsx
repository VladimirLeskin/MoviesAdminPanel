import {observer} from 'mobx-react';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ItemEditor} from '../../components/ItemEditor/ItemEditor';
import {Fab, Stack, Typography} from '@mui/material';
import {Save} from '@mui/icons-material';
import {RoleEditWidgetModel} from './role-edit-widget.model';
import {EFieldInfoType, IEnumMultiFieldInfo} from '../../entries/FieldInfo';
import {MultiEnumField} from '../../components/itemEditorFields/EnumField/MultiEnumField';
import {StringField} from '../../components/itemEditorFields';
import {TItemSchema} from '../../entries/BaseEntity';
import {IRole} from './types';
import css from './RoleEditWidget.module.scss';

interface Props {
  roleName?: string;
  onSaved?: () => void;
}

export const RoleEditWidget = observer(({roleName, onSaved}: Props) => {
  const [model] = useState(() => new RoleEditWidgetModel());
  const {data, editData, save, revision, isLoading, load, permissionOptions, childRoleOptions} = model;

  useEffect(() => {
    if (roleName !== undefined) {
      model.loadOptions(roleName).then(() => load(roleName));
    }
  }, [roleName, load, model]);

  const schema = useMemo((): TItemSchema<IRole> => {
    const childRolesFieldInfo: IEnumMultiFieldInfo<string> = {
      type: EFieldInfoType.ENUM_MULTI,
      title: 'Вложенные роли',
      renderer: MultiEnumField,
      options: childRoleOptions,
    };

    const permissionsFieldInfo: IEnumMultiFieldInfo<string> = {
      type: EFieldInfoType.ENUM_MULTI,
      title: 'Собственные возможности',
      renderer: MultiEnumField,
      options: permissionOptions,
    };

    return {
      name: {title: 'Роль', renderer: StringField, disabled: true},
      description: {title: 'Описание', renderer: StringField, disabled: true},
      childRoles: childRolesFieldInfo,
      permissions: permissionsFieldInfo,
    };
  }, [permissionOptions, childRoleOptions]);

  const handleSave = useCallback(() => {
    save().then(() => onSaved?.());
  }, [onSaved, save]);

  if (roleName === undefined) {
    return null;
  }

  return (
    <div className={css.root} key={revision}>
      <ItemEditor fields={schema} defaultValue={data} onChange={editData} />
      {!!data?.effectivePermissions?.length && (
        <Typography variant="body2" color="text.secondary" className={css.effectivePermissions} sx={{mt: 2, mb: 1}}>
          Итоговые возможности (с учётом вложенных ролей): {data.effectivePermissions.join(', ')}
        </Typography>
      )}
      <Fab onClick={handleSave} variant="extended" color="primary" disabled={isLoading}>
        <Stack direction="row" display="inline-flex" gap={1}>
          <Save /> Сохранить
        </Stack>
      </Fab>
    </div>
  );
});
