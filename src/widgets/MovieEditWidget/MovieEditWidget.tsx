import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {Fab} from '@mui/material';
import {Save} from '@mui/icons-material';

import {ItemEditor} from '../../components/ItemEditor/ItemEditor';
import {IEditedMovieInfo} from './types';
import {MovieEditWidgetModel} from './movie-edit-widget.model';
import {layoutSettings, schema} from './constants';

import css from './MovieEditWidget.module.scss';

const movieEditPageModel = new MovieEditWidgetModel();

interface Props {
  movieId?: string;
  onSaved?: (id: IEditedMovieInfo['id']) => void;
}

export const MovieEditWidget = observer(({movieId}: Props) => {
  const {data: movieInfo, editData, isLoading, load, save} = movieEditPageModel;

  useEffect(() => {
    load(movieId);
  }, [load, movieId]);

  if (!movieInfo) {
    return null;
  }

  return (
    <div className={css.root}>
      <ItemEditor<IEditedMovieInfo>
        key={movieInfo.id}
        fields={schema.value}
        onChange={editData}
        defaultValue={movieInfo}
        layout={layoutSettings}
      />
      <Fab onClick={() => save()} variant="extended" color="primary" disabled={isLoading} className={css.Buttons}>
        <Save /> Сохранить
      </Fab>
    </div>
  );
});
