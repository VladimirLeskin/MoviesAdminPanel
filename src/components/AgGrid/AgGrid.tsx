import React, {useMemo} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {ColDef} from 'ag-grid-community';
import {AgGridReactProps, AgReactUiProps} from 'ag-grid-react/lib/shared/interfaces';
import {IconButton} from '@mui/material';
import {Visibility} from '@mui/icons-material';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.min.css'; // Optional theme CSS

import css from './AgGrid.module.scss';

type TBaseDataType = {id: unknown};

interface Props {
  onShowDetails?: (id: unknown) => void;
  wrapperClassName?: string;
}

export const AgGrid = <TData extends TBaseDataType = TBaseDataType>(
  props: Props & (AgGridReactProps<TData> | AgReactUiProps<TData>)
) => {
  const {wrapperClassName, columnDefs, onShowDetails, ...otherProps} = props;
  const columns = useMemo(() => {
    return onShowDetails ? [getDetailsColumn(onShowDetails)].concat(columnDefs ?? []) : columnDefs;
  }, [columnDefs, onShowDetails]);

  return (
    <div className={`ag-theme-material ${wrapperClassName ?? ''}`}>
      <AgGridReact columnDefs={columns} {...otherProps} />
    </div>
  );
};

function getDetailsColumn<TData extends TBaseDataType = TBaseDataType>(
  callback: (id: unknown) => void,
  width = 50
): ColDef<TData> {
  return {
    colId: '__level_details__',
    cellClass: css.CellWithoutPaddings,
    editable: false,
    resizable: false,
    sortable: false,
    width: 50,
    cellRenderer: params => (
      <IconButton onClick={() => callback(params.data?.id)} size="small">
        <Visibility fontSize="small" />
      </IconButton>
    ),
  };
}
