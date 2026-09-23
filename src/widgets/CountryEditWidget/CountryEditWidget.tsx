import {observer} from 'mobx-react';
import React, {useCallback, useEffect, useState} from 'react';
import {ItemEditor} from '../../components/ItemEditor/ItemEditor';
import {Fab, Stack} from '@mui/material';
import {Save} from '@mui/icons-material';
import {CountryEditWidgetModel} from './country-edit-widget.model';
import {schema} from './constants';

interface Props {
  code?: string;
  onSaved?: () => void;
}

export const CountryEditWidget = observer(({code, onSaved}: Props) => {
  const [model] = useState(() => new CountryEditWidgetModel());
  const {data, editData, save, revision, isLoading, load} = model;

  useEffect(() => {
    load(code);
  }, [code, load]);

  const handleSave = useCallback(() => {
    save().then(() => onSaved?.());
  }, [onSaved, save]);

  return (
    <div style={{height: '100%', padding: 16, width: '100%', boxSizing: 'border-box', overflow: 'auto'}} key={revision}>
      <ItemEditor fields={schema} defaultValue={data} onChange={editData} />
      <Fab onClick={handleSave} variant="extended" color="primary" disabled={isLoading}>
        <Stack direction="row" display="inline-flex" gap={1}>
          <Save /> Сохранить
        </Stack>
      </Fab>
    </div>
  );
});
