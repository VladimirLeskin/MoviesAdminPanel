import React, {FC, useCallback, useMemo, useState} from 'react';

import {ITmdbDiscoverListItem} from 'src/widgets/TmdbDiscoverWidget/tmdb-discover-widget.model';
import {TmdbDiscoverWidget, TmdbDiscoverWidgetParams} from 'src/widgets/TmdbDiscoverWidget';
import {TmdbImportButton} from 'src/widgets/TmdbImportButton';
import {useQueryParams} from 'src/hooks/useQueryParams';
import {useTitleUpdate} from 'src/hooks/useTitleUpdate';

import {tmdbDiscoverFiltersQueryConfig, tmdbDiscoverPaginationQueryConfig} from './constants';

import css from './MoviesTmdbImportPage.module.scss';

export const MoviesTmdbImportPage: FC = () => {
  useTitleUpdate('Заполнение базы данных');
  const [pagination, setPagination] = useQueryParams(tmdbDiscoverPaginationQueryConfig);
  const [filter, setFilter] = useQueryParams(tmdbDiscoverFiltersQueryConfig);
  const [selectedItems, setSelectedItems] = useState<ITmdbDiscoverListItem[]>([]);
  const [revision, setRevision] = useState(Date.now);

  const params: TmdbDiscoverWidgetParams = useMemo(
    () => ({
      pagination,
      filter: {...filter, type: filter.type ?? 'movie'},
    }),
    [filter, pagination]
  );

  const handleParamsChange = useCallback(
    (newParams: TmdbDiscoverWidgetParams) => {
      setFilter(newParams.filter ?? {type: 'movie'});
      setPagination(newParams.pagination ?? {page: 0, pageSize: 20}, 'replaceIn');
    },
    [setFilter, setPagination]
  );

  const forceRecalc = useCallback(() => {
    setRevision(Date.now);
    setSelectedItems([]);
  }, []);

  return (
    <div className={css.root}>
      <TmdbDiscoverWidget
        revision={revision}
        params={params}
        actions={
          selectedItems.length > 0 ? (
            <div className={css.Actions}>
              <TmdbImportButton items={selectedItems} onSuccess={forceRecalc} />
            </div>
          ) : null
        }
        onSelect={setSelectedItems}
        onParamsChanged={handleParamsChange}
      />
    </div>
  );
};
