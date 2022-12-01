import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {AgGridReactProps, AgReactUiProps} from 'ag-grid-react/lib/shared/interfaces';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.min.css'; // Optional theme CSS

interface Props {
  wrapperClassName?: string;
}

export const AgGrid = <TData extends any = any>(props: Props & (AgGridReactProps<TData> | AgReactUiProps<TData>)) => {
  const {wrapperClassName, ...otherProps} = props;
  return (
    <div className={`ag-theme-material ${wrapperClassName ?? ''}`}>
      <AgGridReact {...otherProps} />
    </div>
  );
};
