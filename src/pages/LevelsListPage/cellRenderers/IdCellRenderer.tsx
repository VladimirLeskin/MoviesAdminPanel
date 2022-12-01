import React from 'react';
import {ICellRendererParams} from 'ag-grid-community';
import {Link} from 'react-router-dom';
import {ROUTES} from 'src/constants';
import {ILevelDto} from 'src/api/dto/LevelDto';

export const IdCellRenderer = (props: ICellRendererParams<ILevelDto, number>) => {
  return (
    <>
      {props.data?.id && (
        <Link to={ROUTES.LEVELS.DETAILS.replace(':levelId', props.data.id)} target="_blank">
          {props.data.id}
        </Link>
      )}
    </>
  );
};
