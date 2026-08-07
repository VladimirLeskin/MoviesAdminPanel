import {ColDef, ICellRendererParams} from 'ag-grid-community';
import React from 'react';

import {ITmdbDiscoverListItem} from './tmdb-discover-widget.model';

export const TMDB_DISCOVER_COLUMNS: ColDef<ITmdbDiscoverListItem>[] = [
  {
    colId: 'poster',
    headerName: 'Постер',
    field: 'poster_path',
    sortable: false,
    width: 80,
    cellRenderer: (params: ICellRendererParams<ITmdbDiscoverListItem>) => {
      if (!params.data?.poster_path) {
        return null;
      }

      return (
        <img
          src={params.data.poster_path}
          alt={params.data.title}
          style={{height: 60, objectFit: 'cover'}}
        />
      );
    },
  },
  {
    colId: 'title',
    headerName: 'Название',
    field: 'title',
    sortable: false,
    minWidth: 160,
    flex: 1,
  },
  {
    colId: 'original_title',
    headerName: 'Оригинальное название',
    field: 'original_title',
    sortable: false,
    minWidth: 160,
    flex: 1,
  },
  {
    colId: 'type',
    headerName: 'Тип',
    field: 'type',
    sortable: false,
    width: 90,
    valueFormatter: params => (params.data?.type === 'tv' ? 'Сериал' : 'Фильм'),
  },
  {
    colId: 'release_date',
    headerName: 'Дата релиза',
    field: 'release_date',
    sortable: false,
    width: 120,
  },
  {
    colId: 'end_date',
    headerName: 'Дата окончания',
    field: 'end_date',
    sortable: false,
    width: 130,
  },
  {
    colId: 'popularity',
    headerName: 'Popularity',
    field: 'popularity',
    sortable: false,
    width: 110,
    valueFormatter: params => (params.data?.popularity != null ? params.data.popularity.toFixed(1) : ''),
  },
  {
    colId: 'imdb_id',
    headerName: 'IMDB ID',
    field: 'imdb_id',
    sortable: false,
    width: 120,
  },
  {
    colId: 'tmdb_id',
    headerName: 'TMDB ID',
    field: 'tmdb_id',
    sortable: false,
    width: 100,
  },
  {
    colId: 'overview',
    headerName: 'Описание',
    field: 'overview',
    sortable: false,
    minWidth: 200,
    flex: 1,
    tooltipField: 'overview',
  },
];
