import React from 'react';
import {ColDef, ICellRendererParams} from 'ag-grid-community';

import {MOVIES_LIST_COLUMNS} from './constants';
import {IMovieListItem, IMovieGenre} from '../../api/dto/MovieDto';
import {ImagesCellRenderer} from './components/ImagesCellRenderer';

function genresIdsToString(genresIds?: number[], genresDescriptions?: Record<number, IMovieGenre>) {
  return genresIds?.map(genreId => genresDescriptions?.[genreId]?.name ?? genreId).join(', ') ?? '';
}

export function getMoviesListColumns(
  genresDescriptions?: Record<number, IMovieGenre>
): ColDef<IMovieListItem & {id: string}>[] {
  return [
    ...MOVIES_LIST_COLUMNS,
    {
      colId: 'genres',
      headerName: 'Жанры',
      field: 'genres',
      sortable: false,
      resizable: true,
      tooltipValueGetter: params => genresIdsToString(params.data?.genres, genresDescriptions),
      valueFormatter: params => genresIdsToString(params.data?.genres, genresDescriptions),
    },
    {
      colId: 'images',
      headerName: 'Картинки',
      field: 'images',
      sortable: false,
      resizable: true,
      flex: 1,
      cellRenderer: (params: ICellRendererParams<IMovieListItem>) => {
        return <>{params.data && <ImagesCellRenderer movie={params.data} />}</>;
      },
    },
  ];
}
