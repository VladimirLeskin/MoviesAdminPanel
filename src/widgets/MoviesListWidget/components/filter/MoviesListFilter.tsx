import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, TextField} from '@mui/material';

export interface IMovieFilter {
  search?: string;
}

interface MoviesPickerFilterProps {
  values?: IMovieFilter;
  onChange: (filter: IMovieFilter) => void;
}

const EMPTY_VALUES: IMovieFilter = {};

export const MoviesListFilter: FC<MoviesPickerFilterProps> = ({onChange, values = EMPTY_VALUES}) => {
  const [filterState, setFilterState] = useState(values);

  useEffect(() => {
    setFilterState(values);
  }, [values]);

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
