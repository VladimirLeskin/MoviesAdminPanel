import React from 'react';
import {ColDef, ICellRendererParams} from 'ag-grid-community';
import {Link} from 'react-router-dom';

import {IMovieListItem} from 'src/api/dto/MovieDto';
import {ROUTES} from 'src/constants';
import {DateUtils} from '../../utils/DateUtils';

export const MOVIES_LIST_COLUMNS: ColDef<IMovieListItem & {id: string}>[] = [
  {
    colId: 'movie_id',
    width: 100,
    minWidth: 50,
    flex: 1,
    field: 'movie_id',
    headerName: 'id',
    sortable: true,
    cellRenderer: (params: ICellRendererParams<IMovieListItem>) => {
      if (!params.data?.movie_id) {
        return null;
      }

      return (
        <Link to={ROUTES.MOVIES.DETAILS.replace(':movieId', params.data.movie_id.toString())} target="_blank">
          {params.data.movie_id}
        </Link>
      );
    },
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
