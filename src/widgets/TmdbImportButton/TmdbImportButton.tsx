import React, {useCallback} from 'react';
import {Button, CircularProgress, Stack} from '@mui/material';
import {observer} from 'mobx-react';

import {ITmdbDiscoverListItem} from '../TmdbDiscoverWidget/tmdb-discover-widget.model';
import {TmdbImportButtonModel} from './model';

interface Props {
  items: ITmdbDiscoverListItem[];
  onSuccess?: () => void;
}

const model = new TmdbImportButtonModel();

export const TmdbImportButton = observer(({items, onSuccess}: Props) => {
  const handleClick = useCallback(() => {
    model
      .importItems(
        items.map(item => ({
          tmdb_id: item.tmdb_id,
          type: item.type,
        }))
      )
      .then(result => result && onSuccess?.());
  }, [items, onSuccess]);

  return (
    <Button disabled={model.isLoading || items.length === 0} color="primary" variant="contained" onClick={handleClick}>
      <Stack flexDirection="row" alignItems="center" justifyContent="space-between" gap={1}>
        Добавить в базу ({items.length}) {model.isLoading && <CircularProgress size={16} />}
      </Stack>
    </Button>
  );
});
