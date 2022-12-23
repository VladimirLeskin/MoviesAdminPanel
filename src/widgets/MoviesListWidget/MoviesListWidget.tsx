import React, {FC, useEffect, useMemo} from 'react';
import {ColDef} from 'ag-grid-community';
import {observer} from 'mobx-react';

import {Pagination} from 'src/components/Pagination/Pagination';
import {MOVIES_GENRES} from 'src/models/MoviesGenres';
import {MoviesListFilter} from './MoviesListFilter';
import {AgGrid} from 'src/components/AgGrid/AgGrid';
import {Spinner} from 'src/components/Spinner/Spinner';
import {MoviesListWidgetModel} from './movies-list-widget.model';
import {IMovieDto} from 'src/api/dto/MovieDto';
import {getMoviesListColumns} from './utils';

import css from './MoviesListWidget.module.scss';

type MovieRow = IMovieDto & {id: string};

interface Props {
  prepareColumns?: (columns: ColDef<MovieRow>[]) => ColDef<MovieRow>[];
}

const model = new MoviesListWidgetModel();

export const MoviesListWidget: FC<Props> = observer(({prepareColumns}) => {
  const {movies, total, pagination, filter, moviesLoading, onFilterChanged, onPaginationChanged} = model;
  const rows = useMemo(() => {
    return movies.map(m => ({...m, id: m.movie_id}));
  }, [movies]);

  useEffect(() => {
    model.init();
  }, []);

  const paginationContainer = (
    <div className={css.PaginationContainer}>
      <Spinner className={!moviesLoading && css.LoaderHidden} />
      <Pagination {...pagination} itemsTotal={total} onChange={onPaginationChanged} />
    </div>
  );

  const columns = useMemo(() => {
    const prepareFunc = prepareColumns || (v => v);
    return prepareFunc(getMoviesListColumns(MOVIES_GENRES.genres));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prepareColumns, MOVIES_GENRES.genres]);

  return (
    <div className={css.root}>
      <div className={css.GridWithControls}>
        <MoviesListFilter {...filter} onChange={onFilterChanged} />
        {paginationContainer}
        <AgGrid rowData={rows} columnDefs={columns} wrapperClassName={css.MoviesGrid} />
        {paginationContainer}
      </div>
    </div>
  );
});
