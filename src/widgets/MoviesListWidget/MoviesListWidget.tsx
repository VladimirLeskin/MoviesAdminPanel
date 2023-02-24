import React, {FC, useEffect, useMemo} from 'react';
import {ColDef} from 'ag-grid-community';
import {observer} from 'mobx-react';

import {Pagination} from 'src/components/Pagination/Pagination';
import {MOVIES_GENRES} from 'src/models/MoviesGenres';
import {MoviesListFilter} from './MoviesListFilter';
import {AgGrid} from 'src/components/AgGrid/AgGrid';
import {Spinner} from 'src/components/Spinner/Spinner';
import {MoviesListWidgetModel} from './movies-list-widget.model';
import {IMovieListItem} from 'src/api/dto/MovieDto';
import {getMoviesListColumns} from './utils';
import {COUNTRIES} from '../../models/CountriesModel';

import css from './MoviesListWidget.module.scss';

type MovieRow = IMovieListItem & {id: string};

interface Props {
  prepareColumns?: (columns: ColDef<MovieRow>[]) => ColDef<MovieRow>[];
}

const model = new MoviesListWidgetModel();

export const MoviesListWidget: FC<Props> = observer(({prepareColumns}) => {
  const {items: movies, total, pagination, filter, isLoading, onFilterChanged, onPaginationChanged} = model;
  const rows = useMemo(() => {
    return movies.map(m => ({...m, id: m.movie_id}));
  }, [movies]);

  useEffect(() => {
    model.init();
  }, []);

  const paginationContainer = (
    <div className={css.PaginationContainer}>
      <Spinner className={!isLoading && css.LoaderHidden} />
      <Pagination {...pagination} itemsTotal={total} onChange={onPaginationChanged} />
    </div>
  );

  const columns = useMemo(() => {
    const prepareFunc = prepareColumns || (v => v);
    return prepareFunc(getMoviesListColumns(MOVIES_GENRES.genres, COUNTRIES.countries));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prepareColumns, MOVIES_GENRES.genres, COUNTRIES.countries]);

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
