import React, {FC, FormEvent, useCallback, useEffect, useState} from 'react';
import {Button, TextField} from '@mui/material';
import {Filters} from './Filters';

export interface IMovieFilter {
  search?: string;
  tvSeries?: boolean;
  genres?: number[];
  countries?: string[];
}

interface MoviesFilterProps {
  values?: IMovieFilter;
  onChange: (filter: IMovieFilter) => void;
}

const EMPTY_VALUES: IMovieFilter = {};

export const MoviesListFilter: FC<MoviesFilterProps> = ({onChange, values = EMPTY_VALUES}) => {
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

  const handleFiltersChange = useCallback(
    (newValues: IMovieFilter) => {
      const newFiltersState = {...filterState, ...newValues};
      setFilterState(newFiltersState);
      onChange(newFiltersState);
    },
    [filterState, onChange]
  );

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onChange(filterState);
    },
    [filterState, onChange]
  );

  return (
    <form onSubmit={onSubmit}>
      <TextField
        size="small"
        value={filterState.search ?? ''}
        label="Поиск"
        onChange={onSearchChanged}
        placeholder="Название, imdb_id"
      />
      <Filters filters={filterState} onChange={handleFiltersChange} />
      <Button type="submit">Применить</Button>
    </form>
  );
};
