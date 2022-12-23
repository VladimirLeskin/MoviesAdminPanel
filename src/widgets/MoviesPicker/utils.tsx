import React from 'react';
import {ColDef, ICellRendererParams} from 'ag-grid-community';
import {Button} from '@mui/material';

import {MOVIES_LIST_COLUMNS} from './constants';
import {IMovieDto, IMovieGenre} from '../../api/dto/MovieDto';
import {ImagesCellRenderer} from './components/ImagesCellRenderer';

import css from './MoviesPicker.module.scss';

function genresIdsToString(genresIds?: number[], genresDescriptions?: Record<number, IMovieGenre>) {
  return genresIds?.map(genreId => genresDescriptions?.[genreId]?.name ?? genreId).join(', ') ?? '';
}

export function getMoviePickerColumns(
  pickImage: (movie: IMovieDto, image: {id: string; path: string}) => void,
  pickMovie: (movie: IMovieDto) => void,
  genresDescriptions?: Record<number, IMovieGenre>
): ColDef<IMovieDto & {id: string}>[] {
  return [
    {
      colId: '__select_movie__',
      headerName: '',
      width: 80,
      resizable: false,
      cellClass: css.CellWithoutPadding,
      cellRenderer: (params: ICellRendererParams<IMovieDto>) => {
        return (
          <Button size="small" onClick={() => (params.data ? pickMovie(params.data) : null)}>
            Выбрать
          </Button>
        );
      },
    },
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
      cellRenderer: (params: ICellRendererParams<IMovieDto>) => {
        return <>{params.data && <ImagesCellRenderer movie={params.data} onSelectImage={pickImage} />}</>;
      },
    },
  ];
}
