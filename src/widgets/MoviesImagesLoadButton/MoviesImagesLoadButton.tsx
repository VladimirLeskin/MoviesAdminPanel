import React, {ComponentType, useCallback} from 'react';
import {Button, CircularProgress, Stack} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';
import {MoviesImagesLoadButtonModel} from './model';
import {observer} from 'mobx-react';

interface Props {
  ids: number[];
  Component?: ComponentType<Pick<ButtonProps, 'disabled' | 'color' | 'variant' | 'onClick' | 'children'>>;
  onSuccess?: () => void;
}

const model = new MoviesImagesLoadButtonModel();

export const MoviesImagesLoadButton = observer(({ids, Component = Button, onSuccess}: Props) => {
  const handleClick = useCallback(() => {
    model.loadImages(ids).then(result => result && onSuccess?.());
  }, [ids, onSuccess]);

  return (
    <Component disabled={model.isLoading} color="primary" variant="contained" onClick={handleClick}>
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between" gap={1}>
        Загрузить картинки {model.isLoading && <CircularProgress size={16} />}
      </Stack>
    </Component>
  );
});
