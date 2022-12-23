import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {Button} from '@mui/material';

import {MoviesListWidget} from 'src/widgets/MoviesListWidget/MoviesListWidget';
import {ROUTES} from 'src/constants';

import css from './MoviesListPage.module.scss';

export const MoviesListPage: FC = () => {
  return (
    <div className={css.root}>
      <Link to={ROUTES.MOVIES.CREATE} target="_blank" className={css.AddButton}>
        <Button variant="contained" fullWidth>
          Добавить
        </Button>
      </Link>
      <MoviesListWidget />
    </div>
  );
};
