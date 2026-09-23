import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {Badge, Button, ClickAwayListener, Drawer, IconButton, Stack, Typography} from '@mui/material';
import {FilterAlt} from '@mui/icons-material';

import {useBooleanState} from 'src/hooks/useBooleanState';
import {ItemEditor} from 'src/components/ItemEditor/ItemEditor';
import {IMovieFilter} from './MoviesListFilter';
import {schema} from './constants';

import css from './Filters.module.scss';

interface Props {
  filters: IMovieFilter;
  onChange: (value: IMovieFilter) => void;
}

const EMPTY_STATE: IMovieFilter = {
  status: undefined,
  genres: [],
  countries: [],
  tvSeries: undefined,
};

export const Filters = observer(({filters, onChange}: Props) => {
  const {state: open, setTrue: setOpen, setFalse: setHide} = useBooleanState(false);
  const [values, setValues] = useState<IMovieFilter>(filters);

  const appliedValues = Object.keys(EMPTY_STATE).filter(
    (k: keyof IMovieFilter) => filters[k] != null && JSON.stringify(filters[k]) !== JSON.stringify(EMPTY_STATE[k])
  );

  useEffect(() => {
    setValues(filters);
  }, [filters]);

  const handleSave = () => {
    onChange(values);
    setHide();
  };

  const handleReset = () => {
    setValues({...values, ...EMPTY_STATE});
  };

  return (
    <>
      <IconButton onClick={setOpen}>
        <Badge badgeContent={appliedValues.length} variant="dot" color="primary">
          <FilterAlt fontSize="medium" />
        </Badge>
      </IconButton>
      <Drawer open={open} anchor="right" hideBackdrop>
        <ClickAwayListener onClickAway={setHide}>
          <Stack className={css.drawerContent}>
            <Typography variant="h5">Фильтры</Typography>
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
