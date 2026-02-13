import React, {useCallback, useState} from 'react';
import {Checkbox, CircularProgress, Stack} from '@mui/material';
import {observer} from 'mobx-react';

import {Attach} from '../../components/Attach';
import {MoviesUploadModel} from './model';

const model = new MoviesUploadModel();

export const MoviesUploadWidget = observer(() => {
  const [override, setOverride] = useState(false);
  const handleImport = useCallback(
    (file: File) => {
      model.uploadMoviesFile(file, override);
    },
    [override]
  );

  return (
    <Stack flexWrap="nowrap" alignItems="center" flexDirection="row" gap={1}>
      <Attach onFileChanged={handleImport} showFileName={false} disabled={model.isLoading}>
        <Stack flexWrap="nowrap" alignItems="center" flexDirection="row" gap={1}>
          Импорт {model.isLoading ? <CircularProgress size={16} /> : null}
        </Stack>
      </Attach>
      <Checkbox
        size="small"
        checked={override}
        onChange={() => setOverride(!override)}
        title="Перезаписать существующие фильмы"
      />
    </Stack>
  );
});
