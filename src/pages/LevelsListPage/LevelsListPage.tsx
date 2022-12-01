import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {ColDef} from 'ag-grid-community';

import {LevelsListModel} from './levels-list.model';
import {IdCellRenderer} from './cellRenderers/IdCellRenderer';
import {AgGrid} from '../../components/AgGrid/AgGrid';

import css from './LevelsListPage.module.scss';

const colDefs: ColDef[] = [
  {colId: 'id', field: 'id', headerName: 'id', cellRenderer: IdCellRenderer, sortable: true, resizable: true},
  {colId: 'title', headerName: 'Название', field: 'title', sortable: true, resizable: true},
  {
    colId: 'description',
    headerName: 'Описание',
    field: 'description',
    sortable: true,
    resizable: true,
    tooltipField: 'description',
  },
  {
    colId: 'questions',
    headerName: 'Кол-во вопросов',
    field: 'questions',
    valueFormatter: data => String(data.value?.length ?? 0),
    sortable: true,
    resizable: true,
  },
  {colId: 'type', headerName: 'Тип', field: 'type', sortable: true, resizable: true},
  {colId: 'timeForEach', headerName: 'Время на вопрос', field: 'timeForEach', sortable: true, resizable: true},
  {colId: 'totalTime', headerName: 'Общее время', field: 'totalTime', sortable: true, resizable: true},
  {colId: 'previewImageName', headerName: 'Обложка', field: 'previewImageName', sortable: true, resizable: true},
];

export const LevelsListPage: FC = observer(() => {
  const [model] = useState(() => new LevelsListModel());

  const {loadItems, items} = model;

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div>
      <AgGrid rowData={items} columnDefs={colDefs} wrapperClassName={css.LevelsList} />
    </div>
  );
});
