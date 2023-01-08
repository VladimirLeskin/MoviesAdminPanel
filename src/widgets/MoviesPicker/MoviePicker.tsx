import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react';

import {IMovieListItem} from 'src/api/dto/MovieDto';
import {getMoviePickerColumns} from './utils';
import {MoviesListWidget} from '../MoviesListWidget/MoviesListWidget';
import {ColDef} from 'ag-grid-community';

interface MoviePickerProps {
  onSelectImage: (movie: IMovieListItem, image: {id: string; path: string}) => void;
  onSelectMovie: (movie: IMovieListItem) => void;
}

export const MoviePicker: FC<MoviePickerProps> = observer(props => {
  const {onSelectImage, onSelectMovie} = props;

  const onPrepareColumns = useCallback(
    (columns: ColDef<IMovieListItem & {id: string}>[]) => {
      return getMoviePickerColumns(columns, onSelectImage, onSelectMovie);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [onSelectImage, onSelectMovie]
  );

  return <MoviesListWidget prepareColumns={onPrepareColumns} />;
});
