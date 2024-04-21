import React, {FC, useCallback} from 'react';
import {ColDef} from 'ag-grid-community';

import {IMovieListItem} from 'src/api/dto/MovieDto';
import {getMoviePickerColumns} from './utils';
import {MoviesListWidget} from '../MoviesListWidget/MoviesListWidget';

interface MoviePickerProps {
  onSelectImage?: (movie: IMovieListItem, image: {id: string; path: string}) => void;
  onSelectMovie?: (movie: IMovieListItem) => void;
}

export const MoviePicker: FC<MoviePickerProps> = React.memo(({onSelectMovie, onSelectImage}) => {
  const onPrepareColumns = useCallback(
    (columns: ColDef<IMovieListItem & {id: string}>[]) => {
      return getMoviePickerColumns(columns, onSelectImage, onSelectMovie);
    },
    [onSelectImage, onSelectMovie]
  );

  return <MoviesListWidget prepareColumns={onPrepareColumns} />;
});
