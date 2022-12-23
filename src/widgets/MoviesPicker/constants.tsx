import React from 'react';
import {ColDef, ICellRendererParams} from 'ag-grid-community';

import {IMovieDto} from 'src/api/dto/MovieDto';
import {ROUTES} from 'src/constants';
import {Link} from 'react-router-dom';

export const MOVIES_LIST_COLUMNS: ColDef<IMovieDto & {id: string}>[] = [
  {
    colId: 'movie_id',
    width: 75,
    field: 'movie_id',
    headerName: 'id',
    sortable: true,
    cellRenderer: (params: ICellRendererParams<IMovieDto>) => {
      if (!params.data?.movie_id) {
        return null;
      }

      return (
        <Link to={ROUTES.MOVIES.DETAILS.replace(':movieId', params.data.movie_id)} target="_blank">
          {params.data.movie_id}
        </Link>
      );
    },
  },
  {colId: 'title', headerName: 'Оригинальное название', field: 'title', sortable: true, resizable: true},
  {colId: 'original_title', headerName: 'Название', field: 'original_title', sortable: true, resizable: true},
  {colId: 'date', headerName: 'Название', field: 'date', sortable: true, resizable: true},
];
