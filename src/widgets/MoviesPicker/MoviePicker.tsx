import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react';
import {Button} from '@mui/material';
import {Link} from 'react-router-dom';

import {IMovieDto} from 'src/api/dto/MovieDto';
import {Pagination} from 'src/components/Pagination/Pagination';
import {Spinner} from 'src/components/Spinner/Spinner';
import {MoviesPickerFilter} from './MoviesPickerFilter';
import {MoviesPickerModel} from './movies-picker.model';
import {AgGrid} from '../../components/AgGrid/AgGrid';
import {getMoviePickerColumns} from './utils';
import {MOVIES_GENRES} from '../../models/MoviesGenres';
import {ROUTES} from 'src/constants';

import css from './MoviesPicker.module.scss';

interface MoviePickerProps {
  onSelectImage: (movie: IMovieDto, image: {id: string; path: string}) => void;
  onSelectMovie: (movie: IMovieDto) => void;
}

const model = new MoviesPickerModel();
model.loadMovies();

export const MoviePicker: FC<MoviePickerProps> = observer(props => {
  const {onSelectImage, onSelectMovie} = props;

  const {movies, total, pagination, filter, moviesLoading, onFilterChanged, onPaginationChanged} = model;
  const rows = useMemo(() => {
    return movies.map(m => ({...m, id: m.movie_id}));
  }, [movies]);

  const paginationContainer = (
    <div className={css.PaginationContainer}>
      <Spinner className={!moviesLoading && css.LoaderHidden} />
      <Pagination {...pagination} itemsTotal={total} onChange={onPaginationChanged} />
    </div>
  );

  const columns = useMemo(() => {
    return getMoviePickerColumns(onSelectImage, onSelectMovie, MOVIES_GENRES.genres);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelectImage, onSelectMovie, MOVIES_GENRES.genres]);

  return (
    <div className={css.root}>
      <div className={css.GridWithControls}>
        <Link to={ROUTES.MOVIES.CREATE} target="_blank">
          <Button variant="contained" fullWidth>Добавить</Button>
        </Link>
        <MoviesPickerFilter {...filter} onChange={onFilterChanged} />
        {paginationContainer}
        <AgGrid rowData={rows} columnDefs={columns} wrapperClassName={css.MoviesGrid} />
        {paginationContainer}
      </div>
    </div>
  );
});
