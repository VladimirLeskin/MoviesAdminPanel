import {observer} from 'mobx-react';
import React, {useCallback, useEffect, useState} from 'react';
import {ItemEditor} from '../../components/ItemEditor/ItemEditor';
import {Fab, Stack} from '@mui/material';
import {Save} from '@mui/icons-material';
import {UserEditWidgetModel} from './user-edit-widget.model';
import {schema} from './constants';

interface Props {
  userId?: number;
  onSaved?: () => void;
}

export const UserEditWidget = observer(({userId, onSaved}: Props) => {
  const [model] = useState(() => new UserEditWidgetModel());
  const {data, editData, save, revision, isLoading, load} = model;

  useEffect(() => {
    if (userId !== undefined) {
      load(String(userId));
    }
  }, [userId, load]);

  const handleSave = useCallback(() => {
    save().then(() => onSaved?.());
  }, [onSaved, save]);

  if (userId === undefined) {
    return null;
  }

  return (
    <div style={{height: '100%', padding: 16, minWidth: 400}} key={revision}>
      <ItemEditor fields={schema} defaultValue={data} onChange={editData} />
      <Fab onClick={handleSave} variant="extended" color="primary" disabled={isLoading}>
        <Stack direction="row" display="inline-flex" gap={1}>
          <Save /> Сохранить
        </Stack>
      </Fab>
    </div>
  );
});
