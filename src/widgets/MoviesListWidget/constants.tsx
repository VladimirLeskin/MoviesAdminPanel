import React from 'react';
import {ColDef, ICellRendererParams} from 'ag-grid-community';
import {Link} from 'react-router-dom';

import {IMovieListItem} from 'src/api/dto/MovieDto';
import {ROUTES} from 'src/constants';
import {DateUtils} from '../../utils/DateUtils';
import {Badge, Stack} from '@mui/material';

export const MOVIES_LIST_COLUMNS: ColDef<IMovieListItem & {id: string}>[] = [
  {
    colId: 'movie_id',
    width: 100,
    minWidth: 50,
    flex: 0,
    field: 'movie_id',
    headerName: 'id',
    sortable: true,
    cellRenderer: (params: ICellRendererParams<IMovieListItem>) => {
      if (!params.data?.movie_id) {
        return null;
      }

      return (
        <Stack flexDirection="row" gap={2} alignItems="center">
          <Badge color={params.data.status === 'ACTIVE' ? 'success' : 'warning'} badgeContent="1" variant="dot">
            {null}
          </Badge>
          <Link to={ROUTES.MOVIES.DETAILS.replace(':movieId', params.data.movie_id.toString())} target="_blank">
            {params.data.movie_id}
          </Link>
        </Stack>
      );
    },
  },
  {
    colId: 'type',
    headerName: 'Тип',
    field: 'tvSeries',
    resizable: true,
    initialWidth: 60,
    minWidth: 50,
    maxWidth: 65,
    cellDataType: false,
    valueFormatter: params => (params.value ? 'Сериал' : 'Кино'),
  },
  {
    colId: 'original_title',
    headerName: 'Оригинальное название',
    field: 'original_title',
    sortable: true,
    resizable: true,
    initialWidth: 300,
    minWidth: 100,
  },
  {
    colId: 'title',
    headerName: 'Название',
    field: 'title',
    sortable: true,
    resizable: true,
    initialWidth: 300,
    minWidth: 100,
  },
  {
    colId: 'date',
    headerName: 'Дата выхода',
    field: 'date',
    sortable: true,
    resizable: true,
    width: 110,
    minWidth: 100,
    cellRenderer: (params: ICellRendererParams<IMovieListItem>) => <>{DateUtils.dateToString(params.data?.date)}</>,
  },
];
