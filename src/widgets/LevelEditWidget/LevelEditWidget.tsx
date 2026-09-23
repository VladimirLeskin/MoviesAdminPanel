import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react';
import {Delete, Save} from '@mui/icons-material';
import {Fab} from '@mui/material';
import {toast} from 'react-toastify';

import {LevelEditWidgetModel} from './level-edit-widget.model';
import {ItemEditor} from '../../components/ItemEditor/ItemEditor';
import {schema} from './constants';
import {authModel} from '../../models/AuthModel';
import {EUserPermissions} from '../../api/Auth';

import css from './LevelEditWidget.module.scss';

const levelEditPageModel = new LevelEditWidgetModel();

interface Props {
  levelId?: number;
  onSaved?: (id: number) => void;
  onDeleted?: () => void;
}

export const LevelEditWidget: FC<Props> = observer(({levelId, onSaved, onDeleted}) => {
  const {data, editData, save, revision, isLoading, isDeleting, load, deleteLevel} = levelEditPageModel;
  const canDelete = !!data?.id && authModel.hasPermission(EUserPermissions.deleteLevel);
  const actionsLocked = isLoading || isDeleting;

  useEffect(() => {
    load(levelId);
  }, [levelId, load]);

  const handleSave = useCallback(() => {
    if (levelEditPageModel.isDeleting || levelEditPageModel.isLoading) {
      return;
    }
    save().then(resp => {
      if (resp?.id) {
        onSaved?.(resp.id);
      }
    });
  }, [onSaved, save]);

  const handleDelete = useCallback(() => {
    const title = data?.descriptions.find(description => description.lang === 'ru')?.title;
    if (!confirm(`Удалить уровень${title ? ` «${title}»` : ''}?`)) {
      return;
    }
    deleteLevel()
      .then(deleted => {
        if (deleted) {
          toast.success('Уровень удалён');
          onDeleted?.();
        }
      })
      .catch(() => undefined);
  }, [data?.descriptions, deleteLevel, onDeleted]);

  return (
    <div className={css.root} key={revision}>
      <ItemEditor fields={schema} defaultValue={data} onChange={editData} />
      <div className={css.Actions}>
        {canDelete && (
          <Fab
            onClick={handleDelete}
            variant="extended"
            color="error"
            disabled={actionsLocked}
            className={css.DeleteButton}
          >
            <Delete /> Удалить
          </Fab>
        )}
        <Fab
          onClick={handleSave}
          variant="extended"
          color="primary"
          disabled={actionsLocked}
          className={css.SaveButton}
        >
          <Save /> Сохранить
        </Fab>
      </div>
    </div>
  );
});
