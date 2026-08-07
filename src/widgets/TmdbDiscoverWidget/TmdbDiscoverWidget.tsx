import React, {FC, useEffect, useMemo} from 'react';
import {GridReadyEvent} from 'ag-grid-community/dist/types/core/events';
import {ColDef} from 'ag-grid-community';
import {observer} from 'mobx-react';

import {AgGrid} from 'src/components/AgGrid/AgGrid';
import {Pagination} from 'src/components/Pagination/Pagination';
import {Spinner} from 'src/components/Spinner/Spinner';
import {useGridSelection} from 'src/hooks/useGridSelection';

import {TmdbDiscoverFilters} from './components/filter/TmdbDiscoverFilters';
import {TMDB_DISCOVER_COLUMNS} from './constants';
import {ITmdbDiscoverListItem, TmdbDiscoverWidgetModel} from './tmdb-discover-widget.model';
import {TmdbDiscoverWidgetParams} from './types';
import {useParams} from '../MoviesListWidget/hooks/useParams';

import css from './TmdbDiscoverWidget.module.scss';

interface Props {
  params?: TmdbDiscoverWidgetParams;
  actions?: React.ReactNode;
  revision?: number;
  onParamsChanged?: (params: TmdbDiscoverWidgetParams) => void;
  onSelect?: (rows: ITmdbDiscoverListItem[]) => void;
}

const model = new TmdbDiscoverWidgetModel();

const defaultColDef: ColDef = {
  comparator: () => 0,
};

export const TmdbDiscoverWidget: FC<Props> = observer(({revision, actions, params, onSelect, onParamsChanged}) => {
  const {items: rows, total, isLoading} = model;

  const {
    filter: [filter, onFilterChanged],
    pagination: [pagination, onPaginationChanged],
  } = useParams(model, params, onParamsChanged);

  useEffect(() => {
    if (params) {
      model.loadItems(params);
    } else {
      model.init();
    }
  }, [params, revision]);

  const columns = useMemo(() => TMDB_DISCOVER_COLUMNS, []);
  const selectionProps = useGridSelection(onSelect);

  const paginationContainer = (
    <div className={css.PaginationContainer}>
      <Spinner className={!isLoading && css.LoaderHidden} />
      <Pagination {...pagination} pageSizeOptions={[20]} itemsTotal={total} onChange={onPaginationChanged} />
    </div>
  );

  return (
    <div className={css.root}>
      <div className={css.GridWithControls}>
        <div className={css.TopBar}>
          <TmdbDiscoverFilters filters={filter ?? {type: 'movie'}} onChange={onFilterChanged} />
          {actions}
        </div>
        {paginationContainer}
        <AgGrid
          {...selectionProps}
          onGridReady={onGridReady}
          suppressDragLeaveHidesColumns
          rowData={rows}
          defaultColDef={defaultColDef}
          columnDefs={columns}
          className={css.MoviesGrid}
        />
        {paginationContainer}
      </div>
    </div>
  );
});

function onGridReady(event: GridReadyEvent) {
  event.api.sizeColumnsToFit();
}
