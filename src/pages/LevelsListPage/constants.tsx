import React from 'react';
import {ColDef} from 'ag-grid-community';
import {CustomCellRendererProps} from 'ag-grid-react';

import {ILevelListItemDto} from './types';
import {IdCellRenderer} from './cellRenderers/IdCellRenderer';
import {Image} from 'src/components/Image/Image';

export const LEVELS_LIST_COLUMNS: ColDef<ILevelListItemDto>[] = [
  {
    colId: 'id',
    width: 75,
    field: 'id',
    headerName: 'id',
    cellRenderer: IdCellRenderer,
    sortable: true,
    resizable: true,
  },
  {colId: 'title', headerName: 'Название', field: 'title', flex: 1, minWidth: 100, sortable: true, resizable: true},
  {
    colId: 'description',
    headerName: 'Описание',
    field: 'description',
    sortable: true,
    resizable: true,
    tooltipField: 'description',
    flex: 1,
    minWidth: 100,
  },
  {colId: 'questions', headerName: 'Кол-во вопросов', field: 'questions_count', sortable: true, resizable: true},
  {colId: 'type', headerName: 'Тип', field: 'type', sortable: true, resizable: true},
  {colId: 'timeForEach', headerName: 'Время на вопрос', field: 'timeForEach', sortable: true, resizable: true},
  {colId: 'totalTime', headerName: 'Общее время', field: 'totalTime', sortable: true, resizable: true},
  {
    colId: 'previewImageName',
    headerName: 'Обложка',
    field: 'previewImageName',
    sortable: true,
    resizable: true,
    cellRenderer: ({data}: CustomCellRendererProps<ILevelListItemDto>) => (
      <Image src={data?.previewImageName} style={{maxHeight: 40}} />
    ),
  },
];
