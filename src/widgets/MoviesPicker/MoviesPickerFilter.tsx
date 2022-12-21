import React, {FC, useCallback, useState} from 'react';
import {Button, TextField} from '@mui/material';

export interface IMovieFilter {
  search?: string;
}

interface MoviesPickerFilterProps {
  search?: string;
  onChange: (filter: IMovieFilter) => void;
}

export const MoviesPickerFilter: FC<MoviesPickerFilterProps> = ({onChange, ...filter}) => {
  const [filterState, setFilterState] = useState(filter);

  const onSearchChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterState({...filterState, search: e.target.value});
    },
    [filterState]
  );

  const onSubmit = useCallback(() => {
    onChange(filterState);
  }, [filterState, onChange]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSubmit();
      }
    },
    [onSubmit]
  );

  return (
    <div>
      <TextField
        size="small"
        value={filterState.search ?? ''}
        label="Поиск"
        onChange={onSearchChanged}
        onKeyDown={onKeyDown}
        placeholder="Название, imdb_id"
      />
      <Button onClick={onSubmit}>Применить</Button>
    </div>
  );
};
