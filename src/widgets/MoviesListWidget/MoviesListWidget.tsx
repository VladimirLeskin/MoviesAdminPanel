import React, {FC, useEffect, useMemo, useRef} from 'react';
import {ColDef} from 'ag-grid-community';
import {AgGridReact} from 'ag-grid-react';
import {observer} from 'mobx-react';

import {Pagination} from 'src/components/Pagination/Pagination';
import {MOVIES_GENRES} from 'src/models/MoviesGenres';
import {MoviesListFilter} from './components/filter/MoviesListFilter';
import {AgGrid} from 'src/components/AgGrid/AgGrid';
import {Spinner} from 'src/components/Spinner/Spinner';
import {MoviesListWidgetModel} from './movies-list-widget.model';
import {IMovieListItem} from 'src/api/dto/MovieDto';
import {getMoviesListColumns} from './utils';
import {COUNTRIES} from '../../models/CountriesModel';
import {useGridSort} from './hooks/useGridSort';
import {useParams} from './hooks/useParams';
import {MoviesListWidgetParams} from './types';

import css from './MoviesListWidget.module.scss';

interface Props {
  prepareColumns?: (columns: ColDef<IMovieListItem>[]) => ColDef<IMovieListItem>[];
  params?: MoviesListWidgetParams;
  onParamsChanged?: (params: MoviesListWidgetParams) => void;
}

const model = new MoviesListWidgetModel();
const defaultColDef = {
  comparator: () => 0, // убираем клиентскую сортировку
};

export const MoviesListWidget: FC<Props> = observer(({prepareColumns, params, onParamsChanged}) => {
  const {genres} = MOVIES_GENRES;
  const {countries} = COUNTRIES;
  const {items: rows, total, isLoading} = model;

  const {
    sortState: [sortState, onSortChanged],
    filter: [filter, onFilterChanged],
    pagination: [pagination, onPaginationChanged],
  } = useParams(model, params, onParamsChanged);

  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    model.loadItems(params);
  }, [params]);

  const columns = useMemo(() => {
    const prepareFunc = prepareColumns || (v => v);
    return prepareFunc(getMoviesListColumns(genres, countries));
  }, [prepareColumns, genres, countries]);

  const handleSortChange = useGridSort(gridRef.current, sortState ?? [], onSortChanged);

  const paginationContainer = (
    <div className={css.PaginationContainer}>
      <Spinner className={!isLoading && css.LoaderHidden} />
      <Pagination {...pagination} itemsTotal={total} onChange={onPaginationChanged} />
    </div>
  );

  return (
    <div className={css.root}>
      <div className={css.GridWithControls}>
        <MoviesListFilter values={filter} onChange={onFilterChanged} />
        {paginationContainer}
        <AgGrid
          ref={gridRef}
          rowData={rows}
          defaultColDef={defaultColDef}
          columnDefs={columns}
          className={css.MoviesGrid}
          onSortChanged={handleSortChange}
        />
        {paginationContainer}
      </div>
    </div>
  );
});
