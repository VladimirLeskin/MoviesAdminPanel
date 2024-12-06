import React, {FC, useCallback, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button} from '@mui/material';

import {IMovieListItem} from 'src/api/dto/MovieDto';
import {MoviesListWidget, MoviesListWidgetParams} from 'src/widgets/MoviesListWidget';
import {MoviesUploadWidget} from 'src/widgets/MoviesUploadWidget';
import {MoviesImagesLoadButton} from 'src/widgets/MoviesImagesLoadButton';
import {ROUTES} from 'src/constants';
import {moviesListFiltersQueryConfig, moviesListPaginationQueryConfig, moviesListSortQueryConfig} from './constants';
import {useQueryParams} from 'src/hooks/useQueryParams';
import {useTitleUpdate} from 'src/hooks/useTitleUpdate';

import css from './MoviesListPage.module.scss';

export const MoviesListPage: FC = () => {
  useTitleUpdate('Список фильмов');
  const [pagination, setPagination] = useQueryParams(moviesListPaginationQueryConfig);
  const [filter, setFilter] = useQueryParams(moviesListFiltersQueryConfig);
  const [sortState, setSortState] = useQueryParams(moviesListSortQueryConfig);
  const [selectedItems, setSelectedItems] = useState<IMovieListItem[]>([]);
  const [revision, setRevision] = useState(Date.now);

  const params: MoviesListWidgetParams = useMemo(
    () => ({
      pagination,
      filter,
      sortState: sortState.sort,
    }),
    [filter, pagination, sortState]
  );

  const handleParamsChange = useCallback(
    (newParams: MoviesListWidgetParams) => {
      setFilter(newParams.filter ?? {});
      setPagination(newParams.pagination ?? {}, 'replaceIn');
      setSortState({sort: newParams.sortState}, 'replaceIn');
    },
    [setFilter, setPagination, setSortState]
  );

  // не workaround, а workaroundище
  const forceRecalc = useCallback(() => {
    setRevision(Date.now);
  }, []);

  return (
    <div className={css.root}>
      <MoviesListWidget
        revision={revision}
        params={params}
        actions={
          <div className={css.Actions}>
            <Link to={ROUTES.MOVIES.CREATE} target="_blank" className={css.AddButton}>
              <Button variant="contained" fullWidth>
                Добавить
              </Button>
            </Link>
            <MoviesUploadWidget />
            {selectedItems.length > 0 && (
              <MoviesImagesLoadButton ids={selectedItems.map(it => +it.id)} onSuccess={forceRecalc} />
            )}
          </div>
        }
        onSelect={setSelectedItems}
        onParamsChanged={handleParamsChange}
      />
    </div>
  );
};
