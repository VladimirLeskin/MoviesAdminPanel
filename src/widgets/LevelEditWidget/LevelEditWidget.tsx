import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react';
import {Save} from '@mui/icons-material';
import {Fab} from '@mui/material';

import {LevelEditWidgetModel} from './level-edit-widget.model';
import {ItemEditor} from '../../components/ItemEditor/ItemEditor';
import {schema} from './constants';

import css from './LevelEditWidget.module.scss';

const levelEditPageModel = new LevelEditWidgetModel();

interface Props {
  levelId?: string;
  onSaved?: (id: string) => void;
}

export const LevelEditWidget: FC<Props> = observer(({levelId, onSaved}) => {
  const {data, editData, save, revision, isLoading, load} = levelEditPageModel;

  useEffect(() => {
    load(levelId);
  }, [levelId, load]);

  const handleSave = useCallback(() => {
    save().then(resp => {
      if (resp?.id) {
        onSaved?.(resp.id);
      }
    });
  }, [onSaved, save]);

  return (
    <div className={css.root} key={revision}>
      <ItemEditor fields={schema} defaultValue={data} onChange={editData} />
      <Fab onClick={handleSave} variant="extended" color="primary" disabled={isLoading} className={css.SaveButton}>
        <Save /> Сохранить
      </Fab>
    </div>
  );
});
