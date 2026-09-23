import React, {FormEvent, useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {Badge, Button, ClickAwayListener, Drawer, IconButton, Stack, TextField, Typography} from '@mui/material';
import {FilterAlt, Search} from '@mui/icons-material';

import {useBooleanState} from 'src/hooks/useBooleanState';
import {ItemEditor} from 'src/components/ItemEditor/ItemEditor';

import {ITmdbDiscoverWidgetFilter} from '../../types';
import {schema} from './constants';

import css from './Filters.module.scss';

interface Props {
  filters: ITmdbDiscoverWidgetFilter;
  onChange: (value: ITmdbDiscoverWidgetFilter) => void;
}

const DEFAULT_FILTER: ITmdbDiscoverWidgetFilter = {
  type: 'movie',
  genres: [],
  countries: [],
};

export const TmdbDiscoverFilters = observer(({filters, onChange}: Props) => {
  const {state: open, setTrue: setOpen, setFalse: setHide} = useBooleanState(false);
  const [values, setValues] = useState<ITmdbDiscoverWidgetFilter>(filters);
  const [query, setQuery] = useState(filters.query ?? '');

  const appliedValues = (Object.keys(DEFAULT_FILTER) as (keyof ITmdbDiscoverWidgetFilter)[]).filter(k => {
    const value = filters[k];
    const defaultValue = DEFAULT_FILTER[k];
    return value != null && JSON.stringify(value) !== JSON.stringify(defaultValue);
  });

  useEffect(() => {
    setValues(filters);
    setQuery(filters.query ?? '');
  }, [filters]);

  const handleQuerySubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    onChange({
      ...filters,
      type: filters.type ?? 'movie',
      query: trimmedQuery || undefined,
    });
  };

  const handleSave = () => {
    onChange({
      ...DEFAULT_FILTER,
      ...values,
      type: values.type ?? 'movie',
      query: filters.query?.trim() || undefined,
    });
    setHide();
  };

  const handleReset = () => {
    setValues({...DEFAULT_FILTER});
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        component="form"
        className={css.topBar}
        onSubmit={handleQuerySubmit}
      >
        <TextField
          size="small"
          className={css.queryField}
          value={query}
          label="Название"
          placeholder="Поиск по названию"
          onChange={e => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton type="submit" color="primary">
                <Search />
              </IconButton>
            ),
          }}
        />
        <IconButton onClick={setOpen}>
          <Badge badgeContent={appliedValues.length} variant="dot" color="primary">
            <FilterAlt fontSize="medium" />
          </Badge>
        </IconButton>
      </Stack>
      <Drawer open={open} anchor="right" hideBackdrop>
        <ClickAwayListener onClickAway={setHide}>
          <Stack className={css.drawerContent}>
            <Typography variant="h5">Фильтры TMDB</Typography>
            <ItemEditor fields={schema.value} onChange={setValues} value={values} isControlled />
            <Stack flexDirection="row" flexWrap="wrap" gap={2}>
              <Button variant="contained" onClick={handleSave}>
                Применить
              </Button>
              <Button color="inherit" variant="contained" onClick={handleReset}>
                Сбросить
              </Button>
            </Stack>
          </Stack>
        </ClickAwayListener>
      </Drawer>
    </>
  );
});
