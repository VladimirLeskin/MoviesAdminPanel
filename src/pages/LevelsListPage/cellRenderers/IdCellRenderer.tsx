import React from 'react';
import {ICellRendererParams} from 'ag-grid-community';
import {Link} from 'react-router-dom';
import {ROUTES} from 'src/constants';

export const IdCellRenderer = (props: ICellRendererParams<{id?: number}, number>) => {
  return (
    <>
      {props.data?.id && (
        <Link to={ROUTES.LEVELS.DETAILS.replace(':levelId', props.data.id.toString())} target="_blank">
          {props.data.id}
        </Link>
      )}
    </>
  );
};
