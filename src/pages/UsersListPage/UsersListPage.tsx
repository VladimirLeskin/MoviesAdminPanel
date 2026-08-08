import React, {useCallback, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {ColDef} from 'ag-grid-community';
import {Drawer, Stack} from '@mui/material';

import {AgGrid} from '../../components/AgGrid/AgGrid';
import {USERS} from '../../models/UsersModel';
import {UserListItem} from '../../api/Api';
import {useBooleanState} from '../../hooks/useBooleanState';
import {UserEditWidget} from '../../widgets/UserEditWidget/UserEditWidget';
import {useTitleUpdate} from '../../hooks/useTitleUpdate';

const columns: ColDef<UserListItem>[] = [
  {colId: 'id', field: 'id', headerName: 'ID', width: 80},
  {colId: 'login', field: 'login', headerName: 'Логин'},
  {colId: 'firstname', field: 'firstname', headerName: 'Имя'},
  {colId: 'lastname', field: 'lastname', headerName: 'Фамилия'},
  {
    colId: 'assignedRoles',
    field: 'assignedRoles',
    headerName: 'Роли',
    valueFormatter: params => params.value?.join(', ') ?? '',
  },
];

export const UsersListPage = observer(() => {
  useTitleUpdate('Пользователи');
  const {users, invalidate} = USERS;
  const {state: drawerVisible, toggleState: toggleDrawer, setState: setDrawerState} = useBooleanState();
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const rows = useMemo(() => Object.values(users), [users]);

  const handleUserSelect = useCallback(
    (id: string) => {
      setSelectedId(Number(id));
      setDrawerState(true);
    },
    [setDrawerState]
  );

  return (
    <Stack height="100%" direction="column">
      <AgGrid rowData={rows} columnDefs={columns} onShowDetails={handleUserSelect} />
      <Drawer open={drawerVisible} anchor="right" variant="temporary" onClose={toggleDrawer}>
        <UserEditWidget userId={selectedId} onSaved={invalidate} />
      </Drawer>
    </Stack>
  );
});
