import {useCallback, useEffect} from 'react';
import {SortChangedEvent} from 'ag-grid-community';
import {AgGridReact} from 'ag-grid-react';
import {SortUtils} from '../../../utils/SortUtils';
import {ISortState} from '../../../type';

export function useGridSort(
  gridRef: AgGridReact | null,
  sortState: ISortState[],
  onSortChanged: (state: ISortState[]) => void
) {
  const handleSortChange = useCallback(
    (event: SortChangedEvent) => {
      if (event.source !== 'uiColumnSorted') {
        return;
      }
      onSortChanged(
        event.api
          .getColumnState()
          .slice()
          .sort((a, b) => SortUtils.numeric(a.sortIndex, b.sortIndex))
          .map(({colId, sort}) => ({
            field: colId,
            order: sort,
          }))
          .filter((state): state is ISortState => !!state.order)
      );
    },
    [onSortChanged]
  );

  useEffect(() => {
    const currentState = gridRef?.api?.getColumnState();

    if (currentState) {
      const sortingStateMap = Object.fromEntries(sortState.map((s, index) => [s.field, {...s, index}]));

      const updatedState = currentState.map(colState => {
        const state = sortingStateMap[colState.colId];
        return state
          ? {...colState, sort: state?.order, sortIndex: state?.index}
          : {...colState, sort: null, sortIndex: null};
      });

      gridRef?.api.applyColumnState({state: updatedState});
    }
  }, [gridRef?.api, sortState]);

  return handleSortChange;
}
