import React, {useCallback, useEffect} from 'react';
import {observer} from 'mobx-react';
import {Button, Paper} from '@mui/material';
import {Save} from '@mui/icons-material';

import {ItemEditor} from '../../components/ItemEditor/ItemEditor';
import {IEditedMovieInfo} from './types';
import {MovieEditWidgetModel} from './movie-edit-widget.model';
import {layoutSettings, schema} from './constants';
import {useTitleUpdate} from '../../hooks/useTitleUpdate';
import {getMovieTitle} from './libs';

import css from './MovieEditWidget.module.scss';
import {MoviesImagesLoadButton} from '../MoviesImagesLoadButton';

const movieEditPageModel = new MovieEditWidgetModel();

interface Props {
  movieId?: string;
  onSaved?: (id: IEditedMovieInfo['id']) => void;
}

export const MovieEditWidget = observer(({movieId, onSaved}: Props) => {
  const {data: movieInfo, editData, isLoading, load, save} = movieEditPageModel;
  useTitleUpdate(getMovieTitle(movieInfo));

  useEffect(() => {
    load(movieId);
  }, [load, movieId]);

  const handleSave = useCallback(() => {
    save().then(resp => {
      if (resp?.id) {
        onSaved?.(resp.id);
      }
    });
  }, [onSaved, save]);

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
      <Paper className={css.footer}>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={isLoading}>
          <Save /> Сохранить
        </Button>
        {movieId && <MoviesImagesLoadButton ids={[movieId]} onSuccess={() => load(movieId)} />}
      </Paper>
    </div>
  );
});
