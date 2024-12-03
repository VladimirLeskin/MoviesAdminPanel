import {useCallback, useMemo, useRef} from 'react';
import type {SelectionChangedEvent} from 'ag-grid-community/dist/types/core/events';
import type {RowSelectionOptions} from 'ag-grid-community';

export function useGridSelection<TData>(callback?: (selectedRows: TData[]) => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const handleSelect = useCallback((e: SelectionChangedEvent<TData>) => {
    callbackRef.current?.(e.api.getSelectedRows());
  }, []);

  const rowSelection: RowSelectionOptions = useMemo(() => ({mode: 'multiRow'}), []);

  if (!callbackRef.current) {
    return {};
  }
  return {
    onSelectionChanged: handleSelect,
    rowSelection,
  };
}
