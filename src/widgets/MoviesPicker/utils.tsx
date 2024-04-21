import React from 'react';
import {ColDef, ICellRendererParams} from 'ag-grid-community';
import {Button} from '@mui/material';

import {IMovieListItem} from '../../api/dto/MovieDto';
import {ImagesCellRenderer} from '../../components/gridRenderers';

import css from './MoviesPicker.module.scss';

export function getMoviePickerColumns(
  initialColumns: ColDef<IMovieListItem>[],
  pickImage?: (movie: IMovieListItem, image: {id: string; path: string}) => void,
  pickMovie?: (movie: IMovieListItem) => void
): ColDef<IMovieListItem>[] {
  let columns = initialColumns.slice();

  if (pickMovie) {
    columns.unshift({
      colId: '__select_movie__',
      headerName: '',
      width: 92,
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
    });
  }

  if (pickImage) {
    columns = columns.filter(col => col.field !== 'images');
    columns.unshift({
      colId: 'images',
      headerName: 'Картинки',
      field: 'images',
      sortable: false,
      resizable: true,
      width: 300,
      minWidth: 300,
      flex: 1,
      valueFormatter: params => params.data?.images.map(img => img.path).join(', ') ?? '',
      cellRenderer: (params: ICellRendererParams<IMovieListItem>) => {
        return <>{params.data && <ImagesCellRenderer movie={params.data} onSelectImage={pickImage} />}</>;
      },
    });
  }

  return columns;
}
