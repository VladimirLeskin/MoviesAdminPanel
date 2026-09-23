import React, {useCallback, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {ColDef} from 'ag-grid-community';
import {Drawer, Stack} from '@mui/material';

import {drawerPaperWidth} from '../../styles/drawer';

import {AgGrid} from '../../components/AgGrid/AgGrid';
import {ROLES} from '../../models/RolesModel';
import {RoleListItem} from '../../api/Api';
import {useBooleanState} from '../../hooks/useBooleanState';
import {RoleEditWidget} from '../../widgets/RoleEditWidget/RoleEditWidget';
import {useTitleUpdate} from '../../hooks/useTitleUpdate';

type RoleRow = RoleListItem & {id: string};

const columns: ColDef<RoleRow>[] = [
  {colId: 'name', field: 'name', headerName: 'Роль'},
  {colId: 'description', field: 'description', headerName: 'Описание'},
  {
    colId: 'childRoles',
    field: 'childRoles',
    headerName: 'Вложенные роли',
    valueFormatter: params => params.value?.join(', ') ?? '',
  },
  {
    colId: 'permissions',
    field: 'permissions',
    headerName: 'Собственные возможности',
    valueFormatter: params => params.value?.join(', ') ?? '',
  },
  {
    colId: 'effectivePermissions',
    field: 'effectivePermissions',
    headerName: 'Итоговые возможности',
    valueFormatter: params => params.value?.join(', ') ?? '',
  },
];

export const RolesListPage = observer(() => {
  useTitleUpdate('Роли');
  const {roles, invalidate} = ROLES;
  const {state: drawerVisible, toggleState: toggleDrawer, setState: setDrawerState} = useBooleanState();
  const [selectedName, setSelectedName] = useState<string | undefined>();
  const rows = useMemo(() => Object.values(roles).map(role => ({...role, id: role.name})), [roles]);

  const handleRoleSelect = useCallback(
    (id: unknown) => {
      setSelectedName(String(id));
      setDrawerState(true);
    },
    [setDrawerState]
  );

  return (
    <Stack height="100%" direction="column" sx={{minWidth: 0, maxWidth: '100%'}}>
      <AgGrid rowData={rows} columnDefs={columns} onShowDetails={handleRoleSelect} />
      <Drawer
        open={drawerVisible}
        anchor="right"
        variant="temporary"
        onClose={toggleDrawer}
        PaperProps={{sx: drawerPaperWidth(420)}}
      >
        <RoleEditWidget roleName={selectedName} onSaved={invalidate} />
      </Drawer>
    </Stack>
  );
});
