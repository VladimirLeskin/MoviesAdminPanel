import {IListPagination, ItemsListModel} from '../../../models/ItemsListModel';
import {useCallback, useMemo} from 'react';
import {ISortState} from '../../../type';

interface Params<TFilters> {
  pagination?: IListPagination;
  sortState?: ISortState[];
  filter?: TFilters;
}

export function useParams<TData extends {id: unknown}, TFilters>(
  model: ItemsListModel<TData, TFilters>,
  params?: Params<TFilters>,
  onParamsChanged?: (params: Params<TFilters>) => void
) {
  const {pagination, filter, sortState} = params ?? model;

  const onPaginationChanged = useCallback(
    (newPagination: IListPagination) => {
      if (onParamsChanged) {
        onParamsChanged({...params, pagination: newPagination});
      } else {
        model.onPaginationChanged(newPagination);
      }
    },
    [model, onParamsChanged, params]
  );

  const onFilterChanged = useCallback(
    (newFilter: TFilters) => {
      if (onParamsChanged) {
        onParamsChanged({...params, pagination: {pageSize: 50, ...pagination, page: 0}, filter: newFilter});
      } else {
        model.onFilterChanged(newFilter);
      }
    },
    [model, onParamsChanged, pagination, params]
  );

  const onSortChanged = useCallback(
    (newSortState: ISortState[]) => {
      if (onParamsChanged) {
        onParamsChanged({...params, sortState: newSortState});
      } else {
        model.onSortChanged(newSortState);
      }
    },
    [model, onParamsChanged, params]
  );

  return useMemo(() => {
    return {
      pagination: [pagination, onPaginationChanged] as const,
      filter: [filter, onFilterChanged] as const,
      sortState: [sortState, onSortChanged] as const,
    };
  }, [filter, onFilterChanged, onPaginationChanged, onSortChanged, pagination, sortState]);
}
