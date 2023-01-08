import React from 'react';
import {ColDef, ICellRendererParams} from 'ag-grid-community';
import {Button} from '@mui/material';

import {IMovieListItem} from '../../api/dto/MovieDto';
import {ImagesCellRenderer} from '../MoviesListWidget/components/ImagesCellRenderer';

import css from './MoviesPicker.module.scss';

export function getMoviePickerColumns(
  initialColumns: ColDef<IMovieListItem>[],
  pickImage: (movie: IMovieListItem, image: {id: string; path: string}) => void,
  pickMovie: (movie: IMovieListItem) => void
): ColDef<IMovieListItem & {id: string}>[] {
  return [
    {
      colId: '__select_movie__',
      headerName: '',
      width: 80,
      resizable: false,
      pinned: true,
      cellClass: css.CellWithoutPadding,
      cellRenderer: (params: ICellRendererParams<IMovieListItem>) => {
        return (
          <Button size="small" onClick={() => (params.data ? pickMovie(params.data) : null)}>
            Выбрать
          </Button>
        );
      },
    },
    ...initialColumns.filter(c => c.field !== 'images'),
    {
      colId: 'images',
      headerName: 'Картинки',
      field: 'images',
      sortable: false,
      resizable: true,
      width: 300,
      minWidth: 300,
      flex: 1,
      cellRenderer: (params: ICellRendererParams<IMovieListItem>) => {
        return <>{params.data && <ImagesCellRenderer movie={params.data} onSelectImage={pickImage} />}</>;
      },
    },
  ];
}
