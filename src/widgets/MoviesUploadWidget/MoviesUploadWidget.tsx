import React, {useCallback} from 'react';
import {CircularProgress, Stack} from '@mui/material';
import {observer} from 'mobx-react';

import {Attach} from '../../components/Attach';
import {MoviesUploadModel} from './model';

const model = new MoviesUploadModel();

export const MoviesUploadWidget = observer(() => {
  const handleImport = useCallback((file: File) => {
    model.uploadMoviesFile(file);
  }, []);

  return (
    <Attach onFileChanged={handleImport} showFileName={false} disabled={model.isLoading}>
      <Stack flexWrap="nowrap" alignItems="center" flexDirection="row" gap={1}>
        Импорт {model.isLoading ? <CircularProgress size={16} /> : null}
      </Stack>
    </Attach>
  );
});
