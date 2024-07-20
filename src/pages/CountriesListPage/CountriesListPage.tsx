import React, {useCallback, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {ColDef} from 'ag-grid-community';
import {Button, Drawer, Stack} from '@mui/material';

import {AgGrid} from '../../components/AgGrid/AgGrid';
import {COUNTRIES} from '../../models/CountriesModel';
import {ICountryListItemDto} from '../../api/dto/ICountryDto';
import {useBooleanState} from '../../hooks/useBooleanState';
import {CountryEditWidget} from '../../widgets/CountryEditWidget/CountryEditWidget';
import {useTitleUpdate} from '../../hooks/useTitleUpdate';

const columns: ColDef<ICountryListItemDto & {id: string}>[] = [
  {colId: 'id', field: 'id', headerName: 'Код'},
  {colId: 'name', field: 'name', headerName: 'Название'},
];

export const CountriesListPage = observer(() => {
  useTitleUpdate('Список стран');
  const {countries, invalidate} = COUNTRIES;
  const {state: drawerVisible, toggleState: toggleDrawer, setState: setDrawerState} = useBooleanState();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const rows = useMemo(() => Object.values(countries).map(r => ({...r, id: r.country_code})), [countries]);

  const handleAdd = useCallback(() => {
    setSelectedId(undefined);
    setDrawerState(true);
  }, [setDrawerState]);

  const handleCountrySelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      setDrawerState(true);
    },
    [setDrawerState]
  );
  return (
    <Stack height="100%" direction="column">
      <Button onClick={handleAdd} variant="contained" fullWidth>
        Добавить
      </Button>
      <AgGrid rowData={rows} columnDefs={columns} onShowDetails={handleCountrySelect} />
      <Drawer open={drawerVisible} anchor="right" variant="temporary" onClose={toggleDrawer}>
        <CountryEditWidget code={selectedId} onSaved={invalidate} />
      </Drawer>
    </Stack>
  );
});
