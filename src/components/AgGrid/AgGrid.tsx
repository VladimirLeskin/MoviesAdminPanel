import React, {ForwardedRef, useMemo} from 'react';
import {AgGridReact, AgGridReactProps} from 'ag-grid-react';
import {ColDef, ICellRendererParams} from 'ag-grid-community';
import {IconButton} from '@mui/material';
import {Visibility} from '@mui/icons-material';
import cn from 'classnames';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS

import css from './AgGrid.module.scss';

type TBaseDataType = {id: unknown};

interface Props<TData> extends AgGridReactProps<TData> {
  onShowDetails?: (id: unknown) => void;
}

export const AgGrid = React.forwardRef(
  <TData extends TBaseDataType>(props: Props<TData>, ref: ForwardedRef<AgGridReact<TData>>) => {
    const {className, columnDefs, onShowDetails, ...otherProps} = props;
    const columns = useMemo(() => {
      return onShowDetails ? [getDetailsColumn(onShowDetails)].concat(columnDefs ?? []) : columnDefs;
    }, [columnDefs, onShowDetails]);

    return (
      <AgGridReact ref={ref} columnDefs={columns} className={cn('ag-theme-material', className)} {...otherProps} />
    );
  }
) as <TData extends TBaseDataType>(
  props: Props<TData> & {ref?: ForwardedRef<AgGridReact<TData>>}
) => React.ReactElement;

function getDetailsColumn<TData extends TBaseDataType = TBaseDataType>(
  callback: (id: unknown) => void,
  width = 50
): ColDef<TData> {
  return {
    colId: '__details__',
    cellClass: css.CellWithoutPaddings,
    editable: false,
    resizable: false,
    sortable: false,
    width,
    cellRenderer: (params: ICellRendererParams<TData>) => (
      <IconButton onClick={() => callback(params.data?.id)} size="small">
        <Visibility fontSize="small" />
      </IconButton>
    ),
  };
}
